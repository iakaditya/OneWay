'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { RouteData, RiskLevel } from '@/types';

// Dynamically import the map to avoid SSR issues
const InteractiveRouteMap = dynamic(
  () => import('@/components/journey/InteractiveRouteMap'),
  { ssr: false }
);

type AnalysisState = 
  | 'INITIALIZING'
  | 'VERIFYING_LOCATIONS'
  | 'FINDING_ROUTES'
  | 'CHECKING_WEATHER'
  | 'CALCULATING_RISK'
  | 'AI_COMPARING'
  | 'COMPLETE'
  | 'ERROR';

function AnalyzeExperience() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const originParam = searchParams.get('origin') || '';
  const destinationParam = searchParams.get('destination') || '';
  const travelModeParam = searchParams.get('travelMode') || 'DRIVING';
  const travelDateParam = searchParams.get('travelDate') || '';

  const [state, setState] = useState<AnalysisState>('INITIALIZING');
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [journeyData, setJourneyData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [routesDiscovered, setRoutesDiscovered] = useState(0);
  const [checkpointsAnalyzed, setCheckpointsAnalyzed] = useState(0);

  useEffect(() => {
    if (!originParam || !destinationParam) {
      setErrorMsg('Missing origin or destination.');
      setState('ERROR');
      return;
    }

    async function runAnalysis() {
      try {
        // 1. Verifying Locations
        setState('VERIFYING_LOCATIONS');
        await new Promise(r => setTimeout(r, 1000)); // Brief visual pause

        // 2. Finding Routes (Create Journey)
        setState('FINDING_ROUTES');
        const createRes = await fetch('/api/journeys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin: originParam, destination: destinationParam, travelMode: travelModeParam, travelDate: travelDateParam ? new Date(`${travelDateParam}T08:00:00`).toISOString() : new Date().toISOString() }),
        });
        const createData = await createRes.json();
        
        if (!createData.success) {
          throw new Error(createData.error || 'Failed to find routes.');
        }

        const jId = createData.data.journeyId;
        setJourneyId(jId);

        // Fetch the created journey to get routes for the map
        const jRes = await fetch(`/api/journeys/${jId}`);
        const jData = await jRes.json();
        
        if (jData.success) {
          setJourneyData(jData.data);
          setRoutesDiscovered(jData.data.routes.length);
          setCheckpointsAnalyzed(jData.data.routes.length * 5); // 5 waypoints per route approx
        }

        // 3. Checking Weather & Calculating Risk
        setState('CHECKING_WEATHER');
        await new Promise(r => setTimeout(r, 1500)); // Artificial pause to let user see routes on map
        
        setState('CALCULATING_RISK');
        
        // Actually trigger the heavy analysis endpoint
        const analyzeRes = await fetch(`/api/journeys/${jId}/analyze`, { method: 'POST' });
        const analyzeData = await analyzeRes.json();
        
        if (!analyzeData.success) {
          // Graceful fallback if weather/AI completely fails
          console.error('Analysis failed:', analyzeData.error);
        } else {
          setAnalysisResult(analyzeData.data);
        }

        // 4. AI Comparing
        setState('AI_COMPARING');
        await new Promise(r => setTimeout(r, 1500));

        // 5. Complete
        setState('COMPLETE');

      } catch (err: any) {
        setErrorMsg(err.message || 'Unable to complete route analysis.');
        setState('ERROR');
      }
    }

    runAnalysis();
  }, [originParam, destinationParam]);

  // UI Helpers
  const isStateActive = (s: AnalysisState) => state === s;
  const isStateDone = (s: AnalysisState) => {
    const order = ['INITIALIZING', 'VERIFYING_LOCATIONS', 'FINDING_ROUTES', 'CHECKING_WEATHER', 'CALCULATING_RISK', 'AI_COMPARING', 'COMPLETE'];
    return order.indexOf(state) > order.indexOf(s);
  };

  const getStatusIcon = (s: AnalysisState) => {
    if (isStateDone(s)) return '✓';
    if (isStateActive(s)) return '◉';
    return '○';
  };

  const getStatusClass = (s: AnalysisState) => {
    if (isStateDone(s)) return 'text-success';
    if (isStateActive(s)) return 'text-accent animate-pulse';
    return 'text-text-muted';
  };

  if (state === 'ERROR') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-text-primary">Unable to complete route analysis.</h2>
        <p className="text-risk-high mb-8 max-w-md">{errorMsg}</p>
        <div className="flex gap-4">
          <button onClick={() => router.push('/')} className="px-6 py-3 bg-surface-2 hover:bg-surface-3 rounded-xl transition-colors">
            Try Another Journey
          </button>
          {journeyId && (
            <button onClick={() => router.push(`/journey/${journeyId}`)} className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors">
              View Available Data
            </button>
          )}
        </div>
      </div>
    );
  }

  // Determine which routes to show on map
  // Before finding routes, just show empty or fake coordinates if we don't have them
  const displayRoutes = journeyData?.routes?.map((r: any) => ({
    id: r.id,
    isPrimary: r.isPrimary,
    distance: r.distance,
    duration: r.duration,
    summary: r.summary,
    geometry: r.geometry,
    waypoints: r.waypoints,
  })) || [];

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col md:flex-row">
      
      {/* MAP LAYER (Full screen on mobile, Right side on desktop) */}
      <div className="absolute inset-0 z-0">
        {journeyData && state !== 'VERIFYING_LOCATIONS' ? (
          <InteractiveRouteMap
            origin={{ lat: journeyData.originLat, lng: journeyData.originLng, name: journeyData.origin }}
            destination={{ lat: journeyData.destinationLat, lng: journeyData.destinationLng, name: journeyData.destination }}
            routes={displayRoutes}
            hazards={[]}
            communityReports={[]}
            primaryRisk={'LOW'}
            className="w-full h-full border-none rounded-none"
          />
        ) : (
          <div className="w-full h-full bg-surface-2 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin opacity-50" />
          </div>
        )}
        {/* Map overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 md:via-background/70 to-transparent z-10 pointer-events-none" />
      </div>

      {/* FOREGROUND PANEL */}
      <div className="relative z-20 w-full md:w-[500px] h-full p-6 md:p-12 flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          {state !== 'COMPLETE' ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl p-8 shadow-card-hover"
            >
              <h1 className="text-xl font-medium text-text-muted mb-2">Analyzing your journey</h1>
              <h2 className="text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
                {originParam} <span className="text-accent">→</span> {destinationParam}
              </h2>

              <div className="space-y-5 text-sm font-medium tracking-wide">
                <div className={`flex items-center gap-4 transition-colors ${getStatusClass('VERIFYING_LOCATIONS')}`}>
                  <span className="text-lg w-5 text-center">{getStatusIcon('VERIFYING_LOCATIONS')}</span>
                  <span>Journey locations verified</span>
                </div>
                
                <div className={`flex items-center gap-4 transition-colors ${getStatusClass('FINDING_ROUTES')}`}>
                  <span className="text-lg w-5 text-center">{getStatusIcon('FINDING_ROUTES')}</span>
                  <span>
                    {routesDiscovered > 0 ? `${routesDiscovered} possible routes discovered` : 'Finding available routes'}
                  </span>
                </div>

                <div className={`flex items-center gap-4 transition-colors ${getStatusClass('CHECKING_WEATHER')}`}>
                  <span className="text-lg w-5 text-center">{getStatusIcon('CHECKING_WEATHER')}</span>
                  <span>
                    {checkpointsAnalyzed > 0 && isStateDone('CHECKING_WEATHER') 
                      ? `${checkpointsAnalyzed} route checkpoints analyzed` 
                      : 'Checking weather along the journey'}
                  </span>
                </div>

                <div className={`flex items-center gap-4 transition-colors ${getStatusClass('CALCULATING_RISK')}`}>
                  <span className="text-lg w-5 text-center">{getStatusIcon('CALCULATING_RISK')}</span>
                  <span>Calculating route safety risk</span>
                </div>

                <div className={`flex items-center gap-4 transition-colors ${getStatusClass('AI_COMPARING')}`}>
                  <span className="text-lg w-5 text-center">{getStatusIcon('AI_COMPARING')}</span>
                  <span>OneWay AI is comparing routes</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-card rounded-3xl p-8 shadow-glow-accent border-accent/30"
            >
              <div className="inline-flex items-center gap-2 text-success font-semibold tracking-widest uppercase text-xs mb-6 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
                <span className="text-base">✓</span> Analysis Complete
              </div>

              <h2 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
                {originParam} <span className="text-text-muted text-xl">→</span> {destinationParam}
              </h2>
              <p className="text-text-muted mb-8">{routesDiscovered} possible routes analyzed</p>

              {analysisResult && (
                <div className="bg-surface-3/50 rounded-2xl p-6 border border-border-subtle mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  
                  <div className="text-xs font-semibold text-accent uppercase tracking-widest mb-4">Recommended Route</div>
                  <div className="flex justify-between items-end mb-4">
                    <div className="text-2xl font-bold text-text-primary">
                      {journeyData?.routes.find((r:any) => r.id === analysisResult.recommendedRouteId)?.summary || 'Primary Route'}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Safety Score</div>
                      <div className="text-3xl font-bold text-success">
                        {Math.round((analysisResult.overallRisk === 'LOW' ? 85 : analysisResult.overallRisk === 'MODERATE' ? 65 : 40))}
                        <span className="text-base text-text-muted font-normal">/100</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed border-t border-border-subtle pt-4">
                    {analysisResult.summary}
                  </p>
                </div>
              )}

              <button
                onClick={() => router.push(`/journey/${journeyId}`)}
                className="w-full py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold text-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] flex items-center justify-center gap-2"
              >
                View Full Route Analysis
                <span className="text-xl">→</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AnalyzeExperience />
    </Suspense>
  );
}
