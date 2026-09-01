import { 
  Bell, 
  Calendar, 
  Car, 
  Clock,
  ChevronDown,
  MoreVertical,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  Bookmark
} from 'lucide-react';

export default function SavedJourneysTab() {
  const savedJourneys = [
    {
      id: 1,
      route: 'Delhi → Manali',
      date: 'Saved for Sep 15, 2024',
      distance: '540 km',
      time: '11h 20m',
      statusType: 'good',
      statusText: 'Looking good',
      lastChecked: 'Last checked 12 min ago',
      image: 'https://images.unsplash.com/photo-1626082929543-5b8d29fb9137?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 2,
      route: 'Chandigarh → Leh',
      date: 'Saved for Sep 28, 2024',
      distance: '1,050 km',
      time: '18h 40m',
      statusType: 'changing',
      statusText: 'Conditions changing',
      lastChecked: 'Last checked 35 min ago',
      image: 'https://images.unsplash.com/photo-1542382257-80da9fb9f5c4?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 3,
      route: 'Dehradun → Mussoorie',
      date: 'Saved for Oct 5, 2024',
      distance: '310 km',
      time: '7h 10m',
      statusType: 'attention',
      statusText: 'Attention needed',
      lastChecked: 'Last checked 1 hr ago',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 4,
      route: 'Shimla → Spiti Valley',
      date: 'Saved for Oct 12, 2024',
      distance: '420 km',
      time: '11h 45m',
      statusType: 'good',
      statusText: 'Looking good',
      lastChecked: 'Last checked 50 min ago',
      image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 5,
      route: 'Ahmedabad → Rishikesh',
      date: 'Saved for Nov 3, 2024',
      distance: '1,060 km',
      time: '17h 30m',
      statusType: 'changing',
      statusText: 'Conditions changing',
      lastChecked: 'Last checked 20 min ago',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=200&auto=format&fit=crop'
    }
  ];

  const renderStatus = (type: string, text: string) => {
    switch (type) {
      case 'good':
        return <div className="text-[#1e8e3e] text-[12px] font-bold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1e8e3e]"></span> {text}</div>;
      case 'changing':
        return <div className="text-orange-500 text-[12px] font-bold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> {text}</div>;
      case 'attention':
        return <div className="text-red-500 text-[12px] font-bold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> {text}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fcfdfc] font-sans relative">
      
      {/* TOP HEADER */}
      <div className="bg-white border-b border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] px-8 py-4 flex justify-between items-center z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-[18px] text-gray-900 font-bold tracking-tight">
              Ahmedabad, Gujarat <span className="font-normal text-gray-400 mx-1">→</span> Manali, Himachal Pradesh
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
      <div className="flex-1 overflow-y-auto px-8 py-10">
        
        {/* PAGE HEADER */}
        <div className="flex justify-between items-end mb-8 max-w-[1200px] mx-auto">
          <div>
            <h2 className="text-[28px] font-bold text-gray-900 mb-1 tracking-tight">Saved Journeys</h2>
            <p className="text-[14px] text-gray-500 font-medium">Your favorite routes and planned trips, ready whenever you are.</p>
          </div>
          <button className="bg-[#0f4a3b] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-[#0a352a] transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Plan a New Journey
          </button>
        </div>

        {/* FEATURED UPCOMING JOURNEY */}
        <div className="max-w-[1200px] mx-auto relative overflow-hidden rounded-[32px] bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8 flex h-[340px]">
          {/* Content Left Side */}
          <div className="relative z-10 w-full md:w-[50%] p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#1e8e3e] font-bold text-[11px] uppercase tracking-wider mb-4 bg-[#e6f4ea] w-max px-3 py-1.5 rounded-lg border border-[#1e8e3e]/20">
              <Calendar className="w-3.5 h-3.5" /> Upcoming Journey
            </div>
            
            <h3 className="text-[26px] font-bold text-gray-900 leading-tight mb-2">
              Ahmedabad, Gujarat <span className="font-normal text-gray-400 mx-2">→</span> Manali, Himachal Pradesh
            </h3>
            <p className="text-[15px] font-bold text-gray-600 mb-6">Mon, 2 Sep 2026</p>
            
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2 font-bold text-gray-700 text-[13px]"><Car className="w-4 h-4 text-gray-400" /> By Car</div>
              <div className="flex items-center gap-2 font-bold text-gray-700 text-[13px]"><MapPin className="w-4 h-4 text-gray-400" /> 1,278 km</div>
              <div className="flex items-center gap-2 font-bold text-gray-700 text-[13px]"><Clock className="w-4 h-4 text-gray-400" /> 19h 30m</div>
            </div>

            <div className="mb-8">
               <div className="flex items-center gap-2 font-bold text-[#1e8e3e] text-[14px] mb-1">
                 <span className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e]"></span> Conditions mostly clear
               </div>
               <p className="text-[12px] text-gray-500 font-medium ml-4">One area may need attention near the mountain section.</p>
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-[#0f4a3b] text-white px-6 py-3 rounded-xl text-[13px] font-bold hover:bg-[#0a352a] transition-colors shadow-sm flex items-center gap-2">
                View Journey <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-white border border-[#1e8e3e]/30 text-[#0f4a3b] px-6 py-3 rounded-xl text-[13px] font-bold hover:bg-[#f0f7f3] transition-colors flex items-center gap-2 shadow-sm">
                <Sparkles className="w-4 h-4" /> Ask OneWay AI
              </button>
            </div>
          </div>

          {/* Image Right Side */}
          <div className="absolute right-0 top-0 bottom-0 w-[60%]">
             <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-10"></div>
             <img src="/featured_journey_banner.jpg" alt="Featured Journey" className="w-full h-full object-cover object-left" />
          </div>
        </div>

        {/* FILTERS */}
        <div className="max-w-[1200px] mx-auto flex items-center gap-8 mb-8 border-b border-gray-100">
           <button className="text-[14px] font-bold text-[#1e8e3e] border-b-2 border-[#1e8e3e] pb-3 px-2">Upcoming</button>
           <button className="text-[14px] font-bold text-gray-500 pb-3 px-2 hover:text-gray-700 transition-colors">Saved</button>
           <button className="text-[14px] font-bold text-gray-500 pb-3 px-2 hover:text-gray-700 transition-colors">Past Journeys</button>
        </div>

        {/* JOURNEY CARDS GRID */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {savedJourneys.map(journey => (
             <div key={journey.id} className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col group">
               
               {/* Info Section */}
               <div className="flex gap-4 mb-5">
                  <div className="w-[100px] h-[100px] rounded-[18px] overflow-hidden shrink-0">
                     <img src={journey.image} alt={journey.route} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 pt-1">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-[15px] text-gray-900 leading-tight pr-2">{journey.route}</h4>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors -mr-1"><MoreVertical className="w-4 h-4" /></button>
                     </div>
                     <p className="text-[11px] text-gray-500 font-medium mb-3">{journey.date}</p>
                     
                     <div className="flex gap-4 text-[11px] font-bold text-gray-600 mb-4">
                       <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><Car className="w-3.5 h-3.5 text-gray-400" /> {journey.distance}</span>
                       <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><Clock className="w-3.5 h-3.5 text-gray-400" /> {journey.time}</span>
                     </div>
                     
                     <div className="mb-1">
                       {renderStatus(journey.statusType, journey.statusText)}
                     </div>
                     <p className="text-[10px] text-gray-400 font-medium">{journey.lastChecked}</p>
                  </div>
               </div>
               
               {/* Actions Section */}
               <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                 <button className="text-[12px] font-bold text-gray-700 flex items-center gap-2 hover:text-[#0f4a3b] transition-colors border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50">
                   <MapPin className="w-3.5 h-3.5" /> View Journey
                 </button>
                 <button className="text-[12px] font-bold text-[#0f4a3b] flex items-center gap-1.5 hover:bg-[#f0f7f3] transition-colors px-4 py-2 rounded-xl">
                   <Sparkles className="w-3.5 h-3.5" /> Ask AI
                 </button>
                 <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-full transition-colors ml-auto">
                   <MoreVertical className="w-4 h-4" />
                 </button>
               </div>
               
             </div>
           ))}

           {/* Promotional Card */}
           <div className="bg-[#f0f7f3] rounded-[24px] border border-[#1e8e3e]/10 p-6 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#e6f4ea] rounded-full opacity-50"></div>
             <div className="relative z-10">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#1e8e3e] mb-4">
                 <Bookmark className="w-5 h-5" />
               </div>
               <h4 className="font-bold text-[15px] text-gray-900 mb-2">Keep your journeys updated</h4>
               <p className="text-[12px] text-gray-600 font-medium leading-relaxed mb-6">
                 OneWay continuously monitors your saved routes and notifies you about important changes.
               </p>
               <button className="bg-white border border-gray-200 text-gray-700 font-bold text-[12px] px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 w-max shadow-sm">
                 <Bell className="w-3.5 h-3.5" /> Manage Alerts
               </button>
             </div>
           </div>
           
        </div>
      </div>
    </div>
  );
}
