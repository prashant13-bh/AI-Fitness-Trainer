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
        if (Math.random() < 0.4) {
          setReps(prev => {
            const updated = [...prev];
            if (updated[currentExIndex] < 30) updated[currentExIndex]++;
            return updated;
          });
        }
        setCueIndex(c => (c + 1) % 3);
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
  }, [phase, currentExIndex]);

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
    <div style={{ background: '#0A0A14', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Real-Time Camera AI</p>
            <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
              <span className="gradient-text">AI Pose Trainer</span>
            </h1>
          </div>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div className="btn-icon">✕ Exit</div>
          </Link>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="desktop-grid-split">
          {/* Left Column: Camera Feed HUD */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '24px', overflow: 'hidden', background: '#050510', border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
            {cameraGranted ? (
              <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #0A0E1A, #1A0B30)', padding: '2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }} className="animate-float">🎯</div>
                <div className="font-display" style={{ fontWeight: 700, color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Live AI Pose Detector</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center', maxWidth: '320px' }}>
                  Enable camera for real-time rep counting and automatic posture correction
                </div>
                {phase === 'setup' && (
                  <button onClick={requestCamera} className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
                    📸 Enable Camera Stream
                  </button>
                )}
              </div>
            )}

            {/* Camera Overlay HUD */}
            {cameraGranted && phase === 'active' && (
              <>
                {[{top:'12px',left:'12px'},{top:'12px',right:'12px'},{bottom:'12px',left:'12px'},{bottom:'12px',right:'12px'}].map((pos, i) => (
                  <div key={i} style={{ position: 'absolute', ...pos, width: '24px', height: '24px',
                    borderTop: i < 2 ? '3px solid rgba(0,212,255,0.9)' : undefined,
                    borderBottom: i >= 2 ? '3px solid rgba(0,212,255,0.9)' : undefined,
                    borderLeft: (i === 0 || i === 2) ? '3px solid rgba(0,212,255,0.9)' : undefined,
                    borderRight: (i === 1 || i === 3) ? '3px solid rgba(0,212,255,0.9)' : undefined,
                  }} />
                ))}

                <div style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', textAlign: 'center', background: 'rgba(0,0,0,0.6)', padding: '1rem 0.75rem', borderRadius: '16px', backdropFilter: 'blur(8px)' }}>
                  <div className="font-mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--ice-blue)', lineHeight: 1, textShadow: '0 0 20px rgba(0,212,255,0.8)' }}>{reps[currentExIndex]}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>/{currentEx.targetReps}</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>REPS</div>
                </div>

                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.7)', borderRadius: '10px', padding: '0.4rem 0.8rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>⏱ {formatTime(timer)}</span>
                </div>
              </>
            )}

            {phase === 'ready' && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }}>
                <div className="font-display animate-scaleIn" style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--ice-blue)' }}>GO!</div>
              </div>
            )}
          </div>

          {/* Right Column: AI Form Cues & Exercise Control */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* SETUP PHASE */}
            {phase === 'setup' && (
              <div className="animate-fadeInUp">
                <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1rem' }}>
                  <div className="section-title" style={{ marginBottom: '0.75rem' }}>Session Overview</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {EXERCISES.length} Core Exercises · Est. 25 minutes · Real-Time Posture Scoring
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {EXERCISES.map((ex, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{ex.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div className="font-display" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ex.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: {ex.targetReps} reps</div>
                        </div>
                        <span className="pill pill-blue">AI tracked</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn-primary" onClick={startSession} style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
                  🎯 Start AI Training Session
                </button>
              </div>
            )}

            {/* ACTIVE PHASE */}
            {phase === 'active' && (
              <div className="animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass-card-primary" style={{ padding: '1.25rem', borderRadius: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{currentEx.emoji}</span>
                      <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800 }}>{currentEx.name}</h2>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Exercise {currentExIndex + 1} of {EXERCISES.length}
                    </div>
                  </div>

                  {/* Progress Bar */}
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

                  {/* AI Form Cue Card */}
                  <div className="glass-card" style={{ padding: '0.875rem 1rem', borderRadius: '14px', border: '1px solid rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🤖</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--ice-blue)', fontWeight: 600, fontStyle: 'italic', margin: 0 }}>
                      &quot;{currentEx.cues[cueIndex % currentEx.cues.length]}&quot;
                    </p>
                  </div>
                </div>

                <button className="btn-fire" onClick={finishExercise} style={{ width: '100%', padding: '0.875rem' }}>
                  ✅ Done — Next Exercise
                </button>
              </div>
            )}

            {/* REST PHASE */}
            {phase === 'rest' && (
              <div style={{ textAlign: 'center' }} className="glass-card animate-scaleIn">
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }} className="animate-float">😮‍💨</div>
                  <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>Rest & Recover</h2>
                  <div className="font-mono" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--ice-blue)', marginBottom: '0.5rem' }}>{restTimer}s</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    {currentExIndex < EXERCISES.length - 1 ? `Up next: ${EXERCISES[currentExIndex + 1].name}` : 'Final workout complete!'}
                  </p>
                  <button className="btn-secondary" onClick={skipRest} style={{ width: '100%' }}>Skip Rest →</button>
                </div>
              </div>
            )}

            {/* DONE PHASE */}
            {phase === 'done' && (
              <div style={{ textAlign: 'center' }} className="glass-card animate-scaleIn">
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🎉</div>
                  <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>
                    <span className="gradient-text">Session Completed!</span>
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Outstanding performance today 💪
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <div className="stat-card" style={{ textAlign: 'center' }}>
                      <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ice-blue)' }}>{totalReps}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Reps</div>
                    </div>
                    <div className="stat-card" style={{ textAlign: 'center' }}>
                      <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ice-blue)' }}>{formatTime(timer)}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Duration</div>
                    </div>
                    <div className="stat-card" style={{ textAlign: 'center' }}>
                      <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FF6B35' }}>185</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Calories</div>
                    </div>
                  </div>

                  <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary" style={{ width: '100%' }}>🏠 Back to Dashboard</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
