'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Award,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Coffee,
} from 'lucide-react';
import { ExerciseType } from '@/lib/rep-counter';

interface JavaStreamViewProps {
  initialExercise?: ExerciseType;
  onComplete?: (summary: {
    exercise: ExerciseType;
    reps: number;
    durationSecs: number;
    xp: number;
  }) => void;
  onClose?: () => void;
  onFallbackToBrowser?: () => void;
}

interface JavaStatus {
  exercise: string;
  reps: number;
  stage: string;
  angle: number;
  feedback: string;
  form_quality?: string;
  formQuality?: string;
  hold_seconds?: number;
  holdSeconds?: number;
}

const EXERCISES: { id: ExerciseType; name: string; icon: string }[] = [
  { id: 'pushups', name: 'Push-ups', icon: '💪' },
  { id: 'squats', name: 'Squats', icon: '🦵' },
  { id: 'lunges', name: 'Lunges', icon: '🏃' },
  { id: 'plank', name: 'Plank', icon: '🧘' },
  { id: 'jumping_jacks', name: 'Jumping Jacks', icon: '⭐' },
];

export default function JavaStreamView({
  initialExercise = 'pushups',
  onComplete,
  onClose,
  onFallbackToBrowser,
}: JavaStreamViewProps) {
  const [exercise, setExercise] = useState<ExerciseType>(initialExercise);
  const [isConnected, setIsConnected] = useState(false);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);

  const [status, setStatus] = useState<JavaStatus>({
    exercise: initialExercise,
    reps: 0,
    stage: 'up',
    angle: 0,
    feedback: 'Connecting to Java Spring Boot backend on :8080...',
    form_quality: 'idle',
    hold_seconds: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);

  // 1. Health check & WebSocket connection to Java Backend (:8080)
  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWS = () => {
      try {
        ws = new WebSocket('ws://localhost:8080/ws');
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data: JavaStatus = JSON.parse(event.data);
            setStatus(data);
          } catch (e) {
            console.debug('Java WS parse error:', e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
        };

        ws.onerror = () => {
          setIsConnected(false);
        };
      } catch {
        setIsConnected(false);
      }
    };

    const checkServerHealth = async () => {
      try {
        const res = await fetch('http://localhost:8080/', { method: 'GET' });
        if (res.ok) {
          connectWS();
        } else {
          setIsConnected(false);
        }
      } catch {
        setIsConnected(false);
      }
    };

    checkServerHealth();
    const checkTimer = setInterval(checkServerHealth, 3000);

    return () => {
      clearInterval(checkTimer);
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // 2. Workout Timer
  useEffect(() => {
    if (!isConnected) return;
    const timer = setInterval(() => {
      setWorkoutSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isConnected]);

  // Handle Switch Exercise
  const handleSelectExercise = async (ex: ExerciseType) => {
    setExercise(ex);
    try {
      await fetch('http://localhost:8080/set_exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise: ex }),
      });
    } catch (e) {
      console.warn('Failed to switch exercise on Java backend', e);
    }
  };

  // Handle Reset Reps
  const handleReset = async () => {
    try {
      await fetch('http://localhost:8080/reset', { method: 'POST' });
      setStatus((prev) => ({ ...prev, reps: 0 }));
    } catch (e) {
      console.warn('Failed to reset reps on Java backend', e);
    }
  };

  // Handle Manual Rep Trigger (Testing / Telemetry)
  const handleTriggerRep = async () => {
    try {
      const res = await fetch('http://localhost:8080/rep', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setStatus((prev) => ({ ...prev, reps: data.reps }));
      }
    } catch (e) {
      console.warn('Failed to trigger rep on Java backend', e);
    }
  };

  // Finish Workout
  const handleFinish = () => {
    const xp = status.reps * 15;
    if (onComplete) {
      onComplete({
        exercise,
        reps: status.reps,
        durationSecs: workoutSeconds,
        xp,
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col bg-[#0A192F] text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0F223D]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wide uppercase text-white">
                Java Spring Boot Engine
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isConnected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isConnected ? 'ONLINE (8080)' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              High-performance Java backend with WebSocket telemetry
            </p>
          </div>
        </div>

        {/* Timer & Done */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono font-bold text-slate-300">
            ⏱️ {formatTime(workoutSeconds)}
          </div>
          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 transition"
          >
            <Award className="w-4 h-4" />
            Finish & Log XP
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Left Side: Server Status & Telemetry HUD */}
        <div className="lg:col-span-8 space-y-4">
          {isConnected ? (
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                    Active Telemetry Session
                  </span>
                  <h3 className="text-xl font-black text-white capitalize">
                    {status.exercise || exercise} Session
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerRep}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    +1 Rep
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Reset Rep Count"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* HUD Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Completed Reps
                  </div>
                  <div className="text-4xl font-black text-orange-400 mt-1">
                    {status.reps}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Kinematic Stage
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-2 uppercase">
                    {status.stage || 'UP'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Joint Angle
                  </div>
                  <div className="text-2xl font-black text-cyan-400 mt-2">
                    {Math.round(status.angle || 0)}°
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Form Quality
                  </div>
                  <div className="text-2xl font-black text-purple-400 mt-2 uppercase">
                    {status.formQuality || status.form_quality || 'GOOD'}
                  </div>
                </div>
              </div>

              {/* Feedback Alert Bar */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                <Activity className="w-5 h-5 text-orange-400 animate-pulse flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-black uppercase text-orange-400">
                    Live Coach Feedback
                  </div>
                  <div className="text-sm font-bold text-white">
                    {status.feedback || 'Maintain continuous cadence and breathing.'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Offline State with Helpful Guide */
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-black text-white">
                  Java Backend Offline (port 8080)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Start your Java Spring Boot backend located in{' '}
                  <span className="font-mono text-orange-400">backend-java/</span>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left max-w-md mx-auto font-mono text-xs text-slate-300 space-y-1">
                <div className="text-slate-500"># Start Java backend:</div>
                <div className="text-emerald-400">cd backend-java</div>
                <div className="text-emerald-400">mvn spring-boot:run</div>
              </div>

              {onFallbackToBrowser && (
                <div className="pt-2">
                  <button
                    onClick={onFallbackToBrowser}
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-lg transition"
                  >
                    Switch to On-Device In-Browser Tracker →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Exercise Selection & Instructions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0F223D] border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Select Exercise
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {EXERCISES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left font-bold text-xs transition ${
                    exercise === ex.id
                      ? 'border-orange-500 bg-orange-500/20 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{ex.icon}</span>
                    {ex.name}
                  </span>
                  {exercise === ex.id && (
                    <CheckCircle2 className="w-4 h-4 text-orange-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-[#0F223D] border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <Terminal className="w-4 h-4 text-orange-400" />
              REST & WS Endpoints
            </div>
            <p className="text-[11px] leading-relaxed">
              • REST Health: <code className="text-slate-300">GET /</code>
              <br />
              • REST Stats: <code className="text-slate-300">GET /stats</code>
              <br />
              • WebSocket: <code className="text-slate-300">ws://localhost:8080/ws</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
