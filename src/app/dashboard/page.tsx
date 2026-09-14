'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { WORKOUTS } from '@/lib/data';

function ProgressRing({ percent, size = 80, stroke = 6, color = '#00D4FF' }: { percent: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
    </svg>
  );
}

const DEFAULT_HABITS = [
  { name: ' Cold shower at 6 AM', emoji: '🚿' },
  { name: ' 20 min morning stretch', emoji: '🧘' },
  { name: ' 3L water consumed', emoji: '💧' },
  { name: ' Complete AI workout', emoji: '💪' },
  { name: ' No cheat meals', emoji: '🥗' },
];

const AI_TIPS = [
  "Consistency beats intensity. Even 15 mins of movement today maintains your neural adaptation momentum.",
  "Cold baths trigger norepinephrine release, boosting focus and metabolic rate by up to 250%.",
  "Progressive overload isn't just about weight—increasing time under tension accelerates muscle hypertrophy.",
  "Hydration directly impacts protein synthesis. Drink 500ml water within 30 mins of waking up.",
];

export default function DashboardPage() {
  const { userData, firebaseUser } = useAuth();
  const [greeting, setGreeting] = useState('Good Morning');
  const [completedHabits, setCompletedHabits] = useState<Set<number>>(new Set([0, 1, 2]));

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const displayName = userData?.displayName || firebaseUser?.displayName || 'Athlete';
  const streak = userData?.streak ?? 3;
  const caloriesBurned = userData?.caloriesBurned ?? 420;
  const calorieGoal = userData?.calorieGoal ?? 600;
  const xp = userData?.xp ?? 850;
  const level = userData?.level ?? 'iron';

  const todayWorkout = WORKOUTS[0];
  const nextLevelXP = 1500;
  const xpProgress = Math.min(100, Math.round((xp / nextLevelXP) * 100));
  const todayTip = AI_TIPS[Math.floor(Date.now() / 86400000) % AI_TIPS.length];

  const weekDays = [
    { day: 'Mon', date: 9, active: true },
    { day: 'Tue', date: 10, active: true },
    { day: 'Wed', date: 11, active: true },
    { day: 'Thu', date: 12, active: true, isToday: true },
    { day: 'Fri', date: 13, active: false },
    { day: 'Sat', date: 14, active: false },
    { day: 'Sun', date: 15, active: false },
  ];

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>

        {/* ---- HEADER ---- */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.15rem' }}>{greeting} 👋</p>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>
              {displayName.split(' ')[0]}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="streak-badge">
              🔥 {streak}d
            </div>
            <div style={{
              width: '42px', height: '42px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 800, color: 'white',
              fontFamily: 'var(--font-display)',
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* ---- DESKTOP RESPONSIVE GRID WRAPPER ---- */}
        <div className="desktop-grid-split">

          {/* LEFT COLUMN (MAIN METRICS & WORKOUT) */}
          <div>
            {/* Level + XP Bar */}
            <div className="glass-card animate-fadeInUp delay-100" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', borderRadius: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>
                    {level === 'rookie' ? '🌱' : level === 'iron' ? '⚙️' : level === 'steel' ? '💠' : level === 'diamond' ? '💎' : '👑'}
                  </span>
                  <div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'capitalize' }}>{level}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Level</div>
                  </div>
                </div>
                <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--ice-blue)' }}>
                  {xp} / {nextLevelXP} XP
                </div>
              </div>
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>

            {/* Today's Workout */}
            <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-200">
              <div className="section-header">
                <div className="section-title">Today&apos;s Workout</div>
                <Link href="/workout" className="section-link">Change</Link>
              </div>
              <Link href="/workout" style={{ textDecoration: 'none' }}>
                <div className="challenge-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '18px',
                      background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.75rem', flexShrink: 0,
                    }}>
                      {todayWorkout.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="font-display" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'white' }}>{todayWorkout.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        {todayWorkout.duration} min · {todayWorkout.caloriesBurn} cal · {todayWorkout.exercises.length} exercises
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                        <span className="pill pill-blue">{todayWorkout.difficulty}</span>
                        <span className="pill pill-fire">{todayWorkout.category}</span>
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>▶</div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Today's Habits */}
            <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-300">
              <div className="section-header">
                <div className="section-title">Today&apos;s Habits</div>
                <Link href="/habits" className="section-link">See All</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {DEFAULT_HABITS.slice(0, 4).map((habit, i) => {
                  const done = completedHabits.has(i);
                  return (
                    <div key={i}
                      onClick={() => {
                        setCompletedHabits(prev => {
                          const next = new Set(prev);
                          if (next.has(i)) next.delete(i); else next.add(i);
                          return next;
                        });
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.875rem',
                        padding: '0.875rem 1rem',
                        background: done ? 'rgba(0,212,255,0.06)' : 'var(--bg-glass)',
                        border: `1px solid ${done ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{habit.emoji}</span>
                      <span className="font-display" style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: done ? 'var(--ice-blue)' : 'var(--text-primary)' }}>
                        {habit.name.replace(/^[^ ]+ /, '')}
                      </span>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        border: `2px solid ${done ? 'var(--ice-blue)' : 'rgba(255,255,255,0.1)'}`,
                        background: done ? 'var(--ice-blue)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000', fontSize: '0.8rem', fontWeight: 800,
                      }}>
                        {done ? '✓' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Calendar */}
            <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-200">
              <div className="section-header">
                <div className="section-title">This Week</div>
                <Link href="/history" className="section-link">View All</Link>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
                {weekDays.map((d, i) => (
                  <div key={i} style={{
                    flex: 1, textAlign: 'center', padding: '0.6rem 0.25rem', borderRadius: '14px',
                    background: d.isToday ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(123,47,190,0.15))' : 'transparent',
                    border: d.isToday ? '1.5px solid rgba(0,212,255,0.3)' : '1.5px solid transparent',
                  }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem', fontFamily: 'var(--font-display)' }}>{d.day}</div>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px', margin: '0 auto',
                      background: d.active ? (d.isToday ? 'var(--ice-blue)' : 'rgba(0,212,255,0.3)') : 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                      color: d.active ? (d.isToday ? '#000' : 'var(--ice-blue)') : 'var(--text-muted)',
                    }}>
                      {d.active ? '✓' : d.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (STATS, AI TIP & QUICK ACTIONS) */}
          <div>
            {/* Today's Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }} className="animate-fadeInUp delay-200">
              {[
                { label: 'Calories', value: `${caloriesBurned}`, unit: 'kcal', color: '#FF6B35', percent: Math.round((caloriesBurned/calorieGoal)*100) },
                { label: 'Workouts', value: '3', unit: 'done', color: '#7B2FBE', percent: 75 },
                { label: 'Habits', value: '4/5', unit: 'done', color: '#10B981', percent: 80 },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <ProgressRing percent={s.percent} size={64} stroke={5} color={s.color} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* AI Tip of the Day */}
            <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-400">
              <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(0,212,255,0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>🤖</span>
                  <span className="font-display" style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ice-blue)' }}>AI Tip of the Day</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{todayTip}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-400">
              <div className="section-title" style={{ marginBottom: '0.75rem' }}>Quick Actions</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { href: '/trainer', icon: '🎯', label: 'AI Trainer', sub: 'Live pose detection' },
                  { href: '/planner', icon: '🤖', label: 'AI Planner', sub: 'Weekly plan' },
                  { href: '/nutrition', icon: '🥗', label: 'Log Meal', sub: 'Track nutrition' },
                  { href: '/progress', icon: '📊', label: 'Progress', sub: 'View analytics' },
                ].map((action, i) => (
                  <Link key={i} href={action.href} style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ padding: '1rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{action.icon}</div>
                      <div className="font-display" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{action.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{action.sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      <BottomNav />
    </div>
  );
}
