import { NextRequest, NextResponse } from 'next/server';
import { analyzeJourney } from '@/lib/analysis/journeyAnalyzer';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await analyzeJourney((await params).id);
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ success: false, error: 'Route analysis is temporarily unavailable' }, { status: 503 });
  }
}

