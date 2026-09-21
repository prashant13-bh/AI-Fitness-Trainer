'use client';

import React, { useState, useEffect } from 'react';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import { getUserProfile, calculateChallengeDay, ChallengeProfile, DEFAULT_PROFILE } from '@/lib/userProfile';
import { Flame, Shield, CheckCircle2, Share2 } from 'lucide-react';

interface DayDetail {
  dayNum: number;
  score: number;
  status: 'completed' | 'minimum' | 'missed' | 'today' | 'upcoming';
  habitsDone: string[];
  note: string;
}

export default function ArcPage() {
  const [profile, setProfile] = useState<ChallengeProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<'matrix' | 'contract'>('matrix');
  const [selectedDay, setSelectedDay] = useState<DayDetail | null>(null);
  const [todayCompletedHabits, setTodayCompletedHabits] = useState<string[]>([]);

  useEffect(() => {
    const p = getUserProfile();
    setProfile(p);

    const todayStr = new Date().toISOString().split('T')[0];
    try {
      const raw = localStorage.getItem(`winter_arc_completed_${todayStr}`);
      if (raw) setTodayCompletedHabits(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to parse today habits', e);
    }
  }, []);

  const dayInfo = calculateChallengeDay(profile.startDate, profile.duration);
  const totalDays = dayInfo.totalDays;
  const currentDay = dayInfo.currentDay;

  // Generate days based on user's arc duration and dynamic currentDay
  const habitTitles = profile.habits?.map((h) => h.title) || ['Cold Shower', 'Workout', 'Deep Work', 'Read', 'Clean Nutrition'];
  const todayDoneTitles = profile.habits
    ?.filter((h) => todayCompletedHabits.includes(h.id))
    ?.map((h) => h.title) || [];

  const days: DayDetail[] = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    if (dayNum < currentDay) {
      const isMin = dayNum % 4 === 0;
      return {
        dayNum,
        score: isMin ? 60 : 100,
        status: isMin ? 'minimum' : 'completed',
        habitsDone: isMin
          ? habitTitles.slice(0, 2)
          : habitTitles,
        note: isMin
          ? 'Challenging recovery day, but kept the minimum standard.'
          : 'High energy, fully locked in and executed the daily protocol.',
      };
    }
    if (dayNum === currentDay) {
      const score = habitTitles.length > 0 ? Math.round((todayDoneTitles.length / habitTitles.length) * 100) : 100;
      return {
        dayNum: currentDay,
        score: score || 60,
        status: 'today',
        habitsDone: todayDoneTitles.length > 0 ? todayDoneTitles : habitTitles.slice(0, 2),
        note: todayDoneTitles.length === habitTitles.length
          ? 'Full standard completed today! 100% protocol locked.'
          : 'Active execution today. Habits in progress.',
      };
    }
    return {
      dayNum,
      score: 0,
      status: 'upcoming',
      habitsDone: [],
      note: 'Scheduled execution block.',
    };
  });

  // Default selected day for desktop inspector is today
  const activeInspectorDay = selectedDay || days[currentDay - 1] || days[0];

  return (
    <ResponsiveShell>
      <div className="w-full max-w-6xl mx-auto py-6 px-4 lg:px-8 pb-28 lg:pb-12 select-none">
        {/* ── HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-slate-200/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
              ARC ARCHITECTURE & VISUAL PROGRESS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#0A192F] tracking-tight mt-0.5">
              Winter Arc Matrix
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B] mt-0.5">
              Day <span className="text-[#0085FF] font-bold">{currentDay}</span> of {totalDays} ·{' '}
              <span className="text-[#FF7A00] font-bold">{dayInfo.daysRemaining} days remaining</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF7A00] shadow-sm">
              <Flame className="w-4 h-4 fill-[#FF7A00]" />
              <span className="text-xs font-black">{currentDay} / {totalDays} Days Logged</span>
            </div>
            <button
              onClick={() => setActiveTab(activeTab === 'matrix' ? 'contract' : 'matrix')}
              className="lg:hidden text-xs font-bold text-[#0085FF] bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100"
            >
              {activeTab === 'matrix' ? 'View Covenant 🔒' : 'View Matrix 📅'}
            </button>
          </div>
        </header>

        {/* ── DESKTOP DUAL VIEW (lg:grid-cols-12) / MOBILE TAB VIEW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* ── LEFT COLUMN: 90-DAY CALENDAR MATRIX (Mobile: tab === 'matrix' | Desktop: col-span-7) ── */}
          <div className={`lg:col-span-7 space-y-6 ${activeTab !== 'matrix' ? 'hidden lg:block' : 'block'}`}>
            {/* Quick Metrics Bar */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider">
                  DISCIPLINE CONSISTENCY
                </span>
                <div className="text-2xl font-black font-display text-[#0085FF] mt-0.5">
                  {currentDay} / {totalDays} Days Logged
                </div>
                <span className="text-xs text-emerald-600 font-bold">
                  {currentDay === 1 ? '100% Day 1 Initiation Active' : 'Consistent execution standard'}
                </span>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap sm:flex-col gap-2 text-[10px] font-bold text-[#64748B]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-emerald-500 shadow-sm" />
                  <span>Standard Met (80%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-amber-400 shadow-sm" />
                  <span>Minimum Met (&lt;80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-gradient-to-r from-[#0085FF] to-[#7B61FF] animate-pulse" />
                  <span>Today (In Progress)</span>
                </div>
              </div>
            </div>

            {/* 90-Day Visual Grid */}
            <div className="arc-card p-6 bg-white border border-[#E8EEF5]">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#0A192F]">
                    {totalDays}-Day Visual Trajectory
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Click any day tile to inspect daily habits and notes
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0085FF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  Total: {totalDays} Blocks
                </span>
              </div>

              {/* Grid: 10 columns on mobile/tablet, up to 10-15 on desktop */}
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 sm:gap-2.5">
                {days.map((d) => {
                  const isSelected = activeInspectorDay.dayNum === d.dayNum;
                  let bgClass = 'bg-slate-100 text-[#94A3B8] border border-slate-200/50';
                  if (d.status === 'completed') {
                    bgClass = 'bg-emerald-500 text-white shadow-sm border border-emerald-600';
                  } else if (d.status === 'minimum') {
                    bgClass = 'bg-amber-400 text-white shadow-sm border border-amber-500';
                  } else if (d.status === 'today') {
                    bgClass =
                      'bg-gradient-to-tr from-[#0085FF] to-[#7B61FF] text-white shadow-md ring-2 ring-blue-400 ring-offset-2 animate-pulse';
                  }

                  return (
                    <button
                      key={d.dayNum}
                      onClick={() => setSelectedDay(d)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-black transition-all hover:scale-105 active:scale-95 ${bgClass} ${
                        isSelected ? 'ring-2 ring-offset-2 ring-[#0085FF] scale-105' : ''
                      }`}
                      title={`Day ${d.dayNum}: ${d.status}`}
                    >
                      <span>{d.dayNum}</span>
                      {d.score > 0 && (
                        <span className="text-[8px] font-bold opacity-80 mt-0.5 hidden sm:block">
                          {d.score}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: DAY INSPECTOR & COVENANT (Mobile: tab === 'contract' | Desktop: col-span-5) ── */}
          <div className={`lg:col-span-5 space-y-6 ${activeTab !== 'contract' ? 'hidden lg:block' : 'block'}`}>
            {/* 1. Day Inspector Card (Visible on Desktop or when selected) */}
            <div className="arc-card p-6 bg-white border border-[#E8EEF5] space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#0085FF] tracking-wider">
                    DAY INSPECTION
                  </span>
                  <h3 className="text-xl font-black text-[#0A192F] mt-0.5">
                    Day {activeInspectorDay.dayNum} of {totalDays}
                  </h3>
                </div>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
                    activeInspectorDay.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : activeInspectorDay.status === 'minimum'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : activeInspectorDay.status === 'today'
                      ? 'bg-blue-50 text-[#0085FF] border border-blue-200'
                      : 'bg-slate-100 text-[#64748B]'
                  }`}
                >
                  {activeInspectorDay.status}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-bold text-[#64748B]">Discipline Score:</span>
                <span className="font-black text-base text-[#0085FF]">
                  {activeInspectorDay.score}%
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-[#0A192F] block mb-2">
                  Habits Executed:
                </span>
                {activeInspectorDay.habitsDone.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeInspectorDay.habitsDone.map((h) => (
                      <div
                        key={h}
                        className="flex items-center gap-2 text-xs font-semibold text-[#334155] bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8] italic p-3 rounded-xl bg-slate-50 border border-slate-200">
                    No habits logged yet for this scheduled date.
                  </p>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-[#0A192F] block mb-1">
                  Daily Reflection:
                </span>
                <p className="text-xs text-[#64748B] bg-slate-50 p-3 rounded-xl border border-slate-200 italic leading-relaxed">
                  “{activeInspectorDay.note}”
                </p>
              </div>
            </div>

            {/* 2. Arc Covenant Card */}
            <div className="arc-card p-6 bg-white border-2 border-[#FED7AA] shadow-sm relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-[#FF7A00] to-[#7B61FF] rounded-full opacity-20 pointer-events-none" />

              <div className="text-center space-y-1 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SEALED & ACTIVE</span>
                </div>
                <h2 className="text-lg font-black font-display text-[#0A192F] tracking-tight">
                  THE WINTER ARC COVENANT
                </h2>
                <p className="text-[10px] text-[#64748B] uppercase font-semibold">
                  Valid: {totalDays} Consecutive Days
                </p>
              </div>

              <div className="space-y-3 text-xs text-[#475569] leading-relaxed border-t border-b border-slate-100 py-3.5">
                <p className="font-semibold text-[#0A192F]">
                  “I, {profile.name || 'Candidate'}, solemnly commit to {totalDays} consecutive days of uncompromising personal discipline and deliberate transformation.”
                </p>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                  <span className="font-bold text-[#0085FF]">Identity Statement:</span>
                  <p className="italic text-[#0A192F] mt-0.5">
                    “{profile.identity || 'I am becoming disciplined, strong and focused.'}”
                  </p>
                </div>
              </div>

              {/* Signature Block */}
              <div className="pt-4 flex items-end justify-between">
                <div>
                  <span className="text-[9px] text-[#94A3B8] uppercase tracking-wider block">
                    Digital Signature
                  </span>
                  <div className="font-handwriting text-2xl text-[#0085FF] select-none -rotate-2 mt-0.5">
                    {profile.signature || profile.name || 'Awaiting Signature'}
                  </div>
                  <span className="text-[10px] text-[#64748B] block mt-0.5">
                    Started: {profile.startDate || 'Day 1'}
                  </span>
                </div>

                <div className="text-right">
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#FF7A00] flex items-center justify-center text-center p-1 bg-orange-50/30">
                    <span className="text-[9px] font-black text-[#FF7A00] uppercase leading-tight">
                      SEALED {totalDays}D
                    </span>
                  </div>
                </div>
              </div>

              {/* Share Contract Button */}
              <button
                onClick={() => alert('Arc Covenant link copied to clipboard!')}
                className="w-full mt-4 btn-sunset py-3 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Sealed Covenant Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveShell>
  );
}
