'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import { Flame, Check, Zap, Droplets, Dumbbell, Brain, BookOpen, Apple, ArrowRight } from 'lucide-react';

import { getUserProfile, ChallengeProfile, DEFAULT_PROFILE } from '@/lib/userProfile';
import { logHabitCompletion } from '@/lib/supabase/sync';

interface HabitItem {
  id: string;
  title: string;
  category: string;
  target: string;
  completed: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function TodayPage() {
  const [profile, setProfile] = useState<ChallengeProfile>(DEFAULT_PROFILE);

  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: '1',
      title: 'Morning Cold Shower & Hydration',
      category: 'BODY',
      target: '1 cold shower',
      completed: false,
      icon: Droplets,
    },
    {
      id: '2',
      title: 'Strength Workout / Conditioning',
      category: 'BODY',
      target: '45 min',
      completed: false,
      icon: Dumbbell,
    },
    {
      id: '3',
      title: 'Deep Work / High Output',
      category: 'CAREER',
      target: '90 min',
      completed: false,
      icon: Brain,
    },
    {
      id: '4',
      title: 'Read Non-Fiction',
      category: 'KNOWLEDGE',
      target: '15 pages',
      completed: false,
      icon: BookOpen,
    },
    {
      id: '5',
      title: 'Clean Nutrition & No Sugar',
      category: 'BODY',
      target: 'Zero refined sugar',
      completed: false,
      icon: Apple,
    },
  ]);

  useEffect(() => {
    const user = getUserProfile();
    setProfile(user);
    if (user.habits && user.habits.length > 0) {
      setHabits(
        user.habits.map((h) => {
          let icon = Zap;
          if (h.category === 'BODY') icon = Droplets;
          if (h.title.toLowerCase().includes('workout')) icon = Dumbbell;
          if (h.category === 'CAREER' || h.title.toLowerCase().includes('deep work')) icon = Brain;
          if (h.category === 'KNOWLEDGE' || h.title.toLowerCase().includes('read')) icon = BookOpen;
          if (h.title.toLowerCase().includes('nutrition')) icon = Apple;
          return {
            id: h.id,
            title: h.title,
            category: h.category,
            target: h.target,
            completed: false,
            icon,
          };
        })
      );
    }
  }, []);

  const [xpBonus, setXpBonus] = useState(0);

  const completedCount = habits.filter((h) => h.completed).length;
  const scorePercent = Math.round((completedCount / habits.length) * 100);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const next = !h.completed;
          if (next) {
            setXpBonus((xp) => xp + 30);
          }
          logHabitCompletion(id, next, new Date().toISOString().split('T')[0]);
          return { ...h, completed: next };
        }
        return h;
      })
    );
  };

  return (
    <ResponsiveShell>
      <div className="w-full max-w-6xl mx-auto py-6 px-4 lg:px-8 pb-28 lg:pb-12 select-none">
        {/* ── TOP HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-slate-200/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
              PROTOCOL EXECUTION
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#0A192F] tracking-tight mt-0.5">
              Good Morning, {profile.name.split(' ')[0] || 'Prashant'}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B] mt-0.5">
              Day <span className="text-[#0085FF] font-bold">17</span> of {profile.duration} ·{' '}
              <span className="text-[#FF7A00] font-bold">{profile.duration - 17} days remaining</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF7A00] shadow-sm">
              <Flame className="w-4 h-4 fill-[#FF7A00]" />
              <span className="text-xs font-black tracking-wide">8D STREAK</span>
            </div>
            <span className="text-xs font-bold text-[#64748B] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              Lvl 1 · {xpBonus} XP
            </span>
          </div>
        </header>

        {/* ── RESPONSIVE GRID (Mobile: 1 col | Desktop: 2 cols) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* ── LEFT COLUMN: PROTOCOL & HABITS (lg:col-span-7) ── */}
          <div className="lg:col-span-7 space-y-5">
            {/* DISCIPLINE SCORE CARD */}
            <div className="arc-card p-6 bg-white border border-[#E8EEF5] shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">
                    TODAY&apos;S DISCIPLINE SCORE
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl sm:text-5xl font-black font-display gradient-text">
                      {scorePercent}%
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#64748B]">
                      {completedCount} of {habits.length} completed
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0085FF] text-[10px] font-black">
                      +{habits.length * 30} XP Potential
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black">
                      Target: 80%+
                    </span>
                  </div>
                </div>

                {/* Circular Gauge Ring */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="transition-all duration-500 ease-out"
                      strokeDasharray={`${scorePercent}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="url(#score-gradient)"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <defs>
                      <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0085FF" />
                        <stop offset="50%" stopColor="#7B61FF" />
                        <stop offset="100%" stopColor="#FF7A00" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-sm sm:text-base font-black text-[#0A192F]">82%</span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-[#94A3B8] uppercase">
                      Consistency
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DAILY PROTOCOL HABITS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0A192F]">
                  Daily Protocol Disciplines ({habits.length})
                </h2>
                <span className="text-[10px] sm:text-xs text-[#94A3B8] font-bold">
                  Tap card to complete
                </span>
              </div>

              <div className="space-y-2.5">
                {habits.map((habit) => {
                  const Icon = habit.icon;
                  return (
                    <div
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id)}
                      className={`arc-card p-4 flex items-center justify-between cursor-pointer transition-all ${
                        habit.completed
                          ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                          : 'bg-white hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                            habit.completed
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-slate-100 text-[#0085FF]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <h3
                            className={`text-xs sm:text-sm font-bold tracking-tight ${
                              habit.completed ? 'line-through text-[#64748B]' : 'text-[#0A192F]'
                            }`}
                          >
                            {habit.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] sm:text-[10px] font-black tracking-wide text-[#0085FF] uppercase">
                              {habit.category}
                            </span>
                            <span className="text-[9px] text-[#94A3B8]">·</span>
                            <span className="text-[9px] sm:text-[10px] font-medium text-[#64748B]">
                              {habit.target}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all ${
                          habit.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                            : 'border-slate-300 bg-white hover:border-[#0085FF]'
                        }`}
                      >
                        {habit.completed && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: QUICK ACTIONS & INSIGHTS (lg:col-span-5) ── */}
          <div className="lg:col-span-5 space-y-5">
            {/* LOCK IN TODAY ACTION */}
            <Link
              href="/lock-in"
              id="btn-lock-in-main"
              className="w-full btn-sunset py-4 px-6 text-sm font-extrabold flex items-center justify-between shadow-xl shadow-orange-500/20 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Zap className="w-5 h-5 fill-white animate-bounce" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block">
                    ACTIVE FOCUS TIMER
                  </span>
                  <span className="text-sm font-black">LOCK IN TODAY (DAY 17)</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* TODAY'S PROMISE CARD */}
            <div className="arc-card p-5 bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-orange-50/50 border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0085FF]">
                  TODAY&apos;S PROMISE
                </span>
                <span className="text-[10px] font-bold text-[#64748B]">Daily Anchor</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-[#0A192F] italic leading-snug">
                “The standard you walk past is the standard you accept.”
              </p>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200/60 text-xs">
                <span className="text-[#64748B] font-semibold">Identity Focus:</span>
                <span className="font-extrabold text-[#0085FF] truncate max-w-[200px]">
                  {profile.identity}
                </span>
              </div>
            </div>

            {/* 7-DAY CONSISTENCY MINI WIDGET */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
                  7-Day Trajectory
                </span>
                <span className="text-[10px] font-extrabold text-[#0085FF] bg-blue-50 px-2 py-0.5 rounded-full">
                  85.7% Avg
                </span>
              </div>
              <div className="flex items-center justify-between gap-1.5 pt-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                  const isDone = idx !== 2;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                      <div
                        className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold ${
                          isDone
                            ? 'bg-gradient-to-tr from-[#0085FF] to-[#7B61FF] text-white shadow-sm'
                            : 'bg-amber-400 text-white'
                        }`}
                      >
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-[#64748B]">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI COACH MINI NUDGE */}
            <div className="arc-card p-4 bg-white border border-blue-100 flex items-start gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0085FF] flex items-center justify-center text-lg shrink-0">
                🤖
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0A192F]">AI Coach Tip</span>
                  <Link href="/coach" className="text-[10px] font-bold text-[#0085FF] hover:underline">
                    Chat &gt;
                  </Link>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                  You are 2 habits away from hitting your 80% daily gold standard today. Lock in your deep work block next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveShell>
  );
}
