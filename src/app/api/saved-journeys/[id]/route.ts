import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActorId } from '@/lib/actor';

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getActorId();
  if (!userId) return NextResponse.json({ success: false, error: 'Sign in to update saved journeys' }, { status: 401 });
  const deleted = await prisma.savedJourney.deleteMany({ where: { id: (await params).id, userId } });
  if (!deleted.count) return NextResponse.json({ success: false, error: 'Saved journey not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

