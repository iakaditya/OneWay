import { NextRequest, NextResponse } from 'next/server';
import { streamJourneyChat } from '@/lib/ai/geminiClient';
import { z } from 'zod';
import { getJourneyDashboard } from '@/lib/intelligence/dashboard';
import { JourneyContext, RiskScore } from '@/types';

const ChatSchema = z.object({
  journeyId: z.string(),
  message: z.string().min(1).max(500),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })),
  })).optional().default([]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }

    const { journeyId, message, history } = parsed.data;

    const dashboard = await getJourneyDashboard(journeyId);
    if (!dashboard) {
      return NextResponse.json({ success: false, error: 'Journey not found' }, { status: 404 });
    }
    const origin = { lat: dashboard.journey.originLat, lng: dashboard.journey.originLng };
    const destination = { lat: dashboard.journey.destinationLat, lng: dashboard.journey.destinationLng };
    const riskScore: RiskScore = dashboard.analysis ? {
      overall: dashboard.analysis.overallRisk,
      score: Math.round((dashboard.analysis.confidence || 0) * 100),
      factors: {
        weather: dashboard.analysis.riskFactors.weather || 'LOW',
        road: dashboard.analysis.riskFactors.road || 'LOW',
        hazard: dashboard.analysis.riskFactors.hazard || 'LOW',
        alert: dashboard.analysis.riskFactors.alert || 'LOW',
        traffic: dashboard.analysis.riskFactors.traffic || 'LOW',
        community: dashboard.analysis.riskFactors.community || 'LOW',
        historical: dashboard.analysis.riskFactors.historical || 'LOW',
      },
      primaryReasons: [dashboard.analysis.recommendation],
      confidence: dashboard.analysis.confidence > 0.75 ? 'HIGH' : dashboard.analysis.confidence > 0.5 ? 'MEDIUM' : 'LOW',
    } : {
      overall: 'LOW', score: 0,
      factors: { weather: 'LOW', road: 'LOW', hazard: 'LOW', alert: 'LOW', traffic: 'LOW', community: 'LOW', historical: 'LOW' },
      primaryReasons: ['No completed analysis is available yet'], confidence: 'LOW',
    };
    const context: JourneyContext = {
      journey: {
        origin: dashboard.journey.origin,
        destination: dashboard.journey.destination,
        originCoords: origin,
        destinationCoords: destination,
        travelDate: new Date(dashboard.journey.travelDate),
        distance: dashboard.routes[0]?.distance || 0,
        duration: dashboard.routes[0]?.duration || 0,
      },
      weather: dashboard.weather as JourneyContext['weather'],
      forecasts: [],
      routes: dashboard.routes as unknown as JourneyContext['routes'],
      traffic: [],
      hazards: dashboard.hazards as unknown as JourneyContext['hazards'],
      alerts: dashboard.alerts as unknown as JourneyContext['alerts'],
      news: dashboard.news as unknown as JourneyContext['news'],
      communityReports: dashboard.communityReports as unknown as JourneyContext['communityReports'],
      historicalPatterns: [],
      riskScore,
    };

    let stream: Awaited<ReturnType<typeof streamJourneyChat>> = null;
    try {
      stream = await streamJourneyChat(context, message, history);
    } catch (error) {
      console.error('AI provider unavailable, using grounded fallback:', error);
    }

    if (!stream) {
      // Fallback when no API key
      const fallbackResponses: Record<string, string> = {
        safe: `Based on currently available information for the ${dashboard.journey.origin} to ${dashboard.journey.destination} route, conditions appear ${riskScore.overall.toLowerCase()} risk. I cannot guarantee safety — conditions can change.`,
        risk: `The current risk level for your ${dashboard.journey.origin} → ${dashboard.journey.destination} journey is ${riskScore.overall}. Key factor: ${riskScore.primaryReasons.join(', ')}.`,
        default: `I'm OneWay AI. Current journey assessment is ${riskScore.overall}. I can only confirm information that is present in the current journey data.`,
      };

      const lower = message.toLowerCase();
      const response = lower.includes('safe') ? fallbackResponses.safe
        : lower.includes('risk') ? fallbackResponses.risk
        : fallbackResponses.default;

      return NextResponse.json({ success: true, data: { response } });
    }

    // Stream the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch {
          controller.error('Stream error');
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ success: false, error: 'Chat failed' }, { status: 500 });
  }
}
