import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActorId } from '@/lib/actor';

export async function GET() {
  const userId = await getActorId();
  if (!userId) return NextResponse.json({ success: false, error: 'Sign in to view saved journeys' }, { status: 401 });
  const saved = await prisma.savedJourney.findMany({
    where: { userId },
    include: { journey: { include: { analysis: true, routes: { where: { isPrimary: true } } } } },
    orderBy: { savedAt: 'desc' },
  });
  return NextResponse.json({ success: true, data: saved });
}

export async function POST(request: NextRequest) {
  const userId = await getActorId();
  if (!userId) return NextResponse.json({ success: false, error: 'Sign in to save journeys' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.journeyId !== 'string' || !body.journeyId) {
    return NextResponse.json({ success: false, error: 'Journey id is required' }, { status: 400 });
  }
  const journey = await prisma.journey.findUnique({ where: { id: body.journeyId }, select: { id: true } });
  if (!journey) return NextResponse.json({ success: false, error: 'Journey not found' }, { status: 404 });
  const saved = await prisma.savedJourney.upsert({
    where: { userId_journeyId: { userId, journeyId: body.journeyId } },
    create: { userId, journeyId: body.journeyId },
    update: {},
  });
  return NextResponse.json({ success: true, data: saved }, { status: 201 });
}

