import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActorId } from '@/lib/actor';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getActorId();
  if (!userId) return NextResponse.json({ success: false, error: 'Sign in to react' }, { status: 401 });
  const postId = (await params).id;
  const existing = await prisma.reportVote.findUnique({ where: { reportId_userId: { reportId: postId, userId } } });
  if (existing) {
    await prisma.$transaction([
      prisma.reportVote.delete({ where: { id: existing.id } }),
      prisma.communityReport.update({ where: { id: postId }, data: { usefulCount: { decrement: 1 } } }),
    ]);
    return NextResponse.json({ success: true, data: { liked: false } });
  }
  await prisma.$transaction([
    prisma.reportVote.create({ data: { reportId: postId, userId, isUseful: true } }),
    prisma.communityReport.update({ where: { id: postId }, data: { usefulCount: { increment: 1 } } }),
  ]);
  return NextResponse.json({ success: true, data: { liked: true } });
}

