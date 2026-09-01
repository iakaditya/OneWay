'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Helper to seed if empty
async function ensureSeedData() {
  const count = await prisma.communityReport.count();
  if (count === 0) {
    const seedUser = await prisma.user.upsert({
      where: { email: 'rohit@oneway.local' },
      update: {},
      create: { id: 'rohit_123', email: 'rohit@oneway.local', name: 'Rohit Sharma', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }
    });
    const seedUser2 = await prisma.user.upsert({
      where: { email: 'priya@oneway.local' },
      update: {},
      create: { id: 'priya_123', email: 'priya@oneway.local', name: 'Priya Verma', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' }
    });

    await prisma.communityReport.create({
      data: {
        userId: seedUser.id,
        category: 'Alert',
        content: 'Heavy rainfall near Rohtang Pass. Strong rain since 10 AM. Roads are slippery. Drive safe everyone!',
        lat: 32.3716, lng: 77.2452, locationName: 'Near Rohtang Pass',
        usefulCount: 24,
      }
    });

    await prisma.communityReport.create({
      data: {
        userId: seedUser2.id,
        category: 'Tip',
        content: 'Great chai at this dhaba near Kullu. Highly recommended!',
        lat: 31.9579, lng: 77.1095, locationName: 'Near Kullu',
        usefulCount: 18,
      }
    });
  }
}

export async function getCommunityFeed() {
  await ensureSeedData();

  const session = await auth();
  const currentUserId = session?.user?.id || 'demo_user_123';

  const reports = await prisma.communityReport.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      user: { select: { name: true, image: true, id: true } },
      comments: { 
        select: { id: true, content: true, createdAt: true, user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'asc' }
      },
      votes: { select: { userId: true } }
    },
  });

  return reports.map(r => ({
    id: r.id,
    user: r.user,
    content: r.content,
    category: r.category,
    locationName: r.locationName,
    createdAt: r.createdAt,
    likesCount: r.usefulCount,
    comments: r.comments,
    hasLiked: r.votes.some(v => v.userId === currentUserId)
  }));
}

export async function likeReport(reportId: string) {
  const session = await auth();
  const userId = session?.user?.id || 'demo_user_123'; 

  if (userId === 'demo_user_123') {
    await prisma.user.upsert({
      where: { email: 'demo@oneway.local' },
      update: {},
      create: { id: 'demo_user_123', email: 'demo@oneway.local', name: 'Demo Traveler', image: 'https://i.pravatar.cc/150?u=demo' }
    });
  }

  const existingVote = await prisma.reportVote.findUnique({
    where: { reportId_userId: { reportId, userId } }
  });

  if (existingVote) {
    await prisma.reportVote.delete({ where: { id: existingVote.id } });
    await prisma.communityReport.update({
      where: { id: reportId },
      data: { usefulCount: { decrement: 1 } }
    });
    return { success: true, action: 'unliked' };
  } else {
    await prisma.reportVote.create({
      data: { reportId, userId, isUseful: true }
    });
    await prisma.communityReport.update({
      where: { id: reportId },
      data: { usefulCount: { increment: 1 } }
    });
    return { success: true, action: 'liked' };
  }
}

export async function addComment(reportId: string, content: string) {
  if (!content || content.trim().length === 0) return { success: false, error: 'Comment is empty' };

  const session = await auth();
  const userId = session?.user?.id || 'demo_user_123'; 

  if (userId === 'demo_user_123') {
    await prisma.user.upsert({
      where: { email: 'demo@oneway.local' },
      update: {},
      create: { id: 'demo_user_123', email: 'demo@oneway.local', name: 'Demo Traveler', image: 'https://i.pravatar.cc/150?u=demo' }
    });
  }

  const comment = await prisma.comment.create({
    data: { reportId, userId, content: content.trim() },
    include: { user: { select: { name: true, image: true } } }
  });

  return { success: true, data: comment };
}
