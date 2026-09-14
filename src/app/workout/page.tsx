'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import { WORKOUTS } from '@/lib/data';
import { Workout } from '@/lib/types';

const CATEGORIES = ['All', 'Strength', 'HIIT', 'Cardio', 'Flexibility'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function WorkoutPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>(WORKOUTS[0]);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [currentExIndex, setCurrentExIndex] = useState(0);

  const filtered = WORKOUTS.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || w.category === catFilter.toLowerCase();
    const matchDiff = diffFilter === 'All' || w.difficulty === diffFilter.toLowerCase();
    return matchSearch && matchCat && matchDiff;
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeWorkoutId) {
      interval = setInterval(() => {
        setWorkoutTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkoutId]);

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setActiveWorkoutId(workout.id);
    setWorkoutTimer(0);
    setCurrentExIndex(0);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const activeWo = activeWorkoutId ? WORKOUTS.find(w => w.id === activeWorkoutId) || selectedWorkout : selectedWorkout;
  const currentEx = activeWo.exercises[currentExIndex] || activeWo.exercises[0];

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Workout Hub</p>
            <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
              <span className="gradient-text">Exercise & Training Sessions</span>
            </h1>
          </div>
          <Link href="/trainer" className="btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
            🎯 Launch AI Pose Trainer
          </Link>
        </div>

        {/* 2-Column Responsive Desktop Grid */}
        <div className="desktop-grid-split">
          
          {/* Left Column: Search, Filters, and Workout Cards List */}
          <div>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '0.75rem' }} className="animate-fadeInUp delay-100">
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
              <input
                type="text"
                className="input-field"
                placeholder="Search workouts or muscles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem', marginBottom: '0.5rem', scrollbarWidth: 'none' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} className={`select-chip ${catFilter === c ? 'selected' : ''}`} style={{ flexShrink: 0 }}>
                  {c}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem', marginBottom: '1.25rem', scrollbarWidth: 'none' }}>
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDiffFilter(d)} className={`select-chip ${diffFilter === d ? 'selected' : ''}`} style={{ flexShrink: 0, fontSize: '0.78rem' }}>
                  {d}
                </button>
              ))}
            </div>

            {/* Workout Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }} className="glass-card">
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔎</div>
                  <div>No workouts match your filters</div>
                </div>
              )}
              {filtered.map(workout => (
                <div
                  key={workout.id}
                  className={`workout-card ${selectedWorkout.id === workout.id ? 'active' : ''}`}
                  onClick={() => setSelectedWorkout(workout)}
                  style={{
                    border: selectedWorkout.id === workout.id ? '1px solid rgba(0,212,255,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    background: selectedWorkout.id === workout.id ? 'rgba(0,212,255,0.06)' : 'var(--bg-glass)',
                  }}
                >
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
                      ⏱ {workout.duration} min · 🔥 {workout.caloriesBurn} cal · {workout.exercises.length} exercises
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <span className={`pill ${workout.difficulty === 'beginner' ? 'pill-success' : workout.difficulty === 'intermediate' ? 'pill-blue' : 'pill-fire'}`}>
                        {workout.difficulty}
                      </span>
                      <span className="pill pill-violet">{workout.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startWorkout(workout);
                    }}
                    className="btn-primary"
                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                  >
                    ▶ Start
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Workout Preview & Active Execution Player */}
          <div>
            {/* Workout Detail Player Card */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px', position: 'sticky', top: '1.5rem', border: '1px solid rgba(0,212,255,0.15)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '20px',
                  background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', flexShrink: 0, boxShadow: '0 0 25px rgba(0,212,255,0.3)',
                }}>
                  {selectedWorkout.emoji}
                </div>
                <div>
                  <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>{selectedWorkout.name}</h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{selectedWorkout.description}</p>
                </div>
              </div>

              {/* Active Timer Header if session is active */}
              {activeWorkoutId === selectedWorkout.id && (
                <div style={{
                  padding: '1rem', borderRadius: '16px', marginBottom: '1.25rem',
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(123,47,190,0.15))',
                  border: '1px solid rgba(0,212,255,0.3)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ice-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Session In Progress</div>
                  <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', margin: '0.25rem 0' }}>{formatTimer(workoutTimer)}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Exercise {currentExIndex + 1} of {selectedWorkout.exercises.length}</div>
                </div>
              )}

              {/* Exercise Step Carousel / List */}
              <div className="section-title" style={{ marginBottom: '0.75rem' }}>Exercise Sequence</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                {selectedWorkout.exercises.map((ex, idx) => {
                  const isCurrent = activeWorkoutId === selectedWorkout.id && currentExIndex === idx;
                  return (
                    <div
                      key={ex.id || idx}
                      onClick={() => setCurrentExIndex(idx)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.75rem 1rem', borderRadius: '14px', cursor: 'pointer',
                        background: isCurrent ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
                        border: isCurrent ? '1px solid var(--ice-blue)' : '1px solid rgba(255,255,255,0.05)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>{ex.emoji}</span>
                        <div>
                          <div className="font-display" style={{ fontWeight: 700, fontSize: '0.9rem', color: isCurrent ? 'var(--ice-blue)' : 'white' }}>{ex.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {ex.sets} sets × {ex.reps ? `${ex.reps} reps` : `${ex.duration}s`}
                          </div>
                        </div>
                      </div>
                      {isCurrent && <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ice-blue)' }}>ACTIVE</span>}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {activeWorkoutId !== selectedWorkout.id ? (
                  <button onClick={() => startWorkout(selectedWorkout)} className="btn-primary">
                    ⚡ Start Session Now
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (currentExIndex < selectedWorkout.exercises.length - 1) {
                          setCurrentExIndex(i => i + 1);
                        } else {
                          setActiveWorkoutId(null);
                          alert('🎉 Workout Completed! You earned +250 XP!');
                        }
                      }}
                      className="btn-primary"
                    >
                      {currentExIndex < selectedWorkout.exercises.length - 1 ? 'Next Exercise ➔' : 'Finish Session 🎉'}
                    </button>
                    <button onClick={() => setActiveWorkoutId(null)} className="btn-secondary" style={{ width: 'auto' }}>
                      Pause
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
