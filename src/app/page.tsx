'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import RouteSearchForm from '@/components/shared/RouteSearchForm';
import CommunityFeed from '@/components/shared/CommunityFeed';
import dynamic from 'next/dynamic';
import { getRoutePreview } from '@/app/actions/previewRoute';
import { RouteData } from '@/types';

const InteractiveRouteMap = dynamic(
  () => import('@/components/journey/InteractiveRouteMap'),
  { ssr: false }
);

export default function Home() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [previewData, setPreviewData] = useState<{
    origin: { lat: number; lng: number; name: string };
    destination: { lat: number; lng: number; name: string };
    routes: RouteData[];
  } | null>(null);

  // Debounce the preview fetching
  useEffect(() => {
    if (origin.trim().length > 2 && destination.trim().length > 2) {
      const timer = setTimeout(async () => {
        try {
          const result = await getRoutePreview(origin, destination);
          if (result) {
            setPreviewData(result);
          }
        } catch (error) {
          console.error('Failed preview', error);
        }
      }, 1200); // 1.2s debounce to prevent spamming API while typing
      return () => clearTimeout(timer);
    }
  }, [origin, destination]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col font-sans text-gray-900 selection:bg-accent/20">
      
      {/* 1. Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
            <path d="M12 11l-3 6h6l-3-6z" opacity="0.6"/>
          </svg>
          <span className="text-xl font-bold tracking-widest uppercase">ONEWAY</span>
        </div>
        <nav className="hidden md:flex items-center gap-10 font-medium text-sm text-gray-800">
          <Link href="#how-it-works" className="hover:text-accent transition-colors">How It Works</Link>
          <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
          <Link href="#community" className="hover:text-accent transition-colors">Community</Link>
          <Link href="#about" className="hover:text-accent transition-colors">About Us</Link>
        </nav>
        <div className="hidden md:flex">
          <Link href="#search" className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-full text-sm font-semibold transition-colors flex items-center gap-2">
            Analyze My Journey
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative w-full h-[650px] md:h-[750px] pt-32 px-6 flex flex-col items-center">
        {/* Absolute Background Image fading into the body color */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#fdfbf7] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
            alt="Mountain Road" 
            className="w-full h-[85%] object-cover object-top"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto text-center w-full mt-10 md:mt-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-md">
            Know your route.<br />Travel with confidence.
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto mb-16 drop-shadow-sm">
            OneWay brings together live weather, road conditions, alerts, and real traveler updates to help you choose safer and smarter routes.
          </p>
        </div>
        
        {/* Search Form positioned to overlap the bottom of the hero image */}
        <div className="w-full relative z-30 -mt-10 md:-mt-2" id="search">
          <RouteSearchForm origin={origin} setOrigin={setOrigin} destination={destination} setDestination={setDestination} />
        </div>
      </section>

      {/* 3. Features Row */}
      <section id="features" className="py-16 md:py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent/5 text-accent flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Live Weather</h3>
            <p className="text-gray-600 leading-relaxed">Real-time weather updates along your route.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent/5 text-accent flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Road Conditions</h3>
            <p className="text-gray-600 leading-relaxed">Know about road closures, traffic, and hazards.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent/5 text-accent flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Community Updates</h3>
            <p className="text-gray-600 leading-relaxed">Real traveler reports and photos from the road.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent/5 text-accent flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">AI Powered Insights</h3>
            <p className="text-gray-600 leading-relaxed">Smart analysis to recommend safer route options.</p>
          </div>

        </div>
      </section>

      {/* 4. Split Section: Community & Live Map */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
        
        {/* Left: Community Feed Preview */}
        <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-100 flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Community Updates</h3>
              <p className="text-gray-500 text-sm mt-1">Real travelers. Real updates.</p>
            </div>
            <button className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent font-semibold rounded-full text-sm transition-colors">
              Share an Update
            </button>
          </div>

          <CommunityFeed />
          
          <div className="pt-4 mt-auto">
            <Link href="#community" className="text-sm font-semibold text-accent hover:text-accent-hover flex items-center gap-1">
              View all community updates <span className="text-lg">→</span>
            </Link>
          </div>
        </div>

        {/* Right: Live Route Map Image Placeholder (Or real map) */}
        <div className="bg-[#f0f1ec] rounded-3xl p-8 shadow-card border border-gray-100 flex flex-col h-[600px] overflow-hidden relative group">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Live Route Map</h3>
              <p className="text-gray-500 text-sm mt-1">Real-time conditions on your journey</p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-gray-600 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success"></div> Clear</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-warning"></div> Moderate</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-danger"></div> High Risk</span>
            </div>
          </div>
          
          {/* Realtime Google Map for Landing Page */}
          <div className="absolute inset-x-0 bottom-0 top-28 mx-4 md:mx-8 mb-4 md:mb-8 rounded-2xl overflow-hidden shadow-inner group-hover:shadow-lg transition-all duration-700 z-0">
            <InteractiveRouteMap
              origin={previewData?.origin || { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad' }}
              destination={previewData?.destination || { lat: 32.2396, lng: 77.1887, name: 'Manali' }}
              routes={previewData?.routes || [{
                id: 'demo_route',
                isPrimary: true,
                distance: 1200000,
                duration: 43200,
                summary: 'NH 48',
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [72.5714, 23.0225],
                    [73.7125, 24.5854],
                    [75.7873, 26.9124],
                    [77.1025, 28.7041],
                    [76.7794, 30.7333],
                    [77.1887, 32.2396],
                  ]
                },
                waypoints: []
              }]}
              hazards={previewData ? [] : [
                { id: 'h1', type: 'HEAVY_RAIN', severity: 'HIGH', coordinates: { lat: 28.7041, lng: 77.1025 }, description: 'Heavy Rain', source: 'Weather', reportedAt: new Date(), confidence: 'HIGH', potentialImpact: 'Slippery roads' },
                { id: 'h2', type: 'ROAD_CLOSURE', severity: 'MODERATE', coordinates: { lat: 30.7333, lng: 76.7794 }, description: 'Traffic', source: 'Weather', reportedAt: new Date(), confidence: 'HIGH', potentialImpact: 'Delays' }
              ]}
              communityReports={[]}
              primaryRisk="LOW"
              className="w-full h-full border-none rounded-2xl"
            />
          </div>
          
          {/* Gradient Overlay & Bottom Text */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent mx-4 md:mx-8 mb-4 md:mb-8 rounded-b-2xl pointer-events-none z-10" />
          
          <div className="absolute bottom-12 left-14 right-14 flex justify-between items-end">
            <div>
              <h4 className="font-bold text-gray-900">Live Updates</h4>
              <p className="text-xs text-gray-500">Weather data updated 1 min ago</p>
            </div>
            <button className="text-sm font-semibold text-accent hover:text-accent-hover flex items-center gap-1 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-100">
              View all updates <span className="text-lg">→</span>
            </button>
          </div>
        </div>

      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-10 shadow-card border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-12">How OneWay Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-gray-100 z-0"></div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-accent/20 flex items-center justify-center mb-4 text-accent shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">1. Enter Your Journey</h4>
              <p className="text-sm text-gray-500">Add your start and destination.</p>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-accent/20 flex items-center justify-center mb-4 text-accent shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">2. We Analyze</h4>
              <p className="text-sm text-gray-500">We check weather, roads, traffic & alerts.</p>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-accent/20 flex items-center justify-center mb-4 text-accent shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">3. Get Insights</h4>
              <p className="text-sm text-gray-500">AI analyzes everything and scores each route.</p>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-accent flex items-center justify-center mb-4 text-accent shadow-glow-accent">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">4. Travel Confidently</h4>
              <p className="text-sm text-gray-500">Choose the safest route and enjoy your journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA Banner */}
      <section className="pb-24 px-6 max-w-7xl mx-auto w-full">
        <div className="relative w-full h-[350px] md:h-[400px] rounded-[32px] overflow-hidden flex items-end p-10 md:p-16">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1542240578-8386cd1bdc90?q=80&w=2670&auto=format&fit=crop" 
            alt="Travel Adventure" 
            className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
          />
          <div className="relative z-20 w-full md:max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Every journey is better when you're prepared.</h2>
            <p className="text-lg text-white/90 mb-8 font-medium">Plan smarter. Travel safer. Reach happier.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#search" className="px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2">
                Analyze My Journey
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <button className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                See how it works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Minimal Footer */}
      <footer className="mt-auto border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2"><svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Real-time Updates</span>
            <span className="flex items-center gap-2"><svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> Trusted Sources</span>
            <span className="flex items-center gap-2"><svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> AI-Powered Analysis</span>
          </div>
          <div>&copy; 2024 OneWay. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
