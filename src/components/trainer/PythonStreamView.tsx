'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Award,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { ExerciseType } from '@/lib/rep-counter';

interface PythonStreamViewProps {
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

interface PythonStatus {
  exercise: string;
  reps: number;
  stage: string;
  angle: number;
  feedback: string;
  form_quality: string;
  hold_seconds: number;
}

const EXERCISES: { id: ExerciseType; name: string; icon: string }[] = [
  { id: 'pushups', name: 'Push-ups', icon: '💪' },
  { id: 'squats', name: 'Squats', icon: '🦵' },
  { id: 'lunges', name: 'Lunges', icon: '🏃' },
  { id: 'plank', name: 'Plank', icon: '🧘' },
  { id: 'jumping_jacks', name: 'Jumping Jacks', icon: '⭐' },
];

export default function PythonStreamView({
  initialExercise = 'pushups',
  onComplete,
  onClose,
  onFallbackToBrowser,
}: PythonStreamViewProps) {
  const [exercise, setExercise] = useState<ExerciseType>(initialExercise);
  const [isConnected, setIsConnected] = useState(false);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);

  const [status, setStatus] = useState<PythonStatus>({
    exercise: initialExercise,
    reps: 0,
    stage: 'up',
    angle: 0,
    feedback: 'Connecting to Python MediaPipe server...',
    form_quality: 'idle',
    hold_seconds: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);

  // 1. Health check & WebSocket connection
  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWS = () => {
      try {
        ws = new WebSocket('ws://localhost:8000/ws');
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data: PythonStatus = JSON.parse(event.data);
            setStatus(data);
          } catch (e) {
            console.debug('WS parse error:', e);
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
        const res = await fetch('http://localhost:8000/', { method: 'GET' });
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

  // 2. Workout elapsed time
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setWorkoutSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // 3. Switch Exercise on Python backend
  const handleSelectExercise = async (ex: ExerciseType) => {
    setExercise(ex);
    try {
      await fetch('http://localhost:8000/set_exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise: ex }),
      });
    } catch (e) {
      console.debug('Failed to set exercise on server:', e);
    }
  };

  // 4. Reset reps on Python backend
  const handleResetReps = async () => {
    try {
      await fetch('http://localhost:8000/reset', { method: 'POST' });
    } catch (e) {
      console.debug('Failed to reset on server:', e);
    }
  };

  // 5. Finish workout
  const handleFinish = () => {
    const xp = Math.max(20, Math.round(status.reps * 3 + workoutSeconds * 0.15));
    if (onComplete) {
      onComplete({
        exercise,
        reps: status.reps,
        durationSecs: workoutSeconds,
        xp,
      });
    }
  };

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-4 animate-fade-in text-[#0A192F]">
      {/* ── Top Bar: Exercise Switcher & Python Status ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8EEF5] shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {EXERCISES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleSelectExercise(ex.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                exercise === ex.id
                  ? 'bg-[#0085FF] text-white shadow-sm'
                  : 'bg-slate-100 text-[#64748B] hover:text-[#0A192F] hover:bg-slate-200'
              }`}
            >
              <span>{ex.icon}</span>
              <span>{ex.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-[#64748B]">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isConnected ? 'Python MediaPipe Active' : 'Python Offline'}</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#64748B]"
            >
              ✕ Exit
            </button>
          )}
        </div>
      </div>

      {/* ── Main Viewport: Live Python MJPEG Stream OR Connection Helper ── */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0A192F] border-2 border-slate-800 shadow-2xl aspect-[4/3] sm:aspect-[16/10] max-h-[520px] flex items-center justify-center">
        {isConnected ? (
          /* Live Stream from Python Server */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="http://localhost:8000/video_feed"
            alt="Python MediaPipe Video Feed"
            className="w-full h-full object-cover"
          />
        ) : (
          /* Instructions when server is not started */
          <div className="p-8 text-center text-white max-w-lg space-y-4 animate-fade-in z-20">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-2xl mx-auto shadow-lg">
              🐍
            </div>
            <div>
              <h3 className="text-xl font-black">Python MediaPipe Engine Ready</h3>
              <p className="text-xs text-slate-300 mt-1">
                For rock-solid 60 FPS body tracking with MediaPipe, run the Python server in your terminal:
              </p>
            </div>

            {/* Terminal snippet box */}
            <div className="bg-black/60 border border-slate-700 rounded-xl p-3 text-left font-mono text-xs text-emerald-400 flex items-center justify-between">
              <span>python python_trainer/server.py</span>
              <Terminal className="w-4 h-4 text-slate-400" />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.open('http://localhost:8000', '_blank')}
                className="btn-sunset py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <span>Check Server Connection</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {onFallbackToBrowser && (
                <button
                  onClick={onFallbackToBrowser}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
                >
                  Use Browser Camera Mode Instead
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Overlay HUD (When connected) ── */}
        {isConnected && (
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10">
            <div className="flex items-start justify-between">
              {/* Reps Counter Box */}
              <div className="bg-black/60 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 text-white flex items-center gap-3.5 shadow-lg">
                <div className="text-center">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 block">
                    {exercise === 'plank' ? 'HOLD' : 'REPS'}
                  </span>
                  <span className="font-mono text-4xl sm:text-5xl font-black text-[#FF7A00] leading-none">
                    {exercise === 'plank' ? `${Math.round(status.hold_seconds)}s` : status.reps}
                  </span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-xs">
                  <div className="font-bold text-slate-300 capitalize">{status.exercise}</div>
                  <div className="text-[10px] text-slate-400">
                    {formatSeconds(workoutSeconds)} elapsed
                  </div>
                </div>
              </div>

              {/* Angle Readout */}
              {status.angle > 0 && (
                <div className="bg-black/60 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-2 text-right text-white shadow-lg">
                  <span className="text-[9px] font-black uppercase text-slate-400 block">
                    JOINT ANGLE
                  </span>
                  <span className="font-mono text-xl font-black text-[#0085FF]">
                    {status.angle}°
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Coaching Feedback Bar */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`px-4 py-2 rounded-2xl backdrop-blur-md border text-xs sm:text-sm font-extrabold shadow-xl transition-all flex items-center gap-2 ${
                  status.form_quality === 'good'
                    ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                    : status.form_quality === 'warning'
                    ? 'bg-amber-500/90 text-white border-amber-400/50 animate-pulse'
                    : 'bg-black/70 text-slate-200 border-white/15'
                }`}
              >
                {status.form_quality === 'good' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{status.feedback}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Control Console ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <button
          onClick={handleResetReps}
          className="p-3.5 rounded-2xl bg-white border border-[#E8EEF5] text-[#64748B] hover:text-[#0A192F] font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Reps</span>
        </button>

        <button
          onClick={() => handleSelectExercise(exercise)}
          className="p-3.5 rounded-2xl bg-white border border-[#E8EEF5] hover:border-[#0085FF] text-[#0085FF] font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Activity className="w-4 h-4" />
          <span>Sync Status</span>
        </button>

        <button
          onClick={handleFinish}
          className="p-3.5 rounded-2xl btn-sunset text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition col-span-2 sm:col-span-1"
        >
          <Award className="w-4 h-4" />
          <span>Finish Workout ({status.reps} Reps) →</span>
        </button>
      </div>

      {/* Standalone Desktop Mode Callout */}
      <div className="arc-card p-4 bg-gradient-to-r from-blue-50/50 to-orange-50/50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-extrabold text-[#0A192F] block">
            Prefer a standalone desktop window without a web browser?
          </span>
          <span className="text-[#64748B]">
            Run <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">python python_trainer/ai_trainer.py</code> for an ultra-smooth native OpenCV experience.
          </span>
        </div>
        <div className="shrink-0">
          <span className="px-3 py-1 rounded-xl bg-blue-100 text-[#0085FF] font-bold text-[11px]">
            Desktop GUI Ready
          </span>
        </div>
      </div>
    </div>
  );
}
