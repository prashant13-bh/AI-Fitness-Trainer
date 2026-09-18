'use client';

import React, { useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import { Calendar as CalendarIcon, CheckCircle2, Shield, Share2, Sparkles, X } from 'lucide-react';

interface DayDetail {
  dayNum: number;
  score: number;
  status: 'completed' | 'minimum' | 'today' | 'upcoming';
  habitsDone: string[];
  note: string;
}

export default function ArcPage() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'contract'>('matrix');
  const [selectedDay, setSelectedDay] = useState<DayDetail | null>(null);

  // Generate 90 days of data
  const days: DayDetail[] = Array.from({ length: 90 }, (_, i) => {
    const dayNum = i + 1;
    if (dayNum < 17) {
      const isMin = dayNum === 3 || dayNum === 7 || dayNum === 13;
      return {
        dayNum,
        score: isMin ? 60 : 100,
        status: isMin ? 'minimum' : 'completed',
        habitsDone: isMin
          ? ['Morning Cold Shower', 'Strength Workout']
          : ['Morning Cold Shower', 'Strength Workout', 'Deep Work', 'Read Non-Fiction', 'Clean Nutrition'],
        note: isMin
          ? 'Tough recovery day, but kept the minimum standard.'
          : 'High energy, fully locked in and executed the entire protocol.',
      };
    }
    if (dayNum === 17) {
      return {
        dayNum: 17,
        score: 60,
        status: 'today',
        habitsDone: ['Morning Cold Shower', 'Strength Workout', 'Clean Nutrition'],
        note: 'In progress today. On track to reach 100% after deep work session.',
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] pb-28 pt-4 px-4 select-none">
      <div className="max-w-md mx-auto space-y-4">
        {/* ── HEADER ── */}
        <header className="pt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
            ARC ARCHITECTURE & 90-DAY MATRIX
          </span>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black font-display text-[#0A192F] tracking-tight">
              Winter Arc Matrix
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF7A00] text-xs font-bold border border-orange-100">
              <span>Day 17 / 90</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-[#64748B] mt-0.5">
            Nov 1, 2025 → Jan 29, 2026 · 73 Days Left
          </p>
        </header>

        {/* ── TABS ── */}
        <div className="flex bg-slate-100/80 p-1 rounded-2xl gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'matrix'
                ? 'bg-white text-[#0A192F] shadow-sm'
                : 'text-[#64748B] hover:text-[#0A192F]'
            }`}
          >
            90-Day Calendar Matrix
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'contract'
                ? 'bg-white text-[#0A192F] shadow-sm'
                : 'text-[#64748B] hover:text-[#0A192F]'
            }`}
          >
            Arc Contract 🔒
          </button>
        </div>

        {/* ── TAB: 90-DAY MATRIX ── */}
        {activeTab === 'matrix' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quick Summary Pill */}
            <div className="arc-card p-4 bg-white border border-[#E8EEF5] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Consistency</span>
                <div className="text-xl font-black font-display text-[#0085FF]">16 / 17 Days</div>
                <span className="text-[10px] text-emerald-600 font-bold">94% execution rate</span>
              </div>

              {/* Legend */}
              <div className="text-[9px] space-y-1 font-semibold">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Target Met (80%+)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Minimum Day</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0085FF] animate-pulse" />
                  <span>Today (Active)</span>
                </div>
              </div>
            </div>

            {/* 90-Day Grid */}
            <div className="arc-card p-4 bg-white border border-[#E8EEF5]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
                  Visual Consistency Grid
                </h3>
                <span className="text-[10px] text-[#64748B] font-bold">Tap any day</span>
              </div>

              <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
                {days.map((d) => {
                  let bgClass = 'bg-slate-100 text-[#94A3B8]';
                  if (d.status === 'completed') {
                    bgClass = 'bg-emerald-500 text-white shadow-sm';
                  } else if (d.status === 'minimum') {
                    bgClass = 'bg-amber-400 text-white shadow-sm';
                  } else if (d.status === 'today') {
                    bgClass = 'bg-gradient-to-tr from-[#0085FF] to-[#7B61FF] text-white shadow-md ring-2 ring-blue-300 animate-pulse';
                  }

                  return (
                    <button
                      key={d.dayNum}
                      onClick={() => setSelectedDay(d)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110 active:scale-95 ${bgClass}`}
                    >
                      {d.dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day Inspection Modal */}
            {selectedDay && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#E8EEF5] space-y-3 animate-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#0085FF] tracking-wider">
                        DAY INSPECTION
                      </span>
                      <h3 className="text-xl font-black text-[#0A192F]">
                        Day {selectedDay.dayNum} of 90
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedDay(null)}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-[#64748B]">Discipline Score:</span>
                    <span className="font-black text-sm text-[#0085FF]">{selectedDay.score}%</span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#0A192F] block mb-1.5">
                      Habits Completed:
                    </span>
                    {selectedDay.habitsDone.length > 0 ? (
                      <div className="space-y-1">
                        {selectedDay.habitsDone.map((h) => (
                          <div
                            key={h}
                            className="flex items-center gap-2 text-xs font-semibold text-[#475569] bg-emerald-50/60 p-2 rounded-xl border border-emerald-100"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#94A3B8] italic">No habits logged yet for this future date.</p>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#0A192F] block mb-1">
                      Daily Note / Reflection:
                    </span>
                    <p className="text-xs text-[#64748B] bg-slate-50 p-2.5 rounded-xl border border-slate-200 italic">
                      “{selectedDay.note}”
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: ARC CONTRACT ── */}
        {activeTab === 'contract' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="arc-card p-6 bg-white border-2 border-[#FED7AA] shadow-lg relative overflow-hidden">
              {/* Corner Seal Accent */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-bl from-[#FF7A00] to-[#7B61FF] rounded-full opacity-20 pointer-events-none" />

              <div className="text-center space-y-1 mb-4">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <span>SEALED & ACTIVE</span>
                </div>
                <h2 className="text-xl font-black font-display text-[#0A192F] tracking-tight">
                  THE WINTER ARC COVENANT
                </h2>
                <p className="text-[10px] text-[#64748B] tracking-wider uppercase font-semibold">
                  Valid: Nov 1, 2025 — Jan 29, 2026 (90 Days)
                </p>
              </div>

              <div className="space-y-3 text-xs text-[#475569] leading-relaxed border-t border-b border-slate-100 py-4">
                <p className="font-semibold text-[#0A192F]">
                  “I, Prashant Hiremath, solemnly commit to 90 consecutive days of uncompromising personal discipline and deliberate transformation.”
                </p>

                <div className="space-y-1 text-[11px]">
                  <div className="font-bold text-[#0A192F]">My Non-Negotiables:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[#64748B]">
                    <li>Zero cheap dopamine during high-output work hours</li>
                    <li>Morning cold showers & physical conditioning</li>
                    <li>Minimum 90 minutes of daily deep, uninterrupted focus</li>
                    <li>Daily evening protocol review and honesty in tracking</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px]">
                  <span className="font-bold text-[#0085FF]">Identity Statement:</span>
                  <p className="italic text-[#0A192F] mt-0.5">
                    “I am becoming disciplined, strong and focused.”
                  </p>
                </div>
              </div>

              {/* Signature Block */}
              <div className="pt-4 flex items-end justify-between">
                <div>
                  <span className="text-[9px] text-[#94A3B8] uppercase tracking-wider block">
                    Digital Signature
                  </span>
                  <div className="font-handwriting text-2xl text-[#0085FF] select-none -rotate-3 mt-1">
                    Prashant Hiremath
                  </div>
                  <span className="text-[9px] text-[#64748B] block">Date: Nov 1, 2025</span>
                </div>

                <div className="text-right">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#FF7A00] flex items-center justify-center text-center p-1">
                    <span className="text-[8px] font-black text-[#FF7A00] uppercase leading-tight">
                      SEALED 90D
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Contract Card */}
            <button
              onClick={() => alert('Contract Card copied to clipboard for sharing!')}
              className="w-full btn-sunset py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Sealed Contract Card</span>
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
