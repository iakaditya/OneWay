import { NextRequest, NextResponse } from 'next/server';
import { getJourneyDashboard } from '@/lib/intelligence/dashboard';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const dashboard = await getJourneyDashboard((await params).id);
  if (!dashboard) return NextResponse.json({ success: false, error: 'Journey not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: {
    origin: { lat: dashboard.journey.originLat, lng: dashboard.journey.originLng, name: dashboard.journey.origin },
    destination: { lat: dashboard.journey.destinationLat, lng: dashboard.journey.destinationLng, name: dashboard.journey.destination },
    routes: dashboard.routes,
    hazards: dashboard.hazards,
    alerts: dashboard.alerts,
    communityReports: dashboard.communityReports,
  } });
}

