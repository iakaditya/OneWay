import InteractiveRouteMap from './InteractiveRouteMap';
import CommunityFeed from '@/components/shared/CommunityFeed';
import { RouteData, NormalizedHazard } from '@/types';
import { CloudRain, Map as MapIcon, Car, Bot, Calendar, ChevronDown } from 'lucide-react';

interface Props {
  journey: any;
  mappedRoutes: RouteData[];
  normalizedHazards: NormalizedHazard[];
  distanceKm: number;
  h: number;
  m: number;
}

export default function OverviewTab({ journey, mappedRoutes, normalizedHazards, distanceKm, h, m }: Props) {
  return (
    <div className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden">
        {/* HERO BACKGROUND IMAGE */}
        <div className="absolute top-0 left-0 right-0 h-[340px] z-0">
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="Mountain Road" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f3f5f4]/30 via-[#f3f5f4]/80 to-[#f3f5f4]" />
        </div>

        {/* HEADER AREA */}
        <div className="relative z-10 px-8 pt-10 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-caveat text-[56px] text-[#0b1b11] font-bold tracking-tight leading-none drop-shadow-sm">
                {journey?.origin || 'Ahmedabad'} <span className="font-sans text-[28px] mx-1 font-normal text-gray-700">→</span> <span className="text-[#2d5a3f]">{journey?.destination || 'Manali'}</span>
              </h1>
              <div className="flex items-center gap-5 text-gray-700 font-semibold text-[13px] mt-2 ml-1">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Mon, 2 Sep 2024</span>
                <span className="flex items-center gap-1.5"><Car className="w-4 h-4"/> By Car</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <button className="bg-white/90 backdrop-blur-md border border-white/50 px-4 py-2.5 rounded-full font-bold text-[12px] text-gray-800 flex items-center gap-2 hover:bg-white shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Change Journey
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <img src="https://i.pravatar.cc/150?img=11" className="w-11 h-11 rounded-full border-2 border-white shadow-sm" alt="Profile" />
            </div>
          </div>

          {/* TOP BIG STATUS CARD */}
          <div className="mt-8 bg-white/95 backdrop-blur-2xl rounded-[32px] p-6 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white flex flex-wrap lg:flex-nowrap items-center gap-8 justify-between relative overflow-hidden">
            <div className="flex-1 min-w-[200px] pl-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Your Journey Status</div>
              <div className="text-[28px] font-black text-[#2d5a3f] flex items-center gap-2 mb-2 tracking-tight">
                Looks Good! <span className="text-2xl">🌿</span>
              </div>
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed max-w-sm">
                A few weather challenges on the way, but overall it's a safe journey.
              </p>
            </div>
            
            <div className="hidden lg:block w-px h-24 bg-gray-100" />

            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="w-[100px] h-[100px] rounded-full border-[5px] border-gray-100 border-t-[#2d5a3f] border-r-[#2d5a3f] border-b-[#2d5a3f] flex items-center justify-center relative shadow-inner bg-white">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-[32px] font-black text-[#0b1b11] leading-none mt-1">82</span>
                  <span className="text-[10px] font-bold text-gray-400 mt-0.5">/100</span>
                </div>
              </div>
              <div className="mt-4 bg-[#ebf3ef] text-[#2d5a3f] text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest shadow-sm">Low Risk</div>
            </div>

            <div className="hidden lg:block w-px h-24 bg-gray-100" />
            
            <div className="flex items-center justify-around flex-1 pr-6">
              <div className="flex flex-col items-center">
                <div className="text-[#2d5a3f] mb-3"><svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
                <div className="text-[22px] font-black text-gray-900 leading-none">{distanceKm} <span className="text-[13px] font-bold text-gray-500">km</span></div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Total Distance</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[#2d5a3f] mb-3"><svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <div className="text-[22px] font-black text-gray-900 leading-none">{h}h {m}m</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Est. Duration</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[#2d5a3f] mb-3"><Calendar className="w-[22px] h-[22px]" /></div>
                <div className="text-[22px] font-black text-gray-900 leading-none">Today</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Best Time to Start</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="px-8 pb-12 relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 mt-3">
          
          {/* LEFT SIDE (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            
            {/* MAP CARD */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100 h-[460px] flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-5 px-1">
                <div className="flex items-center gap-6">
                  <h3 className="font-bold text-gray-900 text-[17px]">Live Route Map</h3>
                  <div className="hidden sm:flex items-center gap-4 text-[10px] font-bold text-gray-500">
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#2d5a3f]"/> Safe</span>
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-400"/> Moderate</span>
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/> High Risk</span>
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"/> Weather Alert</span>
                    <span className="flex items-center gap-1.5 text-red-500"><div className="w-3 h-3 rounded-full border border-red-500 flex items-center justify-center font-bold text-[8px] bg-white">!</div> Road Block</span>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 bg-white shadow-sm px-4 py-2 rounded-xl border border-gray-200 transition-colors">
                  View Fullscreen <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </button>
              </div>

              <div className="flex-1 rounded-[20px] overflow-hidden relative border border-gray-100 bg-[#f8f9fa]">
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
                {/* Floating Map Legend Card */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl w-80 text-center border border-white">
                  <div className="text-red-500 font-bold text-[11px] flex items-center justify-center gap-1.5 mb-1.5"><div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center font-bold">!</div> Landslide Reported</div>
                  <div className="text-sm font-bold text-gray-900 mb-1">Near Mandi, Himachal Pradesh</div>
                  <div className="text-[11px] font-medium text-gray-500 mb-3">Reported 15 min ago • Impact: Possible disruption</div>
                  <button className="text-[#2d5a3f] text-xs font-bold flex items-center justify-center gap-1 mx-auto hover:underline">View Details <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                </div>
                {/* Terrain toggle */}
                <button className="absolute bottom-4 right-4 bg-white p-1 rounded-xl shadow-xl border border-white hover:scale-105 transition-transform group">
                  <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100&h=100&fit=crop" className="w-20 h-14 object-cover rounded-lg group-hover:brightness-110 transition-all" alt="Terrain" />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">Terrain View</div>
                </button>
              </div>
            </div>

            {/* BOTTOM 3 CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Weather Timeline */}
              <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-center mb-7 relative z-10">
                  <h3 className="font-bold text-gray-900 text-[14px]">Weather Along the Route</h3>
                  <button className="text-[10px] font-bold text-gray-400 hover:text-[#2d5a3f] flex items-center gap-1 transition-colors">View full forecast <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                </div>
                <div className="flex justify-between text-center relative before:absolute before:top-[22px] before:inset-x-5 before:h-px before:bg-gray-200 before:z-0">
                  {[
                    { city: 'Ahmedabad', temp: '32°C', icon: '☀️', desc: 'Clear' },
                    { city: 'Udaipur', temp: '28°C', icon: '⛅', desc: 'Partly Cloudy' },
                    { city: 'Delhi', temp: '26°C', icon: '🌧️', desc: 'Rain' },
                    { city: 'Chandigarh', temp: '23°C', icon: '🌦️', desc: 'Light Rain' },
                    { city: 'Mandi', temp: '18°C', icon: '⛈️', desc: 'Heavy Rain', active: true },
                    { city: 'Manali', temp: '16°C', icon: '☁️', desc: 'Cloudy' }
                  ].map((w, i) => (
                    <div key={i} className={`relative z-10 flex flex-col items-center ${w.active ? 'bg-red-50/80 px-2.5 py-1.5 -mt-1.5 rounded-[16px] border border-red-100 shadow-sm' : ''}`}>
                      <div className="text-2xl mb-3 bg-white rounded-full leading-none">{w.icon}</div>
                      <div className={`text-[8px] font-bold ${w.active ? 'text-red-600' : 'text-gray-400'} uppercase tracking-wider mb-0.5`}>{w.city}</div>
                      <div className={`text-[8.5px] font-semibold ${w.active ? 'text-red-500' : 'text-gray-900'} mb-1 whitespace-nowrap`}>{w.desc}</div>
                      <div className="font-bold text-gray-900 text-[13px]">{w.temp}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Alerts */}
              <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-[14px]">Active Alerts</h3>
                  <button className="text-[10px] font-bold text-gray-400 hover:text-[#2d5a3f] flex items-center gap-1 transition-colors">View all <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                </div>
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="text-red-500 text-[15px] mt-0.5 leading-none">⚠️</div>
                      <div>
                        <div className="text-[12px] font-bold text-gray-900 mb-0.5">Landslide Warning</div>
                        <div className="text-[10px] text-gray-500 font-medium">Near Mandi, HP</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 mt-1">15 min ago</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="text-orange-500 text-[15px] mt-0.5 leading-none">⚠️</div>
                      <div>
                        <div className="text-[12px] font-bold text-gray-900 mb-0.5">Heavy Rainfall</div>
                        <div className="text-[10px] text-gray-500 font-medium">10 AM - 3 PM</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 mt-1">30 min ago</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="text-orange-500 text-[15px] mt-0.5 leading-none bg-orange-100 w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold">!</div>
                      <div>
                        <div className="text-[12px] font-bold text-gray-900 mb-0.5">Slippery Roads</div>
                        <div className="text-[10px] text-gray-500 font-medium">Rohtang Pass - Drive with caution</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 mt-1">45 min ago</span>
                  </div>
                </div>
              </div>

              {/* Recommended Route */}
              <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-[14px]">Recommended Route</h3>
                    <span className="text-[9px] font-bold text-[#2d5a3f] bg-[#ebf3ef] px-2 py-0.5 rounded-[6px] uppercase tracking-wider">Recommended</span>
                  </div>
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="font-bold text-gray-900 text-[13px]">NH 48 (Demo Route)</div>
                      <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-[6px] uppercase">Moderate Risk</span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">19h 30m • 1,278 km</div>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="font-bold text-gray-900 text-[13px]">Alternative: NH 48 B</div>
                      <span className="text-[9px] font-bold text-[#2d5a3f] bg-[#ebf3ef] px-2 py-0.5 rounded-[6px] uppercase">Low Risk</span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">20h 8m • 1,346 km</div>
                  </div>
                </div>
                <button className="text-gray-700 text-[12px] font-bold flex items-center justify-center gap-1.5 w-full bg-white border border-gray-200 shadow-sm py-2.5 rounded-xl mt-4 hover:bg-gray-50 transition-colors">
                  <MapIcon className="w-3.5 h-3.5" /> View on Map <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

            </div>

            {/* BANNER */}
            <div className="bg-gradient-to-r from-[#ebd6c3]/60 via-[#cdd8df]/60 to-[#e2d5c8]/60 rounded-[28px] flex items-center justify-between p-4 pr-6 border border-white shadow-sm relative overflow-hidden backdrop-blur-md mt-2">
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-16 ml-2">
                  <img src="https://images.unsplash.com/photo-1516961642265-531546e84af2?w=200&h=150&fit=crop" className="w-[110px] h-[65px] object-cover rounded-xl shadow-[0_4px_12px_rgb(0,0,0,0.15)] rotate-[-6deg] absolute top-0 left-0 border-2 border-white" alt="Photos" />
                  <img src="https://images.unsplash.com/photo-1542382257-80da9fb9f5c4?w=200&h=150&fit=crop" className="w-[110px] h-[65px] object-cover rounded-xl shadow-[0_4px_12px_rgb(0,0,0,0.15)] rotate-[8deg] absolute top-1 left-8 border-2 border-white" alt="Photos" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900 text-[17px] mb-1 tracking-tight">Make Memories, We'll Handle the Rest</h3>
                  <p className="text-[12px] text-gray-600 font-medium">OneWay keeps you informed so you can enjoy every moment.</p>
                </div>
              </div>
              <button className="bg-[#1b263b] text-white px-5 py-3 rounded-[16px] text-[12px] font-bold flex items-center gap-2 hover:bg-gray-900 shadow-[0_4px_14px_rgba(27,38,59,0.3)] transition-colors shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> How It Works
              </button>
            </div>

          </div>

          {/* RIGHT SIDE (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* AI SUMMARY CARD (DARK) */}
            <div className="bg-[#1e293b] text-white rounded-[32px] p-7 shadow-[0_10px_40px_rgba(30,41,59,0.2)] relative overflow-hidden border border-[#2d3b55]">
              {/* Dark subtle background graphic */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#3b82f6]/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#10b981]/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
              
              <div className="flex items-center gap-2.5 mb-6 relative z-10">
                <span className="text-xl">✨</span>
                <h3 className="font-bold text-[16px]">OneWay AI Summary</h3>
              </div>
              
              <p className="text-[13px] text-gray-300 leading-relaxed mb-8 relative z-10 w-[75%] font-medium">
                Heavy rainfall is expected near Mandi between 10 AM - 3 PM. Roads are mostly good but drive with caution in ghat sections.
              </p>

              <div className="flex gap-2.5 mb-10 relative z-10">
                <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"><CloudRain className="w-3 h-3 text-blue-300"/> Weather</span>
                <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"><Car className="w-3 h-3 text-orange-300"/> Roads</span>
                <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"><svg className="w-3 h-3 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> Visibility</span>
              </div>

              <button className="w-[65%] bg-white text-[#1e293b] font-bold text-[13px] py-3 rounded-2xl flex items-center justify-center gap-2 relative z-10 hover:bg-gray-50 shadow-lg transition-colors">
                Ask OneWay AI ✨
              </button>

              {/* Robot Mascot Placeholder */}
              <div className="absolute right-0 bottom-4 w-[160px] h-[160px] z-10 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=oneway&backgroundColor=transparent&baseColor=ffffff" className="w-full h-full object-contain" alt="AI Bot" />
              </div>
            </div>

            {/* FROM TRAVELERS */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex-1 flex flex-col min-h-[380px]">
              <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="font-bold text-gray-900 text-[16px]">From Travelers</h3>
                <button className="text-[11px] font-bold text-gray-400 hover:text-[#2d5a3f] flex items-center gap-1 transition-colors">View all <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-hide">
                 {/* Re-using our highly styled feed component here */}
                 <CommunityFeed hideHeader={true} />
              </div>
              <button className="w-full mt-4 bg-white text-[#2d5a3f] font-bold text-[13px] py-3 rounded-2xl border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                Report an Update
              </button>
            </div>

            {/* QUICK AI QUESTIONS */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="flex items-center gap-3 mb-5 px-1">
                <div className="bg-[#ebf3ef] p-2 rounded-xl">
                  <Bot className="w-4 h-4 text-[#2d5a3f]" />
                </div>
                <h3 className="font-bold text-gray-900 text-[14px]">Quick AI Questions</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-[11px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 hover:text-gray-700 transition-colors">Is it safe to leave now?</span>
                <span className="text-[11px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 hover:text-gray-700 transition-colors">Should I take the alternative route?</span>
                <span className="text-[11px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 hover:text-gray-700 transition-colors">What's the weather at Manali?</span>
                <span className="text-[11px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 hover:text-gray-700 transition-colors">Any road closures ahead?</span>
              </div>
              <div className="relative">
                <input type="text" placeholder="Ask anything about your journey..." className="w-full bg-white border border-gray-200 rounded-2xl pl-4 pr-12 py-3.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2d5a3f]/20 focus:border-[#2d5a3f] shadow-sm font-medium text-gray-900 placeholder:text-gray-400" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-[#2d5a3f] w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#1f422c] transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </button>
              </div>
            </div>

          </div>

        </div>
    </div>
  );
}
