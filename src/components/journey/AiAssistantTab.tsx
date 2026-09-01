import { RouteData, NormalizedHazard } from '@/types';
import { 
  Bell, 
  Calendar, 
  Car, 
  Clock,
  ChevronDown,
  ShieldCheck,
  CloudRain,
  AlertTriangle,
  Map,
  FileText,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  MapPin,
  Mic,
  Send,
  Shield
} from 'lucide-react';

interface Props {
  journey: any;
  mappedRoutes: RouteData[];
  normalizedHazards: NormalizedHazard[];
}

export default function AiAssistantTab({ journey }: Props) {
  
  const quickActions = [
    {
      id: 1,
      icon: <ShieldCheck className="w-6 h-6 text-[#1e8e3e]" />,
      bg: 'bg-[#e6f4ea]',
      text: 'Is my route\nsafe right now?'
    },
    {
      id: 2,
      icon: <CloudRain className="w-6 h-6 text-blue-500" />,
      bg: 'bg-blue-50',
      text: 'What weather\nshould I expect?'
    },
    {
      id: 3,
      icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
      bg: 'bg-orange-50',
      text: 'What should I\nbe careful about?'
    },
    {
      id: 4,
      icon: <Map className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
      text: 'Show me\na better route'
    },
    {
      id: 5,
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      bg: 'bg-purple-50',
      text: 'What changed\nrecently?'
    },
    {
      id: 6,
      icon: <Clock className="w-6 h-6 text-slate-500" />,
      bg: 'bg-slate-100',
      text: 'Should I leave\nnow or later?'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fcfdfc] font-sans relative">
      
      {/* TOP HEADER */}
      <div className="bg-white border-b border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] px-8 py-4 flex justify-between items-center z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-[18px] text-gray-900 font-bold tracking-tight">
              {journey?.origin || 'Ahmedabad, Gujarat'} <span className="font-normal text-gray-400 mx-1">→</span> {journey?.destination || 'Manali, Himachal Pradesh'}
            </h1>
            <span className="bg-[#e6f4ea] text-[#1e8e3e] font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e]"></span>
              Live
            </span>
          </div>
          <div className="h-4 w-px bg-gray-200"></div>
          <div className="flex items-center gap-4 text-gray-500 font-bold text-[12px]">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Mon, 2 Sep 2024</span>
            <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> By Car</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              1,278 km
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 19h 30m
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-full font-bold text-[12px] text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Change Journey
          </button>
          <div className="h-6 w-px bg-gray-200 mx-1"></div>
          <button className="text-gray-600 hover:text-gray-900 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-white flex items-center justify-center">2</span>
          </button>
          <div className="flex items-center gap-1.5 cursor-pointer ml-2">
            <img src="https://i.pravatar.cc/150?img=11" className="w-8 h-8 rounded-full border border-gray-200" alt="Profile" />
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* SCROLLABLE MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto pb-24">
        
        {/* HERO ILLUSTRATION & HEADER */}
        <div className="flex flex-col items-center pt-8">
          {/* Mountain Hero */}
          <div className="w-full max-w-[800px] h-[240px] relative mb-6">
             {/* Note: In a real app we'd want to mask this nicely or ensure it fades to transparent. 
                 Since it's generated on a white background, it should blend well into #fcfdfc. */}
             <img src="/ai_mountain_hero.jpg" alt="Mountain AI Hero" className="w-full h-full object-cover object-center rounded-[40px] mix-blend-multiply opacity-90" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#fcfdfc] via-transparent to-transparent"></div>
          </div>
          
          <div className="flex flex-col items-center -mt-16 z-10">
            <div className="flex items-center gap-2 text-[#0f4a3b] mb-1">
              <Sparkles className="w-7 h-7" />
              <h2 className="text-[28px] font-bold tracking-tight">OneWay AI</h2>
            </div>
            <p className="text-[15px] font-medium text-gray-500 mb-4">Your intelligent travel companion</p>
            
            <div className="bg-[#f0f7f3]/50 border border-[#1e8e3e]/20 rounded-full px-4 py-1.5 flex items-center gap-3 text-[12px] font-bold text-gray-600">
               <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400"/> Ahmedabad → Manali</span>
               <span className="text-gray-300">|</span>
               <span className="flex items-center gap-1 text-[#1e8e3e]"><span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e]"></span> Live context</span>
            </div>
          </div>
        </div>

        {/* MAIN QUESTION */}
        <div className="text-center mt-12 mb-10">
           <h3 className="text-[32px] font-bold text-gray-900 mb-3 tracking-tight">How can I help with your journey?</h3>
           <p className="text-[15px] text-gray-500 font-medium max-w-[500px] mx-auto leading-relaxed">
             I already understand your route and can help you make better travel decisions.
           </p>
        </div>

        {/* QUICK ACTIONS GRID */}
        <div className="max-w-[960px] mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
           {quickActions.map((action) => (
             <div key={action.id} className="bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-all cursor-pointer rounded-[24px] p-6 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                   <div className={`w-14 h-14 rounded-full ${action.bg} flex items-center justify-center shrink-0`}>
                      {action.icon}
                   </div>
                   <p className="text-[14px] font-bold text-gray-900 leading-snug whitespace-pre-line">
                     {action.text}
                   </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
             </div>
           ))}
        </div>

        <div className="flex justify-center mb-8">
           <div className="bg-gray-50 border border-gray-100 rounded-full px-5 py-2 text-[12px] font-bold text-gray-500 flex items-center gap-1.5">
             <Sparkles className="w-3.5 h-3.5 text-gray-400" /> You can also ask anything, upload a photo, or use voice.
           </div>
        </div>
        
      </div>

      {/* CHAT INPUT AREA (Fixed at bottom) */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#fcfdfc] via-[#fcfdfc] to-transparent pt-12 pb-8 px-8 z-20">
         <div className="max-w-[800px] mx-auto">
            <div className="bg-white border border-gray-200 rounded-[32px] p-2 pl-6 flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgba(30,142,62,0.1)] focus-within:border-[#1e8e3e]/30 transition-all">
               <input 
                 type="text" 
                 placeholder="Ask OneWay anything about your journey..."
                 className="flex-1 bg-transparent border-none text-[15px] focus:outline-none placeholder-gray-400 font-medium"
               />
               <div className="flex items-center gap-1 mr-2">
                 <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                   <ImageIcon className="w-5 h-5" />
                 </button>
                 <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                   <MapPin className="w-5 h-5" />
                 </button>
                 <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                   <Mic className="w-5 h-5" />
                 </button>
               </div>
               <button className="w-12 h-12 bg-[#0f4a3b] text-white rounded-full flex items-center justify-center hover:bg-[#0a352a] transition-colors shadow-sm shrink-0 group">
                 <Send className="w-5 h-5 translate-x-[-1px] group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform" />
               </button>
            </div>
            
            <div className="flex justify-center items-center gap-1.5 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
               <Shield className="w-3.5 h-3.5" /> Powered by live data, official updates & traveler reports
            </div>
         </div>
      </div>

    </div>
  );
}
