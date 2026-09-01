import { prisma } from '@/lib/prisma';
import { Coordinates, GeoJSONLineString, RiskLevel } from '@/types';

type StoredSnapshot = {
  data: unknown;
  error?: string;
};

export type DashboardData = {
  journey: {
    id: string;
    origin: string;
    destination: string;
    originLat: number;
    originLng: number;
    destinationLat: number;
    destinationLng: number;
    travelDate: Date;
    travelMode: string;
    status: string;
    preferences: Record<string, boolean>;
    lastAnalyzedAt: Date | null;
  };
  routes: Array<{
    id: string;
    distance: number;
    duration: number;
    geometry: GeoJSONLineString;
    isPrimary: boolean;
    riskLevel: RiskLevel;
    summary: string;
    segments: Array<{
      id: string;
      name: string;
      condition: string;
      riskLevel: RiskLevel;
      averageSpeed: number | null;
      isBlocked: boolean;
      start: Coordinates;
      end: Coordinates;
      updatedAt: Date;
    }>;
  }>;
  analysis: {
    overallRisk: RiskLevel;
    summary: string;
    recommendation: string;
    confidence: number;
    riskFactors: Record<string, RiskLevel>;
    generatedAt: Date;
  } | null;
  weather: unknown[];
  alerts: unknown[];
  news: unknown[];
  hazards: unknown[];
  communityReports: unknown[];
  dataAvailability: {
    weather: boolean;
    alerts: boolean;
    news: boolean;
    lastCheckedAt: Date | null;
  };
};

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseGeometry(value: string): GeoJSONLineString {
  const parsed = parseJson<GeoJSONLineString>(value, { type: 'LineString', coordinates: [] });
  return parsed?.type === 'LineString' && Array.isArray(parsed.coordinates)
    ? parsed
    : { type: 'LineString', coordinates: [] };
}

function parseSnapshot(value: string | null): StoredSnapshot {
  return parseJson<StoredSnapshot>(value, { data: [] });
}

export function parsePreferences(value: string | null | undefined): Record<string, boolean> {
  return parseJson<Record<string, boolean>>(value, {
    avoidNightTravel: false,
    preferSaferRoutes: true,
    preferFasterRoutes: false,
    severeWeatherAlerts: true,
    communityLocationVisibility: true,
  });
}

export async function persistJourneySnapshot(
  journeyId: string,
  dataType: 'WEATHER' | 'ALERTS' | 'NEWS',
  data: unknown,
  error?: string
) {
  const now = new Date();
  await prisma.dataSourceRecord.create({
    data: {
      journeyId,
      source: dataType === 'WEATHER' ? 'OpenWeatherMap' : dataType === 'NEWS' ? 'GNews' : 'Official alerts',
      dataType,
      fetchedAt: now,
      expiresAt: new Date(now.getTime() + (dataType === 'WEATHER' ? 10 : 30) * 60 * 1000),
      isStale: Boolean(error),
      rawData: JSON.stringify({ data, ...(error ? { error } : {}) }),
    },
  });
}

function makeSegmentName(index: number, total: number, start: [number, number], end: [number, number]) {
  return `Route section ${index + 1} of ${total} (${start[1].toFixed(2)}, ${start[0].toFixed(2)} → ${end[1].toFixed(2)}, ${end[0].toFixed(2)})`;
}

export async function ensureRouteSegments(routeId: string, geometryValue: string) {
  const geometry = parseGeometry(geometryValue);
  const points = geometry.coordinates;
  if (points.length < 2) return;

  const existing = await prisma.routeSegment.count({ where: { routeId } });
  if (existing > 0) return;

  const segmentCount = Math.min(6, points.length - 1);
  const segments = Array.from({ length: segmentCount }, (_, index) => {
    const startIndex = Math.floor((index * (points.length - 1)) / segmentCount);
    const endIndex = Math.floor(((index + 1) * (points.length - 1)) / segmentCount);
    const start = points[startIndex];
    const end = points[Math.max(startIndex + 1, endIndex)];
    return {
      routeId,
      name: makeSegmentName(index, segmentCount, start, end),
      startLat: start[1],
      startLng: start[0],
      endLat: end[1],
      endLng: end[0],
    };
  });

  await prisma.routeSegment.createMany({ data: segments });
}

export async function getJourneyDashboard(journeyId: string): Promise<DashboardData | null> {
  const journey = await prisma.journey.findUnique({
    where: { id: journeyId },
    include: {
      routes: { include: { segments: { orderBy: { updatedAt: 'asc' } } } },
      analysis: true,
      hazards: { where: { isActive: true }, orderBy: { reportedAt: 'desc' } },
      communityReports: {
        where: { isActive: true },
        include: {
          user: { select: { id: true, name: true, image: true } },
          confirmations: { select: { id: true } },
          comments: {
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 30,
      },
      dataSourceRecords: { orderBy: { fetchedAt: 'desc' }, take: 30 },
    },
  });

  if (!journey) return null;

  const snapshots = new Map<string, StoredSnapshot>();
  for (const record of journey.dataSourceRecords) {
    if (!snapshots.has(record.dataType)) snapshots.set(record.dataType, parseSnapshot(record.rawData));
  }

  return {
    journey: {
      id: journey.id,
      origin: journey.origin,
      destination: journey.destination,
      originLat: journey.originLat,
      originLng: journey.originLng,
      destinationLat: journey.destinationLat,
      destinationLng: journey.destinationLng,
      travelDate: journey.travelDate,
      travelMode: journey.travelMode,
      status: journey.status,
      preferences: parsePreferences(journey.preferences),
      lastAnalyzedAt: journey.lastAnalyzedAt,
    },
    routes: journey.routes.map((route) => ({
      id: route.id,
      distance: route.distance,
      duration: route.duration,
      geometry: parseGeometry(route.geometry),
      isPrimary: route.isPrimary,
      riskLevel: route.riskLevel as RiskLevel,
      summary: route.summary || (route.isPrimary ? 'Recommended route' : 'Alternative route'),
      segments: route.segments.map((segment) => ({
        id: segment.id,
        name: segment.name,
        condition: segment.condition,
        riskLevel: segment.riskLevel as RiskLevel,
        averageSpeed: segment.averageSpeed,
        isBlocked: segment.isBlocked,
        start: { lat: segment.startLat, lng: segment.startLng },
        end: { lat: segment.endLat, lng: segment.endLng },
        updatedAt: segment.updatedAt,
      })),
    })),
    analysis: journey.analysis ? {
      overallRisk: journey.analysis.overallRisk as RiskLevel,
      summary: journey.analysis.summary,
      recommendation: journey.analysis.recommendation,
      confidence: journey.analysis.confidence,
      riskFactors: parseJson<Record<string, RiskLevel>>(journey.analysis.riskFactors, {}),
      generatedAt: journey.analysis.generatedAt,
    } : null,
    weather: Array.isArray(snapshots.get('WEATHER')?.data) ? snapshots.get('WEATHER')!.data as unknown[] : [],
    alerts: Array.isArray(snapshots.get('ALERTS')?.data) ? snapshots.get('ALERTS')!.data as unknown[] : [],
    news: Array.isArray(snapshots.get('NEWS')?.data) ? snapshots.get('NEWS')!.data as unknown[] : [],
    hazards: journey.hazards,
    communityReports: journey.communityReports,
    dataAvailability: {
      weather: snapshots.has('WEATHER') && !snapshots.get('WEATHER')?.error,
      alerts: snapshots.has('ALERTS') && !snapshots.get('ALERTS')?.error,
      news: snapshots.has('NEWS') && !snapshots.get('NEWS')?.error,
      lastCheckedAt: journey.dataSourceRecords[0]?.fetchedAt || null,
    },
  };
}

