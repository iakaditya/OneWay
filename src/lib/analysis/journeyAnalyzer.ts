// ============================================================
// JOURNEY ANALYZER — Orchestrates all providers
// ============================================================
import { OpenWeatherMapProvider, getRiskFromWeather } from '@/lib/providers/WeatherProvider';
import { GoogleRouteProvider } from '@/lib/providers/RouteProvider';
import { GNewsProvider, StubAlertProvider } from '@/lib/providers/NewsProvider';
import { calculateRiskScore } from '@/lib/analysis/riskEngine';
import { generateJourneyAnalysis } from '@/lib/ai/geminiClient';
import { prisma } from '@/lib/prisma';
import { ensureRouteSegments, persistJourneySnapshot } from '@/lib/intelligence/dashboard';
import { publishJourneyEvent } from '@/lib/events';
import {
  Coordinates,
  JourneyContext,
  JourneyAnalysisResult,
  NormalizedHazard,
  HistoricalPattern,
  CommunityReportData,
  HazardType,
  RiskLevel,
} from '@/types';

const weatherProvider = new OpenWeatherMapProvider();
const routeProvider = new GoogleRouteProvider();
const newsProvider = new GNewsProvider();
const alertProvider = new StubAlertProvider();

// ---- Sample waypoints along a route ----
function sampleWaypoints(coords: [number, number][], count: number): Coordinates[] {
  if (coords.length === 0) return [];
  const step = Math.max(1, Math.floor(coords.length / count));
  const sampled: Coordinates[] = [];
  for (let i = 0; i < coords.length && sampled.length < count; i += step) {
    sampled.push({ lat: coords[i][1], lng: coords[i][0] });
  }
  return sampled;
}

// ---- Convert DB community reports to normalized type ----
function normalizeDBReports(dbReports: {
  id: string;
  userId: string | null;
  user?: { name: string | null; image: string | null } | null;
  lat: number;
  lng: number;
  locationName: string | null;
  category: string;
  content: string;
  imageUrl: string | null;
  verificationStatus: string;
  confirmationCount: number;
  usefulCount: number;
  createdAt: Date;
}[]): CommunityReportData[] {
  return dbReports.map((r) => ({
    id: r.id,
    userId: r.userId || undefined,
    userName: r.user?.name || undefined,
    userImage: r.user?.image || undefined,
    coordinates: { lat: r.lat, lng: r.lng },
    locationName: r.locationName || undefined,
    category: r.category as CommunityReportData['category'],
    content: r.content,
    imageUrl: r.imageUrl || undefined,
    verificationStatus: r.verificationStatus as CommunityReportData['verificationStatus'],
    confirmationCount: r.confirmationCount,
    usefulCount: r.usefulCount,
    createdAt: r.createdAt,
  }));
}

// ---- Convert DB historical incidents ----
function normalizeHistoricalIncidents(incidents: {
  id: string;
  location: string;
  lat: number;
  lng: number;
  incidentType: string;
  severity: string;
  occurredAt: Date;
  description: string;
}[]): HistoricalPattern[] {
  // Group by location + type
  const grouped = new Map<string, typeof incidents>();
  for (const inc of incidents) {
    const key = `${inc.lat.toFixed(2)}_${inc.incidentType}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(inc);
  }

  return Array.from(grouped.entries()).map(([, items]) => ({
    location: items[0].location,
    coordinates: { lat: items[0].lat, lng: items[0].lng },
    incidentType: items[0].incidentType as HazardType,
    frequency: items.length,
    lastOccurred: items.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())[0]?.occurredAt,
    description: `${items.length} incident(s) of this type recorded in historical data`,
    severity: items[0].severity as RiskLevel,
  }));
}

// ---- Build mock hazards from weather + alerts ----
function buildHazardsFromContext(
  weather: import('@/types').WeatherData[],
  alerts: import('@/types').OfficialAlert[]
): NormalizedHazard[] {
  const hazards: NormalizedHazard[] = [];

  for (const w of weather) {
    const risk = getRiskFromWeather(w);
    if (risk === 'HIGH' || risk === 'CRITICAL') {
      hazards.push({
        id: `weather_hazard_${w.coordinates.lat}_${w.coordinates.lng}`,
        type: w.conditionCode === 'snow' ? 'SNOW' : w.conditionCode === 'fog' ? 'FOG' : 'HEAVY_RAIN',
        severity: risk,
        coordinates: w.coordinates,
        description: `${w.condition} conditions at ${w.location}. Visibility: ${w.visibility?.toFixed(1) ?? '?'}km`,
        source: 'OpenWeatherMap',
        confidence: 'HIGH',
        reportedAt: w.timestamp,
        potentialImpact: risk === 'CRITICAL'
          ? 'Severe conditions may render travel dangerous'
          : 'Conditions may cause delays and require reduced speed',
      });
    }
  }

  for (const alert of alerts) {
    hazards.push({
      id: `alert_hazard_${alert.id}`,
      type: alert.alertType,
      severity: alert.severity,
      coordinates: alert.coordinates || { lat: 0, lng: 0 },
      description: alert.description,
      source: alert.issuer,
      confidence: 'VERIFIED',
      reportedAt: alert.issuedAt,
      potentialImpact: alert.actionRequired || 'May affect travel conditions',
    });
  }

  return hazards;
}

// ============================================================
// MAIN ANALYZER FUNCTION
// ============================================================
export async function analyzeJourney(journeyId: string): Promise<JourneyAnalysisResult> {
  const journey = await prisma.journey.findUnique({
    where: { id: journeyId },
    include: {
      routes: true,
      communityReports: {
        include: { user: { select: { name: true, image: true } } },
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!journey) throw new Error('Journey not found');

  const origin: Coordinates = { lat: journey.originLat, lng: journey.originLng };
  const destination: Coordinates = { lat: journey.destinationLat, lng: journey.destinationLng };

  // ---- 1. Get routes ----
  const routes = journey.routes.length > 0
    ? journey.routes.map((r) => ({
        id: r.id,
        isPrimary: r.isPrimary,
        distance: r.distance,
        duration: r.duration,
        summary: r.summary || '',
        geometry: (typeof r.geometry === 'string' ? JSON.parse(r.geometry) : r.geometry) as import('@/types').GeoJSONLineString,
        waypoints: (typeof r.waypoints === 'string' ? JSON.parse(r.waypoints || '[]') : r.waypoints || []) as { coordinates: Coordinates }[],
      }))
    : await routeProvider.getRoutes(origin, destination);

  const primaryRoute = routes.find((r) => r.isPrimary) || routes[0];
  const waypoints = sampleWaypoints(primaryRoute?.geometry?.coordinates || [], 5);

  // ---- 2. Fetch weather along route ----
  let weatherPoints: import('@/types').WeatherData[] = [];
  let weatherError: string | undefined;
  try {
    weatherPoints = await weatherProvider.getWeatherAlongRoute([
      origin,
      ...waypoints,
      destination,
    ]);
  } catch (error: unknown) {
    weatherError = error instanceof Error ? error.message : 'Weather provider unavailable';
    console.error('Weather fetch failed, continuing without weather data:', error);
  }
  await persistJourneySnapshot(journeyId, 'WEATHER', weatherPoints, weatherError);

  // ---- 3. Fetch official alerts ----
  const midpoint = waypoints[Math.floor(waypoints.length / 2)] || origin;
  let alerts: import('@/types').OfficialAlert[] = [];
  let alertsError: string | undefined;
  try {
    alerts = await alertProvider.getOfficialAlerts(midpoint, 100);
  } catch (error: unknown) {
    alertsError = error instanceof Error ? error.message : 'Alert provider unavailable';
  }
  await persistJourneySnapshot(journeyId, 'ALERTS', alerts, alertsError);

  // ---- 4. Fetch news ----
  let news: import('@/types').NewsItem[] = [];
  let newsError: string | undefined;
  try {
    news = await newsProvider.getJourneyNews(journey.origin, journey.destination);
  } catch (error: unknown) {
    newsError = error instanceof Error ? error.message : 'News provider unavailable';
    console.error('News fetch failed, continuing without news data:', error);
  }
  await persistJourneySnapshot(journeyId, 'NEWS', news, newsError);

  // ---- 5. Build hazards from weather + alerts + DB ----
  const dbHazards = await prisma.hazard.findMany({
    where: { journeyId, isActive: true },
  });

  const derivedHazards = buildHazardsFromContext(weatherPoints, alerts);
  const allHazards: NormalizedHazard[] = [
    ...derivedHazards,
    ...dbHazards.map((h) => ({
      id: h.id,
      type: h.type as HazardType,
      severity: h.severity as RiskLevel,
      coordinates: { lat: h.lat, lng: h.lng },
      description: h.description,
      source: h.source,
      confidence: h.confidence as import('@/types').ConfidenceLevel,
      reportedAt: h.reportedAt,
      distanceFromRoute: h.distanceFromRoute || undefined,
      potentialImpact: 'May affect route conditions',
    })),
  ];

  // ---- 6. Fetch historical incidents ----
  const historicalIncidents = await prisma.historicalIncident.findMany({
    where: {
      lat: { gte: Math.min(origin.lat, destination.lat) - 1, lte: Math.max(origin.lat, destination.lat) + 1 },
      lng: { gte: Math.min(origin.lng, destination.lng) - 1, lte: Math.max(origin.lng, destination.lng) + 1 },
    },
    orderBy: { occurredAt: 'desc' },
    take: 20,
  });

  const historicalPatterns = normalizeHistoricalIncidents(historicalIncidents);

  // ---- 7. Normalize community reports ----
  const communityReports = normalizeDBReports(journey.communityReports as Parameters<typeof normalizeDBReports>[0]);

  // ---- 8. Calculate risk score ----
  const riskScore = calculateRiskScore({
    weatherPoints,
    hazards: allHazards,
    alerts,
    communityReports,
    historicalPatterns,
    traffic: [],
  });

  await Promise.all(journey.routes.map((route) => ensureRouteSegments(route.id, route.geometry)));
  const segments = await prisma.routeSegment.findMany({ where: { route: { journeyId } } });
  await Promise.all(segments.map((segment) => {
    const nearestWeather = weatherPoints.find((point) =>
      Math.abs(point.coordinates.lat - (segment.startLat + segment.endLat) / 2) < 1.5 &&
      Math.abs(point.coordinates.lng - (segment.startLng + segment.endLng) / 2) < 1.5
    );
    const segmentRisk = nearestWeather ? getRiskFromWeather(nearestWeather) : riskScore.overall;
    const condition = nearestWeather
      ? nearestWeather.conditionCode === 'rain' || nearestWeather.conditionCode === 'thunderstorm' ? 'WET'
        : nearestWeather.conditionCode === 'fog' ? 'LOW_VISIBILITY' : 'CLEAR'
      : 'NO_LIVE_DATA';
    return prisma.routeSegment.update({
      where: { id: segment.id },
      data: { condition, riskLevel: segmentRisk, averageSpeed: null, isBlocked: false },
    });
  }));

  // ---- 9. Build journey context for Gemini ----
  const context: JourneyContext = {
    journey: {
      origin: journey.origin,
      destination: journey.destination,
      originCoords: origin,
      destinationCoords: destination,
      travelDate: journey.travelDate,
      distance: primaryRoute?.distance || 0,
      duration: primaryRoute?.duration || 0,
    },
    weather: weatherPoints,
    forecasts: [],
    routes,
    traffic: [],
    hazards: allHazards,
    alerts,
    news,
    communityReports,
    historicalPatterns,
    riskScore,
  };

  // ---- 10. Generate AI analysis ----
  const aiAnalysis = await generateJourneyAnalysis(context);

  // ---- 11. Store analysis in DB ----
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

  await prisma.journeyAnalysis.upsert({
    where: { journeyId },
    create: {
      journeyId,
      overallRisk: riskScore.overall,
      summary: aiAnalysis.summary,
      recommendation: aiAnalysis.recommendation,
      confidence: riskScore.confidence === 'HIGH' ? 0.8 : riskScore.confidence === 'MEDIUM' ? 0.6 : 0.4,
      riskFactors: JSON.stringify(riskScore.factors),
      generatedAt: new Date(),
      expiresAt,
    },
    update: {
      overallRisk: riskScore.overall,
      summary: aiAnalysis.summary,
      recommendation: aiAnalysis.recommendation,
      confidence: riskScore.confidence === 'HIGH' ? 0.8 : riskScore.confidence === 'MEDIUM' ? 0.6 : 0.4,
      riskFactors: JSON.stringify(riskScore.factors),
      generatedAt: new Date(),
      expiresAt,
    },
  });

  // ---- 12. Update journey lastAnalyzedAt ----
  await prisma.journey.update({
    where: { id: journeyId },
    data: { lastAnalyzedAt: new Date(), status: riskScore.overall === 'LOW' ? 'READY' : riskScore.overall },
  });

  publishJourneyEvent(journeyId, 'AI_CONTEXT_UPDATED');

  return {
    journeyId,
    overallRisk: riskScore.overall,
    summary: aiAnalysis.summary,
    recommendation: aiAnalysis.recommendation,
    keyFindings: aiAnalysis.keyFindings,
    confidence: riskScore.confidence === 'HIGH' ? 0.8 : riskScore.confidence === 'MEDIUM' ? 0.6 : 0.4,
    riskFactors: riskScore.factors,
    alternativeRecommended: aiAnalysis.alternativeRecommended,
    alternativeReason: aiAnalysis.alternativeReason,
    generatedAt: new Date(),
    expiresAt,
  };
}
