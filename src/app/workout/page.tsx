'use client';

import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import { WORKOUTS } from '@/lib/data';

const CATEGORIES = ['All', 'Strength', 'HIIT', 'Cardio', 'Flexibility'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function WorkoutPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [sessionRunning, setSessionRunning] = useState(false);

  const filtered = WORKOUTS.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || w.category === catFilter.toLowerCase();
    const matchDiff = diffFilter === 'All' || w.difficulty === diffFilter.toLowerCase();
    return matchSearch && matchCat && matchDiff;
  });

  const startWorkout = (id: string) => {
    setActiveWorkout(id);
    setWorkoutTimer(0);
    setSessionRunning(true);
  };

  const activeWo = WORKOUTS.find(w => w.id === activeWorkout);

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Library</p>
          <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
            <span className="gradient-text">Workouts</span>
          </h1>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1rem' }} className="animate-fadeInUp delay-100">
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
          <input type="text" className="input-field" placeholder="Search workouts..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.75rem' }} />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', marginBottom: '0.75rem', scrollbarWidth: 'none' }} className="animate-fadeInUp delay-100">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} className={`select-chip ${catFilter === c ? 'selected' : ''}`} style={{ flexShrink: 0 }}>
              {c}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', marginBottom: '1.25rem', scrollbarWidth: 'none' }}>
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setDiffFilter(d)} className={`select-chip ${diffFilter === d ? 'selected' : ''}`} style={{ flexShrink: 0, fontSize: '0.78rem' }}>
              {d}
            </button>
          ))}
        </div>

        {/* Workout List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }} className="animate-fadeInUp delay-200">
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔎</div>
              <div>No workouts found</div>
            </div>
          )}
          {filtered.map(workout => (
            <div key={workout.id} className="workout-card" onClick={() => startWorkout(workout.id)}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,47,190,0.2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem', flexShrink: 0,
              }}>
                {workout.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div className="font-display" style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>{workout.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  ⏱ {workout.duration}min · 🔥 {workout.caloriesBurn}cal · {workout.exercises.length} exercises
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span className={`pill ${workout.difficulty === 'beginner' ? 'pill-success' : workout.difficulty === 'intermediate' ? 'pill-blue' : 'pill-fire'}`}>
                    {workout.difficulty}
                  </span>
                  <span className="pill pill-violet">{workout.category}</span>
                </div>
              </div>
              <div style={{ color: 'var(--ice-blue)', fontSize: '1.25rem' }}>▶</div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Detail Modal */}
      {activeWorkout && activeWo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '430px', margin: '0 auto', background: 'var(--bg-surface)', borderRadius: '28px 28px 0 0', padding: '1.5rem', maxHeight: '90dvh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)' }} className="animate-fadeInUp">
            
            {/* Workout Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem' }}>{activeWo.emoji}</div>
              <div style={{ flex: 1 }}>
                <h2 className="font-display" style={{ fontWeight: 800, fontSize: '1.3rem' }}>{activeWo.name}</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{activeWo.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span className="pill pill-blue">⏱ {activeWo.duration}min</span>
                  <span className="pill pill-fire">🔥 {activeWo.caloriesBurn}cal</span>
                </div>
              </div>
              <button onClick={() => setActiveWorkout(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>

            {/* Exercises */}
            <div className="section-title" style={{ marginBottom: '0.75rem' }}>Exercises ({activeWo.exercises.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {activeWo.exercises.map((ex, i) => (
                <div key={ex.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', padding: '0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--ice-blue)', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ex.emoji} {ex.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {ex.sets && `${ex.sets} sets × `}{ex.reps ? `${ex.reps} reps` : ex.duration ? `${ex.duration}s` : ''} · Rest {ex.restTime}s
                    </div>
                    {ex.cues && ex.cues.length > 0 && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--ice-blue)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                        💡 {ex.cues[0]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Start Button */}
            <Link href="/trainer" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" onClick={() => setActiveWorkout(null)}>
                🎯 Start with AI Trainer
              </button>
            </Link>
            <button className="btn-secondary" style={{ marginTop: '0.75rem' }} onClick={() => setActiveWorkout(null)}>
              Start without tracking
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
