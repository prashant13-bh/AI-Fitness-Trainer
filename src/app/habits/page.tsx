'use client';

import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import { DEFAULT_HABITS } from '@/lib/data';

type HabitEntry = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  streak: number;
  completedToday: boolean;
  completionsThisWeek: number;
  targetDays: number;
  history: boolean[]; // last 28 days
};

const WEEKDAYS = ['S','M','T','W','T','F','S'];

function generateHistory(completedToday: boolean): boolean[] {
  return Array.from({ length: 28 }, (_, i) => {
    if (i === 27) return completedToday;
    return Math.random() > 0.3;
  });
}

const INITIAL_HABITS: HabitEntry[] = DEFAULT_HABITS.map((h, i) => ({
  id: `habit-${i}`,
  name: h.name.replace(/^[^ ]+ /, ''),
  emoji: h.emoji,
  color: h.color,
  streak: Math.floor(Math.random() * 15) + 1,
  completedToday: i < 3,
  completionsThisWeek: Math.floor(Math.random() * 5) + 2,
  targetDays: 7,
  history: generateHistory(i < 3),
}));

function HeatmapRow({ history, color }: { history: boolean[]; color: string }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {history.map((done, i) => (
        <div key={i} style={{
          width: '10px', height: '10px', borderRadius: '2px',
          background: done ? color : 'rgba(255,255,255,0.05)',
          opacity: done ? (0.4 + (i / history.length) * 0.6) : 1,
          transition: 'all 0.2s',
        }} />
      ))}
    </div>
  );
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitEntry[]>(INITIAL_HABITS);
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', emoji: '⭐', color: '#00D4FF' });

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const newCompleted = !h.completedToday;
      const newHistory = [...h.history];
      newHistory[27] = newCompleted;
      return {
        ...h,
        completedToday: newCompleted,
        streak: newCompleted ? h.streak + (h.history[26] ? 0 : 1) : Math.max(0, h.streak - 1),
        history: newHistory,
      };
    }));
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalStreak = Math.max(...habits.map(h => h.streak));

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    const h: HabitEntry = {
      id: `habit-${Date.now()}`,
      name: newHabit.name,
      emoji: newHabit.emoji,
      color: newHabit.color,
      streak: 0,
      completedToday: false,
      completionsThisWeek: 0,
      targetDays: 7,
      history: Array(28).fill(false),
    };
    setHabits(prev => [...prev, h]);
    setNewHabit({ name: '', emoji: '⭐', color: '#00D4FF' });
    setShowAdd(false);
  };

  const EMOJIS = ['💧','🏃','😴','🥗','🧘','📖','💊','☀️','🎵','✏️','🏊','🚴'];
  const COLORS = ['#00D4FF','#7B2FBE','#10B981','#F59E0B','#EF4444','#EC4899'];

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily</p>
            <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
              <span className="gradient-text">Habit Tracker</span>
            </h1>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-icon" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', gap: '0.35rem', borderRadius: '12px' }}>
            + Add
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }} className="animate-fadeInUp delay-100">
          {[
            { icon: '✅', value: `${completedToday}/${habits.length}`, label: 'Today', color: '#10B981' },
            { icon: '🔥', value: totalStreak, label: 'Best Streak', color: '#FF6B35' },
            { icon: '📅', value: `${Math.round((completedToday/habits.length)*100)}%`, label: 'Today Rate', color: '#7B2FBE' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Habits List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }} className="animate-fadeInUp delay-200">
          {habits.map(habit => (
            <div key={habit.id} className="glass-card" style={{
              padding: '1rem 1.25rem', borderRadius: '18px',
              border: `1px solid ${habit.completedToday ? `${habit.color}30` : 'rgba(255,255,255,0.06)'}`,
              background: habit.completedToday ? `${habit.color}08` : 'rgba(255,255,255,0.02)',
              transition: 'all 0.3s',
            }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: `${habit.color}20`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0,
                }}>
                  {habit.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-display" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>{habit.name}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.7rem', color: habit.color, fontWeight: 700 }}>🔥 {habit.streak} day streak</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>· {habit.completionsThisWeek}/7 this week</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleHabit(habit.id)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${habit.completedToday ? habit.color : 'rgba(255,255,255,0.1)'}`,
                    background: habit.completedToday ? habit.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#000', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: habit.completedToday ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {habit.completedToday ? '✓' : ''}
                </button>
              </div>

              {/* Week progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  {WEEKDAYS.map((d, i) => (
                    <div key={i} style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center', width: '10px' }}>{d}</div>
                  ))}
                  <div style={{ flex: 1 }} />
                </div>
                <HeatmapRow history={habit.history.slice(-7)} color={habit.color} />
              </div>
            </div>
          ))}
        </div>

        {/* Full Heatmap */}
        <div style={{ marginTop: '1.5rem' }} className="animate-fadeInUp delay-300">
          <div className="section-title" style={{ marginBottom: '0.75rem' }}>28-Day Heatmap</div>
          <div className="glass-card" style={{ padding: '1rem', borderRadius: '18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {habits.map(h => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', width: '20px', textAlign: 'center' }}>{h.emoji}</span>
                  <HeatmapRow history={h.history} color={h.color} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem', marginTop: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Less</span>
              {[0.1,0.3,0.6,0.9,1].map((op, i) => (
                <div key={i} style={{ width: '10px', height: '10px', borderRadius: '2px', background: `rgba(0, 212, 255, ${op})` }} />
              ))}
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '430px', margin: '0 auto', background: 'var(--bg-surface)', borderRadius: '28px 28px 0 0', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }} className="animate-fadeInUp">
            <div className="font-display" style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem' }}>Add New Habit</div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="input-label">Habit Name</label>
              <input className="input-field" placeholder="e.g. Drink Water" value={newHabit.name}
                onChange={e => setNewHabit(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="input-label">Emoji</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {EMOJIS.map(em => (
                  <button key={em} onClick={() => setNewHabit(p => ({ ...p, emoji: em }))}
                    style={{ width: '40px', height: '40px', borderRadius: '10px', fontSize: '1.25rem', border: `1.5px solid ${newHabit.emoji === em ? 'rgba(0,212,255,0.5)' : 'transparent'}`, background: newHabit.emoji === em ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="input-label">Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setNewHabit(p => ({ ...p, color: c }))}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: c, border: `3px solid ${newHabit.color === c ? 'white' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.2s' }} />
                ))}
              </div>
            </div>
            <button className="btn-primary" onClick={addHabit}>Add Habit</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
