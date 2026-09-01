import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getActorId } from '@/lib/actor';
import { publishJourneyEvent } from '@/lib/events';
import { analyzeJourney } from '@/lib/analysis/journeyAnalyzer';

const ReportSchema = z.object({
  journeyId: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  locationName: z.string().optional(),
  category: z.enum(['GENERAL','ROAD_UPDATE','WEATHER_REPORT','HAZARD','TIP','QUESTION','ROAD_BLOCKED','LANDSLIDE','FLOOD','HEAVY_RAIN','SNOW','POOR_VISIBILITY','TRAFFIC','ACCIDENT','ROAD_CLEAR','BRIDGE_DAMAGE','OTHER']),
  content: z.string().min(5).max(1000),
  imageUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getActorId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Sign in to submit a report' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ReportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid report data' }, { status: 400 });
    }

    const report = await prisma.communityReport.create({
      data: {
        userId,
        journeyId: parsed.data.journeyId || null,
        lat: parsed.data.lat,
        lng: parsed.data.lng,
        locationName: parsed.data.locationName,
        category: parsed.data.category,
        content: parsed.data.content,
        imageUrl: parsed.data.imageUrl,
        verificationStatus: 'UNVERIFIED',
      },
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    const hazardCategories = new Set(['HAZARD', 'LANDSLIDE', 'FLOOD', 'ROAD_BLOCKED', 'ACCIDENT', 'BRIDGE_DAMAGE']);
    if (report.journeyId && hazardCategories.has(report.category)) {
      const content = report.content.toLowerCase();
      const hazardType = report.category === 'HAZARD'
        ? content.includes('landslide') ? 'LANDSLIDE' : content.includes('flood') ? 'FLOOD' : content.includes('accident') ? 'ACCIDENT' : 'ROAD_CLOSURE'
        : report.category === 'ROAD_BLOCKED' ? 'ROAD_CLOSURE' : report.category;
      await prisma.hazard.create({
        data: {
          journeyId: report.journeyId,
          lat: report.lat,
          lng: report.lng,
          type: hazardType,
          severity: report.category === 'ROAD_BLOCKED' || report.category === 'LANDSLIDE' || report.category === 'HAZARD' ? 'HIGH' : 'MODERATE',
          description: report.content,
          source: 'Community report',
          confidence: 'MEDIUM',
          reportedAt: report.createdAt,
        },
      });
      publishJourneyEvent(report.journeyId, 'COMMUNITY_POST_CREATED');
      publishJourneyEvent(report.journeyId, 'ROUTE_RISK_CHANGED');
      await analyzeJourney(report.journeyId);
    }

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create report' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const journeyId = url.searchParams.get('journeyId') || undefined;
  const lat = parseFloat(url.searchParams.get('lat') || '0');
  const lng = parseFloat(url.searchParams.get('lng') || '0');
  const radius = parseFloat(url.searchParams.get('radius') || '50'); // km
  const latDelta = radius / 111;
  const lngDelta = radius / (111 * Math.cos(lat * Math.PI / 180));
  const reports = await prisma.communityReport.findMany({
    where: {
      isActive: true,
      ...(journeyId ? { journeyId } : {}),
      ...(!journeyId ? {
        lat: { gte: lat - latDelta, lte: lat + latDelta },
        lng: { gte: lng - lngDelta, lte: lng + lngDelta },
      } : {}),
    },
    include: {
      user: { select: { name: true, image: true } },
      confirmations: { select: { id: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return NextResponse.json({ success: true, data: reports });
}
