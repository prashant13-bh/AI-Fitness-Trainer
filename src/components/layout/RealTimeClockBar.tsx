'use client';

import React from 'react';
import { useRealTimeClock, getRealArcDayInfo } from '@/lib/realTimeSync';
import { Clock, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { getUserProfile } from '@/lib/userProfile';

export default function RealTimeClockBar() {
  const { timeString, dateString, activeSlot, greeting } = useRealTimeClock();
  const profile = getUserProfile();
  const { currentArcDay, daysUntil2027 } = getRealArcDayInfo(profile.startDate);

  return (
    <div className="w-full bg-[#0A192F] text-white border-b border-slate-800 px-3 sm:px-6 py-2 transition-all select-none">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Real-time clock & live pulse */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-xl font-mono text-emerald-400 font-black shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs">{timeString}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-[#0085FF]" />
            <span>{dateString}</span>
          </div>

          <span className="hidden md:inline-block text-[10px] text-slate-500">|</span>

          <span className="hidden md:inline-block text-[11px] font-bold text-slate-300">
            {greeting}
          </span>
        </div>

        {/* Right: Active Routine Slot in Real Time */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-900/60 to-purple-900/60 border border-blue-500/30 px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold text-slate-200">
            <span>{activeSlot.emoji}</span>
            <span className="text-[#0085FF] font-black uppercase text-[9px] tracking-wider hidden xs:inline">NOW:</span>
            <span className="truncate max-w-[160px] sm:max-w-[240px] text-white font-extrabold">{activeSlot.title}</span>
            <span className="text-[9px] text-slate-400 hidden lg:inline">({activeSlot.timeRange})</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-orange-500/20 text-[#FF7A00] border border-orange-500/30 px-2.5 py-1 rounded-xl text-[10px] font-black">
            <span>Day {currentArcDay}</span>
            <span className="text-white/40">·</span>
            <span>{daysUntil2027}d left</span>
          </div>
        </div>
      </div>
    </div>
  );
}
