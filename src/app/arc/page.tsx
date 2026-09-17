'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/components/layout/BottomNav';

interface CalendarDay {
  dayNumber: number;
  dateStr: string;
  status: 'complete' | 'partial' | 'minimum' | 'missed' | 'today' | 'future';
  score?: number;
  habitsCompleted?: number;
  totalHabits?: number;
  journal?: string;
  mood?: number;
  isMilestone?: boolean;
}

interface ArcGoal {
  id: string;
  title: string;
  area: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

const MILESTONES = [7, 14, 21, 30, 45, 60, 75, 90];

export default function ArcPage() {
  const { user, userData } = useAuth();
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const arcDuration = 90;
  const currentDay = 17;

  // Goals
  const goals: ArcGoal[] = [
    { id: 'g-1', title: 'Body Recomposition & Sub-12% Fat', area: 'Body', currentValue: 14.5, targetValue: 12.0, unit: '%' },
    { id: 'g-2', title: 'Read 6 Self-Mastery Books', area: 'Knowledge', currentValue: 2, targetValue: 6, unit: 'books' },
    { id: 'g-3', title: 'Launch High-Ticket Digital Offer', area: 'Career', currentValue: 65, targetValue: 100, unit: '%' },
    { id: 'g-4', title: '90-Day Clean Diet Adherence', area: 'Body', currentValue: 16, targetValue: 90, unit: 'days' },
  ];

  // Generate 90-day calendar state
  const calendarDays = useMemo<CalendarDay[]>(() => {
    const days: CalendarDay[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (currentDay - 1));

    for (let i = 1; i <= arcDuration; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + (i - 1));
      const dateStr = d.toISOString().split('T')[0];

      let status: CalendarDay['status'] = 'future';
      let score: number | undefined = undefined;
      let habitsCompleted = 0;
      let totalHabits = 5;
      let journal = '';
      let mood = 4;

      if (i < currentDay) {
        // Past days simulation
        if (i === 4 || i === 11) {
          status = 'minimum';
          score = 0.5;
          habitsCompleted = 2;
          journal = 'Tough day at work, but kept the minimum promise.';
          mood = 2;
        } else if (i === 9) {
          status = 'missed';
          score = 0.2;
          habitsCompleted = 1;
          journal = 'Fell off today. Recommitting tomorrow.';
          mood = 1;
        } else {
          status = 'complete';
          score = 0.85 + (i % 3) * 0.05;
          habitsCompleted = 5;
          journal = 'Strong day. Kept every agreement.';
          mood = 4;
        }
      } else if (i === currentDay) {
        status = 'today';
        score = 0.75;
        habitsCompleted = 3;
      }

      days.push({
        dayNumber: i,
        dateStr,
        status,
        score,
        habitsCompleted,
        totalHabits,
        journal,
        mood,
        isMilestone: MILESTONES.includes(i),
      });
    }

    return days;
  }, [currentDay, arcDuration]);

  // Overall Consistency calculation
  const completedPastDays = calendarDays.filter(d => d.dayNumber < currentDay && (d.status === 'complete' || d.status === 'minimum'));
  const overallConsistency = Math.round((completedPastDays.length / (currentDay - 1)) * 100);

  const displayName = userData?.name || user?.user_metadata?.full_name || 'Warrior';
  const identityStatement = userData?.identity_statement || 'I am the disciplined, focused architect of my future.';

  return (
    <div className="app-container">
      <BottomNav />

      <main className="page-content" style={{ paddingBottom: '7rem' }}>
        {/* ── Top Header ── */}
        <header style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--ice-blue)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            THE 90-DAY PROTOCOL
          </div>
          <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
            Winter Arc Matrix
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Day <span style={{ color: 'white', fontWeight: 700 }}>{currentDay}</span> of {arcDuration} · {arcDuration - currentDay} Days Remaining
          </div>
        </header>

        {/* ── Identity Statement Banner ── */}
        <section className="glass-card" style={{
          padding: '1.25rem',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(123, 47, 190, 0.12) 100%)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ice-blue)' }}>
              IDENTITY STATEMENT
            </span>
            <span className="pill pill-blue" style={{ fontSize: '0.62rem', padding: '0.15rem 0.5rem' }}>
              NON-NEGOTIABLE
            </span>
          </div>
          <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', lineHeight: 1.4 }}>
            "{identityStatement}"
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Signed by {displayName} · Sealed until Day 90
          </div>
        </section>

        {/* ── Overall Stats Grid ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div className="glass-card" style={{ padding: '0.9rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Consistency
            </div>
            <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--ice-blue)', marginTop: '0.2rem' }}>
              {overallConsistency}%
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>
              Active Rate
            </div>
          </div>

          <div className="glass-card" style={{ padding: '0.9rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Streak
            </div>
            <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--fire-orange)', marginTop: '0.2rem' }}>
              8d
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>
              Best: 11d
            </div>
          </div>

          <div className="glass-card" style={{ padding: '0.9rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Next Phase
            </div>
            <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--neon-purple)', marginTop: '0.2rem' }}>
              Day 21
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>
              4d to Habit Lock
            </div>
          </div>
        </section>

        {/* ── 90-Day Interactive Calendar Grid ── */}
        <section className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: 0 }}>
                90-Day Execution Grid
              </h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Tap any day to view reflection and habits completed
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span title="Complete" style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#00D4FF', display: 'inline-block' }} />
              <span title="Minimum" style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#FFB300', display: 'inline-block' }} />
              <span title="Missed" style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#FF3B30', display: 'inline-block' }} />
              <span title="Future" style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', display: 'inline-block' }} />
            </div>
          </div>

          {/* Grid: 10 columns x 9 rows */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '0.4rem'
          }}>
            {calendarDays.map((day) => {
              let bg = 'rgba(255, 255, 255, 0.04)';
              let border = '1px solid rgba(255, 255, 255, 0.06)';
              let color = 'rgba(255, 255, 255, 0.3)';

              if (day.status === 'complete') {
                bg = 'linear-gradient(135deg, rgba(0, 212, 255, 0.7), rgba(0, 114, 255, 0.85))';
                border = '1px solid rgba(0, 212, 255, 0.9)';
                color = 'white';
              } else if (day.status === 'minimum') {
                bg = 'linear-gradient(135deg, rgba(255, 179, 0, 0.6), rgba(255, 107, 0, 0.8))';
                border = '1px solid rgba(255, 179, 0, 0.8)';
                color = 'white';
              } else if (day.status === 'missed') {
                bg = 'rgba(255, 59, 48, 0.25)';
                border = '1px solid rgba(255, 59, 48, 0.5)';
                color = '#ff6b6b';
              } else if (day.status === 'today') {
                bg = 'rgba(0, 212, 255, 0.15)';
                border = '2px solid #00D4FF';
                color = 'white';
              }

              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: '8px',
                    background: bg,
                    border: border,
                    color: color,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: day.status === 'today' || day.isMilestone ? 900 : 700,
                    cursor: 'pointer',
                    position: 'relative',
                    padding: 0,
                    transition: 'transform 0.15s ease',
                    boxShadow: day.status === 'today' ? '0 0 12px rgba(0,212,255,0.5)' : 'none'
                  }}
                >
                  <span>{day.dayNumber}</span>
                  {day.isMilestone && (
                    <span style={{
                      position: 'absolute',
                      top: '1px',
                      right: '1px',
                      fontSize: '0.45rem',
                      color: 'var(--sun-yellow)'
                    }}>
                      ★
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>★ Milestone Days (7, 14, 21, 30, 45, 60, 75, 90)</span>
            <span style={{ color: 'var(--ice-blue)', fontWeight: 600 }}>Day 17 Active</span>
          </div>
        </section>

        {/* ── Active Arc Goals ── */}
        <section style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: 0 }}>
              Arc Milestones & Goals
            </h2>
            <Link href="/today" style={{ fontSize: '0.75rem', color: 'var(--ice-blue)', textDecoration: 'none', fontWeight: 600 }}>
              + Manage
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {goals.map(goal => {
              // Calculate progress percent
              const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              return (
                <div key={goal.id} className="glass-card" style={{ padding: '1rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--ice-blue)', letterSpacing: '0.05em' }}>
                        {goal.area}
                      </span>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', marginTop: '0.15rem' }}>
                        {goal.title}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>
                      {progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    marginTop: '0.5rem'
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #00D4FF, #7B2FBE)',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    <span>Current: {goal.currentValue} {goal.unit}</span>
                    <span>Target: {goal.targetValue} {goal.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Day Detail Modal ── */}
        {selectedDay && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}>
            <div className="glass-card" style={{
              width: '100%',
              maxWidth: '400px',
              padding: '1.5rem',
              borderRadius: '20px',
              border: '1px solid rgba(0,212,255,0.3)',
              background: '#070d1a',
              animation: 'scaleIn 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="pill pill-blue" style={{ fontSize: '0.75rem' }}>
                  DAY {selectedDay.dayNumber} OF 90
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedDay.dateStr}
                </span>
              </div>

              <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white', margin: '0 0 0.5rem 0' }}>
                Status: {selectedDay.status.toUpperCase()}
              </h3>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '0.85rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Protocol Adherence:</span>
                  <span style={{ color: 'white', fontWeight: 700 }}>
                    {selectedDay.score ? `${Math.round(selectedDay.score * 100)}%` : 'Pending'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Habits Completed:</span>
                  <span style={{ color: 'white', fontWeight: 700 }}>
                    {selectedDay.habitsCompleted} / {selectedDay.totalHabits}
                  </span>
                </div>
              </div>

              {selectedDay.journal && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Reflection Note
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
                    "{selectedDay.journal}"
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedDay(null)}
                className="btn-primary"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '12px' }}
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
