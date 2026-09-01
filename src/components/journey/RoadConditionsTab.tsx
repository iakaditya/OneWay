import { RouteData, NormalizedHazard } from '@/types';
import { 
  Bell, 
  Calendar, 
  Car, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Camera,
  Check,
  Map as MapIcon,
  Wind,
  Navigation,
  Mountain
} from 'lucide-react';

interface Props {
  journey: any;
  mappedRoutes: RouteData[];
  normalizedHazards: NormalizedHazard[];
}

export default function RoadConditionsTab({ journey }: Props) {
  return (
    <div className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden bg-[#f8f9fa] pt-8 px-8 pb-12">
      {/* HEADER AREA */}
      <div className="flex justify-between items-start mb-6">
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
              <Car className="w-4 h-4" /> By Car
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

      <div className="grid grid-cols-12 gap-6 mt-2">
        
        {/* LEFT COLUMN: Main Road Intel */}
        <div className="col-span-8 flex flex-col gap-6">
          
          {/* TOP BANNER */}
          <div className="w-full bg-[#1b2a3a] rounded-[24px] h-[170px] relative overflow-hidden shadow-sm flex items-center px-8 border border-gray-800">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Mountain Road" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111f2d] via-[#111f2d]/80 to-transparent"></div>
            </div>

            <div className="relative z-10 flex w-full justify-between items-center text-white">
              <div className="flex-1 pr-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#1e8e3e] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest flex items-center gap-1">
                    <Navigation className="w-2.5 h-2.5"/> Road Conditions
                  </span>
                </div>
                <h2 className="text-[28px] font-bold tracking-tight mb-2 text-white">Roads are mostly clear</h2>
                <p className="text-[13px] text-gray-300 font-medium">Some sections may be slippery due to rainfall. Drive with caution.</p>
              </div>

              <div className="shrink-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-5 shadow-lg">
                  <div>
                     <div className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mb-1">Overall Road Condition</div>
                     <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-[#1e8e3e] flex items-center justify-center border-2 border-white/20">
                         <ShieldCheck className="w-4 h-4 text-white" />
                       </div>
                       <span className="text-[20px] font-bold text-white tracking-tight">Good</span>
                     </div>
                  </div>
                  <div className="text-right border-l border-white/15 pl-5">
                    <div className="text-3xl font-black text-white leading-none">78<span className="text-[14px] text-gray-400 font-bold">/100</span></div>
                    {/* Small progress bar */}
                    <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-[#1e8e3e] w-[78%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* ROUTE BREAKDOWN */}
            <div className="col-span-7 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative">
              <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="font-bold text-gray-900 text-[15px]">Route Breakdown</h3>
                   <p className="text-[11px] text-gray-500 font-medium">Real-time road condition for major highway segments</p>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#1e8e3e]"/> Good</span>
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-400"/> Caution</span>
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"/> Poor / Blocked</span>
                </div>
              </div>

              <div className="relative pl-6 space-y-3">
                 {/* Connection Line */}
                 <div className="absolute left-[7px] top-[24px] bottom-[24px] w-[2px] bg-gray-100 -z-10 rounded-full overflow-hidden flex flex-col">
                   <div className="flex-1 bg-[#1e8e3e]"></div>
                   <div className="flex-1 bg-[#1e8e3e]"></div>
                   <div className="flex-1 bg-yellow-400"></div>
                   <div className="flex-1 bg-red-500"></div>
                   <div className="flex-1 bg-yellow-400"></div>
                   <div className="h-[20px] bg-[#1e8e3e]"></div>
                 </div>

                 {/* Segment 1 */}
                 <div className="relative flex items-center border border-gray-100 rounded-2xl p-3 bg-white">
                    <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#1e8e3e] border-2 border-white shadow-sm z-10"></div>
                    <div className="flex-1 border-r border-gray-100 pr-3">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[13px] font-bold text-gray-900">Ahmedabad → Udaipur</span>
                         <span className="text-[9px] font-bold text-[#1e8e3e] bg-[#e6f4ea] px-2 py-0.5 rounded-md">Good</span>
                       </div>
                       <div className="text-[11px] text-gray-500 font-medium">NH 48 • 260 km • ~4h 20m</div>
                    </div>
                    <div className="flex-1 pl-3 flex items-start gap-2">
                       <CheckCircle2 className="w-4 h-4 text-[#1e8e3e] shrink-0 mt-0.5" />
                       <span className="text-[11px] text-gray-700 font-medium">Roads are in great condition. Smooth drive.</span>
                    </div>
                 </div>

                 {/* Segment 2 */}
                 <div className="relative flex items-center border border-gray-100 rounded-2xl p-3 bg-white">
                    <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#1e8e3e] border-2 border-white shadow-sm z-10"></div>
                    <div className="flex-1 border-r border-gray-100 pr-3">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[13px] font-bold text-gray-900">Udaipur → Delhi</span>
                         <span className="text-[9px] font-bold text-[#1e8e3e] bg-[#e6f4ea] px-2 py-0.5 rounded-md">Good</span>
                       </div>
                       <div className="text-[11px] text-gray-500 font-medium">NH 48 • 665 km • ~8h 30m</div>
                    </div>
                    <div className="flex-1 pl-3 flex items-start gap-2">
                       <CheckCircle2 className="w-4 h-4 text-[#1e8e3e] shrink-0 mt-0.5" />
                       <span className="text-[11px] text-gray-700 font-medium">Clear roads with normal traffic.</span>
                    </div>
                 </div>

                 {/* Segment 3 */}
                 <div className="relative flex items-center border border-yellow-100 rounded-2xl p-3 bg-white">
                    <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-white shadow-sm z-10"></div>
                    <div className="flex-1 border-r border-gray-100 pr-3">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[13px] font-bold text-gray-900">Delhi → Chandigarh</span>
                         <span className="text-[9px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-md">Caution</span>
                       </div>
                       <div className="text-[11px] text-gray-500 font-medium">NH 44 • 240 km • ~4h 10m</div>
                    </div>
                    <div className="flex-1 pl-3 flex items-start gap-2">
                       <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                       <span className="text-[11px] text-gray-700 font-medium">Light rain. Roads slightly wet in patches.</span>
                    </div>
                 </div>

                 {/* Segment 4 - HIGH RISK */}
                 <div className="relative flex items-center border border-red-200 rounded-2xl p-3 bg-red-50/50 shadow-sm">
                    <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-sm z-10"></div>
                    <div className="flex-1 border-r border-red-100 pr-3">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[13px] font-bold text-gray-900">Chandigarh → Mandi</span>
                         <span className="text-[9px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">High Risk</span>
                       </div>
                       <div className="text-[11px] text-gray-500 font-medium">NH 3 • 200 km • ~5h 30m</div>
                    </div>
                    <div className="flex-1 pl-3 flex flex-col items-start gap-1">
                       <div className="flex items-start gap-2">
                         <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                         <span className="text-[11px] text-gray-800 font-semibold">Landslide reported near Mandi.</span>
                       </div>
                       <button className="text-red-500 text-[10px] font-bold flex items-center gap-1 hover:underline ml-6">
                         View on Map <ChevronRight className="w-3 h-3"/>
                       </button>
                    </div>
                 </div>

                 {/* Segment 5 */}
                 <div className="relative flex items-center border border-yellow-100 rounded-2xl p-3 bg-white">
                    <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-white shadow-sm z-10"></div>
                    <div className="flex-1 border-r border-gray-100 pr-3">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[13px] font-bold text-gray-900">Mandi → Kullu</span>
                         <span className="text-[9px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-md">Caution</span>
                       </div>
                       <div className="text-[11px] text-gray-500 font-medium">NH 3 • 40 km • ~1h 30m</div>
                    </div>
                    <div className="flex-1 pl-3 flex items-start gap-2">
                       <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                       <span className="text-[11px] text-gray-700 font-medium">Slippery roads due to rain.</span>
                    </div>
                 </div>

                 {/* Segment 6 */}
                 <div className="relative flex items-center border border-gray-100 rounded-2xl p-3 bg-white">
                    <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#1e8e3e] border-2 border-white shadow-sm z-10"></div>
                    <div className="flex-1 border-r border-gray-100 pr-3">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[13px] font-bold text-gray-900">Kullu → Manali</span>
                         <span className="text-[9px] font-bold text-[#1e8e3e] bg-[#e6f4ea] px-2 py-0.5 rounded-md">Good</span>
                       </div>
                       <div className="text-[11px] text-gray-500 font-medium">NH 3 • 50 km • ~1h 10m</div>
                    </div>
                    <div className="flex-1 pl-3 flex items-start gap-2">
                       <CheckCircle2 className="w-4 h-4 text-[#1e8e3e] shrink-0 mt-0.5" />
                       <span className="text-[11px] text-gray-700 font-medium">Roads are clear. Drive safely.</span>
                    </div>
                 </div>

              </div>
            </div>

            {/* CAMERA & REPORTS */}
            <div className="col-span-5 flex flex-col gap-6">
              {/* Live Road Camera */}
              <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-900 text-[15px]">Live Road Camera</h3>
                   <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#1e8e3e] uppercase tracking-widest">
                     <div className="w-2 h-2 rounded-full bg-[#1e8e3e] animate-pulse"></div> Live
                   </span>
                </div>
                
                <div className="rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm">
                   <img src="https://images.unsplash.com/photo-1542382257-80da9fb9f5c4?q=80&w=800&auto=format&fit=crop" className="w-full h-44 object-cover" alt="Road Cam" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                   
                   <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div className="flex items-center gap-2 text-white text-[11px] font-bold">
                        <Camera className="w-4 h-4" /> Near Mandi, Himachal Pradesh
                      </div>
                      <div className="text-[9px] text-white/80 font-bold">2 min ago</div>
                   </div>

                   {/* Play button overlay on hover */}
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-t-6 border-b-6 border-l-8 border-transparent border-l-white ml-1"></div>
                     </div>
                   </div>
                </div>

                <div className="flex justify-center gap-1.5 mt-4">
                  <div className="w-2 h-2 rounded-full bg-gray-800"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                </div>
              </div>

              {/* Recent Road Reports */}
              <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm flex-1">
                <div className="flex justify-between items-center mb-5">
                   <h3 className="font-bold text-gray-900 text-[15px]">Recent Road Reports</h3>
                   <button className="text-[10px] font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
                
                <div className="space-y-5">
                   <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                         <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                           <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                         </div>
                         <div>
                           <div className="text-[12px] font-bold text-gray-900 mb-0.5">Landslide activity cleared (partial)</div>
                           <div className="text-[10px] text-gray-500 font-medium">Near Mandi, HP • 15 min ago</div>
                         </div>
                      </div>
                      <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">High Risk</span>
                   </div>

                   <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                         <div className="w-7 h-7 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 border border-yellow-100">
                           <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                         </div>
                         <div>
                           <div className="text-[12px] font-bold text-gray-900 mb-0.5">Roads wet due to rainfall</div>
                           <div className="text-[10px] text-gray-500 font-medium">Near Kullu, HP • 32 min ago</div>
                         </div>
                      </div>
                      <span className="text-[9px] font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">Moderate</span>
                   </div>

                   <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                         <div className="w-7 h-7 rounded-full bg-[#e6f4ea] flex items-center justify-center shrink-0 border border-[#1e8e3e]/20">
                           <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e]" />
                         </div>
                         <div>
                           <div className="text-[12px] font-bold text-gray-900 mb-0.5">Road conditions clear</div>
                           <div className="text-[10px] text-gray-500 font-medium">Near Chandigarh • 1 hr ago</div>
                         </div>
                      </div>
                      <span className="text-[9px] font-bold text-[#1e8e3e] bg-[#e6f4ea] px-2 py-1 rounded-md">Safe</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROAD CONDITION BY TYPE */}
          <div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-4 ml-1">Road Condition by Type</h3>
            <div className="grid grid-cols-4 gap-4">
              
              <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#e6f4ea] p-1.5 rounded-lg"><MapIcon className="w-4 h-4 text-[#1e8e3e]" /></div>
                    <span className="text-[11px] font-bold text-gray-900">Highways</span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-auto mb-2">
                   <div className="text-2xl font-black text-gray-900 leading-none">82<span className="text-[12px] font-bold text-gray-400">/100</span></div>
                   <span className="text-[10px] font-bold text-[#1e8e3e]">Good</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#1e8e3e] w-[82%]"></div>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-yellow-100 shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-50 p-1.5 rounded-lg"><Mountain className="w-4 h-4 text-yellow-600" /></div>
                    <span className="text-[11px] font-bold text-gray-900">Mountain Roads</span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-auto mb-2">
                   <div className="text-2xl font-black text-gray-900 leading-none">72<span className="text-[12px] font-bold text-gray-400">/100</span></div>
                   <span className="text-[10px] font-bold text-yellow-600">Caution</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-yellow-400 w-[72%]"></div>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#e6f4ea] p-1.5 rounded-lg"><svg className="w-4 h-4 text-[#1e8e3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21V9m0 0a3 3 0 100-6 3 3 0 000 6zM5 21V12a7 7 0 0114 0v9" /></svg></div>
                    <span className="text-[11px] font-bold text-gray-900">Tunnels & Passes</span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-auto mb-2">
                   <div className="text-2xl font-black text-gray-900 leading-none">85<span className="text-[12px] font-bold text-gray-400">/100</span></div>
                   <span className="text-[10px] font-bold text-[#1e8e3e]">Good</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#1e8e3e] w-[85%]"></div>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#e6f4ea] p-1.5 rounded-lg"><ShieldCheck className="w-4 h-4 text-[#1e8e3e]" /></div>
                    <span className="text-[11px] font-bold text-gray-900">Overall Condition</span>
                  </div>
                </div>
                <div className="flex items-end justify-between mt-auto mb-2">
                   <div className="text-2xl font-black text-gray-900 leading-none">78<span className="text-[12px] font-bold text-gray-400">/100</span></div>
                   <span className="text-[10px] font-bold text-[#1e8e3e]">Good</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#1e8e3e] w-[78%]"></div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-4 flex flex-col gap-6">
          
          {/* ROAD RISK SCORE */}
          <div className="bg-white rounded-[24px] pt-6 px-6 pb-6 border border-gray-100 shadow-sm text-center">
            <h3 className="font-bold text-gray-900 text-[15px] mb-4 text-left">Road Risk Score</h3>
            
            <div className="w-44 h-24 mx-auto relative overflow-hidden flex justify-center mt-2 mb-2">
               {/* Semicircle chart */}
               <svg viewBox="0 0 100 50" className="w-full h-full transform">
                 <path d="M10 50 a 40 40 0 0 1 80 0" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                 <path d="M10 50 a 40 40 0 0 1 80 0" fill="none" stroke="#1e8e3e" strokeWidth="10" strokeLinecap="round" strokeDasharray="125" strokeDashoffset="27" />
               </svg>
               <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
                 <span className="text-4xl font-black text-gray-900">78<span className="text-[14px] font-bold text-gray-400">/100</span></span>
                 <span className="text-[11px] font-bold text-[#1e8e3e] mt-1 tracking-wider uppercase">Generally Safe</span>
               </div>
            </div>

            <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-4">
              Road conditions are suitable for travel with a few caution zones.
            </p>
          </div>

          {/* KEY INSIGHTS */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-[15px] mb-5">Key Insights</h3>
            
            <div className="space-y-5">
              <div className="flex gap-4 items-center">
                 <div className="w-10 h-10 rounded-full bg-[#e6f4ea] flex items-center justify-center shrink-0">
                   <svg className="w-5 h-5 text-[#1e8e3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <div className="text-[13px] text-gray-700 font-semibold leading-snug">
                   <span className="font-bold text-[#1e8e3e]">78%</span> of the route in good condition
                 </div>
              </div>

              <div className="flex gap-4 items-center">
                 <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                   <AlertTriangle className="w-5 h-5 text-red-500" />
                 </div>
                 <div className="text-[13px] text-gray-700 font-semibold leading-snug">
                   <span className="font-bold text-red-500">1 high-risk</span> section near Mandi
                 </div>
              </div>

              <div className="flex gap-4 items-center">
                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                   <Clock className="w-5 h-5 text-blue-500" />
                 </div>
                 <div className="text-[13px] text-gray-700 font-semibold leading-snug">
                   Expected delay <br/><span className="font-bold text-gray-900">~ 30 to 45 minutes</span>
                 </div>
              </div>
            </div>
          </div>

          {/* TRAVEL TIPS */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-[15px] mb-4 flex items-center gap-2">
               <span className="text-yellow-500">💡</span> Travel Tips
            </h3>
            
            <div className="space-y-3">
               {[
                 'Drive slowly in hilly sections',
                 'Avoid night travel near Mandi',
                 'Keep an eye on weather updates',
                 'Follow local authority advisories'
               ].map((tip, i) => (
                 <div key={i} className="flex items-start gap-2.5">
                   <Check className="w-4 h-4 text-[#1e8e3e] shrink-0 mt-0.5" />
                   <span className="text-[12px] text-gray-700 font-medium">{tip}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* STAY UPDATED CARD */}
          <div className="bg-[#eef4f8] rounded-[24px] p-6 border border-blue-900/10 shadow-sm relative overflow-hidden mt-auto">
            <div className="relative z-10">
               <h3 className="font-bold text-gray-900 text-[16px] mb-1">Stay updated on the go</h3>
               <p className="text-[11px] text-gray-600 font-medium mb-5 w-4/5">Get real-time road alerts for this journey.</p>
               
               <button className="w-full bg-[#162743] text-white text-[12px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-lg">
                 <Bell className="w-4 h-4" /> Enable Live Updates
               </button>
            </div>
            
            {/* Background graphic */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
              <svg viewBox="0 0 200 50" preserveAspectRatio="none" className="w-full h-full text-[#162743]">
                <path d="M0 50 L0 30 Q 50 10 100 30 T 200 10 L200 50 Z" fill="currentColor" />
                <path d="M0 50 L0 40 Q 50 20 100 40 T 200 20 L200 50 Z" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
