import { useState } from 'react';
import { RouteData, NormalizedHazard } from '@/types';
import { 
  Bell, 
  Calendar, 
  Car, 
  Clock,
  Search,
  RefreshCw,
  Sparkles,
  ArrowRight,
  MapPin,
  MoreVertical,
  AlertTriangle,
  CloudRain,
  AlertOctagon,
  Newspaper,
  Plane,
  CheckCircle2,
  Users,
  Check
} from 'lucide-react';

interface Props {
  journey: any;
  mappedRoutes: RouteData[];
  normalizedHazards: NormalizedHazard[];
}

export default function NewsTab({ journey }: Props) {
  
  const updates = [
    {
      id: 1,
      category: 'ROAD UPDATE',
      categoryColor: 'text-orange-500',
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      iconBg: 'bg-orange-50',
      title: 'Landslide clearance work underway',
      location: 'Near Mandi, Himachal Pradesh',
      time: '42 min ago',
      summary: 'Authorities are working to clear debris from a section of the highway following recent rainfall.',
      impactLevel: 'expect-delays',
      impactText: 'Expect delays',
      source: 'Official road update',
      sourceVerified: true,
      image: 'https://images.unsplash.com/photo-1542382257-80da9fb9f5c4?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 2,
      category: 'WEATHER UPDATE',
      categoryColor: 'text-blue-500',
      icon: <CloudRain className="w-5 h-5 text-blue-500" />,
      iconBg: 'bg-blue-50',
      title: 'Heavy rainfall expected near Mandi',
      location: 'Mandi, Himachal Pradesh',
      time: '1 hr ago',
      summary: 'IMD has predicted heavy rainfall in Mandi and surrounding areas over the next 24 hours.',
      impactLevel: 'possible-impact',
      impactText: 'Possible impact',
      source: 'IMD Weather Update',
      sourceVerified: true,
      image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 3,
      category: 'OFFICIAL ALERT',
      categoryColor: 'text-red-500',
      icon: <AlertOctagon className="w-5 h-5 text-red-500" />,
      iconBg: 'bg-red-50',
      title: 'NH-21 lane closed due to landslide',
      location: 'Near Pandoh, Himachal Pradesh',
      time: '2 hr ago',
      summary: 'One lane closed on NH-21 due to landslide. Commuters are advised to follow diversions and drive slowly.',
      impactLevel: 'major-disruption',
      impactText: 'Major disruption',
      source: 'Himachal Police',
      sourceVerified: true,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 4,
      category: 'LOCAL NEWS',
      categoryColor: 'text-purple-600',
      icon: <Newspaper className="w-5 h-5 text-purple-600" />,
      iconBg: 'bg-purple-50',
      title: 'New tunnel between Mandi and Aut nearing completion',
      location: 'Mandi, Himachal Pradesh',
      time: '5 hr ago',
      summary: 'The new tunnel is expected to reduce travel time by 30% once fully operational.',
      impactLevel: 'no-impact',
      impactText: 'No significant impact',
      source: 'Himachal Local News',
      sourceVerified: false,
      image: 'https://images.unsplash.com/photo-1626082929543-5b8d29fb9137?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 5,
      category: 'TRAVEL UPDATE',
      categoryColor: 'text-green-600',
      icon: <Plane className="w-5 h-5 text-green-600" />, // using Plane as a generic travel icon as in mockup
      iconBg: 'bg-green-50',
      title: 'Long traffic near Chandigarh on weekends',
      location: 'Chandigarh, Punjab',
      time: '6 hr ago',
      summary: 'Heavy weekend traffic observed on Zirakpur bypass.',
      impactLevel: 'expect-delays',
      impactText: 'Expect delays',
      source: 'Community Signal',
      sourceIcon: <Users className="w-3.5 h-3.5 text-gray-400 ml-1" />,
      sourceVerified: false,
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop'
    }
  ];

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'no-impact': return 'bg-green-500';
      case 'possible-impact': return 'bg-yellow-500';
      case 'expect-delays': return 'bg-orange-500';
      case 'major-disruption': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const timeline = [
    { city: 'Ahmedabad', status: 'Clear conditions', desc: 'No major updates', time: 'Just now', type: 'success' },
    { city: 'Delhi', status: 'Traffic update', desc: 'Moderate traffic reported on ring road.', time: '3 hr ago', type: 'news' },
    { city: 'Chandigarh', status: 'Heavy rainfall', desc: 'Rainfall expected in surrounding areas.', time: '1 hr ago', type: 'weather' },
    { city: 'Mandi', status: 'Road disruption', desc: 'Landslide clearance work underway near NH-21.', time: '42 min ago', type: 'warning' },
    { city: 'Pandoh', status: 'Lane closed', desc: 'One lane closed due to landslide.', time: '2 hr ago', type: 'danger' },
    { city: 'Manali', status: 'Clear conditions', desc: 'No major updates', time: 'Just now', type: 'success' },
  ];

  return (
    <div className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden bg-[#f8f9fa] pt-8 px-8 pb-12 font-sans">
      
      {/* TOP HEADER */}
      <div className="flex justify-between items-start mb-10 max-w-[1200px] mx-auto">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-[26px] text-gray-900 font-bold tracking-tight">
              {journey?.origin || 'Ahmedabad, Gujarat'} <span className="font-normal text-gray-400 mx-1">→</span> {journey?.destination || 'Manali, Himachal Pradesh'}
            </h1>
            <span className="bg-[#e6f4ea] text-[#1e8e3e] font-bold text-[11px] px-2.5 py-1 rounded-md uppercase tracking-wider">Live</span>
          </div>
          <div className="flex items-center gap-5 text-gray-500 font-semibold text-[13px] mt-1.5">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Mon, 2 Sep 2024</span>
            <span className="flex items-center gap-1.5"><Car className="w-4 h-4" /> By Car</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              1,278 km
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 19h 30m
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
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">2</span>
          </button>
          <img src="https://i.pravatar.cc/150?img=11" className="w-11 h-11 rounded-full border border-gray-200 shadow-sm" alt="Profile" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto">
        
        {/* PAGE HEADER */}
        <div className="flex justify-between items-end mb-6">
           <div>
              <h2 className="text-[28px] font-bold text-gray-900 mb-1 tracking-tight">News & Updates</h2>
              <div className="flex items-center gap-3">
                <p className="text-[14px] text-gray-500 font-medium">What's changing along your journey.</p>
                <div className="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded text-[11px] font-bold text-green-700">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                   Updated recently
                </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search updates..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-[13px] w-[240px] focus:outline-none focus:border-[#1e8e3e] focus:ring-1 focus:ring-[#1e8e3e] font-medium placeholder-gray-400"
                />
              </div>
              <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-full text-[13px] font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
           </div>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-2 mb-8">
           <button className="bg-[#e6f4ea] text-[#1e8e3e] border border-[#1e8e3e]/20 px-4 py-2.5 rounded-full text-[13px] font-bold">All</button>
           <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-gray-50"><AlertTriangle className="w-4 h-4 text-orange-500" /> Road Updates</button>
           <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-gray-50"><CloudRain className="w-4 h-4 text-blue-500" /> Weather</button>
           <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-gray-50"><AlertOctagon className="w-4 h-4 text-red-500" /> Official Alerts</button>
           <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-gray-50"><Newspaper className="w-4 h-4 text-purple-500" /> Local News</button>
           <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-gray-50"><Plane className="w-4 h-4 text-green-600" /> Travel Updates</button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-[1fr_360px] gap-6">
          
          {/* LEFT COLUMN: FEED */}
          <div className="space-y-6">
            
            {/* AI BRIEF */}
            <div className="bg-gradient-to-r from-[#e6f4ea] to-[#f0f7f3] rounded-3xl p-6 relative overflow-hidden border border-[#1e8e3e]/10 shadow-sm">
              <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none w-64 h-32">
                {/* Minimal SVG forest graphic representation */}
                <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M150 100L130 50L170 50L150 100Z" fill="#1e8e3e"/>
                  <path d="M120 100L90 40L150 40L120 100Z" fill="#0f4a3b"/>
                  <path d="M180 100L160 60L200 60L180 100Z" fill="#1e8e3e"/>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[#0f4a3b] mb-3">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-[18px]">OneWay AI Brief</h3>
                </div>
                <div className="flex gap-8 items-center">
                  <p className="text-[14px] text-gray-800 leading-relaxed max-w-[500px]">
                    Most of your route is currently clear. However, recent heavy rainfall near Mandi may affect road conditions. One road update and two traveler reports are relevant to your journey.
                  </p>
                  <div className="flex gap-6 items-center flex-1">
                    <div>
                      <div className="text-[24px] font-black text-[#1e8e3e] leading-none mb-1">3</div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Important updates</div>
                    </div>
                    <div>
                      <div className="text-[24px] font-black text-[#1e8e3e] leading-none mb-1">1</div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active alert</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-gray-500 mb-2">
                        <Clock className="w-4 h-4 text-[#1e8e3e]" />
                        <span className="text-[13px] font-bold text-gray-900">Updated</span>
                      </div>
                      <div className="text-[11px] font-medium text-gray-500">just now</div>
                    </div>
                  </div>
                  <button className="bg-[#0f4a3b] text-white px-5 py-3 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-[#0a352a] transition-colors shrink-0 shadow-md">
                    View Journey Analysis <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* UPDATES LIST */}
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex gap-5">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full ${update.iconBg} flex items-center justify-center shrink-0`}>
                      {update.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className={`text-[11px] font-bold tracking-wider uppercase mb-1 ${update.categoryColor}`}>
                            {update.category}
                          </div>
                          <h3 className="font-bold text-[16px] text-gray-900 leading-snug">{update.title}</h3>
                        </div>
                        <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-3 font-medium">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {update.location}</span>
                        <span className="text-gray-300">•</span>
                        <span>{update.time}</span>
                      </div>

                      <p className="text-[14px] text-gray-700 leading-relaxed mb-4 max-w-[85%]">
                        {update.summary}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-6">
                          <div>
                            <div className="text-[11px] text-gray-400 font-medium mb-1">Impact on your journey</div>
                            <div className="flex items-center gap-2 font-bold text-[13px] text-gray-900">
                              <span className={`w-2.5 h-2.5 rounded-full ${getImpactColor(update.impactLevel)}`}></span>
                              {update.impactText}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-gray-400 font-medium mb-1">Source</div>
                            <div className="flex items-center gap-1.5 font-bold text-[13px] text-gray-900">
                              {update.source}
                              {update.sourceVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e] fill-[#e6f4ea]" />}
                              {update.sourceIcon && update.sourceIcon}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Image area */}
                    <div className="w-[180px] shrink-0 flex flex-col items-center justify-center gap-3">
                      <div className="w-full h-[110px] rounded-2xl overflow-hidden relative">
                        <img src={update.image} className="absolute inset-0 w-full h-full object-cover" alt="Update context" />
                      </div>
                      <button className="text-[12px] font-bold text-gray-600 border border-gray-200 bg-white rounded-full px-4 py-2 hover:bg-gray-50 w-full flex justify-center items-center gap-1.5">
                         <MapPin className="w-3.5 h-3.5" /> View on Map
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN: TIMELINE */}
          <div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-8">
              <h3 className="font-bold text-[16px] text-gray-900 mb-1">Your Route Updates Timeline</h3>
              <p className="text-[12px] text-gray-500 font-medium mb-8">Important updates along your route</p>

              <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 mb-10">
                {timeline.map((item, idx) => {
                  let icon, color, bg;
                  switch(item.type) {
                    case 'success': 
                      icon = <Check className="w-3 h-3 text-white" />; color = 'bg-[#1e8e3e]'; bg = 'bg-[#e6f4ea]'; break;
                    case 'news': 
                      icon = <Newspaper className="w-3 h-3 text-white" />; color = 'bg-purple-500'; bg = 'bg-purple-50'; break;
                    case 'weather': 
                      icon = <CloudRain className="w-3 h-3 text-white" />; color = 'bg-blue-500'; bg = 'bg-blue-50'; break;
                    case 'warning': 
                      icon = <AlertTriangle className="w-3 h-3 text-white" />; color = 'bg-orange-500'; bg = 'bg-orange-50'; break;
                    case 'danger': 
                      icon = <AlertOctagon className="w-3 h-3 text-white" />; color = 'bg-red-500'; bg = 'bg-red-50'; break;
                    default: 
                      icon = <Check className="w-3 h-3 text-white" />; color = 'bg-gray-500'; bg = 'bg-gray-50';
                  }

                  return (
                    <div key={idx} className="relative pl-6">
                      {/* Node */}
                      <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full ${color} border-[3px] border-white flex items-center justify-center shadow-sm`}>
                         {icon}
                      </div>
                      
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-bold text-[14px] text-gray-900">{item.city}</h4>
                        <span className="text-[10px] text-gray-400 font-bold">{item.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {item.type === 'success' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e]" />
                        ) : item.type === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                        ) : item.type === 'danger' ? (
                          <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                        ) : item.type === 'weather' ? (
                          <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <Newspaper className="w-3.5 h-3.5 text-purple-500" />
                        )}
                        <span className="text-[12px] font-bold text-gray-700">{item.status}</span>
                      </div>
                      
                      <p className="text-[11px] text-gray-500 font-medium pr-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     <span className="text-[10px] font-bold text-gray-600">No significant impact</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                     <span className="text-[10px] font-bold text-gray-600">Possible impact</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                     <span className="text-[10px] font-bold text-gray-600">Expect delays</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-500"></span>
                     <span className="text-[10px] font-bold text-gray-600">Major disruption</span>
                   </div>
                </div>
              </div>

              <button className="w-full bg-[#e6f4ea] text-[#1e8e3e] font-bold text-[13px] py-3 rounded-full hover:bg-[#d6ebd9] transition-colors flex justify-center items-center gap-2">
                <MapPin className="w-4 h-4" /> View Full Route on Map <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
