'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { WORKOUTS, DEFAULT_HABITS } from '@/lib/data';
import { getUserLevel, LEVEL_THRESHOLDS, getNextLevelXP } from '@/lib/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function ProgressRing({ percent, size = 80, stroke = 7, color = '#00D4FF' }: { percent: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}

const AI_TIPS = [
  "❄️ Cold showers after workouts reduce muscle soreness by 40%. Winter warriors embrace the cold!",
  "💡 Compound movements (squats, push-ups) burn 3x more calories than isolation exercises.",
  "🥗 Eating protein within 30 minutes post-workout maximizes muscle protein synthesis.",
  "🧠 Visualization before a workout can increase strength output by up to 15%.",
  "😴 Growth hormone peaks during deep sleep. 7-9 hours = free gains.",
  "🔥 HIIT workouts keep your metabolism elevated for 24 hours after training.",
  "💧 Even 2% dehydration can reduce workout performance by 10-20%. Stay hydrated!",
];

export default function DashboardPage() {
  const router = useRouter();
  const { userData, firebaseUser, loading } = useAuth();
  const [todayTip] = useState(() => AI_TIPS[new Date().getDay() % AI_TIPS.length]);
  const [completedHabits, setCompletedHabits] = useState<Set<number>>(new Set());

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const displayName = userData?.displayName || firebaseUser?.displayName || 'Athlete';
  const xp = userData?.xp ?? 120;
  const streak = userData?.streak ?? 3;
  const level = getUserLevel(xp);
  const nextLevelXP = getNextLevelXP(level);
  const currentLevelXP = LEVEL_THRESHOLDS[level];
  const xpProgress = Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return { day: DAYS[d.getDay()], date: d.getDate(), isToday: i === 6, active: i < 4 };
  });

  const todayWorkout = WORKOUTS[0];
  const calorieGoal = 500;
  const caloriesBurned = 280;

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/login');
    }
  }, [loading, firebaseUser, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: '#060A14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }} className="animate-float">❄️</div>
          <div className="font-display" style={{ color: 'var(--ice-blue)', fontWeight: 700 }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      {/* Page Content */}
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>

        {/* ---- HEADER ---- */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.15rem' }}>{greeting} 👋</p>
            <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
              {displayName.split(' ')[0]}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Streak */}
            <div className="streak-badge">
              🔥 {streak}d
            </div>
            {/* Avatar */}
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

        {/* ---- LEVEL + XP BAR ---- */}
        <div className="glass-card animate-fadeInUp delay-100" style={{ padding: '1rem 1.25rem', marginBottom: '1rem', borderRadius: '18px' }}>
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

        {/* ---- WEEKLY CALENDAR ---- */}
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

        {/* ---- TODAY'S STATS ---- */}
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

        {/* ---- TODAY'S WORKOUT ---- */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-300">
          <div className="section-header">
            <div className="section-title">Today's Workout</div>
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

        {/* ---- HABITS QUICK VIEW ---- */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-300">
          <div className="section-header">
            <div className="section-title">Today's Habits</div>
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

        {/* ---- AI TIP OF THE DAY ---- */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-400">
          <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(0,212,255,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🤖</span>
              <span className="font-display" style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ice-blue)' }}>AI Tip of the Day</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{todayTip}</p>
          </div>
        </div>

        {/* ---- QUICK ACTIONS ---- */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-400">
          <div className="section-title" style={{ marginBottom: '0.75rem' }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { href: '/trainer', icon: '🎯', label: 'AI Trainer', sub: 'Live pose detection', color: '#00D4FF' },
              { href: '/planner', icon: '🤖', label: 'AI Planner', sub: 'Generate weekly plan', color: '#7B2FBE' },
              { href: '/nutrition', icon: '🥗', label: 'Log Meal', sub: 'Track nutrition', color: '#10B981' },
              { href: '/progress', icon: '📊', label: 'Progress', sub: 'View analytics', color: '#F59E0B' },
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

      <BottomNav />
    </div>
  );
}
