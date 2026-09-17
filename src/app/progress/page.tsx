'use client';

import React, { useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'overview' | 'habits' | 'goals' | 'achievements';

const WEEK_DAYS = [
  { day: 'Mon', score: 100, status: 'complete' },
  { day: 'Tue', score: 100, status: 'complete' },
  { day: 'Wed', score: 80, status: 'complete' },
  { day: 'Thu', score: 50, status: 'minimum' },
  { day: 'Fri', score: 100, status: 'complete' },
  { day: 'Sat', score: 40, status: 'partial' },
  { day: 'Sun', score: 80, status: 'today' },
];

const HABIT_STATS = [
  { name: 'Morning Cold Shower & Water', area: 'Body', completionRate: 94, totalDays: 16, status: 'Elite' },
  { name: 'Strength Workout / Conditioning', area: 'Body', completionRate: 88, totalDays: 15, status: 'Strong' },
  { name: 'Deep Work / Skill Mastery', area: 'Career', completionRate: 82, totalDays: 14, status: 'Solid' },
  { name: 'Read Non-Fiction', area: 'Knowledge', completionRate: 76, totalDays: 13, status: 'Focus' },
  { name: 'No Sugar & Clean Nutrition', area: 'Body', completionRate: 88, totalDays: 15, status: 'Strong' },
];

const ACHIEVEMENTS = [
  { icon: '❄️', title: 'The First Frost', desc: 'Commenced the 90-Day Winter Arc', earned: true, date: 'Day 1' },
  { icon: '🔥', title: '7-Day Iron Chain', desc: 'Maintained 7 consecutive days of discipline', earned: true, date: 'Day 7' },
  { icon: '🛡️', title: 'The Shield Kept', desc: 'Protected streak using Minimum Day Protocol', earned: true, date: 'Day 11' },
  { icon: '⚡', title: '14-Day Resolute', desc: 'Reached the 2-week transformation horizon', earned: true, date: 'Day 14' },
  { icon: '🏆', title: 'Month of Iron', desc: 'Survive Day 30 with 80%+ consistency', earned: false },
  { icon: '👑', title: 'Forged in Winter', desc: 'Complete all 90 days and seal your new self', earned: false },
];

export default function ProgressPage() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const winterScore = 84; // Winter Score (0-100)
  const currentStreak = 8;
  const bestStreak = 11;
  const totalCompletedDays = 14;
  const totalArcDays = 90;
  const currentDay = 17;

  return (
    <div className="app-container">
      <BottomNav />

      <main className="page-content" style={{ paddingBottom: '7rem' }}>
        {/* ── Top Header ── */}
        <header style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--ice-blue)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            PERFORMANCE ANALYTICS
          </div>
          <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
            Winter Arc Progress
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Day {currentDay} of {totalArcDays} · Consistency over streaks
          </div>
        </header>

        {/* ── Navigation Tabs ── */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '0.25rem',
          marginBottom: '1.5rem',
          gap: '0.25rem'
        }}>
          {(['overview', 'habits', 'goals', 'achievements'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '0.6rem 0',
                borderRadius: '10px',
                background: activeTab === tab ? 'var(--ice-blue-dim)' : 'transparent',
                border: activeTab === tab ? '1px solid rgba(56, 189, 248, 0.3)' : 'none',
                color: activeTab === tab ? 'var(--ice-blue)' : 'var(--text-muted)',
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: '0.78rem',
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="grid-2col-desktop">
            {/* Left Column: Hero Score + Weekly Bar Chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Winter Score Hero */}
              <div className="glass-card" style={{
                padding: '1.5rem',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                borderLeft: '4px solid var(--ice-blue)'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    WINTER SCORE™
                  </div>
                  <div className="font-display" style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white', lineHeight: 1, margin: '0.3rem 0' }}>
                    {winterScore}
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/100</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Weighted protocol adherence: <span style={{ color: 'var(--ice-blue)', fontWeight: 700 }}>Optimal Range</span>
                  </div>
                </div>

                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', boxShadow: '0 8px 24px var(--ice-blue-glow)',
                  color: '#08090d'
                }}>
                  ❄️
                </div>
              </div>

              {/* Weekly Bar Graph */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 800, color: 'white', margin: 0 }}>
                      This Week's Discipline
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Daily scores & minimum days
                    </div>
                  </div>
                  <span className="pill pill-blue" style={{ fontSize: '0.65rem' }}>
                    Avg: 79%
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px', padding: '0 0.5rem' }}>
                  {WEEK_DAYS.map((d, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        {d.score}%
                      </div>
                      <div style={{
                        width: '24px',
                        height: `${d.score}px`,
                        maxHeight: '85px',
                        borderRadius: '6px',
                        background: d.status === 'minimum'
                          ? 'var(--grad-amber)'
                          : 'var(--grad-primary)',
                        transition: 'height 0.4s ease'
                      }} />
                      <div style={{ fontSize: '0.7rem', color: d.status === 'today' ? 'var(--ice-blue)' : 'var(--text-secondary)', fontWeight: d.status === 'today' ? 800 : 500 }}>
                        {d.day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Metrics Triad + Habit Overview List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Metrics Triad */}
              <div className="grid-3col-responsive">
                <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Consistency
                  </div>
                  <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--ice-blue)', marginTop: '0.2rem' }}>
                    82%
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>
                    Active Days
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Current Streak
                  </div>
                  <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--amber)', marginTop: '0.2rem' }}>
                    {currentStreak}d
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>
                    Best: {bestStreak}d
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Kept Days
                  </div>
                  <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', marginTop: '0.2rem' }}>
                    {totalCompletedDays}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>
                    Of {currentDay} Elapsed
                  </div>
                </div>
              </div>

              {/* Protocol Summary Card */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    TOP HABIT ADHERENCE
                  </div>
                  <button onClick={() => setActiveTab('habits')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}>
                    View All →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {HABIT_STATS.slice(0, 3).map((h, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                        <span style={{ color: 'white', fontWeight: 600 }}>{h.name}</span>
                        <span style={{ color: 'var(--ice-blue)', fontWeight: 700 }}>{h.completionRate}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${h.completionRate}%`, height: '100%', background: 'var(--grad-primary)' }} />
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {HABIT_STATS.map((h, i) => (
              <div key={i} className="glass-card" style={{ padding: '1rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--ice-blue)' }}>
                      {h.area}
                    </span>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', marginTop: '0.15rem' }}>
                      {h.name}
                    </div>
                  </div>
                  <span className="pill pill-blue" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                    {h.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', marginTop: '0.75rem' }}>
                  <div style={{ width: `${h.completionRate}%`, height: '100%', background: 'var(--grad-primary)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  <span>{h.totalDays} of 17 days completed</span>
                  <span style={{ color: 'white', fontWeight: 700 }}>{h.completionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: GOALS ── */}
        {activeTab === 'goals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="glass-card" style={{ padding: '1rem', borderRadius: '16px' }}>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Sub-12% Body Fat</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Started: 15.5% · Current: 14.5% · Goal: 12.0%</div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', marginTop: '0.6rem' }}>
                <div style={{ width: '45%', height: '100%', background: 'var(--grad-primary)' }} />
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', borderRadius: '16px' }}>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>Read 6 Mastery Books</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>2 of 6 books finished</div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', marginTop: '0.6rem' }}>
                <div style={{ width: '33%', height: '100%', background: 'var(--grad-primary)' }} />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: ACHIEVEMENTS ── */}
        {activeTab === 'achievements' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {ACHIEVEMENTS.map((a, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  opacity: a.earned ? 1 : 0.45,
                  border: a.earned ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                  background: a.earned ? 'var(--bg-glass)' : 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>{a.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'white' }}>{a.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.3 }}>
                  {a.desc}
                </div>
                {a.earned && (
                  <div style={{ fontSize: '0.65rem', color: 'var(--ice-blue)', fontWeight: 700, marginTop: '0.5rem' }}>
                    ✓ Unlocked {a.date}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
