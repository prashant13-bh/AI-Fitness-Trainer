'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type FocusActivity = 'workout' | 'reading' | 'study' | 'deepwork' | 'meditation' | 'custom';

interface ActivityOption {
  id: FocusActivity;
  name: string;
  icon: string;
  desc: string;
  color: string;
}

const ACTIVITIES: ActivityOption[] = [
  { id: 'deepwork', name: 'Deep Work', icon: '💻', desc: 'High output, coding, or writing', color: '#0085FF' },
  { id: 'workout', name: 'Workout', icon: '🏋️', desc: 'Strength, cardio, or mobility', color: '#FF7A00' },
  { id: 'reading', name: 'Reading', icon: '📖', desc: 'Non-fiction or study books', color: '#7B61FF' },
  { id: 'study', name: 'Study / Learn', icon: '🧠', desc: 'Skill acquisition or courses', color: '#10B981' },
  { id: 'meditation', name: 'Stillness', icon: '🧘', desc: 'Breathwork, calm, reflection', color: '#EC4899' },
  { id: 'custom', name: 'Custom Goal', icon: '🎯', desc: 'Name your specific focus', color: '#6366F1' },
];

const PRESET_DURATIONS = [
  { mins: 25, label: '25 min', tag: 'Sprint' },
  { mins: 45, label: '45 min', tag: 'Standard' },
  { mins: 60, label: '60 min', tag: 'Deep Block' },
  { mins: 90, label: '90 min', tag: 'Titan' },
];

const MOTIVATIONAL_QUOTES = [
  "The standard you walk past is the standard you accept.",
  "Discipline today, a different tomorrow.",
  "Where focus goes, energy flows and transformation follows.",
  "Small disciplines repeated with consistency create extraordinary lives.",
  "Stay locked in. No cheap dopamine, no compromises.",
];

export default function LockInPage() {
  // Mode: 'launcher' | 'active' | 'completed'
  const [sessionState, setSessionState] = useState<'launcher' | 'active' | 'completed'>('launcher');

  // Launcher Config
  const [selectedActivity, setSelectedActivity] = useState<FocusActivity>('deepwork');
  const [customName, setCustomName] = useState('');
  const [durationMins, setDurationMins] = useState(45);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDurationInput, setCustomDurationInput] = useState('30');

  // Active Timer State
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [initialSeconds, setInitialSeconds] = useState(45 * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle active countdown
  useEffect(() => {
    if (sessionState === 'active' && !isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setSessionState('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionState, isPaused]);

  // Start Focus Session
  const handleStartSession = () => {
    const finalMins = isCustomDuration ? parseInt(customDurationInput) || 25 : durationMins;
    const totalSecs = finalMins * 60;
    setSecondsLeft(totalSecs);
    setInitialSeconds(totalSecs);
    setIsPaused(false);
    setQuoteIndex(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
    setSessionState('active');
  };

  // Add 5 Minutes
  const handleAdd5Mins = () => {
    setSecondsLeft((prev) => prev + 300);
    setInitialSeconds((prev) => prev + 300);
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;
  const currentActivityObj = ACTIVITIES.find((a) => a.id === selectedActivity)!;
  const activeActivityName = selectedActivity === 'custom' && customName.trim() ? customName : currentActivityObj.name;
  const xpEarned = Math.round((initialSeconds / 60) * 0.8);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] flex flex-col justify-between relative overflow-x-hidden">
      {/* ── Top Header ── */}
      <header className="w-full max-w-2xl lg:max-w-4xl mx-auto pt-6 px-5 flex items-center justify-between z-10">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-white border border-[#E8EEF5] flex items-center justify-center text-[#0A192F] shadow-sm hover:bg-slate-50 transition"
        >
          ←
        </Link>
        <div className="text-center">
          <span className="text-[10px] font-extrabold tracking-[0.15em] text-[#0085FF] uppercase">
            WINTER ARC
          </span>
          <h2 className="text-xs font-semibold text-[#64748B]">
            {sessionState === 'launcher' ? 'Deep Focus Hub' : 'Active Focus Protocol'}
          </h2>
        </div>
        <div className="w-10 flex justify-end">
          <span className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center text-xs font-bold">
            🔒
          </span>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="w-full max-w-2xl lg:max-w-4xl mx-auto px-5 py-4 flex-1 z-10 flex flex-col justify-center">
        {/* =========================================================================
            STATE 1: LOCK IN LAUNCHER (SCREEN 15)
           ========================================================================= */}
        {sessionState === 'launcher' && (
          <div className="space-y-5 animate-fade-in">
            {/* Title & Eyebrow */}
            <div className="text-center pt-1 pb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0085FF] text-[11px] font-bold tracking-wide uppercase mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0085FF] animate-ping" />
                Deep Focus Session
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-[#0A192F] tracking-tight">
                Lock <span className="gradient-text">In</span>
              </h1>
              <p className="text-[#64748B] text-xs sm:text-sm mt-1 max-w-xs mx-auto">
                Silence distractions. Dedicate uninterrupted time to forge your Arc.
              </p>
            </div>

            {/* Handwritten Script Note */}
            <div className="flex justify-end pr-2 -mb-2">
              <span className="font-handwriting text-lg sm:text-xl text-[#0085FF] -rotate-3 select-none">
                Focus Builds Freedom ~
              </span>
            </div>

            {/* 1. What do you want to focus on? */}
            <div className="arc-card p-5 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold tracking-wider text-[#64748B] uppercase">
                  1. What do you want to focus on?
                </h3>
                <span className="text-[11px] font-bold text-[#0085FF]">
                  {currentActivityObj.icon} {activeActivityName}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {ACTIVITIES.map((act) => {
                  const isSelected = selectedActivity === act.id;
                  return (
                    <button
                      key={act.id}
                      onClick={() => setSelectedActivity(act.id)}
                      className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all ${
                        isSelected
                          ? 'border-2 border-[#0085FF] bg-blue-50/50 shadow-sm'
                          : 'border border-[#E8EEF5] bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1.5">{act.icon}</span>
                      <span
                        className={`text-xs font-bold leading-tight ${
                          isSelected ? 'text-[#0085FF]' : 'text-[#0A192F]'
                        }`}
                      >
                        {act.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom input if custom selected */}
              {selectedActivity === 'custom' && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Enter activity name (e.g. Write Chapter 1)..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8EEF5] text-xs font-medium text-[#0A192F] focus:outline-none focus:border-[#0085FF]"
                  />
                </div>
              )}
            </div>

            {/* 2. Choose Duration */}
            <div className="arc-card p-5 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold tracking-wider text-[#64748B] uppercase">
                  2. Choose Duration
                </h3>
                <span className="text-[11px] font-bold text-[#FF7A00]">
                  {isCustomDuration ? `${customDurationInput} mins` : `${durationMins} mins`}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {PRESET_DURATIONS.map((preset) => {
                  const isSelected = !isCustomDuration && durationMins === preset.mins;
                  return (
                    <button
                      key={preset.mins}
                      onClick={() => {
                        setIsCustomDuration(false);
                        setDurationMins(preset.mins);
                      }}
                      className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'border-2 border-[#FF7A00] bg-orange-50/40 shadow-sm'
                          : 'border border-[#E8EEF5] bg-white hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`text-sm font-extrabold ${
                          isSelected ? 'text-[#FF7A00]' : 'text-[#0A192F]'
                        }`}
                      >
                        {preset.label}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] font-semibold mt-0.5">
                        {preset.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom slider toggle */}
              <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <button
                  onClick={() => setIsCustomDuration(!isCustomDuration)}
                  className={`text-xs font-semibold flex items-center gap-1.5 ${
                    isCustomDuration ? 'text-[#0085FF]' : 'text-[#64748B] hover:text-[#0A192F]'
                  }`}
                >
                  <span>⏱</span>
                  <span>{isCustomDuration ? 'Using Custom Time' : 'Set custom minutes...'}</span>
                </button>

                {isCustomDuration && (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="5"
                      max="180"
                      value={customDurationInput}
                      onChange={(e) => setCustomDurationInput(e.target.value)}
                      className="w-16 px-2.5 py-1 text-center font-bold text-xs rounded-lg border border-[#0085FF] text-[#0A192F] focus:outline-none"
                    />
                    <span className="text-xs text-[#64748B] font-medium">min</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Focus Commitment & Reward Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-50/60 to-orange-50/60 border border-slate-200/80 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg">
                  🏆
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0A192F]">
                    Earn +{Math.round((isCustomDuration ? parseInt(customDurationInput) || 25 : durationMins) * 0.8)} XP
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Protects your daily consistency rate
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#0085FF]">Locked Protocol</span>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={handleStartSession}
                className="w-full btn-sunset py-4 text-base font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <span>🔒</span>
                <span>Lock In Now ({isCustomDuration ? customDurationInput : durationMins} min) →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: ACTIVE FOCUS SESSION (LIVE RUNNING COUNTDOWN)
           ========================================================================= */}
        {sessionState === 'active' && (
          <div className="space-y-6 animate-fade-in py-2">
            {/* Status Pills */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF7A00] text-xs font-extrabold tracking-wide uppercase shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-ping" />
                LOCKED IN
              </div>
              <span className="text-xs font-bold text-[#64748B]">
                +{xpEarned} XP on completion
              </span>
            </div>

            {/* Activity Focus Header */}
            <div className="text-center pt-2">
              <div className="w-16 h-16 rounded-3xl bg-white border border-[#E8EEF5] shadow-md flex items-center justify-center text-3xl mx-auto mb-3">
                {currentActivityObj.icon}
              </div>
              <h2 className="text-2xl font-black font-display text-[#0A192F] tracking-tight">
                {activeActivityName}
              </h2>
              <p className="text-xs font-medium text-[#64748B] mt-1">
                Deep work in progress. All notifications silenced.
              </p>
            </div>

            {/* GIANT COUNTDOWN TIMER DIAL */}
            <div className="arc-card p-8 bg-white text-center relative overflow-hidden flex flex-col items-center justify-center shadow-lg">
              {/* Progress Ring / Background Glow */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-orange-50/30 opacity-70 pointer-events-none"
              />

              <div className="relative z-10 w-full">
                {/* Time Display */}
                <div className="font-mono text-6xl sm:text-7xl font-black tracking-tighter text-[#0A192F] py-2">
                  {formatTime(secondsLeft)}
                </div>

                <div className="text-xs font-bold tracking-widest text-[#94A3B8] uppercase mt-1">
                  {isPaused ? '⏸ SESSION PAUSED' : 'TIME REMAINING'}
                </div>

                {/* Linear Progress Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full mt-6 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#0085FF] via-[#7B61FF] to-[#FF7A00]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] font-semibold text-[#94A3B8] mt-2">
                  <span>Elapsed: {formatTime(initialSeconds - secondsLeft)}</span>
                  <span>{Math.round(progressPercent)}% Done</span>
                  <span>Total: {formatTime(initialSeconds)}</span>
                </div>
              </div>
            </div>

            {/* Inspirational Quote Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#E8EEF5] text-center shadow-sm">
              <p className="font-display italic text-xs sm:text-sm text-[#0A192F] font-semibold leading-relaxed">
                "{MOTIVATIONAL_QUOTES[quoteIndex]}"
              </p>
              <span className="font-handwriting text-base text-[#0085FF] block mt-1">
                ~ Stay focused. You are forging your Arc.
              </span>
            </div>

            {/* Active Controls */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`py-3.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                  isPaused
                    ? 'bg-emerald-500 text-white shadow-md hover:bg-emerald-600'
                    : 'bg-slate-100 text-[#0A192F] border border-slate-200 hover:bg-slate-200'
                }`}
              >
                <span>{isPaused ? '▶ Resume' : '⏸ Pause'}</span>
              </button>

              <button
                onClick={handleAdd5Mins}
                className="py-3.5 px-3 rounded-2xl bg-white border border-[#E8EEF5] text-[#0085FF] font-bold text-xs flex items-center justify-center gap-1 hover:border-[#0085FF] transition"
              >
                <span>+ 5 Min</span>
              </button>

              <button
                onClick={() => setSessionState('completed')}
                className="py-3.5 px-3 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF7A00] font-bold text-xs flex items-center justify-center gap-1 hover:bg-orange-100 transition"
              >
                <span>✓ Finish</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 3: COMPLETED CELEBRATION
           ========================================================================= */}
        {sessionState === 'completed' && (
          <div className="space-y-6 text-center animate-fade-in py-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center text-4xl mx-auto shadow-lg">
              ✓
            </div>

            <div>
              <span className="text-[11px] font-extrabold tracking-[0.2em] text-emerald-600 uppercase">
                SESSION COMPLETE
              </span>
              <h1 className="text-3xl font-black font-display text-[#0A192F] mt-1">
                Discipline <span className="gradient-text">Delivered</span>
              </h1>
              <p className="text-sm text-[#64748B] mt-1.5 max-w-xs mx-auto">
                You successfully locked in for {activeActivityName}. Another promise kept.
              </p>
            </div>

            {/* Achievement Card */}
            <div className="arc-card p-6 bg-white text-left shadow-sm">
              <div className="flex justify-between items-center pb-3 border-b border-[#F1F5F9]">
                <span className="text-xs text-[#64748B] font-semibold">Activity</span>
                <span className="text-xs font-bold text-[#0A192F]">
                  {currentActivityObj.icon} {activeActivityName}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#F1F5F9]">
                <span className="text-xs text-[#64748B] font-semibold">Duration Locked</span>
                <span className="text-xs font-bold text-[#0A192F]">
                  {formatTime(initialSeconds - secondsLeft)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-xs text-[#64748B] font-semibold">XP Earned</span>
                <span className="text-sm font-extrabold text-[#0085FF]">+{xpEarned} XP ⚡</span>
              </div>
            </div>

            {/* Return to Dashboard */}
            <div className="pt-2 space-y-3">
              <Link
                href="/"
                className="w-full btn-sunset py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Return to Home Dashboard →</span>
              </Link>
              <button
                onClick={() => setSessionState('launcher')}
                className="text-xs font-bold text-[#64748B] hover:text-[#0A192F] transition block mx-auto"
              >
                Start another session
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Mountain Sunrise Bottom Graphic ── */}
      <div className="w-full max-w-lg mx-auto relative h-28 sm:h-36 overflow-hidden pointer-events-none select-none z-0 mt-2">
        <Image
          src="/assets/mountain-sunrise.jpg"
          alt="Snowy mountain peaks with morning alpine sunrise glow"
          fill
          className="object-cover object-bottom opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />
      </div>
    </div>
  );
}
