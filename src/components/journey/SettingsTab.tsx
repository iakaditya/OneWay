import { 
  Bell, 
  Calendar, 
  Car, 
  Clock,
  ChevronDown,
  Check,
  Moon,
  ShieldCheck,
  Zap,
  Globe,
  AlertTriangle,
  CloudLightning,
  ShieldAlert,
  Users,
  Shield,
  MapPin,
  Sparkles,
  Mic,
  FileText,
  Trash2,
  Info,
  Sun,
  Monitor,
  ChevronRight
} from 'lucide-react';

export default function SettingsTab() {
  const Toggle = ({ active }: { active: boolean }) => (
    <div className={`w-[38px] h-[22px] rounded-full flex items-center px-0.5 transition-colors ${active ? 'bg-[#1e8e3e]' : 'bg-gray-200'}`}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${active ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
    </div>
  );

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
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Mon, 2 Sep 2026</span>
            <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> By Car</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
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
            <h2 className="text-[28px] font-bold text-gray-900 mb-1 tracking-tight">Settings</h2>
            <p className="text-[14px] text-gray-500 font-medium">Manage your OneWay experience.</p>
          </div>
          <div className="bg-[#e6f4ea] text-[#1e8e3e] font-bold text-[12px] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-[#1e8e3e]/10">
            <Check className="w-3.5 h-3.5" /> Changes saved
          </div>
        </div>

        {/* PROFILE HERO CARD */}
        <div className="max-w-[1200px] mx-auto bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-8 overflow-hidden relative flex items-center p-8">
           <div className="relative z-10 flex items-center gap-6">
              <img src="https://i.pravatar.cc/150?img=11" alt="Aditya" className="w-24 h-24 rounded-full border-4 border-white shadow-sm" />
              <div>
                 <h3 className="text-[22px] font-bold text-gray-900 mb-0.5 tracking-tight">Aditya</h3>
                 <p className="text-[13px] text-gray-500 font-medium mb-3">aditya@example.com</p>
                 <button className="bg-white border border-[#1e8e3e]/30 text-[#1e8e3e] hover:bg-[#e6f4ea] font-bold text-[12px] px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 shadow-sm">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                   Edit Profile
                 </button>
              </div>
           </div>
           
           {/* Illustration Background */}
           <div className="absolute top-0 right-0 bottom-0 w-[500px] pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent z-10"></div>
              {/* Using ai_mountain_hero.jpg as requested to reuse existing assets since generation failed */}
              <img src="/ai_mountain_hero.jpg" alt="Mountain Landscape" className="w-full h-full object-cover object-right opacity-80" />
           </div>

           <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 text-right">
             <p className="text-[#0f4a3b] font-medium text-[16px] italic opacity-80 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
               Better journeys<br/>start with you.
             </p>
           </div>
        </div>

        {/* SETTINGS GRID */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           
           {/* 1. Travel Preferences */}
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-3 mb-1">
                <Car className="w-5 h-5 text-[#0f4a3b]" />
                <h3 className="font-bold text-[16px] text-gray-900">Travel Preferences</h3>
              </div>
              <p className="text-[12px] text-gray-500 font-medium mb-6">Tell OneWay how you prefer to travel.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <Car className="w-4 h-4 text-[#1e8e3e]" />
                    <span className="text-[13px] font-bold text-gray-700">Default travel mode</span>
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-[12px] font-bold rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-[#1e8e3e]">
                      <option>Car</option>
                      <option>Motorcycle</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <Moon className="w-4 h-4 text-[#1e8e3e]" />
                    <span className="text-[13px] font-bold text-gray-700">Avoid night travel</span>
                  </div>
                  <Toggle active={true} />
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#1e8e3e]" />
                    <span className="text-[13px] font-bold text-gray-700">Prefer safer routes</span>
                  </div>
                  <Toggle active={true} />
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <span className="text-[13px] font-bold text-gray-700">Prefer faster routes</span>
                  </div>
                  <Toggle active={false} />
                </div>

                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#1e8e3e]" />
                    <span className="text-[13px] font-bold text-gray-700">Preferred language</span>
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-[12px] font-bold rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-[#1e8e3e]">
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
           </div>

           {/* 2. Alerts & Safety */}
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-3 mb-1">
                <Bell className="w-5 h-5 text-[#0f4a3b]" />
                <h3 className="font-bold text-[16px] text-gray-900">Alerts & Safety</h3>
              </div>
              <p className="text-[12px] text-gray-500 font-medium mb-6">Choose what OneWay should keep an eye on.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700">Road closures</span>
                  </div>
                  <Toggle active={true} />
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <CloudLightning className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700">Severe weather</span>
                  </div>
                  <Toggle active={true} />
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700">Road hazards</span>
                  </div>
                  <Toggle active={true} />
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700">Important community reports</span>
                  </div>
                  <Toggle active={true} />
                </div>

                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700">High-risk route alerts</span>
                  </div>
                  <Toggle active={true} />
                </div>
              </div>
           </div>

           {/* 3. Location & Privacy */}
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-1">
                <MapPin className="w-5 h-5 text-[#0f4a3b]" />
                <h3 className="font-bold text-[16px] text-gray-900">Location & Privacy</h3>
              </div>
              <p className="text-[12px] text-gray-500 font-medium mb-6">Control your location and data settings.</p>
              
              <div className="space-y-4 mb-auto">
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700">Use my location</span>
                  </div>
                  <Toggle active={true} />
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700 pr-4 leading-tight">Show approximate location in community posts</span>
                  </div>
                  <Toggle active={true} />
                </div>
                
                <div className="flex justify-between items-center py-1 cursor-pointer group">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Manage data preferences</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mt-6 flex gap-2.5 border border-gray-100">
                 <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                   Your precise location is only used to improve route information and travel updates.
                 </p>
              </div>
           </div>
        </div>

        {/* BOTTOM ROW (Appearance & OneWay AI) */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 mb-8">
           
           {/* Appearance */}
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-3 mb-1">
                <Sun className="w-5 h-5 text-[#0f4a3b]" />
                <h3 className="font-bold text-[16px] text-gray-900">Appearance</h3>
              </div>
              <p className="text-[12px] text-gray-500 font-medium mb-6">Choose how OneWay looks for you.</p>
              
              <div className="grid grid-cols-3 gap-4">
                 {/* Light - Selected */}
                 <div className="bg-[#f0f7f3] border-2 border-[#1e8e3e] rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors relative">
                    <Sun className="w-6 h-6 text-[#1e8e3e]" />
                    <span className="text-[12px] font-bold text-[#1e8e3e]">Light</span>
                    <div className="w-3.5 h-3.5 rounded-full border-[3px] border-[#1e8e3e] bg-white flex items-center justify-center mt-1">
                       <div className="w-1.5 h-1.5 bg-[#1e8e3e] rounded-full"></div>
                    </div>
                 </div>

                 {/* Dark */}
                 <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <Moon className="w-6 h-6 text-gray-400" />
                    <span className="text-[12px] font-bold text-gray-500">Dark</span>
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-300 mt-1"></div>
                 </div>

                 {/* System */}
                 <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <Monitor className="w-6 h-6 text-gray-400" />
                    <span className="text-[12px] font-bold text-gray-500">System</span>
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-300 mt-1"></div>
                 </div>
              </div>
           </div>

           {/* OneWay AI */}
           <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center gap-3 mb-1">
                <Sparkles className="w-5 h-5 text-[#0f4a3b]" />
                <h3 className="font-bold text-[16px] text-gray-900">OneWay AI</h3>
              </div>
              <p className="text-[12px] text-gray-500 font-medium mb-6">Control how OneWay AI helps you during your journey.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700">Enable proactive journey suggestions</span>
                  </div>
                  <Toggle active={true} />
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <Mic className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700">Voice responses</span>
                  </div>
                  <Toggle active={true} />
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#0f4a3b]" />
                    <span className="text-[13px] font-bold text-gray-700">Explain why recommendations are made</span>
                  </div>
                  <Toggle active={true} />
                </div>
              </div>
           </div>
        </div>

        {/* DANGER ZONE */}
        <div className="max-w-[1200px] mx-auto bg-[#fff8f8] border border-red-100 rounded-[24px] p-6 flex items-center justify-between">
           <div>
              <h3 className="font-bold text-[15px] text-red-600 mb-0.5">Danger Zone</h3>
              <p className="text-[12px] text-red-400 font-medium">These actions are permanent and cannot be undone.</p>
           </div>
           
           <div className="flex items-center gap-4">
             <button className="bg-white border border-red-200 text-red-600 text-[12px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-red-50 transition-colors shadow-sm">
               <FileText className="w-3.5 h-3.5" /> Clear saved journeys
             </button>
             <button className="bg-white border border-red-200 text-red-600 text-[12px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-red-50 transition-colors shadow-sm">
               <Trash2 className="w-3.5 h-3.5" /> Delete account
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
