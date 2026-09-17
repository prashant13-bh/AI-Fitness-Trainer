'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { calculateDayScore, calculateLevel, HabitScoreItem } from '@/lib/scoring';
import BottomNav from '@/components/layout/BottomNav';

interface HabitItem extends HabitScoreItem {
  name: string;
  area: string;
  targetUnit?: string;
  minimumUnit?: string;
  icon?: string;
}

const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'h-1',
    name: 'Morning Cold Shower & Hydration',
    area: 'Body',
    type: 'binary',
    status: 'pending',
    difficulty: 1,
    icon: '💧',
  },
  {
    id: 'h-2',
    name: 'Strength Workout / Conditioning',
    area: 'Body',
    type: 'duration',
    status: 'pending',
    value: 0,
    targetValue: 45,
    targetUnit: 'min',
    minimumValue: 15,
    minimumUnit: 'min',
    difficulty: 2,
    icon: '🏋️',
  },
  {
    id: 'h-3',
    name: 'Deep Work / High Output',
    area: 'Career',
    type: 'duration',
    status: 'pending',
    value: 0,
    targetValue: 90,
    targetUnit: 'min',
    minimumValue: 30,
    minimumUnit: 'min',
    difficulty: 3,
    icon: '🧠',
  },
  {
    id: 'h-4',
    name: 'Read Non-Fiction',
    area: 'Knowledge',
    type: 'quantity',
    status: 'pending',
    value: 0,
    targetValue: 15,
    targetUnit: 'pages',
    minimumValue: 5,
    minimumUnit: 'pages',
    difficulty: 1,
    icon: '📖',
  },
  {
    id: 'h-5',
    name: 'Clean Nutrition & No Sugar',
    area: 'Body',
    type: 'binary',
    status: 'pending',
    difficulty: 2,
    icon: '🥗',
  },
];

const DAILY_PROMISES = [
  "Show up even when you don't feel like it.",
  "Discipline is choosing between what you want now and what you want most.",
  "The standard you walk past is the standard you accept.",
  "The winter forged what the summer will celebrate.",
  "One promise kept today is better than ten planned for tomorrow.",
];

export default function TodayPage() {
  const { user, userData, updateUserData } = useAuth();
  const [habits, setHabits] = useState<HabitItem[]>(DEFAULT_HABITS);
  const [activeTabModal, setActiveTabModal] = useState<HabitItem | null>(null);
  const [modalInputVal, setModalInputVal] = useState<number>(0);
  const [showCheckinModal, setShowCheckinModal] = useState<boolean>(false);
  const [isLockedIn, setIsLockedIn] = useState<boolean>(false);
  const [mood, setMood] = useState<number>(4);
  const [energy, setEnergy] = useState<number>(8);
  const [journal, setJournal] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const arcDay = 17;
  const totalDays = 90;
  const daysLeft = totalDays - arcDay;

  // Load habits from localStorage on mount
  useEffect(() => {
    const todayKey = `winter_arc_habits_${new Date().toISOString().split('T')[0]}`;
    const saved = localStorage.getItem(todayKey);
    if (saved) {
      try {
        setHabits(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved habits', e);
      }
    }
    const checkinKey = `winter_arc_checkin_${new Date().toISOString().split('T')[0]}`;
    if (localStorage.getItem(checkinKey)) {
      setIsLockedIn(true);
    }
  }, []);

  // Save changes to localStorage and optionally sync to Supabase
  const saveHabits = (newHabits: HabitItem[]) => {
    setHabits(newHabits);
    const todayKey = `winter_arc_habits_${new Date().toISOString().split('T')[0]}`;
    localStorage.setItem(todayKey, JSON.stringify(newHabits));

    try {
      const supabase = getSupabaseClient();
      if (user && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('.supabase.co') && !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('YOUR_PROJECT')) {
        const todayStr = new Date().toISOString().split('T')[0];
        newHabits.forEach(async (h) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('habit_logs') as any).upsert({
            user_id: user.id,
            arc_id: user.id,
            habit_id: h.id,
            date: todayStr,
            status: h.status,
            value: h.value ?? 0,
            target_value: h.targetValue ?? null,
            xp_earned: h.status === 'complete' ? 10 * (h.difficulty ?? 1) : 0,
            completed_at: h.status === 'complete' ? new Date().toISOString() : null,
          }, { onConflict: 'habit_id,date' });
        });
      }
    } catch {
      // Offline fallback handles it
    }
  };

  // Compute live score
  const scoreResult = useMemo(() => {
    return calculateDayScore(habits, arcDay % 7 === 0);
  }, [habits, arcDay]);

  const levelInfo = useMemo(() => {
    const currentXp = (userData?.xp ?? 340) + scoreResult.xpEarned;
    return calculateLevel(currentXp);
  }, [userData?.xp, scoreResult.xpEarned]);

  const displayName = userData?.name || user?.user_metadata?.full_name || 'Warrior';
  const identityStatement = userData?.identity_statement || 'I am forging the disciplined, unstoppable version of myself.';

  const handleToggleHabit = (id: string) => {
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      if (h.type === 'binary') {
        const nextStatus = h.status === 'complete' ? 'pending' : 'complete';
        return { ...h, status: nextStatus as HabitItem['status'] };
      } else {
        setActiveTabModal(h);
        setModalInputVal(h.value ?? (h.status === 'complete' ? h.targetValue ?? 0 : 0));
        return h;
      }
    });
    saveHabits(updated);
  };

  const handleApplyMinimum = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      const isCurrentlyMin = h.status === 'minimum';
      return {
        ...h,
        status: (isCurrentlyMin ? 'pending' : 'minimum') as HabitItem['status'],
        value: isCurrentlyMin ? 0 : (h.minimumValue ?? 1)
      };
    });
    saveHabits(updated);
    showNotice(habits.find(h => h.id === id)?.status === 'minimum' ? 'Minimum reset' : 'Minimum Day logged. Promise kept! 🛡️');
  };

  const handleSaveModal = () => {
    if (!activeTabModal) return;
    const target = activeTabModal.targetValue ?? 1;
    const min = activeTabModal.minimumValue ?? 0;
    let newStatus: HabitItem['status'] = 'pending';

    if (modalInputVal >= target) {
      newStatus = 'complete';
    } else if (modalInputVal >= min && min > 0) {
      newStatus = 'minimum';
    } else if (modalInputVal > 0) {
      newStatus = 'partial';
    }

    const updated = habits.map(h => {
      if (h.id !== activeTabModal.id) return h;
      return {
        ...h,
        value: modalInputVal,
        status: newStatus
      };
    });

    saveHabits(updated);
    setActiveTabModal(null);
    showNotice(`${activeTabModal.name}: ${modalInputVal} ${activeTabModal.targetUnit || ''} recorded`);
  };

  const handleLockInSubmit = async () => {
    setIsLockedIn(true);
    setShowCheckinModal(false);
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(`winter_arc_checkin_${todayStr}`, JSON.stringify({
      mood,
      energy,
      journal,
      score: scoreResult.dailyScore,
      xp: scoreResult.xpEarned,
      timestamp: new Date().toISOString()
    }));

    try {
      if (updateUserData && userData) {
        await updateUserData({
          xp: (userData.xp ?? 340) + scoreResult.xpEarned,
        });
      }
    } catch {
      // handled
    }

    showNotice(`🔥 Day ${arcDay} Locked In! +${scoreResult.xpEarned} XP earned.`);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const todayPromise = DAILY_PROMISES[arcDay % DAILY_PROMISES.length];

  // Circle progress calculation
  const circleRadius = 52;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (scoreResult.dailyScore * circumference);

  return (
    <div className="app-container">
      <BottomNav />

      <main className="page-content">
        {/* Toast Notification */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--grad-primary)',
            color: '#06090e',
            padding: '0.65rem 1.25rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 800,
            zIndex: 9999,
            boxShadow: '0 8px 24px var(--ice-blue-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeInUp 0.3s ease'
          }}>
            <span>✨</span>
            <span>{notification}</span>
          </div>
        )}

        {/* ── Top Header ── */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--ice-blue)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              PROTOCOL EXECUTION
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
              Good Morning, {displayName}
            </h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Day <span style={{ color: 'white', fontWeight: 700 }}>{arcDay}</span> of {totalDays} · <span style={{ color: 'var(--ice-blue)', fontWeight: 600 }}>{daysLeft} days remaining</span>
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span className="pill pill-amber" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
              🔥 8d Streak
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Lvl {levelInfo.level} · {levelInfo.currentLevelXp} XP
            </div>
          </div>
        </header>

        {/* ── Main Responsive Grid (2-Column Desktop Command Center) ── */}
        <div className="grid-2col-desktop">
          {/* Left Column: Discipline Score Hero + Lock In Button + Identity Promise */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* ── Daily Hero Ring Card ── */}
            <section className="glass-card" style={{
              padding: 'clamp(1.2rem, 3vw, 1.75rem)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Left stats */}
              <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ice-blue)', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
                  Today's Discipline Score
                </div>
                <div className="font-display" style={{ fontSize: 'clamp(2.4rem, 5vw, 3rem)', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                  {Math.round(scoreResult.dailyScore * 100)}%
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>{scoreResult.completedCount} of {habits.length} completed</span>
                  {scoreResult.isMinimumDay && (
                    <span style={{ color: 'var(--amber)', fontWeight: 700 }}>• Minimum Day Active</span>
                  )}
                </div>

                <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.6rem', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                    ⚡ +{scoreResult.xpEarned} XP Today
                  </span>
                  <span style={{ fontSize: '0.75rem', background: 'var(--ice-blue-dim)', padding: '0.25rem 0.6rem', borderRadius: '8px', color: 'var(--ice-blue)', fontWeight: 600 }}>
                    Target: 80%+
                  </span>
                </div>
              </div>

              {/* Right SVG Circle */}
              <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0, margin: '0 auto' }}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    fill="none"
                    stroke="url(#glacierGradient)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                  <defs>
                    <linearGradient id="glacierGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>
                    {Math.round(scoreResult.dailyScore * 100)}%
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Consistency
                  </span>
                </div>
              </div>
            </section>

            {/* ── Lock In Today Button ── */}
            <section>
              <button
                onClick={() => setShowCheckinModal(true)}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  fontSize: '1rem',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  background: isLockedIn
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'var(--grad-primary)',
                  color: isLockedIn ? '#ffffff' : '#08090d',
                  boxShadow: isLockedIn
                    ? '0 6px 20px rgba(16, 185, 129, 0.25)'
                    : '0 6px 24px var(--ice-blue-glow)'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{isLockedIn ? '✓' : '⚡'}</span>
                <span>{isLockedIn ? `DAY ${arcDay} LOCKED IN (COMPLETED)` : `LOCK IN TODAY (DAY ${arcDay})`}</span>
              </button>
            </section>

            {/* ── Today's Promise & Identity ── */}
            <section className="glass-card" style={{
              padding: '1.25rem',
              borderRadius: '16px',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ice-blue)', marginBottom: '0.4rem' }}>
                TODAY'S PROMISE
              </div>
              <p style={{
                fontSize: '0.98rem',
                fontStyle: 'italic',
                color: 'white',
                margin: '0 0 0.75rem 0',
                lineHeight: 1.5,
                fontWeight: 500
              }}>
                "{todayPromise}"
              </p>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Identity Focus:</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--ice-blue)', fontWeight: 600 }}>
                  {identityStatement}
                </span>
              </div>
            </section>
          </div>

          {/* Right Column: Habits List Section ── */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Daily Protocol</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>({habits.length})</span>
              </h2>

              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tap to complete</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {habits.map((habit) => {
                const isDone = habit.status === 'complete';
                const isMin = habit.status === 'minimum';

                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleHabit(habit.id)}
                    style={{
                      background: isDone
                        ? 'rgba(56, 189, 248, 0.08)'
                        : isMin
                        ? 'var(--amber-dim)'
                        : 'var(--bg-card)',
                      border: `1px solid ${
                        isDone
                          ? 'rgba(56, 189, 248, 0.35)'
                          : isMin
                          ? 'rgba(245, 158, 11, 0.35)'
                          : 'var(--border-subtle)'
                      }`,
                      borderRadius: '16px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isDone ? '0 4px 16px rgba(56, 189, 248, 0.1)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                      {/* Status Checkbox / Icon */}
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: isDone
                          ? 'var(--grad-primary)'
                          : isMin
                          ? 'var(--grad-amber)'
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isDone || isMin ? 'none' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        color: isDone ? '#08090d' : 'white',
                        fontWeight: 900,
                        flexShrink: 0,
                        transition: 'all 0.15s ease'
                      }}>
                        {isDone ? '✓' : isMin ? '🛡️' : habit.icon || '○'}
                      </div>

                      {/* Habit Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          color: isDone ? 'white' : 'var(--text-primary)',
                          lineHeight: 1.3,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {habit.name}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.65rem',
                            padding: '0.12rem 0.45rem',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            fontWeight: 700
                          }}>
                            {habit.area}
                          </span>

                          {habit.targetValue && (
                            <span style={{ fontSize: '0.72rem', color: isDone ? 'var(--ice-blue)' : 'var(--text-muted)' }}>
                              {habit.value ?? 0} / {habit.targetValue} {habit.targetUnit}
                            </span>
                          )}

                          {isMin && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--amber)', fontWeight: 700 }}>
                              Minimum Day (50%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                      {!isDone && (
                        <button
                          onClick={(e) => handleApplyMinimum(habit.id, e)}
                          title="Log minimum requirement to protect streak"
                          style={{
                            background: isMin ? 'var(--amber-dim)' : 'rgba(255, 255, 255, 0.04)',
                            border: `1px solid ${isMin ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'}`,
                            color: isMin ? 'var(--amber)' : 'var(--text-muted)',
                            borderRadius: '8px',
                            padding: '0.35rem 0.6rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <span>🛡️</span>
                          <span>Min</span>
                        </button>
                      )}

                      {habit.type !== 'binary' && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0 0.25rem' }}>
                          ✎
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ── Modal: Quantity / Duration Input ── */}
        {activeTabModal && (
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
              maxWidth: '380px',
              padding: '1.5rem',
              borderRadius: '20px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              animation: 'fadeInUp 0.2s ease'
            }}>
              <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', margin: '0 0 0.5rem 0' }}>
                Log {activeTabModal.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Target: {activeTabModal.targetValue} {activeTabModal.targetUnit} · Minimum: {activeTabModal.minimumValue ?? 0} {activeTabModal.targetUnit}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Amount Completed ({activeTabModal.targetUnit})
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => setModalInputVal(Math.max(0, modalInputVal - 5))}
                    style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: 'white', fontSize: '1.2rem', cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={modalInputVal}
                    onChange={(e) => setModalInputVal(Number(e.target.value))}
                    className="input-field"
                    style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 800 }}
                  />
                  <button
                    onClick={() => setModalInputVal(modalInputVal + 5)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: 'white', fontSize: '1.2rem', cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setActiveTabModal(null)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModal}
                  className="btn-primary"
                  style={{ flex: 2, padding: '0.75rem' }}
                >
                  Save Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal: Lock In Check-in ── */}
        {showCheckinModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}>
            <div className="glass-card" style={{
              width: '100%',
              maxWidth: '420px',
              padding: '1.75rem',
              borderRadius: '24px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2rem' }}>⚡</span>
                <h3 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', margin: '0.25rem 0' }}>
                  Lock In Day {arcDay}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Reflect, record your metrics, and cement today's progress into the Arc.
                </p>
              </div>

              {/* Day Score Summary */}
              <div style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Calculated Score
                  </div>
                  <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>
                    {Math.round(scoreResult.dailyScore * 100)}%
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    XP To Award
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ice-blue)' }}>
                    +{scoreResult.xpEarned} XP
                  </div>
                </div>
              </div>

              {/* Mood selector */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
                  Today's Mental State (1-5)
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.4rem' }}>
                  {[
                    { val: 1, icon: '😫', label: 'Rough' },
                    { val: 2, icon: '😕', label: 'Tough' },
                    { val: 3, icon: '😐', label: 'Steady' },
                    { val: 4, icon: '🙂', label: 'Strong' },
                    { val: 5, icon: '⚡', label: 'Beast' },
                  ].map(m => (
                    <button
                      key={m.val}
                      onClick={() => setMood(m.val)}
                      style={{
                        flex: 1,
                        padding: '0.65rem 0.2rem',
                        borderRadius: '12px',
                        background: mood === m.val ? 'var(--ice-blue-dim)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${mood === m.val ? 'var(--ice-blue)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{m.icon}</span>
                      <span style={{ fontSize: '0.62rem', color: mood === m.val ? 'var(--ice-blue)' : 'var(--text-muted)', fontWeight: 700 }}>
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level Slider */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Energy Level
                  </label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--ice-blue)' }}>
                    {energy} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--ice-blue)' }}
                />
              </div>

              {/* Reflection Journal */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>
                  Daily Reflection Note
                </label>
                <textarea
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  placeholder="What was your biggest win today? What tested your discipline?"
                  className="input-field"
                  rows={3}
                  style={{ width: '100%', resize: 'none', fontSize: '0.85rem', lineHeight: 1.4 }}
                />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setShowCheckinModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '0.85rem' }}
                >
                  Close
                </button>
                <button
                  onClick={handleLockInSubmit}
                  className="btn-primary"
                  style={{ flex: 2, padding: '0.85rem' }}
                >
                  ⚡ Confirm Lock In
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
