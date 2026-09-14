'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

type Exercise = { name: string; emoji: string; reps: number; targetReps: number; cues: string[] };

const EXERCISES: Exercise[] = [
  { name: 'Push-Up', emoji: '💪', reps: 0, targetReps: 15, cues: ['Keep body straight', 'Elbows at 45°', 'Full range of motion'] },
  { name: 'Squat', emoji: '🍑', reps: 0, targetReps: 20, cues: ['Sit back like a chair', 'Knees over toes', 'Weight in heels'] },
  { name: 'Plank', emoji: '🧱', reps: 0, targetReps: 30, cues: ['Squeeze your core', 'Don\'t let hips sag', 'Breathe steadily'] },
  { name: 'Lunge', emoji: '🦵', reps: 0, targetReps: 12, cues: ['Tall spine', 'Front knee over ankle', 'Control the descent'] },
];

type Phase = 'setup' | 'ready' | 'active' | 'rest' | 'done';

export default function TrainerPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [reps, setReps] = useState<number[]>(EXERCISES.map(() => 0));
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [cueIndex, setCueIndex] = useState(0);
  const [cameraGranted, setCameraGranted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentEx = EXERCISES[currentExIndex];

  useEffect(() => {
    if (phase === 'active') {
      intervalRef.current = setInterval(() => {
        setTimer(t => t + 1);
        // Simulate rep detection every 2.5 seconds
        if (Math.random() < 0.4) {
          setReps(prev => {
            const updated = [...prev];
            if (updated[currentExIndex] < 30) updated[currentExIndex]++;
            return updated;
          });
        }
        // Rotate cues
        setCueIndex(c => (c + 1) % currentEx.cues.length);
      }, 2500);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, currentExIndex]);

  useEffect(() => {
    if (phase === 'rest') {
      setRestTimer(30);
      const interval = setInterval(() => {
        setRestTimer(t => {
          if (t <= 1) {
            clearInterval(interval);
            if (currentExIndex < EXERCISES.length - 1) {
              setCurrentExIndex(i => i + 1);
              setPhase('active');
              setTimer(0);
            } else {
              setPhase('done');
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) { videoRef.current.srcObject = stream; }
      setCameraGranted(true);
    } catch {
      setCameraGranted(false);
    }
  };

  const startSession = () => {
    setPhase('ready');
    setTimeout(() => { setPhase('active'); setTimer(0); }, 2000);
  };

  const finishExercise = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('rest');
  };

  const skipRest = () => {
    if (currentExIndex < EXERCISES.length - 1) {
      setCurrentExIndex(i => i + 1);
      setPhase('active');
      setTimer(0);
    } else {
      setPhase('done');
    }
  };

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const totalReps = reps.reduce((s, r) => s + r, 0);

  return (
    <div style={{ background: '#0A0A14', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Camera Feed Area */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '430px', margin: '0 auto', aspectRatio: '9/16', maxHeight: '55dvh', overflow: 'hidden', background: '#050510', flexShrink: 0 }}>
        {cameraGranted ? (
          <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #0A0E1A, #1A0B30)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }} className="animate-float">🎯</div>
            <div className="font-display" style={{ fontWeight: 700, color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>AI Pose Trainer</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center', padding: '0 2rem' }}>
              Enable camera for live pose detection and automatic rep counting
            </div>
            {phase === 'setup' && (
              <button onClick={requestCamera} className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
                📸 Enable Camera
              </button>
            )}
          </div>
        )}

        {/* Camera overlay HUD */}
        {cameraGranted && phase === 'active' && (
          <>
            {/* Corner guides */}
            {[{top:'10px',left:'10px'},{top:'10px',right:'10px'},{bottom:'10px',left:'10px'},{bottom:'10px',right:'10px'}].map((pos, i) => (
              <div key={i} style={{ position: 'absolute', ...pos, width: '20px', height: '20px',
                borderTop: i < 2 ? '2px solid rgba(0,212,255,0.8)' : undefined,
                borderBottom: i >= 2 ? '2px solid rgba(0,212,255,0.8)' : undefined,
                borderLeft: (i === 0 || i === 2) ? '2px solid rgba(0,212,255,0.8)' : undefined,
                borderRight: (i === 1 || i === 3) ? '2px solid rgba(0,212,255,0.8)' : undefined,
              }} />
            ))}

            {/* Rep counter overlay */}
            <div style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', textAlign: 'center' }}>
              <div className="font-mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--ice-blue)', lineHeight: 1, textShadow: '0 0 20px rgba(0,212,255,0.8)' }}>{reps[currentExIndex]}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>/{currentEx.targetReps}</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>REPS</div>
            </div>

            {/* Timer overlay */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', borderRadius: '8px', padding: '0.3rem 0.6rem', backdropFilter: 'blur(8px)' }}>
              <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{formatTime(timer)}</span>
            </div>
          </>
        )}

        {/* Ready countdown */}
        {phase === 'ready' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
            <div className="font-display" style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--ice-blue)' }} className="animate-scaleIn">GO!</div>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-surface)', borderRadius: '24px 24px 0 0', marginTop: '-20px', padding: '1.25rem 1rem', paddingBottom: '6rem', zIndex: 10 }}>

        {/* SETUP */}
        {phase === 'setup' && (
          <div className="animate-fadeInUp">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800 }}>AI Trainer Session</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  {EXERCISES.length} exercises · Est. 25 min
                </p>
              </div>
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <div className="btn-icon">✕</div>
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
              {EXERCISES.map((ex, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{ex.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ex.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: {ex.targetReps} reps</div>
                  </div>
                  <span className="pill pill-blue">AI tracked</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={startSession} style={{ fontSize: '1rem' }}>
              🎯 Start AI Training Session
            </button>
          </div>
        )}

        {/* ACTIVE */}
        {phase === 'active' && (
          <div className="animate-fadeInUp">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{currentEx.emoji}</span>
                  <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800 }}>{currentEx.name}</h2>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Exercise {currentExIndex + 1} of {EXERCISES.length}
                </div>
              </div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ice-blue)' }}>{formatTime(timer)}</div>
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (reps[currentExIndex]/currentEx.targetReps)*100)}%`, background: 'linear-gradient(90deg, #00D4FF, #7B2FBE)', borderRadius: '5px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
              <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ice-blue)', flexShrink: 0 }}>
                {reps[currentExIndex]}/{currentEx.targetReps}
              </span>
            </div>

            {/* AI Cue */}
            <div className="glass-card" style={{ padding: '0.875rem 1rem', borderRadius: '14px', marginBottom: '1rem', border: '1px solid rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🤖</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--ice-blue)', fontWeight: 600, fontStyle: 'italic' }}>
                "{currentEx.cues[cueIndex % currentEx.cues.length]}"
              </p>
            </div>

            {/* Exercise list */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {EXERCISES.map((ex, i) => (
                <div key={i} style={{ flexShrink: 0, padding: '0.4rem 0.75rem', borderRadius: '10px', background: i === currentExIndex ? 'rgba(0,212,255,0.15)' : i < currentExIndex ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${i === currentExIndex ? 'rgba(0,212,255,0.3)' : 'transparent'}` }}>
                  <div style={{ fontSize: '0.75rem' }}>{i < currentExIndex ? '✓' : ex.emoji}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{ex.name.split(' ')[0]}</div>
                </div>
              ))}
            </div>

            <button className="btn-fire" onClick={finishExercise}>
              ✅ Done — Next Exercise
            </button>
          </div>
        )}

        {/* REST */}
        {phase === 'rest' && (
          <div style={{ textAlign: 'center' }} className="animate-scaleIn">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }} className="animate-float">😮‍💨</div>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Rest Time</h2>
            <div className="font-mono" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--ice-blue)', marginBottom: '0.5rem' }}>{restTimer}s</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {currentExIndex < EXERCISES.length - 1 ? `Next: ${EXERCISES[currentExIndex + 1].name}` : 'Last exercise done!'}
            </p>
            <button className="btn-secondary" onClick={skipRest}>Skip Rest →</button>
          </div>
        )}

        {/* DONE */}
        {phase === 'done' && (
          <div style={{ textAlign: 'center' }} className="animate-scaleIn">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.25rem' }}>
              <span className="gradient-text">Session Complete!</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Amazing work! You crushed it today 💪
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { icon: '🔢', value: totalReps, label: 'Total Reps' },
                { icon: '⏱', value: formatTime(timer), label: 'Duration' },
                { icon: '🔥', value: '185', label: 'Cal Burned' },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ice-blue)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="glass-card-primary" style={{ padding: '1rem', borderRadius: '16px', marginBottom: '1.25rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Exercises completed:</div>
              {EXERCISES.map((ex, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                  <span style={{ fontSize: '0.85rem' }}>{ex.emoji} {ex.name}</span>
                  <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--ice-blue)' }}>{reps[i]} reps</span>
                </div>
              ))}
            </div>

            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">🏠 Back to Dashboard</button>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
