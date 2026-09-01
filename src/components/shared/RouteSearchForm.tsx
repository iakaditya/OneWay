'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface RouteSearchFormProps {
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
}

export default function RouteSearchForm({ origin, setOrigin, destination, setDestination }: RouteSearchFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    setLoading(true);
    // Redirect to the rich analysis loading experience
    router.push(`/analyze?origin=${encodeURIComponent(origin.trim())}&destination=${encodeURIComponent(destination.trim())}&travelMode=${travelMode}&travelDate=${travelDate}`);
  }

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col md:flex-row items-center gap-4 relative z-20">
        
        {/* Origin Field */}
        <div className="flex-1 w-full px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors cursor-text group border border-transparent hover:border-gray-100">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">From</label>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search starting location"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-300 focus:outline-none font-medium"
              required
            />
          </div>
        </div>

        {/* Swap Button - Absolute on Desktop, Relative on Mobile */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm text-gray-400 hover:text-accent hover:shadow-md transition-all cursor-pointer" onClick={handleSwap}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        {/* Mobile Swap Button */}
        <div className="md:hidden w-full flex justify-center -my-2 z-10">
          <div className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm text-gray-400" onClick={handleSwap}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        </div>

        {/* Divider (Desktop) */}
        <div className="hidden md:block w-px h-12 bg-gray-200"></div>

        {/* Destination Field */}
        <div className="flex-1 w-full px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors cursor-text group border border-transparent hover:border-gray-100 pl-4 md:pl-10">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">To</label>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-300 focus:outline-none font-medium"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex w-full gap-2 md:w-auto md:flex-col md:gap-1">
          <label className="flex flex-1 flex-col text-[10px] font-bold uppercase tracking-wider text-gray-400 md:w-32">
            Mode
            <select value={travelMode} onChange={(e) => setTravelMode(e.target.value)} className="mt-1 rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs font-semibold text-gray-700 outline-none">
              <option value="DRIVING">Car</option><option value="MOTORCYCLE">Motorcycle</option><option value="TRANSIT">Transit</option><option value="WALKING">Walk</option>
            </select>
          </label>
          <label className="flex flex-1 flex-col text-[10px] font-bold uppercase tracking-wider text-gray-400 md:w-32">
            Travel date
            <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="mt-1 rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs font-semibold text-gray-700 outline-none" />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading || !origin.trim() || !destination.trim()}
          className="w-full md:w-auto mt-2 md:mt-0 px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl md:rounded-[20px] font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(45,90,63,0.2)] hover:shadow-[0_6px_20px_rgba(45,90,63,0.3)] shrink-0"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Analyze My Journey
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>

      </div>
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-gray-600 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Trusted by thousands of travelers across India
        </p>
      </div>
    </form>
  );
}
