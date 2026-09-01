import { NextRequest, NextResponse } from 'next/server';
import { analyzeJourney } from '@/lib/analysis/journeyAnalyzer';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await analyzeJourney(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
