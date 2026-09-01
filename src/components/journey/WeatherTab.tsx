import { RouteData, NormalizedHazard } from '@/types';
import { 
  Bell, 
  Calendar, 
  CloudRain, 
  Wind, 
  Droplets, 
  Eye,
  MapPin, 
  Sunrise, 
  Sunset,
  Cloud,
  Sun,
  CloudLightning,
  AlertTriangle,
  Info,
  ChevronRight,
  Thermometer,
  Umbrella,
  Leaf
} from 'lucide-react';

interface Props {
  journey: any;
  mappedRoutes: RouteData[];
  normalizedHazards: NormalizedHazard[];
}

export default function WeatherTab({ journey }: Props) {
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

      {/* TOP BANNER */}
      <div className="w-full bg-[#162743] rounded-[24px] h-[160px] relative overflow-hidden shadow-sm flex items-center px-8 border border-[#162743]">
        {/* Background Graphic */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop" className="absolute top-0 right-0 w-2/3 h-full object-cover mix-blend-luminosity opacity-40 mask-image:linear-gradient(to_left,black,transparent)" alt="Mountains" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#162743] via-[#162743]/90 to-transparent"></div>
        </div>

        <div className="relative z-10 flex w-full justify-between items-center text-white">
          <div className="flex-1">
            <div className="text-[12px] font-bold text-blue-200/80 uppercase tracking-widest mb-1.5">Current Weather on Route</div>
            <div className="flex items-center gap-3 mb-2">
              <CloudRain className="w-10 h-10 text-blue-300" />
              <h2 className="text-4xl font-bold tracking-tight">Heavy Rain</h2>
            </div>
            <p className="text-[13px] text-blue-100 font-medium">Rainfall is affecting parts of your route.<br/>Drive safe!</p>
          </div>

          <div className="flex-1 border-l border-white/10 pl-10">
             <div className="text-4xl font-bold mb-1">18°C</div>
             <div className="text-[12px] font-medium text-blue-200/80">Feels like 16°C</div>
          </div>

          <div className="flex-1 flex gap-10 border-l border-white/10 pl-10">
             <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[12px] text-blue-200/80 font-bold"><Droplets className="w-4 h-4"/> Humidity</div>
                <div className="flex items-center gap-2 text-[12px] text-blue-200/80 font-bold"><Wind className="w-4 h-4"/> Wind</div>
             </div>
             <div className="flex flex-col gap-3">
                <div className="text-[12px] font-bold text-white">92%</div>
                <div className="text-[12px] font-bold text-white">12 km/h</div>
             </div>
             <div className="flex flex-col gap-3 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2 text-[12px] text-blue-200/80 font-bold"><Eye className="w-4 h-4"/> Visibility</div>
                <div className="text-[12px] font-bold text-white pl-6">3 km</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        
        {/* ROW 1 */}
        {/* Weather Along Route */}
        <div className="col-span-8 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold text-gray-900 text-[16px]">Weather Along the Route</h3>
            <button className="text-[12px] font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1">View full forecast <ChevronRight className="w-3.5 h-3.5" /></button>
          </div>

          <div className="relative px-2">
            <div className="absolute top-[82px] left-6 right-6 h-[3px] bg-gradient-to-r from-[#1e8e3e] via-yellow-400 to-[#1e8e3e] -z-10 rounded-full">
               <div className="absolute top-0 right-1/4 w-1/4 h-full bg-red-500"></div>
            </div>
            
            <div className="flex justify-between items-end pb-8">
              {[
                { name: 'Ahmedabad', status: 'Clear', temp: '32°C', icon: <Sun className="w-7 h-7 text-yellow-400 fill-yellow-400" />, color: 'text-[#1e8e3e]' },
                { name: 'Udaipur', status: 'Partly Cloudy', temp: '28°C', icon: <Cloud className="w-7 h-7 text-gray-400 fill-gray-200" />, color: 'text-[#1e8e3e]' },
                { name: 'Delhi', status: 'Light Rain', temp: '26°C', icon: <CloudRain className="w-7 h-7 text-blue-400" />, color: 'text-gray-900' },
                { name: 'Chandigarh', status: 'Cloudy', temp: '23°C', icon: <Cloud className="w-7 h-7 text-gray-500 fill-gray-300" />, color: 'text-gray-900' },
                { name: 'Mandi', status: 'Heavy Rain', temp: '18°C', icon: <CloudLightning className="w-7 h-7 text-gray-600" />, color: 'text-red-600', active: true },
                { name: 'Kullu', status: 'Rain', temp: '17°C', icon: <CloudRain className="w-7 h-7 text-blue-500" />, color: 'text-gray-900' },
                { name: 'Manali', status: 'Cloudy', temp: '16°C', icon: <Cloud className="w-7 h-7 text-gray-500 fill-gray-300" />, color: 'text-[#1e8e3e]' }
              ].map((loc, idx) => (
                <div key={idx} className={`relative flex flex-col items-center z-10 ${loc.active ? 'bg-red-50/90 p-3 rounded-[16px] border border-red-100 shadow-sm -mb-3' : ''}`}>
                  <div className={`text-[10px] font-bold ${loc.color} mb-1`}>{loc.name}</div>
                  <div className="text-[10px] font-semibold text-gray-500 mb-2">{loc.status}</div>
                  <div className="text-[14px] font-bold text-gray-900 mb-3 flex items-center gap-1">{loc.temp} {loc.active && <AlertTriangle className="w-3 h-3 text-red-500"/>}</div>
                  <div className="bg-white rounded-full p-1 shadow-sm mb-2">{loc.icon}</div>
                  <div className={`w-3 h-3 rounded-full border-[2.5px] border-white shadow-sm ${loc.active ? 'bg-red-500' : 'bg-[#1e8e3e]'}`}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5 mt-6 border-t border-gray-100 pt-5">
             <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e]"/> Clear / Safe</span>
             <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/> Moderate</span>
             <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/> High Risk (Weather)</span>
             <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600"><div className="w-3 h-3 rounded-full border-[1.5px] border-blue-600 flex items-center justify-center font-bold text-[8px] bg-blue-50">i</div> Weather Alert</span>
          </div>
        </div>

        {/* Destination Weather */}
        <div className="col-span-4 bg-[#1a2b4c] rounded-[24px] relative overflow-hidden shadow-sm flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1626082929543-5b8d29fb9137?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" alt="Manali" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#162238] via-[#162238]/60 to-[#162238]/40"></div>
          
          <div className="relative z-10 p-6 flex flex-col h-full">
            <h3 className="font-bold text-white text-[15px] mb-4">Weather at Destination</h3>
            
            <div className="flex items-center gap-2 text-white/90 text-[12px] font-bold mb-4">
              <MapPin className="w-4 h-4" /> Manali, Himachal Pradesh
            </div>

            <div className="flex items-center gap-4 mb-4">
               <div className="text-5xl font-bold text-white">16°C</div>
               <div className="flex items-center gap-2">
                 <Cloud className="w-8 h-8 text-blue-200 fill-blue-100/20" />
                 <div>
                    <div className="text-white text-[13px] font-bold">Cloudy</div>
                    <div className="text-white/70 text-[11px] font-medium">Feels like 14°C</div>
                 </div>
               </div>
            </div>

            <div className="flex justify-between bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 mb-4">
               <div className="flex items-center gap-1.5 text-[11px] font-bold text-white"><Umbrella className="w-3.5 h-3.5 text-blue-300"/> 89%</div>
               <div className="flex items-center gap-1.5 text-[11px] font-bold text-white"><Wind className="w-3.5 h-3.5 text-blue-300"/> 8 km/h</div>
               <div className="flex items-center gap-1.5 text-[11px] font-bold text-white"><Eye className="w-3.5 h-3.5 text-blue-300"/> 4 km</div>
            </div>

            <p className="text-[12px] text-white/90 font-medium leading-relaxed mb-6 mt-auto">
              Cloudy skies. Light drizzle expected in the evening. Carry warm clothes and rain protection.
            </p>

            <div className="flex justify-between items-center text-white/80 text-[11px] font-bold pt-4 border-t border-white/10">
               <div className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-yellow-400"/> Sunrise 5:56 AM</div>
               <div className="flex items-center gap-1.5"><Sunset className="w-4 h-4 text-orange-400"/> Sunset 6:32 PM</div>
            </div>
          </div>
        </div>

        {/* BOTTOM GRID */}
        {/* We use a grid-cols-12 wrapper for the complex bottom section. */}
        {/* Actually, visually it looks like three main columns. Let's do grid-cols-3 gap-6. */}
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* COL 1: Hourly Forecast & Temp Trend */}
           <div className="flex flex-col gap-6">
             {/* Hourly Forecast */}
             <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-gray-900 text-[14px]">Hourly Forecast <span className="text-gray-500 font-medium">(Near Mandi)</span></h3>
                </div>
                
                <div className="flex justify-between items-end mb-6 text-center">
                   {[
                     { t: 'Now', temp: '18°C', icon: <CloudRain className="w-6 h-6 text-blue-500 mx-auto mb-2"/>, desc: 'Heavy Rain' },
                     { t: '10 AM', temp: '18°C', icon: <CloudLightning className="w-6 h-6 text-gray-600 mx-auto mb-2"/>, desc: 'Rain' },
                     { t: '11 AM', temp: '17°C', icon: <CloudRain className="w-6 h-6 text-blue-500 mx-auto mb-2"/>, desc: 'Rain' },
                     { t: '12 PM', temp: '17°C', icon: <CloudRain className="w-6 h-6 text-blue-400 mx-auto mb-2"/>, desc: 'Rain' },
                     { t: '1 PM', temp: '18°C', icon: <Cloud className="w-6 h-6 text-gray-400 fill-gray-200 mx-auto mb-2"/>, desc: 'Cloudy' },
                     { t: '2 PM', temp: '18°C', icon: <Cloud className="w-6 h-6 text-gray-400 fill-gray-200 mx-auto mb-2"/>, desc: 'Cloudy' },
                     { t: '3 PM', temp: '19°C', icon: <Cloud className="w-6 h-6 text-gray-400 fill-gray-200 mx-auto mb-2"/>, desc: 'Cloudy' },
                   ].map((h, i) => (
                     <div key={i} className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500 mb-3">{h.t}</span>
                        {h.icon}
                        <span className="text-[12px] font-bold text-gray-900 mb-1">{h.temp}</span>
                        <span className="text-[8px] font-semibold text-gray-500 leading-tight">{h.desc}</span>
                     </div>
                   ))}
                </div>

                <div className="bg-red-50 text-red-600 text-[11px] font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 shrink-0"/> Heavy rainfall expected between 10 AM - 3 PM near Mandi.
                </div>
             </div>

             {/* Temperature Trend */}
             <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-gray-900 text-[14px]">Temperature Trend</h3>
                   <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Next 5 Days</span>
                </div>
                
                <div className="flex justify-between text-center">
                   {[
                     { day: 'Mon', h: '18°', l: '13°', icon: <CloudRain className="w-6 h-6 text-blue-500 mx-auto mb-2"/>, active: true },
                     { day: 'Tue', h: '19°', l: '12°', icon: <Cloud className="w-6 h-6 text-gray-400 mx-auto mb-2"/> },
                     { day: 'Wed', h: '17°', l: '11°', icon: <CloudRain className="w-6 h-6 text-blue-400 mx-auto mb-2"/> },
                     { day: 'Thu', h: '18°', l: '12°', icon: <Sun className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto mb-2"/> },
                     { day: 'Fri', h: '20°', l: '11°', icon: <Sun className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto mb-2"/> },
                   ].map((d, i) => (
                     <div key={i} className={`flex flex-col p-2 rounded-2xl ${d.active ? 'bg-[#f0f7f3] border border-[#1e8e3e]/20' : ''}`}>
                        <span className={`text-[11px] font-bold mb-3 ${d.active ? 'text-[#1e8e3e]' : 'text-gray-500'}`}>{d.day}</span>
                        {d.icon}
                        <div className="text-[11px] font-bold text-gray-900">{d.h} <span className="text-gray-400 font-medium">/ {d.l}</span></div>
                     </div>
                   ))}
                </div>
             </div>
           </div>

           {/* COL 2: Precipitation & Air Comfort */}
           <div className="flex flex-col gap-6">
             {/* Precipitation Forecast */}
             <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-gray-900 text-[14px]">Precipitation Forecast</h3>
                   <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Next 24 Hours</span>
                </div>
                
                <div className="relative h-[120px] mb-8 mt-4 flex items-end">
                   {/* Y-Axis Labels */}
                   <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] font-bold text-gray-400">
                     <span>Heavy</span>
                     <span>Moderate</span>
                     <span>Light</span>
                     <span>None</span>
                   </div>
                   
                   {/* Bars */}
                   <div className="flex-1 flex items-end justify-between ml-12 pb-6 border-b border-gray-100 h-full relative">
                      {[ 10, 20, 40, 70, 100, 100, 60, 40, 20, 10, 5, 5].map((val, i) => (
                        <div key={i} className="flex flex-col items-center w-4 group">
                          <div 
                            className={`w-3 rounded-t-sm transition-all ${val > 80 ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]' : 'bg-blue-300'}`} 
                            style={{ height: `${val}%` }}
                          ></div>
                        </div>
                      ))}
                      
                      {/* X-Axis Labels */}
                      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] font-bold text-gray-400 px-1">
                        <span>6 AM</span>
                        <span>9 AM</span>
                        <span>12 PM</span>
                        <span>3 PM</span>
                        <span>6 PM</span>
                        <span>9 PM</span>
                        <span>12 AM</span>
                        <span>3 AM</span>
                        <span>6 AM</span>
                      </div>
                   </div>
                </div>

                <div className="bg-yellow-50 text-yellow-700 text-[11px] font-bold p-3 rounded-xl border border-yellow-100 flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 shrink-0 text-yellow-500"/> Rainfall may reduce after 4 PM.
                </div>
             </div>

             {/* Air & Comfort */}
             <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-[14px] mb-6">Air & Comfort</h3>
                
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                       <Leaf className="w-4 h-4 text-[#1e8e3e]" />
                     </div>
                     <div>
                       <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Air Quality</div>
                       <div className="text-[13px] font-bold text-gray-900">Good</div>
                       <div className="text-[10px] font-semibold text-gray-400">AQI 32</div>
                     </div>
                   </div>

                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                       <Sun className="w-4 h-4 text-yellow-500" />
                     </div>
                     <div>
                       <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">UV Index</div>
                       <div className="text-[13px] font-bold text-gray-900">Low</div>
                       <div className="text-[10px] font-semibold text-gray-400">1/11</div>
                     </div>
                   </div>

                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                       <Thermometer className="w-4 h-4 text-blue-500" />
                     </div>
                     <div>
                       <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Comfort Level</div>
                       <div className="text-[13px] font-bold text-gray-900">Cool & Humid</div>
                     </div>
                   </div>
                </div>
             </div>
           </div>

           {/* COL 3: Alerts & Tip */}
           <div className="flex flex-col gap-6">
             {/* Weather Alerts */}
             <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-gray-900 text-[14px]">Weather Alerts</h3>
                   <button className="text-[11px] font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
                
                <div className="bg-[#f2f7fc] rounded-[16px] p-5 border border-blue-100 relative h-full flex flex-col justify-center">
                   <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <CloudRain className="w-5 h-5 text-blue-500" />
                        <h4 className="font-bold text-gray-900 text-[13px]">IMD Weather Alert</h4>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">Active</span>
                   </div>
                   
                   <p className="text-[13px] font-bold text-gray-800 mb-1.5 ml-7">Heavy rainfall alert for Mandi & Kullu</p>
                   <p className="text-[12px] text-gray-600 font-medium mb-4 ml-7">Between 10 AM – 3 PM today.</p>
                   
                   <p className="text-[10px] text-gray-400 font-bold ml-7 mt-auto">Issued: 2 Sep, 6:30 AM</p>
                </div>
             </div>

             {/* OneWay Tip */}
             <div className="bg-[#f0f7f3] rounded-[24px] p-6 border border-[#1e8e3e]/10 shadow-sm relative overflow-hidden">
                <h3 className="font-bold text-gray-900 text-[14px] mb-3">OneWay Tip</h3>
                <p className="text-[12px] text-gray-700 font-medium leading-relaxed mb-6 w-[80%]">
                  Roads may be slippery due to rain.<br/>Drive slowly and maintain a safe distance.
                </p>
                
                <button className="text-[11px] font-bold text-[#1e8e3e] flex items-center gap-1.5 hover:underline bg-white px-3 py-1.5 rounded-lg border border-[#1e8e3e]/20 w-max shadow-sm">
                  Check road conditions for live updates <ChevronRight className="w-3 h-3" />
                </button>
                
                {/* Umbrella Icon */}
                <div className="absolute right-[-10px] bottom-[-20px] rotate-[-15deg] opacity-90 drop-shadow-lg">
                   {/* Render an umbrella SVG directly to match the teal one in the screenshot closely */}
                   <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#0d6d56] fill-[#138e71]">
                     <path d="M22 12a10.06 10.06 0 0 0-20 0Z" />
                     <path d="M12 12v8a2 2 0 0 0 4 0" strokeWidth="2" fill="none" />
                     <path d="M12 2v1" strokeWidth="2" />
                   </svg>
                </div>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
}
