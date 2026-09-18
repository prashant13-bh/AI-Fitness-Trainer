'use client';

import React, { useState } from 'react';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import { Award, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Shield, Flame, Check } from 'lucide-react';
import { getUserProfile } from '@/lib/userProfile';

export default function ReviewPage() {
  const profile = getUserProfile();
  const [winsText, setWinsText] = useState('Kept cold showers every single morning. Workouts were consistent.');
  const [leaksText, setLeaksText] = useState('Got pulled into phone browsing after lunch on Wednesday.');
  const [adjustmentText, setAdjustmentText] = useState('Leave phone in another room starting at 1:00 PM.');
  const [isLockedIn, setIsLockedIn] = useState(false);

  return (
    <ResponsiveShell>
      <div className="w-full max-w-6xl mx-auto py-6 px-4 lg:px-8 pb-28 lg:pb-12 select-none">
        {/* ── HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
              SUNDAY CALIBRATION RITUAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#0A192F] tracking-tight mt-0.5">
              Weekly Arc Review
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B] mt-0.5">
              Reflect honestly. Optimize relentlessly. Lock in week 3.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Week 2 of 13 Complete</span>
            </div>
          </div>
        </header>

        {/* ── RESPONSIVE DUAL COLUMN (lg:grid-cols-12) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* ── LEFT COLUMN: WEEK SCORECARD & METRICS (lg:col-span-5) ── */}
          <div className="lg:col-span-5 space-y-5">
            {/* Main Scorecard */}
            <div className="arc-card p-6 bg-white border border-[#E8EEF5] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#94A3B8]">
                  WEEK 2 DISCIPLINE SCORE
                </span>
                <span className="text-xs font-extrabold text-[#0085FF] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  6 of 7 Days &gt; 80%
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-display gradient-text">88%</span>
                <span className="text-sm font-bold text-[#64748B]">Execution standard met</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 block">Best Day</span>
                    <span className="text-xs font-black text-[#0A192F]">Friday (100%)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 block">Bottleneck</span>
                    <span className="text-xs font-black text-[#0A192F]">Wed (Phone distraction)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak & Momentum Card */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-[#FF7A00]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0A192F]">Unbroken 8-Day Streak</div>
                  <div className="text-[10px] text-[#64748B]">Earned "7-Day Iron Will" Badge</div>
                </div>
              </div>
              <span className="text-xs font-extrabold text-[#FF7A00] bg-orange-50 px-3 py-1 rounded-full">
                +150 XP
              </span>
            </div>

            {/* Philosophy quote */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-orange-50/60 border border-blue-100 text-center">
              <span className="font-handwriting text-xl text-[#0085FF] block">
                “Small adjustments, relentless compounding.”
              </span>
              <span className="text-[10px] text-[#64748B] font-bold mt-1 block">
                Winter Arc Protocol Review Standard
              </span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: 3-STEP GUIDED REFLECTION (lg:col-span-7) ── */}
          <div className="lg:col-span-7 space-y-5">
            <div className="arc-card p-6 bg-white border border-[#E8EEF5] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0A192F]">
                3-Step Guided Reflection
              </h3>

              {/* Step 1: Wins */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A192F] block">
                  1. What worked exceptionally well this week?
                </label>
                <textarea
                  rows={2}
                  value={winsText}
                  onChange={(e) => setWinsText(e.target.value)}
                  className="w-full text-xs sm:text-sm text-[#334155] p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0085FF]"
                />
              </div>

              {/* Step 2: Leaks */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A192F] block">
                  2. Where were the energy & discipline leaks?
                </label>
                <textarea
                  rows={2}
                  value={leaksText}
                  onChange={(e) => setLeaksText(e.target.value)}
                  className="w-full text-xs sm:text-sm text-[#334155] p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0085FF]"
                />
              </div>

              {/* Step 3: Actionable Adjustment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0A192F] block">
                  3. What single adjustment will you make for next week?
                </label>
                <textarea
                  rows={2}
                  value={adjustmentText}
                  onChange={(e) => setAdjustmentText(e.target.value)}
                  className="w-full text-xs sm:text-sm text-[#334155] p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0085FF]"
                />
              </div>

              {/* Submit / Lock-In Button */}
              {!isLockedIn ? (
                <button
                  onClick={() => setIsLockedIn(true)}
                  className="w-full btn-sunset py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md mt-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Lock In Week 2 Review (+100 XP)</span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-xs font-black block">Week 2 Review Sealed!</span>
                      <span className="text-[10px] text-emerald-700">
                        +100 XP added to your total protocol score.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-white px-3 py-1 rounded-full border border-emerald-200">
                    Week 3 Ready
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ResponsiveShell>
  );
}
