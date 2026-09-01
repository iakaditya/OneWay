import JourneyDashboard from '@/components/journey/JourneyDashboard';

export default async function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JourneyDashboard journeyId={id} />;
}

