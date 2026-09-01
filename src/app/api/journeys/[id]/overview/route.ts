import { NextRequest, NextResponse } from 'next/server';
import { getJourneyDashboard } from '@/lib/intelligence/dashboard';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const dashboard = await getJourneyDashboard((await params).id);
  if (!dashboard) return NextResponse.json({ success: false, error: 'Journey not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: {
    journey: dashboard.journey,
    analysis: dashboard.analysis,
    recommendedRoute: dashboard.routes.find((route) => route.isPrimary),
    activeAlerts: dashboard.alerts,
    weather: dashboard.weather,
    roadConditions: dashboard.routes.flatMap((route) => route.segments),
    communityActivity: dashboard.communityReports.slice(0, 5),
    recentUpdates: [...dashboard.news, ...dashboard.communityReports].slice(0, 8),
    dataAvailability: dashboard.dataAvailability,
  } });
}

