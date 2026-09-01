import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { parsePreferences } from '@/lib/intelligence/dashboard';
import { publishJourneyEvent } from '@/lib/events';

const UpdateJourneySchema = z.object({
  preferences: z.record(z.string(), z.boolean()).optional(),
  travelDate: z.string().datetime().optional(),
  travelMode: z.enum(['DRIVING', 'MOTORCYCLE', 'TRANSIT', 'WALKING']).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const journey = await prisma.journey.findUnique({
      where: { id },
      include: {
        routes: true,
        analysis: true,
        hazards: { where: { isActive: true } },
        communityReports: {
          where: { isActive: true },
          include: {
            user: { select: { name: true, image: true } },
            confirmations: { select: { id: true } },
            comments: {
              include: { user: { select: { name: true, image: true } } },
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!journey) {
      return NextResponse.json({ success: false, error: 'Journey not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: journey });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch journey' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = UpdateJourneySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid journey settings' }, { status: 400 });
  const journey = await prisma.journey.findUnique({ where: { id }, select: { id: true, preferences: true } });
  if (!journey) return NextResponse.json({ success: false, error: 'Journey not found' }, { status: 404 });
  const preferences = parsed.data.preferences ? { ...parsePreferences(journey.preferences), ...parsed.data.preferences } : undefined;
  const updated = await prisma.journey.update({
    where: { id },
    data: {
      ...(preferences ? { preferences: JSON.stringify(preferences) } : {}),
      ...(parsed.data.travelDate ? { travelDate: new Date(parsed.data.travelDate) } : {}),
      ...(parsed.data.travelMode ? { travelMode: parsed.data.travelMode } : {}),
    },
  });
  publishJourneyEvent(id, 'JOURNEY_REFRESHED');
  return NextResponse.json({ success: true, data: updated });
}
