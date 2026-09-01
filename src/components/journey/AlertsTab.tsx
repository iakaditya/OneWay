import InteractiveRouteMap from './InteractiveRouteMap';
import { RouteData, NormalizedHazard } from '@/types';
import { 
  Bell, 
  Calendar, 
  Map as MapIcon, 
  MapPin, 
  AlertTriangle, 
  CloudRain, 
  Car, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  BellRing,
  Mountain
} from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  journey: any;
  mappedRoutes: RouteData[];
  normalizedHazards: NormalizedHazard[];
}

export default function AlertsTab({ journey, mappedRoutes, normalizedHazards }: Props) {
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
          <button className="bg-white border border-gray-200 w-11 h-11 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">3</span>
          </button>
          <img src="https://i.pravatar.cc/150?img=11" className="w-11 h-11 rounded-full border border-gray-200 shadow-sm" alt="Profile" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Alerts List */}
        <div className="col-span-8 flex flex-col gap-6">
          <div className="flex justify-between items-center mb-1">
            <div>
              <h2 className="text-[18px] font-bold text-gray-900 mb-1">Active Alerts (3)</h2>
              <p className="text-[13px] text-gray-500 font-medium">Real-time alerts that may affect your journey</p>
            </div>
            <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl font-bold text-[12px] text-gray-700 flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
              Sort by: Most Recent <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          <div className="space-y-4">
            
            {/* ALERT 1: HIGH */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex items-start gap-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-red-500">
              <div className="w-[72px] h-[72px] rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100 mt-1">
                <Mountain className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-red-100 mb-3 inline-block">High</span>
                <h3 className="text-[18px] font-bold text-gray-900 mb-1">Landslide Reported</h3>
                <p className="text-[13px] font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                   Near Mandi, Himachal Pradesh
                </p>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-5 w-[90%]">
                  Landslide reported near Pandoh area due to continuous rainfall. Movement on the route may be affected.
                </p>
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                    <Clock className="w-4 h-4" /> 15 min ago
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                    <CheckCircle2 className="w-4 h-4" /> Verified by 12 travelers
                  </span>
                </div>
              </div>
              <div className="shrink-0 pt-2 border-l border-gray-100 pl-6 h-full flex flex-col justify-center my-auto min-h-[120px]">
                <button className="bg-white border border-gray-200 text-gray-700 text-[13px] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors mt-auto mb-2">
                  <MapIcon className="w-4 h-4" /> View on Map
                </button>
              </div>
            </div>

            {/* ALERT 2: MODERATE */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex items-start gap-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-yellow-400">
              <div className="w-[72px] h-[72px] rounded-full bg-yellow-50 flex items-center justify-center shrink-0 border border-yellow-100 mt-1">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-yellow-100 mb-3 inline-block">Moderate</span>
                <h3 className="text-[18px] font-bold text-gray-900 mb-1">Heavy Rainfall</h3>
                <p className="text-[13px] font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                   Between Mandi – Kullu
                </p>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-5 w-[90%]">
                  Heavy rainfall expected between 10 AM – 3 PM. Visibility may be low in ghat sections.
                </p>
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                    <Clock className="w-4 h-4" /> 30 min ago
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                    <CloudRain className="w-4 h-4" /> IMD Weather Alert
                  </span>
                </div>
              </div>
              <div className="shrink-0 pt-2 border-l border-gray-100 pl-6 h-full flex flex-col justify-center my-auto min-h-[120px]">
                <button className="bg-white border border-gray-200 text-gray-700 text-[13px] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors mt-auto mb-2">
                  View Details <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* ALERT 3: MODERATE */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex items-start gap-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-orange-400">
              <div className="w-[72px] h-[72px] rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100 mt-1">
                <Car className="w-8 h-8 text-orange-500" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-orange-100 mb-3 inline-block">Moderate</span>
                <h3 className="text-[18px] font-bold text-gray-900 mb-1">Slippery Roads</h3>
                <p className="text-[13px] font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                   Rohtang Pass
                </p>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-5 w-[90%]">
                  Roads are slippery due to rainfall. Drive with caution and maintain a safe distance.
                </p>
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                    <Clock className="w-4 h-4" /> 45 min ago
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                    <Users className="w-4 h-4" /> Reported by 8 travelers
                  </span>
                </div>
              </div>
              <div className="shrink-0 pt-2 border-l border-gray-100 pl-6 h-full flex flex-col justify-center my-auto min-h-[120px]">
                <button className="bg-white border border-gray-200 text-gray-700 text-[13px] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors mt-auto mb-2">
                  <MapIcon className="w-4 h-4" /> View on Map
                </button>
              </div>
            </div>

            {/* ALERT 4: SAFE (Road Clear) */}
            <div className="bg-[#fcfdfc] rounded-[24px] p-6 border border-gray-100/50 shadow-sm relative overflow-hidden flex items-start gap-6">
              <div className="w-[72px] h-[72px] rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100 mt-1">
                <CheckCircle2 className="w-8 h-8 text-[#1e8e3e]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[18px] font-bold text-gray-900 mb-1 mt-1">Road Clear</h3>
                <p className="text-[13px] font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                   Chandigarh – Bilaspur Highway
                </p>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-5">
                  No major issues reported. Smooth traffic and clear conditions.
                </p>
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                    <Clock className="w-4 h-4" /> 1 hr ago
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                    <CheckCircle2 className="w-4 h-4" /> Verified by 15 travelers
                  </span>
                </div>
              </div>
              <div className="shrink-0 pt-2 border-l border-gray-100 pl-6 h-full flex flex-col justify-center my-auto min-h-[120px]">
                <button className="bg-white border border-gray-200 text-gray-700 text-[13px] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors mt-auto mb-2">
                  View on Map <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Summary & Map */}
        <div className="col-span-4 flex flex-col gap-6 pt-[52px]">
          
          {/* ALERT MAP CARD */}
          <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-[15px]">Alert Map</h3>
              <button className="text-[11px] font-bold text-[#1e8e3e] flex items-center gap-1 hover:underline">View Full Map <ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
            
            {/* Map Placeholder Graphic */}
            <div className="bg-gray-100 h-48 rounded-[16px] relative overflow-hidden border border-gray-100 shadow-inner">
               {/* Replace with interactive map if needed, but a static stylized map works for this view */}
               {journey && (
                  <div className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none">
                    <InteractiveRouteMap
                      origin={{ lat: journey.originLat, lng: journey.originLng, name: journey.origin }}
                      destination={{ lat: journey.destinationLat, lng: journey.destinationLng, name: journey.destination }}
                      routes={mappedRoutes}
                      hazards={normalizedHazards}
                      communityReports={[]}
                      primaryRisk={journey.analysis?.overallRisk || 'MODERATE'}
                      className="w-full h-full border-none rounded-none"
                    />
                  </div>
                )}
                {/* Fake map pins layer for style */}
                <div className="absolute inset-0 bg-white/40"></div>
                
                {/* Stylized Route path overlay */}
                <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 400 200" preserveAspectRatio="none">
                   <path d="M 50 150 Q 100 130 150 160 T 250 90 T 350 40" fill="none" stroke="#1e8e3e" strokeWidth="4" strokeLinecap="round" strokeDasharray="5,5" />
                   <path d="M 150 160 Q 200 130 250 90" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                   <circle cx="50" cy="150" r="6" fill="#1e8e3e" stroke="white" strokeWidth="2" />
                   <circle cx="350" cy="40" r="6" fill="#1e8e3e" stroke="white" strokeWidth="2" />
                   {/* Alert Node */}
                   <circle cx="230" cy="110" r="14" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
                   <path d="M 230 105 L 227 113 L 233 113 Z" fill="#ef4444" />
                </svg>
            </div>

            <div className="flex justify-between items-center mt-5 px-1 pb-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e]"/> Safe</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/> Moderate</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/> High Risk</span>
            </div>
          </div>

          {/* ALERT IMPACT CARD */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <h3 className="font-bold text-gray-900 text-[15px] mb-6 relative z-10">Alert Impact on Your Journey</h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                  <Clock className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-gray-500 mb-0.5">Possible Delay</div>
                  <div className="text-[13px] font-bold text-gray-900">Up to 1.5 – 2 hrs</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                  <ShieldAlert className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-gray-500 mb-0.5">Risk Level</div>
                  <div className="text-[13px] font-bold text-orange-600">Moderate to High</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                  <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-gray-500 mb-0.5">Suggested Action</div>
                  <div className="text-[13px] font-bold text-gray-900 leading-snug">Plan your travel accordingly. Check updates before starting.</div>
                </div>
              </div>
            </div>

            {/* Siren / Red Warning Graphic BG */}
            <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.15]">
               <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
                 <path d="M100 180 C 140 180, 180 140, 180 100 C 180 60, 140 20, 100 20 C 60 20, 20 60, 20 100" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" strokeDasharray="1 30" />
                 <circle cx="100" cy="100" r="40" fill="#ef4444" />
                 <path d="M 85 100 L 100 115 L 125 80" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>
            {/* Additional glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-400 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
          </div>

          {/* GET NOTIFIED CARD */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-[15px] mb-1.5">Get Notified</h3>
            <p className="text-[12px] text-gray-500 font-medium mb-5">
              Receive real-time updates about alerts on your route.
            </p>
            <button className="w-full bg-white border border-[#1e8e3e]/30 text-[#1e8e3e] font-bold text-[13px] py-3 rounded-[14px] flex items-center justify-center gap-2 hover:bg-[#e6f4ea] transition-colors shadow-sm">
              <BellRing className="w-4 h-4" /> Enable Notifications
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// User Icon fallback
function Users(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
