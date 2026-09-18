'use client';

import React, { useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import { Award, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function ReviewPage() {
  const [winsText, setWinsText] = useState('Kept cold showers every single morning. Workouts were consistent.');
  const [leaksText, setLeaksText] = useState('Got pulled into phone browsing after lunch on Wednesday.');
  const [adjustmentText, setAdjustmentText] = useState('Leave phone in another room starting at 1:00 PM.');
  const [isLockedIn, setIsLockedIn] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] pb-28 pt-4 px-4 select-none">
      <div className="max-w-md mx-auto space-y-4">
        {/* ── HEADER ── */}
        <header className="pt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
            SUNDAY CALIBRATION RITUAL
          </span>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black font-display text-[#0A192F] tracking-tight">
              Weekly Arc Review
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Week 2 of 13</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-[#64748B] mt-0.5">
            Reflect honestly. Optimize relentlessly.
          </p>
        </header>

        {/* ── WEEK SCORECARD ── */}
        <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase text-[#94A3B8]">
              WEEK 2 EXECUTION SCORE
            </span>
            <span className="text-xs font-extrabold text-[#0085FF] bg-blue-50 px-2 py-0.5 rounded-full">
              6 of 7 Days &gt; 80%
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display gradient-text">88%</span>
            <span className="text-xs font-bold text-[#64748B]">Excellent momentum</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-emerald-700 block">Best Day</span>
                <span className="text-xs font-black text-[#0A192F]">Friday (100%)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-amber-700 block">Bottleneck</span>
                <span className="text-xs font-black text-[#0A192F]">Wed (Phone distraction)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3-STEP GUIDED REFLECTION ── */}
        <div className="space-y-3">
          <div className="arc-card p-4 bg-white border border-[#E8EEF5]">
            <label className="text-xs font-black text-[#0A192F] block mb-1">
              1. What worked exceptionally well this week?
            </label>
            <textarea
              rows={2}
              value={winsText}
              onChange={(e) => setWinsText(e.target.value)}
              className="w-full text-xs text-[#475569] p-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0085FF]"
            />
          </div>

          <div className="arc-card p-4 bg-white border border-[#E8EEF5]">
            <label className="text-xs font-black text-[#0A192F] block mb-1">
              2. Where did energy or discipline leak?
            </label>
            <textarea
              rows={2}
              value={leaksText}
              onChange={(e) => setLeaksText(e.target.value)}
              className="w-full text-xs text-[#475569] p-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="arc-card p-4 bg-white border border-[#E8EEF5]">
            <label className="text-xs font-black text-[#0A192F] block mb-1">
              3. What is your one non-negotiable adjustment for Week 3?
            </label>
            <textarea
              rows={2}
              value={adjustmentText}
              onChange={(e) => setAdjustmentText(e.target.value)}
              className="w-full text-xs text-[#475569] p-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#7B61FF]"
            />
          </div>
        </div>

        {/* ── LOCK IN WEEK 3 ── */}
        {isLockedIn ? (
          <div className="arc-card p-4 bg-emerald-50 border border-emerald-200 text-center space-y-1 animate-in zoom-in-95">
            <span className="text-2xl">🎉</span>
            <h4 className="text-sm font-black text-emerald-800">Week 3 Locked In & Certified!</h4>
            <p className="text-[11px] text-emerald-700">
              Ready to execute Monday morning. Keep the momentum high.
            </p>
          </div>
        ) : (
          <button
            onClick={() => setIsLockedIn(true)}
            className="w-full btn-sunset py-4 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <span>Lock In Week 3 Protocol →</span>
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
