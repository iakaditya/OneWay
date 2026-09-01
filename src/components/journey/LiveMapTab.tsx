import InteractiveRouteMap from './InteractiveRouteMap';
import { RouteData, NormalizedHazard } from '@/types';
import { CloudRain, Map as MapIcon, Share, Bell, Calendar, ChevronRight } from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  journey: any;
  mappedRoutes: RouteData[];
  normalizedHazards: NormalizedHazard[];
  distanceKm: number;
  h: number;
  m: number;
}

export default function LiveMapTab({ journey, mappedRoutes, normalizedHazards, distanceKm, h, m }: Props) {
  return (
    <div className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden bg-[#f8f9fa] pt-8 px-8 pb-12">
      {/* HEADER AREA */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-[26px] text-gray-900 font-bold tracking-tight">
              {journey?.origin || 'Ahmedabad, Gujarat'} <span className="font-normal text-gray-400 mx-1">→</span> {journey?.destination || 'Manali, Himachal Pradesh'}
            </h1>
            <span className="bg-[#e6f4ea] text-[#1e8e3e] font-bold text-[11px] px-2.5 py-1 rounded-md uppercase tracking-wider">Live</span>
          </div>
          <div className="flex items-center gap-5 text-gray-500 font-semibold text-[13px] mt-1.5">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Mon, 2 Sep 2024</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l-1-1m0 0l-1 1m1-1v10a2 2 0 002 2h10a2 2 0 002-2V9m-1-1l1 1m0 0l1-1m-1 1v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9" /></svg>
              By Car
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl font-bold text-[13px] text-gray-700 flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Change Journey
          </button>
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl font-bold text-[13px] text-gray-700 flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">
            <Share className="w-4 h-4" />
            Share
          </button>
          <button className="bg-white border border-gray-200 w-11 h-11 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <img src="https://i.pravatar.cc/150?img=11" className="w-11 h-11 rounded-full border border-gray-200 shadow-sm" alt="Profile" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Map & Stats */}
        <div className="col-span-8 flex flex-col gap-6">
          
          {/* MAP CONTAINER */}
          <div className="bg-white rounded-[28px] p-2 shadow-sm border border-gray-100 h-[640px] flex flex-col relative">
            {/* Map Header */}
            <div className="flex items-center gap-6 p-4">
              <h3 className="font-bold text-gray-900 text-[16px]">Live Route Map</h3>
              <div className="hidden sm:flex items-center gap-5 text-[11px] font-bold text-gray-500">
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e]"/> Safe</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"/> Moderate</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/> High Risk</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"/> Weather Alert</span>
                <span className="flex items-center gap-1.5 text-red-500"><div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-red-500 flex items-center justify-center font-bold text-[8px] bg-white">!</div> Road Block</span>
              </div>
            </div>

            {/* Map Element */}
            <div className="flex-1 rounded-[20px] overflow-hidden relative border border-gray-100">
              {journey && (
                <InteractiveRouteMap
                  origin={{ lat: journey.originLat, lng: journey.originLng, name: journey.origin }}
                  destination={{ lat: journey.destinationLat, lng: journey.destinationLng, name: journey.destination }}
                  routes={mappedRoutes}
                  hazards={normalizedHazards}
                  communityReports={[]}
                  primaryRisk={journey.analysis?.overallRisk || 'MODERATE'}
                  className="w-full h-full border-none rounded-none"
                />
              )}

              {/* Terrain toggle */}
              <button className="absolute bottom-6 right-6 bg-black p-0 rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform group border-2 border-white">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100&h=100&fit=crop" className="w-[100px] h-[64px] object-cover group-hover:brightness-110 transition-all opacity-80" alt="Terrain" />
                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white drop-shadow-md">Terrain View</div>
              </button>

              {/* TIMELINE OVERLAY */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white">
                <div className="relative">
                  <div className="absolute top-1/2 inset-x-8 h-1.5 bg-gray-100 -z-10 -translate-y-1/2 rounded-full overflow-hidden flex">
                    <div className="h-full w-[20%] bg-[#1e8e3e]"></div>
                    <div className="h-full w-[20%] bg-[#1e8e3e]"></div>
                    <div className="h-full w-[20%] bg-red-500"></div>
                    <div className="h-full w-[20%] bg-yellow-400"></div>
                    <div className="h-full w-[20%] bg-[#1e8e3e]"></div>
                  </div>
                  <div className="flex justify-between relative z-10">
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-bold text-gray-900 mb-1">Ahmedabad</div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e] border-2 border-white shadow-sm"></div>
                      <div className="text-[9px] font-bold text-[#1e8e3e] mt-1 uppercase tracking-wider">Start</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-bold text-gray-900 mb-1">Delhi</div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e] border-2 border-white shadow-sm"></div>
                      <div className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Good</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-bold text-gray-900 mb-1">Chandigarh</div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e] border-2 border-white shadow-sm"></div>
                      <div className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Good</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-bold text-red-600 mb-1">Mandi</div>
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-md relative">
                         <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-50"></div>
                      </div>
                      <div className="text-[9px] font-bold text-red-600 mt-1 uppercase tracking-wider">High Risk</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-bold text-gray-900 mb-1">Kullu</div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-white shadow-sm"></div>
                      <div className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Moderate</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-bold text-[#1e8e3e] mb-1">Manali</div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#1e8e3e] shadow-sm"></div>
                      <div className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Destination</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS ROW */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_14px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-2 text-gray-500 mb-3">
                <MapIcon className="w-4 h-4 text-[#1e8e3e]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Distance</span>
              </div>
              <div className="text-2xl font-black text-gray-900">{distanceKm} km</div>
            </div>
            
            <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_14px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-2 text-gray-500 mb-3">
                <svg className="w-4 h-4 text-[#1e8e3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-[11px] font-bold uppercase tracking-wider">Est. Duration</span>
              </div>
              <div className="text-2xl font-black text-gray-900">{h}h {m}m</div>
            </div>

            <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_14px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-2 text-gray-500 mb-3">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Current Weather</span>
              </div>
              <div className="text-[16px] font-bold text-gray-900 mb-0.5">Heavy Rain</div>
              <div className="text-[11px] font-semibold text-gray-500">Near Mandi</div>
            </div>

            <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_14px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-2 text-gray-500 mb-3">
                <Calendar className="w-4 h-4 text-[#1e8e3e]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Best Time to Start</span>
              </div>
              <div className="text-[16px] font-bold text-gray-900 mb-0.5">Today, 8:00 AM</div>
            </div>

            <div className="bg-purple-50 rounded-[20px] p-5 border border-purple-100 shadow-sm flex flex-col justify-center relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-purple-700 mb-2 bg-purple-100 w-max px-2.5 py-1 rounded-md">
                <span className="text-sm leading-none">✨</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Recommended</span>
              </div>
              <div className="text-[14px] font-bold text-purple-900 leading-snug">
                Review Alternative Route
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-4 flex flex-col gap-6">
          
          {/* SAFETY SCORE CARD */}
          <div className="bg-white rounded-[24px] pt-6 px-6 pb-2 border border-gray-100 shadow-sm relative overflow-hidden">
            <h3 className="font-bold text-gray-900 text-[15px] mb-4">Journey Safety Score</h3>
            
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e8e3e" strokeWidth="3" strokeDasharray="82, 100" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#1e8e3e]">82<span className="text-[13px] text-gray-400 font-bold">/100</span></span>
                  <span className="text-[11px] font-bold text-[#1e8e3e] mt-1">Low Risk</span>
                </div>
              </div>
            </div>

            <div className="mt-4 mb-24">
              <div className="flex items-center gap-1.5 font-bold text-[15px] text-gray-900 mb-1">
                <span className="text-[#1e8e3e]">🌿</span> You're good to go!
              </div>
              <p className="text-[12px] text-gray-600 font-medium">
                Stay alert in the high risk zones near Mandi.
              </p>
            </div>

            {/* Mountains Graphic Background */}
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-80 pointer-events-none">
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full text-green-50/50">
                <path d="M0 120L0 80L50 40L100 70L150 20L200 60L250 10L300 50L350 20L400 60L400 120Z" fill="currentColor" />
                <path d="M0 120L0 100L70 50L130 90L190 40L240 80L310 30L360 70L400 40L400 120Z" fill="#e6f4ea" />
                <path d="M30 120V90M35 120V100M40 120V80" stroke="#1e8e3e" strokeWidth="2" strokeOpacity="0.4" />
                <path d="M360 120V70M365 120V90M370 120V60" stroke="#1e8e3e" strokeWidth="2" strokeOpacity="0.4" />
              </svg>
            </div>
          </div>

          {/* RISK BREAKDOWN */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-[15px]">Route Risk Breakdown</h3>
              <button className="text-[10px] font-bold text-[#2d5a3f] flex items-center gap-1 hover:underline">View details <ChevronRight className="w-3 h-3" /></button>
            </div>
            
            <div className="space-y-5">
              {[
                { label: 'Weather Conditions', score: 85, color: 'bg-[#1e8e3e]' },
                { label: 'Road Conditions', score: 75, color: 'bg-[#1e8e3e]' },
                { label: 'Community Reports', score: 80, color: 'bg-[#1e8e3e]' },
                { label: 'Traffic Situation', score: 70, color: 'bg-[#1e8e3e]' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-[11px] font-bold text-gray-900 mb-2">
                    <span>{item.label}</span>
                    <span>{item.score}/100</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE UPDATES */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex-1">
            <h3 className="font-bold text-gray-900 text-[15px] mb-6">Live Updates (3)</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <span className="text-red-500 font-bold text-[14px]">⚠️</span>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-gray-900 mb-0.5">Landslide Reported</div>
                    <div className="text-[11px] text-gray-500 font-medium">Near Mandi, HP</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-gray-400 mt-1">15 min ago</span>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <CloudRain className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-gray-900 mb-0.5">Heavy Rain</div>
                    <div className="text-[11px] text-gray-500 font-medium">Between Mandi - Kullu</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-gray-400 mt-1">20 min ago</span>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#1e8e3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-gray-900 mb-0.5">Road Clear</div>
                    <div className="text-[11px] text-gray-500 font-medium">Chandigarh - Kullu</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-gray-400 mt-1">35 min ago</span>
              </div>
            </div>

            <button className="text-[11px] font-bold text-[#1e8e3e] flex items-center justify-center gap-1.5 w-full mt-6 pt-6 border-t border-gray-100 hover:underline">
              View all updates <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
