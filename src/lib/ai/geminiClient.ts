// ============================================================
// GEMINI AI CLIENT
// Structured context → journey analysis + chat
// ============================================================
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { JourneyContext, JourneyAnalysisResult, RiskLevel } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const SYSTEM_INSTRUCTION = `You are OneWay AI, a travel safety intelligence assistant.

Your role is to help travelers understand conditions on their specific journey using real data provided to you. 

CRITICAL RULES:
1. Base all responses on the structured data provided. Do not invent road closures, landslides, accidents, or weather events.
2. Distinguish clearly between verified facts, reported conditions, and inferences.
3. Always use probabilistic language. Say "available information indicates..." not "this route is dangerous."
4. Never guarantee safety. Never say "the route is safe."
5. State uncertainty when data is limited: "Data is limited for this section."
6. Use human-readable, concise language. Travelers need clarity, not jargon.
7. Recommend alternatives only when current data justifies it.
8. Always explain your reasoning based on the data provided.`;

export function buildJourneyPrompt(context: JourneyContext): string {
  const { journey, weather, hazards, alerts, news, communityReports, historicalPatterns, riskScore } = context;

  const weatherSummary = weather.slice(0, 5).map((w) =>
    `- ${w.location}: ${w.condition}, ${w.temperature?.toFixed(1) ?? '?'}°C, visibility ${w.visibility?.toFixed(1) ?? '?'}km, precipitation ${w.precipitation?.toFixed(1) ?? '0'}mm/h`
  ).join('\n');

  const hazardSummary = hazards.slice(0, 5).map((h) =>
    `- ${h.type} (${h.severity}): ${h.description} — Source: ${h.source}, Confidence: ${h.confidence}`
  ).join('\n');

  const alertSummary = alerts.slice(0, 3).map((a) =>
    `- [${a.severity}] ${a.title}: ${a.description} — Issued by ${a.issuer}`
  ).join('\n');

  const newsSummary = news.slice(0, 4).map((n) =>
    `- "${n.title}" (${n.source}, relevance: ${(n.relevanceScore * 100).toFixed(0)}%)`
  ).join('\n');

  const communitySummary = communityReports.slice(0, 4).map((r) =>
    `- ${r.category}: "${r.content}" — Confirmations: ${r.confirmationCount}, Status: ${r.verificationStatus}`
  ).join('\n');

  const historicalSummary = historicalPatterns.slice(0, 3).map((p) =>
    `- ${p.incidentType} near ${p.location}: frequency ${p.frequency}/year, severity ${p.severity}`
  ).join('\n');

  return `JOURNEY: ${journey.origin} → ${journey.destination}
Distance: ${(journey.distance / 1000).toFixed(0)}km | Duration: ${Math.round(journey.duration / 60)}min
Travel Date: ${journey.travelDate.toLocaleDateString()}

RISK SCORE: ${riskScore.overall} (${riskScore.score}/100)
Factors: weather=${riskScore.factors.weather}, road=${riskScore.factors.road}, hazard=${riskScore.factors.hazard}, alert=${riskScore.factors.alert}, traffic=${riskScore.factors.traffic}, community=${riskScore.factors.community}

WEATHER CONDITIONS:
${weatherSummary || 'No weather data available'}

ACTIVE HAZARDS:
${hazardSummary || 'No active hazards detected'}

OFFICIAL ALERTS:
${alertSummary || 'No official alerts'}

RELEVANT NEWS:
${newsSummary || 'No relevant news'}

COMMUNITY REPORTS:
${communitySummary || 'No community reports'}

HISTORICAL PATTERNS:
${historicalSummary || 'No historical data'}

Based on this data, provide:
1. A 2-3 sentence SUMMARY of current journey conditions
2. A clear RECOMMENDATION (e.g., "proceed with caution", "consider alternative route", "delay if possible")
3. Up to 4 KEY FINDINGS (bullet points) explaining what matters most
4. Whether an ALTERNATIVE ROUTE is warranted (yes/no) and why

Use probabilistic language. Be concise. Base everything on the data above.`;
}

export async function generateJourneyAnalysis(
  context: JourneyContext
): Promise<{ summary: string; recommendation: string; keyFindings: string[]; alternativeRecommended: boolean; alternativeReason?: string }> {
  if (!process.env.GEMINI_API_KEY) {
    return getMockAnalysis(context.riskScore.overall, context.journey.origin, context.journey.destination);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction: SYSTEM_INSTRUCTION,
      safetySettings: SAFETY_SETTINGS,
    });

    const prompt = buildJourneyPrompt(context);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse structured response
    return parseAnalysisResponse(text, context.riskScore.overall);
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return getMockAnalysis(context.riskScore.overall, context.journey.origin, context.journey.destination);
  }
}

function parseAnalysisResponse(
  text: string,
  risk: RiskLevel
): { summary: string; recommendation: string; keyFindings: string[]; alternativeRecommended: boolean; alternativeReason?: string } {
  const lines = text.split('\n').filter((l) => l.trim());

  // Extract summary (first substantive paragraph)
  const summary = lines.find((l) => l.length > 80 && !l.startsWith('-') && !l.startsWith('#'))
    || lines[0]
    || 'Journey analysis completed. Review conditions below.';

  // Extract recommendation
  const recLine = lines.find((l) =>
    l.toLowerCase().includes('recommend') ||
    l.toLowerCase().includes('advise') ||
    l.toLowerCase().includes('proceed') ||
    l.toLowerCase().includes('consider')
  );
  const recommendation = recLine || (risk === 'HIGH' || risk === 'CRITICAL'
    ? 'Review current conditions carefully before departure. Consider the alternative route.'
    : 'Proceed with awareness of current conditions.');

  // Extract bullet points as key findings
  const keyFindings = lines
    .filter((l) => l.startsWith('-') || l.startsWith('•') || l.match(/^\d\./))
    .map((l) => l.replace(/^[-•\d.]\s*/, '').trim())
    .filter((l) => l.length > 10)
    .slice(0, 4);

  if (keyFindings.length === 0) {
    keyFindings.push(
      `Overall risk level: ${risk}`,
      'Review weather and road conditions before departure',
    );
  }

  const alternativeRecommended = risk === 'HIGH' || risk === 'CRITICAL';
  const alternativeReason = alternativeRecommended
    ? 'Current route conditions indicate elevated risk. Alternative route may offer lower disruption risk.'
    : undefined;

  return { summary, recommendation, keyFindings, alternativeRecommended, alternativeReason };
}

function getMockAnalysis(risk: RiskLevel, origin: string, destination: string) {
  return {
    summary: 'AI analysis is temporarily unavailable. Please review the route data, weather, and risk score above.',
    recommendation: 'Review the provided data manually before departure.',
    keyFindings: ['AI intelligence layer unavailable'],
    alternativeRecommended: risk === 'HIGH' || risk === 'CRITICAL',
    alternativeReason: risk === 'HIGH' || risk === 'CRITICAL'
      ? 'Primary route shows HIGH/CRITICAL risk parameters based on data.'
      : undefined,
  };
}

// ---- AI Chat function ----
export async function streamJourneyChat(
  context: JourneyContext,
  userMessage: string,
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
) {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    systemInstruction: SYSTEM_INSTRUCTION + '\n\nJOURNEY CONTEXT:\n' + buildJourneyPrompt(context),
    safetySettings: SAFETY_SETTINGS,
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(userMessage);
  return result.stream;
}
