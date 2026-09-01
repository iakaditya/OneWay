import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActorId } from '@/lib/actor';
import { publishJourneyEvent } from '@/lib/events';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getActorId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Sign in to confirm reports' }, { status: 401 });
    }

    // Check report exists
    const report = await prisma.communityReport.findUnique({ where: { id } });
    if (!report) return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });

    // Upsert confirmation
    await prisma.reportConfirmation.upsert({
      where: { reportId_userId: { reportId: id, userId } },
      create: { reportId: id, userId },
      update: {},
    });

    // Count confirmations and update status
    const count = await prisma.reportConfirmation.count({ where: { reportId: id } });
    await prisma.communityReport.update({
      where: { id },
      data: {
        confirmationCount: count,
        verificationStatus: count >= 3 ? 'CONFIRMED' : 'REPORTED',
      },
    });

    if (report.journeyId) publishJourneyEvent(report.journeyId, 'COMMUNITY_POST_UPDATED');

    return NextResponse.json({ success: true, data: { confirmationCount: count } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to confirm report' }, { status: 500 });
  }
}
