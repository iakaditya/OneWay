import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleRouteProvider } from '@/lib/providers/RouteProvider';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { ensureRouteSegments } from '@/lib/intelligence/dashboard';
import { publishJourneyEvent } from '@/lib/events';

const routeProvider = new GoogleRouteProvider();

const CreateJourneySchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  travelDate: z.string().optional(),
  travelMode: z.enum(['DRIVING', 'MOTORCYCLE', 'TRANSIT', 'WALKING']).optional().default('DRIVING'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateJourneySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const { origin, destination, travelDate, travelMode } = parsed.data;
    const session = await auth();

    // Geocode both locations
    const [originGeo, destGeo] = await Promise.all([
      routeProvider.geocode(origin),
      routeProvider.geocode(destination),
    ]);

    // Get routes
    const routes = await routeProvider.getRoutes(
      { lat: originGeo.lat, lng: originGeo.lng },
      { lat: destGeo.lat, lng: destGeo.lng }
    );

    // Create journey
    const journey = await prisma.journey.create({
      data: {
        userId: session?.user?.id || null,
        origin: originGeo.formattedAddress || origin,
        destination: destGeo.formattedAddress || destination,
        originLat: originGeo.lat,
        originLng: originGeo.lng,
        destinationLat: destGeo.lat,
        destinationLng: destGeo.lng,
        travelDate: travelDate ? new Date(travelDate) : new Date(),
        travelMode,
        status: 'ANALYZING',
        routes: {
          create: routes.map((r: import('@/types').RouteData) => ({
            providerRouteId: r.id,
            distance: r.distance,
            duration: r.duration,
            geometry: JSON.stringify(r.geometry),
            isPrimary: r.isPrimary,
            summary: r.summary,
            waypoints: JSON.stringify(r.waypoints),
          })),
        },
      },
      include: { routes: true },
    });

    await Promise.all(journey.routes.map((route) => ensureRouteSegments(route.id, route.geometry)));
    publishJourneyEvent(journey.id, 'JOURNEY_CREATED');

    return NextResponse.json({ success: true, data: { journeyId: journey.id } });
  } catch (error: unknown) {
    console.error('Journey creation error:', error);
    const msg = error instanceof Error && error.message.includes('MISSING_CONFIG')
      ? error.message
      : 'Failed to create journey';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const journeys = await prisma.journey.findMany({
      where: { userId: session.user.id },
      include: { analysis: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ success: true, data: journeys });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch journeys' }, { status: 500 });
  }
}
