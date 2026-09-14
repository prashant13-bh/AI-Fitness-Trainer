'use client';

import BottomNav from '@/components/layout/BottomNav';
import { WORKOUTS } from '@/lib/data';

const SESSIONS = [
  { date: 'Aug 31, 2026', time: '07:30 AM', workout: WORKOUTS[0], duration: 32, calories: 265, reps: 142, mood: 5 },
  { date: 'Aug 30, 2026', time: '07:15 AM', workout: WORKOUTS[2], duration: 42, calories: 310, reps: 115, mood: 4 },
  { date: 'Aug 28, 2026', time: '06:45 AM', workout: WORKOUTS[4], duration: 20, calories: 340, reps: 98, mood: 4 },
  { date: 'Aug 27, 2026', time: '08:00 AM', workout: WORKOUTS[1], duration: 47, calories: 230, reps: 130, mood: 5 },
  { date: 'Aug 25, 2026', time: '07:00 AM', workout: WORKOUTS[3], duration: 27, calories: 185, reps: 160, mood: 3 },
  { date: 'Aug 23, 2026', time: '06:30 AM', workout: WORKOUTS[5], duration: 38, calories: 210, reps: 90, mood: 4 },
];

const MOOD_EMOJIS = ['','😞','😕','😐','😊','🤩'];

export default function HistoryPage() {
  const totalWorkouts = SESSIONS.length;
  const totalCalories = SESSIONS.reduce((s,w) => s + w.calories, 0);
  const totalMinutes = SESSIONS.reduce((s,w) => s + w.duration, 0);
  const totalReps = SESSIONS.reduce((s,w) => s + w.reps, 0);

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Completed Workouts</p>
          <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
            <span className="gradient-text">Session History</span>
          </h1>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="desktop-grid-split">
          {/* Left Column: Session Timeline List */}
          <div className="animate-fadeInUp delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div className="section-title" style={{ marginBottom: '0.25rem' }}>Recent Workouts ({totalWorkouts})</div>
            {SESSIONS.map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.1rem 1.25rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(123,47,190,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                      {s.workout.emoji}
                    </div>
                    <div>
                      <div className="font-display" style={{ fontWeight: 700, fontSize: '0.98rem', color: 'white' }}>{s.workout.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.date} · {s.time}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.4rem' }}>{MOOD_EMOJIS[s.mood]}</span>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Feeling</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00D4FF' }}>{s.duration}m</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>Duration</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FF6B35' }}>{s.calories}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>Calories</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7B2FBE' }}>{s.reps}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Reps</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Analytics & Monthly Overview */}
          <div className="animate-fadeInUp delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Overall Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {[
                { icon: '💪', value: totalWorkouts, label: 'Total Sessions', color: '#00D4FF' },
                { icon: '🔥', value: totalCalories, label: 'Kcal Burned', color: '#FF6B35' },
                { icon: '⏱', value: `${totalMinutes}m`, label: 'Active Time', color: '#7B2FBE' },
                { icon: '🔢', value: totalReps, label: 'Total Reps', color: '#10B981' },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>{s.icon}</div>
                  <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Favorite Workouts Breakdown */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px' }}>
              <div className="section-title" style={{ marginBottom: '0.875rem' }}>Most Trained Routines</div>
              {WORKOUTS.slice(0, 4).map((w, i) => (
                <div key={w.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{w.emoji}</span>
                    <span className="font-display" style={{ fontWeight: 600, fontSize: '0.85rem' }}>{w.name}</span>
                  </div>
                  <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--ice-blue)', fontWeight: 700 }}>{3 - Math.floor(i / 2)} sessions</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
