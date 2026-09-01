import { useState } from 'react';
import { RouteData, NormalizedHazard } from '@/types';
import { 
  Bell, 
  Calendar, 
  Car, 
  MapPin,
  Search,
  ChevronDown,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  CornerUpRight,
  MoreHorizontal,
  X,
  Sparkles,
  Shield,
  Map,
  Smile,
  AlignLeft,
  PlayCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  CloudRain
} from 'lucide-react';

interface Props {
  journey: any;
  mappedRoutes: RouteData[];
  normalizedHazards: NormalizedHazard[];
}

export default function CommunityTab({ journey }: Props) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const posts = [
    {
      id: 1,
      author: 'Rohit Sharma',
      avatar: 'https://i.pravatar.cc/150?img=11',
      location: 'Near Pandoh, Himachal Pradesh',
      time: '18m ago',
      badge: { label: 'Landslide', color: 'text-red-500 bg-red-50' },
      content: 'Landslide near Pandoh. One lane open. Expect delays. Drive slow and stay safe!',
      images: [
        '/landslide_himachal.jpg'
      ],
      likes: 24,
      comments: 5,
      shares: 18,
      isAiVerified: true
    },
    {
      id: 2,
      author: 'Priya Verma',
      avatar: 'https://i.pravatar.cc/150?img=5',
      location: 'Near Kullu Valley, Himachal Pradesh',
      time: '45m ago',
      badge: { label: 'Heavy Rain', color: 'text-orange-500 bg-orange-50' },
      content: 'Heavy rainfall in Kullu valley since morning. Visibility is low. Please be careful.',
      images: [
        'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=800&auto=format&fit=crop'
      ],
      isVideo: true,
      likes: 31,
      comments: 6,
      shares: 22,
    },
    {
      id: 3,
      author: 'Amit Negi',
      avatar: 'https://i.pravatar.cc/150?img=12',
      location: 'Near Rohtang Pass, Himachal Pradesh',
      time: '1h ago',
      badge: { label: 'Road Clear', color: 'text-[#1e8e3e] bg-[#e6f4ea]' },
      content: 'Road is open till Rohtang Pass. Weather is cold but roads are fine.',
      images: [
        'https://images.unsplash.com/photo-1626082929543-5b8d29fb9137?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop'
      ],
      likes: 40,
      comments: 2,
      shares: 35,
    },
    {
      id: 4,
      author: 'Sneha Iyer',
      avatar: 'https://i.pravatar.cc/150?img=9',
      location: 'Near Mandi, Himachal Pradesh',
      time: '2h ago',
      badge: { label: 'Traffic', color: 'text-purple-600 bg-purple-50' },
      content: 'Traffic moving slow between Mandi and Aut tunnel. Construction work in progress.',
      likes: 12,
      comments: 1,
      shares: 4,
    }
  ];

  return (
    <div className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden bg-[#f8f9fa] pt-8 px-8 pb-12">
      {/* HEADER AREA */}
      <div className="flex justify-between items-start mb-10">
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

      <div className="max-w-[700px] mx-auto">
        {/* COMMUNITY HEADER */}
        <div className="flex justify-between items-end mb-6">
           <div>
              <h2 className="text-[26px] font-bold text-gray-900 mb-1">Community</h2>
              <p className="text-[13px] text-gray-500 font-medium">Real updates from travelers on your route.</p>
           </div>
           
           <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search posts, places, people..."
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-[13px] w-[280px] focus:outline-none focus:border-[#1e8e3e] focus:ring-1 focus:ring-[#1e8e3e]"
              />
           </div>
        </div>

        {/* FILTERS */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-2">
              <button className="bg-[#e6f4ea] text-[#1e8e3e] border border-[#1e8e3e]/20 px-4 py-2 rounded-full text-[12px] font-bold">All</button>
              <button className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-full text-[12px] font-bold flex items-center gap-1.5 hover:bg-gray-50"><MapPin className="w-3.5 h-3.5" /> Near Me</button>
              <button className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-full text-[12px] font-bold flex items-center gap-1.5 hover:bg-gray-50"><AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Hazards</button>
              <button className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-full text-[12px] font-bold flex items-center gap-1.5 hover:bg-gray-50"><svg className="w-3.5 h-3.5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/></svg> Road Conditions</button>
              <button className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-full text-[12px] font-bold flex items-center gap-1.5 hover:bg-gray-50"><svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11A2.98 2.98 0 0122 15c0 1.65-1.35 3-3 3z"/></svg> Weather</button>
              <button className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-full text-[12px] font-bold flex items-center gap-1.5 hover:bg-gray-50"><Car className="w-3.5 h-3.5 text-purple-500" /> Traffic</button>
           </div>
           
           <button className="bg-transparent text-gray-600 px-2 py-2 rounded-full text-[12px] font-bold flex items-center gap-1 hover:bg-gray-100 transition-colors">
              Most Recent <ChevronDown className="w-4 h-4" />
           </button>
        </div>

        {/* INLINE COMPOSER */}
        <div className="bg-white border border-gray-200 rounded-[24px] p-2 pr-3 flex items-center gap-3 mb-8 shadow-sm">
           <img src="https://i.pravatar.cc/150?img=11" className="w-10 h-10 rounded-full ml-1" alt="User" />
           <input 
             type="text" 
             placeholder="What's happening on your route?"
             className="flex-1 bg-transparent border-none text-[14px] focus:outline-none focus:ring-0 placeholder-gray-400"
             onClick={() => setIsComposerOpen(true)}
           />
           <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
             <ImageIcon className="w-5 h-5" />
           </button>
           <button 
             onClick={() => setIsComposerOpen(true)}
             className="bg-[#0f4a3b] text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#0a352a] transition-colors"
           >
             Post
           </button>
        </div>

        {/* FEED */}
        <div className="space-y-6">
          {posts.map((post) => (
             <div key={post.id} className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <img src={post.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-100" alt={post.author} />
                      <div>
                         <h3 className="font-bold text-gray-900 text-[15px]">{post.author}</h3>
                         <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1 font-bold text-[#1e8e3e]">
                               <MapPin className="w-3 h-3" /> {post.location}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span>{post.time}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      {post.isAiVerified && (
                        <span className="text-[10px] font-bold text-[#0d4f40] bg-[#e2f0eb] px-2.5 py-1 rounded-md border border-[#0d4f40]/20 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#0d4f40]" /> AI Verified
                        </span>
                      )}
                      {post.badge && (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${post.badge.color}`}>
                          {post.badge.label}
                        </span>
                      )}
                      <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
                   </div>
                </div>

                <p className="text-[14px] text-gray-800 leading-relaxed mb-4">{post.content}</p>

                {post.images && post.images.length > 0 && (
                   <div className={`grid gap-2 mb-4 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {post.images.map((img, idx) => (
                         <div key={idx} className="relative rounded-2xl overflow-hidden aspect-video border border-gray-100 group cursor-pointer">
                            <img src={img} className="w-full h-full object-cover" alt="Post attachment" />
                            {post.isVideo && (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                 <PlayCircle className="w-12 h-12 text-white/80" />
                              </div>
                            )}
                         </div>
                      ))}
                   </div>
                )}

                <div className="flex items-center gap-6 mt-4 pt-2">
                   <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group">
                     <Heart className={`w-5 h-5 ${post.likes > 0 ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-50'}`} />
                     <span className="text-[13px] font-bold">{post.likes}</span>
                   </button>
                   <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                     <MessageCircle className="w-5 h-5" />
                     <span className="text-[13px] font-bold">{post.comments}</span>
                   </button>
                   <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors">
                     <CornerUpRight className="w-5 h-5" />
                     <span className="text-[13px] font-bold">{post.shares}</span>
                   </button>
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setIsComposerOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#0f4a3b] hover:bg-[#0a352a] text-white rounded-full shadow-[0_8px_30px_rgb(15,74,59,0.3)] flex items-center justify-center transition-transform hover:scale-105 z-40"
      >
        <Sparkles className="w-7 h-7" />
      </button>

      {/* COMPOSER PANEL (SLIDE-UP / FLOATING MODAL) */}
      {isComposerOpen && (
        <>
          {/* Dimmed Overlay */}
          <div 
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 transition-opacity"
            onClick={() => setIsComposerOpen(false)}
          ></div>
          
          {/* Composer Card */}
          <div className="fixed bottom-8 right-10 w-[440px] bg-white rounded-[28px] shadow-2xl z-50 overflow-hidden flex flex-col border border-gray-100 animate-in slide-in-from-bottom-8 fade-in duration-300">
             
             {/* Header */}
             <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-50">
                <div className="flex items-start gap-3">
                   <div className="bg-[#e6f4ea] p-2 rounded-xl mt-1 text-[#1e8e3e]">
                     <Sparkles className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900 text-[16px] mb-1">Share an update with the community</h3>
                     <p className="text-[12px] text-gray-500">Your update can help fellow travelers stay safe.</p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsComposerOpen(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>

             {/* Content */}
             <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="flex items-center gap-3 mb-4">
                   <img src="https://i.pravatar.cc/150?img=11" className="w-10 h-10 rounded-full border border-gray-100" alt="User" />
                   <div>
                     <div className="flex items-center gap-1 font-bold text-[14px] text-gray-900">
                       iakadityaa <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e] fill-[#e6f4ea] ml-0.5" />
                     </div>
                     <div className="text-[11px] text-gray-500 font-medium">Posting to: <span className="font-bold text-gray-700">Ahmedabad → Manali route</span></div>
                   </div>
                </div>

                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-200 mb-5 relative">
                   <textarea 
                     className="w-full bg-transparent border-none focus:outline-none resize-none text-[15px] placeholder-gray-400 h-24"
                     placeholder="What's happening on your route?"
                     autoFocus
                   ></textarea>
                   <div className="absolute bottom-3 right-4 text-[10px] font-bold text-gray-400">0/500</div>
                </div>

                <div className="mb-5">
                   <p className="text-[12px] font-bold text-gray-500 mb-3">Add details (optional)</p>
                   <div className="flex flex-wrap gap-2">
                      <button className="border border-gray-200 rounded-full px-3 py-1.5 text-[11px] font-bold text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                        <AlertTriangle className="w-3 h-3 text-red-500" /> Hazard
                      </button>
                      <button className="border border-gray-200 rounded-full px-3 py-1.5 text-[11px] font-bold text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                        <svg className="w-3 h-3 text-[#1e8e3e]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/></svg> Road Condition
                      </button>
                      <button className="border border-gray-200 rounded-full px-3 py-1.5 text-[11px] font-bold text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                        <CloudRain className="w-3 h-3 text-blue-500" /> Weather
                      </button>
                      <button className="border border-gray-200 rounded-full px-3 py-1.5 text-[11px] font-bold text-gray-700 flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                        <Car className="w-3 h-3 text-purple-500" /> Traffic
                      </button>
                   </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                   <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"><ImageIcon className="w-4 h-4" /></button>
                   <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-[10px] font-bold transition-colors">GIF</button>
                   <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"><AlignLeft className="w-4 h-4" /></button>
                   <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"><MapPin className="w-4 h-4" /></button>
                   <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"><Smile className="w-4 h-4" /></button>
                </div>

                <div className="bg-[#f0f7f3]/50 rounded-2xl p-4 border border-[#1e8e3e]/10 flex items-center justify-between">
                   <div>
                     <h4 className="font-bold text-gray-900 text-[13px] mb-1">Stay kind & helpful</h4>
                     <p className="text-[11px] text-gray-600 font-medium leading-relaxed w-[90%]">Be respectful, share accurate info, and help others travel safer.</p>
                   </div>
                   <div className="w-12 h-12 bg-[#e6f4ea] rounded-full flex items-center justify-center shrink-0 border border-[#1e8e3e]/20">
                     <Shield className="w-6 h-6 text-[#1e8e3e] fill-[#1e8e3e]/10" />
                   </div>
                </div>
             </div>

             {/* Footer */}
             <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-3">
                   {/* Toggle switch */}
                   <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                     <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                   </div>
                   <span className="text-[12px] font-bold text-gray-500">Post anonymously</span>
                   <button className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[9px] font-bold text-gray-400">?</button>
                </div>
                
                <button 
                  className="bg-[#0f4a3b] text-white px-6 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-[#0a352a] transition-colors shadow-sm"
                  onClick={() => setIsComposerOpen(false)}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Post Update
                </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
