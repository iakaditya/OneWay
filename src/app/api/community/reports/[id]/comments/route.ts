import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getActorId } from '@/lib/actor';

const CommentSchema = z.object({ content: z.string().min(1).max(500) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getActorId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Sign in to comment' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CommentSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid content' }, { status: 400 });

    const comment = await prisma.comment.create({
      data: { reportId: id, userId, content: parsed.data.content },
      include: { user: { select: { name: true, image: true } } },
    });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to post comment' }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await prisma.comment.findMany({
    where: { reportId: id },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return NextResponse.json({ success: true, data: comments });
}
