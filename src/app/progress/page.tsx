'use client';

import React, { useState } from 'react';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import { Sparkles } from 'lucide-react';
import { getUserProfile, calculateChallengeDay } from '@/lib/userProfile';

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'habits' | 'goals' | 'badges'>('overview');
  const profile = getUserProfile();
  const dayInfo = calculateChallengeDay(profile.startDate, profile.duration);

  const weeklyData = [
    { day: 'Mon', score: 80, isTargetMet: true },
    { day: 'Tue', score: 100, isTargetMet: true },
    { day: 'Wed', score: 60, isTargetMet: false },
    { day: 'Thu', score: 80, isTargetMet: true },
    { day: 'Fri', score: 100, isTargetMet: true },
    { day: 'Sat', score: 100, isTargetMet: true },
    { day: 'Sun', score: 80, isTargetMet: true },
  ];

  const currentTotal = dayInfo.currentDay;
  const habitsAnalytics = (profile.habits && profile.habits.length > 0 ? profile.habits : [
    { id: '1', title: 'Morning Cold Shower', category: 'BODY' },
    { id: '2', title: 'Strength Workout', category: 'BODY' },
    { id: '3', title: 'Deep Work Session', category: 'CAREER' },
    { id: '4', title: 'Read Non-Fiction', category: 'KNOWLEDGE' },
    { id: '5', title: 'Clean Nutrition', category: 'BODY' },
  ]).map((h, idx) => {
    const colors = ['#0085FF', '#FF7A00', '#7B61FF', '#10B981', '#F59E0B'];
    const completed = currentTotal === 1 ? 1 : Math.max(1, currentTotal - (idx % 2));
    const pct = Math.round((completed / currentTotal) * 100);
    return {
      name: h.title,
      category: h.category,
      completed,
      total: currentTotal,
      streak: `${completed}d`,
      pct,
      color: colors[idx % colors.length],
    };
  });

  const badges = [
    { title: 'Arc Initiated', desc: `Started your ${dayInfo.totalDays}-day Winter Arc`, icon: '🏔️', unlocked: true },
    { title: '7-Day Iron Will', desc: 'Maintained an unbroken 7-day streak', icon: '🔥', unlocked: dayInfo.currentDay >= 7 },
    { title: 'Cold Shower Beast', desc: '14 days of cold shower discipline', icon: '❄️', unlocked: dayInfo.currentDay >= 14 },
    { title: 'Deep Work Master', desc: 'Completed 20+ hours of focused flow', icon: '⚡', unlocked: dayInfo.currentDay >= 20 },
    { title: 'Halftime Titan', desc: `Reach Day ${Math.floor(dayInfo.totalDays / 2)} of your Arc`, icon: '🛡️', unlocked: dayInfo.currentDay >= Math.floor(dayInfo.totalDays / 2) },
    { title: 'Winter Legend', desc: `Completed the full ${dayInfo.totalDays}-day Arc`, icon: '👑', unlocked: dayInfo.isCompleted },
  ];

  return (
    <ResponsiveShell>
      <div className="w-full max-w-6xl mx-auto py-6 px-4 lg:px-8 pb-28 lg:pb-12 select-none">
        {/* ── HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
              ARC ANALYTICS & INSIGHTS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#0A192F] tracking-tight mt-0.5">
              Progress & Growth
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B] mt-0.5">
              Consistency is the bridge between goals and reality.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0085FF] text-xs font-bold border border-blue-100 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Day {dayInfo.currentDay} / {dayInfo.totalDays}</span>
          </div>
        </header>

        {/* ── TAB SELECTOR ── */}
        <div className="flex bg-slate-100/80 p-1 rounded-2xl gap-1 text-xs font-bold mt-4 mb-6">
          {(['overview', 'habits', 'goals', 'badges'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-[#0A192F] shadow-sm font-black'
                  : 'text-[#64748B] hover:text-[#0A192F]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* ── LEFT COLUMN: METRIC DIALS & 7-DAY CHART (lg:col-span-7) ── */}
            <div className="lg:col-span-7 space-y-6">
              {/* 3 Core Metric Dials */}
              <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">
                    WINTER PERFORMANCE METRICS
                  </span>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Top 5% Tier
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  <div className="p-3 sm:p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                    <div className="text-2xl sm:text-3xl font-black font-display text-[#0085FF]">82%</div>
                    <div className="text-[10px] sm:text-xs font-bold text-[#0A192F] mt-1">Consistency</div>
                    <div className="text-[9px] text-[#64748B]">Last 30 Days</div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
                    <div className="text-2xl sm:text-3xl font-black font-display text-[#FF7A00]">81%</div>
                    <div className="text-[10px] sm:text-xs font-bold text-[#0A192F] mt-1">Completion</div>
                    <div className="text-[9px] text-[#64748B]">Daily average</div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                    <div className="text-2xl sm:text-3xl font-black font-display text-[#7B61FF]">89%</div>
                    <div className="text-[10px] sm:text-xs font-bold text-[#0A192F] mt-1">Momentum</div>
                    <div className="text-[9px] text-[#64748B]">Growth velocity</div>
                  </div>
                </div>
              </div>

              {/* 7-Day Performance Chart */}
              <div className="arc-card p-6 bg-white border border-[#E8EEF5]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-[#0A192F] uppercase tracking-wider">
                      7-Day Execution Rate
                    </h3>
                    <p className="text-xs text-[#64748B]">Daily discipline score (Target: 80%+)</p>
                  </div>
                  <span className="text-xs font-extrabold text-[#0085FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Avg 85.7%
                  </span>
                </div>

                {/* Bar Chart Bars */}
                <div className="flex items-end justify-between h-44 pt-4 px-2 border-b border-slate-100">
                  {weeklyData.map((d) => {
                    const heightPct = `${d.score}%`;
                    return (
                      <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                        <span className="text-[10px] font-bold text-[#64748B]">{d.score}%</span>
                        <div className="w-full max-w-[32px] bg-slate-100 rounded-t-xl h-32 flex items-end justify-center overflow-hidden">
                          <div
                            style={{ height: heightPct }}
                            className={`w-full rounded-t-xl transition-all duration-500 ${
                              d.isTargetMet
                                ? 'bg-gradient-to-t from-[#0085FF] to-[#7B61FF]'
                                : 'bg-amber-400'
                            }`}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#0A192F] mt-1">{d.day}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-[#94A3B8] font-semibold mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-md bg-gradient-to-r from-[#0085FF] to-[#7B61FF]" />
                    <span>Target Met (80%+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-md bg-amber-400" />
                    <span>Minimum Day (&lt;80%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: HABITS & BADGES SNAPSHOT (lg:col-span-5) ── */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Habit Snapshot */}
              <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-[#0A192F] uppercase tracking-wider">
                    Top Disciplines
                  </h3>
                  <button
                    onClick={() => setActiveTab('habits')}
                    className="text-xs font-bold text-[#0085FF] hover:underline"
                  >
                    View All &gt;
                  </button>
                </div>

                <div className="space-y-3">
                  {habitsAnalytics.slice(0, 4).map((h) => (
                    <div key={h.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#0A192F]">{h.name}</span>
                        <span className="font-extrabold text-[#0085FF]">{h.pct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${h.pct}%`, backgroundColor: h.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges Preview */}
              <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-[#0A192F] uppercase tracking-wider">
                    Recent Badges (4 Unlocked)
                  </h3>
                  <button
                    onClick={() => setActiveTab('badges')}
                    className="text-xs font-bold text-[#0085FF] hover:underline"
                  >
                    View All &gt;
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {badges.slice(0, 4).map((b) => (
                    <div
                      key={b.title}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5"
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0A192F] truncate">{b.title}</div>
                        <span className="text-[9px] text-emerald-600 font-bold">Unlocked ✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: HABITS ── */}
        {activeTab === 'habits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
            {habitsAnalytics.map((h) => (
              <div key={h.name} className="arc-card p-5 bg-white border border-[#E8EEF5]">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-[#64748B]">
                      {h.category}
                    </span>
                    <h3 className="text-sm font-black text-[#0A192F] mt-1.5">{h.name}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Completed {h.completed} of {h.total} days
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black font-display text-[#0085FF]">{h.pct}%</span>
                    <div className="text-[10px] font-bold text-[#FF7A00] mt-0.5">{h.streak} streak 🔥</div>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${h.pct}%`, backgroundColor: h.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: GOALS ── */}
        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
            <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🏋️</span>
                  <div>
                    <h3 className="text-xs font-bold text-[#0A192F]">Get Fit & Build Muscle</h3>
                    <span className="text-[10px] text-[#64748B]">Target: 4x workouts / week</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#0085FF]">68%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                <div className="w-[68%] h-full bg-[#0085FF] rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-[#64748B] mt-2 font-medium">
                <span>14 workouts completed</span>
                <span className="text-emerald-600 font-bold">On Track</span>
              </div>
            </div>

            <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📖</span>
                  <div>
                    <h3 className="text-xs font-bold text-[#0A192F]">Read 10 Non-Fiction Books</h3>
                    <span className="text-[10px] text-[#64748B]">Target: 15 pages / day</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#7B61FF]">40%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                <div className="w-[40%] h-full bg-[#7B61FF] rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-[#64748B] mt-2 font-medium">
                <span>4 of 10 books finished</span>
                <span className="text-emerald-600 font-bold">Pacing 1.5 books / mo</span>
              </div>
            </div>

            <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">💻</span>
                  <div>
                    <h3 className="text-xs font-bold text-[#0A192F]">Deep Work & Career Launch</h3>
                    <span className="text-[10px] text-[#64748B]">Target: 90 min daily focused code</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#FF7A00]">74%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                <div className="w-[74%] h-full bg-[#FF7A00] rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-[#64748B] mt-2 font-medium">
                <span>25.5 hours locked in</span>
                <span className="text-orange-600 font-bold">Ahead of schedule</span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: BADGES ── */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-in fade-in duration-200">
            {badges.map((b) => (
              <div
                key={b.title}
                className={`arc-card p-4 text-center transition-all ${
                  b.unlocked
                    ? 'bg-white border-blue-100 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-3xl mb-1.5">{b.icon}</div>
                <h4 className="text-xs font-extrabold text-[#0A192F]">{b.title}</h4>
                <p className="text-[9px] text-[#64748B] mt-0.5 leading-tight">{b.desc}</p>
                <span
                  className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-2.5 ${
                    b.unlocked
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {b.unlocked ? 'Unlocked' : 'In Progress'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ResponsiveShell>
  );
}
