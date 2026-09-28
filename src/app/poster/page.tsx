'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, ArrowLeft, Shield, Flame, Dumbbell, Apple, Sparkles, Check } from 'lucide-react';

export default function PosterPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 print:p-0 print:bg-white print:text-black">
      {/* Screen-Only Header Bar */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/glowup"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Glow-Up</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7A00] to-[#0085FF] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg hover:opacity-95 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print A4 Wall Poster</span>
        </button>
      </div>

      {/* ── PRINTABLE POSTER CONTAINER (A4 Formatted) ── */}
      <div className="max-w-4xl mx-auto bg-white text-slate-950 p-6 sm:p-10 rounded-3xl shadow-2xl print:shadow-none print:p-6 print:rounded-none border border-slate-200">
        {/* Poster Top Banner */}
        <div className="border-b-4 border-slate-950 pb-4 mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-widest bg-slate-950 text-white px-2.5 py-0.5 rounded">
                WINTER ARC · 457 DAYS
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF7A00]">
                OCT 1, 2026 – DEC 31, 2027
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-slate-950 font-display">
              BRUCE · GLOW-UP 2027
            </h1>
            <p className="text-xs font-bold text-slate-600 mt-1">
              167 cm · 70 kg Skinny-Fat → 63 kg Greek God · 140g NK Veg Nutrition · Betnovate Recovery
            </p>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">TARGET PHYSIQUE</span>
            <span className="text-2xl sm:text-3xl font-black text-[#0085FF] leading-none">63.0 KG</span>
            <span className="text-[10px] font-extrabold text-emerald-600 block">10–12% LEAN MUSCLE</span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* LEFT COLUMN: DAILY SCHEDULE & NUTRITION */}
          <div className="space-y-4">
            {/* Daily Schedule Box */}
            <div className="border-2 border-slate-950 p-3.5 rounded-2xl">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-2.5 flex items-center justify-between">
                <span>⏰ Master Daily Routine</span>
                <span className="text-[9px] text-[#FF7A00]">NON-NEGOTIABLE</span>
              </h2>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="font-mono font-black text-slate-950 shrink-0">05:30 AM</span>
                  <span className="text-slate-700">Rise without snooze · 500ml water · Cold rinse</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-black text-[#0085FF] shrink-0">05:45 AM</span>
                  <span className="text-slate-700">AM Skin Shield: Ceramides + Niacinamide + SPF 50+</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-black text-[#FF7A00] shrink-0">06:30 AM</span>
                  <span className="text-slate-700">Gym Session (PPL Split · 60s Rest · Progressive Overload)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-black text-emerald-700 shrink-0">08:00 AM</span>
                  <span className="text-slate-700">Meal 1: Jolada Rotti + Shenga Chutney + Mosaru (28g P)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-black text-slate-950 shrink-0">10:30 AM</span>
                  <span className="text-slate-700">Meal 2: Sprouted Moong Kosambari + Lemon (12g P)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-black text-emerald-700 shrink-0">01:00 PM</span>
                  <span className="text-slate-700">Meal 3: Kadle Saaru / Ennegayi + 2 Jowar Roti + Taak (32g P)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-black text-slate-950 shrink-0">04:30 PM</span>
                  <span className="text-slate-700">Meal 4: 50g Roasted Peanuts / Soya Crunch (18g P)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-black text-emerald-700 shrink-0">07:30 PM</span>
                  <span className="text-slate-700">Meal 5: 200g Low-Fat Paneer + Ragi Mudde + Sambar (36g P)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-black text-purple-700 shrink-0">09:00 PM</span>
                  <span className="text-slate-700">PM Skin Protocol: Ice + 10% Azelaic + Rosehip Oil</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-black text-slate-950 shrink-0">09:30 PM</span>
                  <span className="text-slate-700">Haldi Doodh · Zero Screens · 8 Hours Deep Sleep</span>
                </div>
              </div>
            </div>

            {/* 140g Pure Veg Nutrition Blueprint */}
            <div className="border border-slate-300 p-3.5 rounded-2xl bg-slate-50">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-2 flex items-center justify-between">
                <span>🌾 140g NK Pure Veg Nutrition</span>
                <span className="text-[10px] font-black text-emerald-700">1,750 KCAL</span>
              </h2>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="font-black text-slate-900 block">Jolada Rotti (Jowar)</span>
                  <span className="text-slate-500">11g P/100g · Low GI · Zero Gluten</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="font-black text-slate-900 block">Shenga (Peanuts)</span>
                  <span className="text-slate-500">26g P/100g · Shengdana Chutney</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="font-black text-slate-900 block">Low-Fat Paneer</span>
                  <span className="text-slate-500">200g Daily · 36g Casein Protein</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="font-black text-slate-900 block">Sprouted Moong & Kadle</span>
                  <span className="text-slate-500">24g P/100g · Live Enzymes</span>
                </div>
              </div>
              <p className="text-[9px] text-red-600 font-bold mt-2">
                🚫 ZERO Maida · ZERO Bakery Biscuits · ZERO Refined Sugar · ZERO Oily Bhajji
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: WORKOUT SPLIT & SKIN PROTOCOL */}
          <div className="space-y-4">
            {/* PPL Weekly Split */}
            <div className="border-2 border-slate-950 p-3.5 rounded-2xl">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-2.5 flex items-center justify-between">
                <span>🏋️ PPL Hypertrophy Split</span>
                <span className="text-[9px] text-[#0085FF]">6 DAYS ON · 1 RECOVER</span>
              </h2>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-900">MON: Push A</span>
                  <span className="text-slate-600">Flat/Incline Press · Dips · Lateral Raises · Triceps</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-900">TUE: Pull A</span>
                  <span className="text-slate-600">Pull-ups / Lat Pulldown · DB Rows · Bicep Curls</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-900">WED: Legs & Core</span>
                  <span className="text-slate-600">Heavy Squats · Bulgarian Splits · RDL · Hanging Legs</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-900">THU: Push B</span>
                  <span className="text-slate-600">Incline DB Press · Arnold Press · Chest Fly · Pushups</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-900">FRI: Pull B</span>
                  <span className="text-slate-600">Chin-ups (Max) · T-Bar Row · Deadlift · Core Plank</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-900">SAT: Legs Power</span>
                  <span className="text-slate-600">Goblet Squats · Lunges · Jump Squats · Calves</span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="font-bold text-emerald-700">SUN: Active Recovery</span>
                  <span className="text-slate-600">Mobility Walk · Arc Review & Weight Log · Meal Prep</span>
                </div>
              </div>
            </div>

            {/* Betnovate-N Steroid Recovery Laws */}
            <div className="border border-slate-300 p-3.5 rounded-2xl bg-purple-50/50">
              <h2 className="text-xs font-black uppercase tracking-wider text-purple-950 border-b border-purple-200 pb-1 mb-2 flex items-center justify-between">
                <span>✨ Betnovate-N Recovery Code</span>
                <span className="text-[10px] font-black text-purple-700">BARRIER HEALING</span>
              </h2>
              <div className="space-y-1.5 text-[10.5px] text-slate-800">
                <p><strong>1. ZERO STEROIDS:</strong> Never apply Betnovate-N again. Endure rebound calmly.</p>
                <p><strong>2. SUNSCREEN LAW:</strong> UV Doux SPF 50+ PA++++ every morning without excuse.</p>
                <p><strong>3. CERAMIDE SHIELD:</strong> Repair lipid mortar before applying active ingredients.</p>
                <p><strong>4. AZELAIC ACID 10%:</strong> Applied nightly to suppress tyrosinase and fade PIH.</p>
                <p><strong>5. 4L WATER FLUSH:</strong> Flush inflammatory cytokines out through cellular hydration.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Commitment Oath & Signature Block */}
        <div className="mt-5 pt-4 border-t-2 border-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-display italic text-slate-900 font-bold">
              &ldquo;I conquered 92kg down to 70kg. These last 7kg to Greek God 63kg belong to me.&rdquo;
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Winter Arc Commitment · Day 1 through Day 457 · Zero Excuses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-handwriting text-2xl text-[#0085FF] block -mb-1">Bruce</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">VERIFIED ATHLETE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
