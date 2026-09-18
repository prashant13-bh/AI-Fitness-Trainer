'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  // Current Screen State:
  // 'welcome-1' | 'welcome-2' | 'step-becoming' | 'step-identity' | 'step-goals' | 'step-duration' | 'step-focus' | 'step-habits' | 'step-create-habit' | 'step-ready' | 'celebration'
  const [screen, setScreen] = useState<
    | 'welcome-1'
    | 'welcome-2'
    | 'step-becoming'
    | 'step-identity'
    | 'step-goals'
    | 'step-duration'
    | 'step-focus'
    | 'step-habits'
    | 'step-create-habit'
    | 'step-ready'
    | 'step-all-set'
    | 'step-mountain-ready'
    | 'celebration'
  >('welcome-1');

  // Form State
  const [becomingSelections, setBecomingSelections] = useState<string[]>(['Stronger', 'Disciplined']);
  const [identityText, setIdentityText] = useState('disciplined, strong and focused.');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Get Fit', 'Read More', 'Be More Spiritual']);
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [customGoals, setCustomGoals] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState('90');
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['Body', 'Mind', 'Knowledge', 'Career']);
  const [habitFilter, setHabitFilter] = useState('All');
  const [selectedHabits, setSelectedHabits] = useState<string[]>([
    'Workout',
    'Meditation',
    'Read Books',
    'Deep Work',
    'Sleep Early',
  ]);

  // Create Habit Modal State
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitArea, setNewHabitArea] = useState('Body');
  const [newHabitType, setNewHabitType] = useState('Yes / No');
  const [newHabitTarget, setNewHabitTarget] = useState('4');
  const [newHabitDays, setNewHabitDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [newHabitReminder, setNewHabitReminder] = useState(true);
  const [newHabitTime, setNewHabitTime] = useState('7:00 AM');
  const [newHabitNotes, setNewHabitNotes] = useState('');

  // Toggle helpers
  const toggleBecoming = (id: string) => {
    setBecomingSelections((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleGoal = (name: string) => {
    setSelectedGoals((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  };

  const addCustomGoal = () => {
    if (!customGoalInput.trim()) return;
    setCustomGoals((prev) => [...prev, customGoalInput.trim()]);
    setSelectedGoals((prev) => [...prev, customGoalInput.trim()]);
    setCustomGoalInput('');
  };

  const toggleArea = (name: string) => {
    setSelectedAreas((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  };

  const toggleHabit = (name: string) => {
    setSelectedHabits((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  };

  const toggleHabitDay = (day: string) => {
    setNewHabitDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleSaveCustomHabit = () => {
    if (newHabitName.trim()) {
      setSelectedHabits((prev) => [...prev, newHabitName.trim()]);
    }
    setScreen('step-habits');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] flex flex-col justify-between relative overflow-x-hidden">
      {/* ── TOP NAVIGATION BAR (Present on Steps) ── */}
      {screen !== 'welcome-1' && screen !== 'welcome-2' && screen !== 'celebration' && (
        <header className="w-full max-w-md mx-auto pt-6 px-5 flex items-center justify-between z-20">
          <button
            onClick={() => {
              if (screen === 'step-becoming') setScreen('welcome-1');
              else if (screen === 'step-identity') setScreen('step-becoming');
              else if (screen === 'step-goals') setScreen('step-identity');
              else if (screen === 'step-duration') setScreen('step-goals');
              else if (screen === 'step-focus') setScreen('step-duration');
              else if (screen === 'step-habits') setScreen('step-focus');
              else if (screen === 'step-create-habit') setScreen('step-habits');
              else if (screen === 'step-ready') setScreen('step-habits');
              else if (screen === 'step-all-set') setScreen('step-ready');
              else if (screen === 'step-mountain-ready') setScreen('step-all-set');
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#0A192F] hover:bg-slate-200/60 transition"
          >
            ←
          </button>

          {/* Gradient Progress Bar */}
          <div className="flex-1 mx-3 max-w-[140px]">
            <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[#0085FF] via-[#7B61FF] to-[#FF7A00]"
                style={{
                  width:
                    screen === 'step-becoming'
                      ? '33%'
                      : screen === 'step-identity'
                      ? '50%'
                      : screen === 'step-goals'
                      ? '50%'
                      : screen === 'step-duration'
                      ? '66%'
                      : screen === 'step-focus'
                      ? '83%'
                      : '100%',
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#64748B]">
              {screen === 'step-becoming'
                ? '02 / 06'
                : screen === 'step-identity'
                ? '03 / 06'
                : screen === 'step-goals'
                ? '03 / 06'
                : screen === 'step-duration'
                ? '04 / 06'
                : screen === 'step-focus'
                ? '05 / 06'
                : screen === 'step-create-habit'
                ? '07 / 12'
                : '06 / 06'}
            </span>
            <button
              onClick={() => setScreen('step-ready')}
              className="text-xs font-bold text-[#0085FF] hover:text-[#0052FF] ml-1"
            >
              Skip
            </button>
          </div>
        </header>
      )}

      {/* ── TOP BAR FOR WELCOME OR CELEBRATION ── */}
      {(screen === 'welcome-1' || screen === 'welcome-2' || screen === 'celebration') && (
        <header className="w-full max-w-md mx-auto pt-6 px-5 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              {/* Mountain Icon Logo */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L3 19H21L12 4Z" fill="url(#crest-grad)" />
                <defs>
                  <linearGradient id="crest-grad" x1="3" y1="4" x2="21" y2="19">
                    <stop stopColor="#0085FF" />
                    <stop offset="1" stopColor="#FF7A00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-black tracking-[0.14em] text-[#0A192F] uppercase">
                WINTER ARC
              </div>
              <div className="text-[8px] font-semibold text-[#94A3B8] tracking-wider uppercase">
                Discipline Creates Freedom
              </div>
            </div>
          </div>

          <button
            onClick={() => setScreen('step-becoming')}
            className="text-xs font-bold text-[#0085FF] hover:text-[#0052FF]"
          >
            {screen === 'celebration' ? 'Done' : 'Skip'}
          </button>
        </header>
      )}

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="w-full max-w-md mx-auto px-5 py-3 flex-1 z-10 flex flex-col justify-start">
        {/* =========================================================================
            SCREEN 0A: WELCOME CAROUSEL (SLIDE 1 - SCREENSHOT 3)
           ========================================================================= */}
        {screen === 'welcome-1' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-4 pb-2">
            <div>
              {/* Main Headline */}
              <h1 className="text-4xl font-black font-display text-[#0A192F] tracking-tight leading-[1.15]">
                A Better You <br />
                <span className="gradient-text">Starts Now</span>
              </h1>
              <p className="text-[#64748B] text-sm mt-2 font-medium">
                90 days. One promise. A different you.
              </p>

              {/* Handwritten Script Badge */}
              <div className="flex justify-end pr-3 mt-1">
                <div className="text-right">
                  <span className="font-handwriting text-xl text-[#0085FF] -rotate-6 inline-block leading-tight select-none">
                    Same You <br /> But Stronger
                  </span>
                  <div className="w-16 h-1 bg-[#FF7A00] rounded-full mt-0.5 ml-auto opacity-70" />
                </div>
              </div>

              {/* 4 Feature Bullet Items */}
              <div className="space-y-3 mt-4">
                <div className="arc-card p-3 flex items-center gap-3.5 bg-white">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0085FF] flex items-center justify-center text-xl flex-shrink-0">
                    🏋️
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0A192F]">Build Habits</h3>
                    <p className="text-xs text-[#64748B] font-medium">Small steps. Big change.</p>
                  </div>
                </div>

                <div className="arc-card p-3 flex items-center gap-3.5 bg-white">
                  <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center text-xl flex-shrink-0">
                    🧠
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0A192F]">Clear Mind</h3>
                    <p className="text-xs text-[#64748B] font-medium">Focus on what matters.</p>
                  </div>
                </div>

                <div className="arc-card p-3 flex items-center gap-3.5 bg-white">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7B61FF] flex items-center justify-center text-xl flex-shrink-0">
                    📊
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0A192F]">Track Progress</h3>
                    <p className="text-xs text-[#64748B] font-medium">See your growth.</p>
                  </div>
                </div>

                <div className="arc-card p-3 flex items-center gap-3.5 bg-white">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center text-xl flex-shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0A192F]">Stronger You</h3>
                    <p className="text-xs text-[#64748B] font-medium">Discipline creates freedom.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 space-y-3">
              <button
                onClick={() => setScreen('welcome-2')}
                className="w-full btn-sunset py-4 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Get Started →</span>
              </button>

              <div className="text-center">
                <span className="text-xs text-[#64748B]">Already have an account? </span>
                <Link href="/login" className="text-xs font-bold text-[#0085FF] hover:underline">
                  Sign In
                </Link>
              </div>

              {/* Carousel Dots */}
              <div className="flex justify-center items-center gap-1.5 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0085FF]" />
                <button onClick={() => setScreen('welcome-2')} className="w-2 h-2 rounded-full bg-slate-300" />
                <button onClick={() => setScreen('step-becoming')} className="w-2 h-2 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 0B: WELCOME CAROUSEL (SLIDE 2 - SECOND WELCOME SCREENSHOT)
           ========================================================================= */}
        {screen === 'welcome-2' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-4 pb-2">
            <div>
              <h1 className="text-4xl font-black font-display text-[#0A192F] tracking-tight leading-[1.15]">
                Your Journey <br />
                <span className="gradient-text">Starts Now</span>
              </h1>
              <p className="text-[#64748B] text-sm mt-2 font-medium">
                Small steps. Daily action. A better you. You've got this!
              </p>

              {/* Handwritten Script Badge */}
              <div className="flex justify-end pr-3 mt-1">
                <div className="text-right">
                  <span className="font-handwriting text-xl text-[#0085FF] -rotate-6 inline-block leading-tight select-none">
                    Discipline <br /> Creates Freedom
                  </span>
                  <div className="w-20 h-1 bg-[#FF7A00] rounded-full mt-0.5 ml-auto opacity-70" />
                </div>
              </div>

              {/* 4 Feature Items */}
              <div className="space-y-3 mt-4">
                <div className="arc-card p-3.5 flex items-center gap-3.5 bg-white">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0085FF] flex items-center justify-center text-xl flex-shrink-0">
                    📊
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0A192F]">Track Progress</h3>
                    <p className="text-xs text-[#64748B]">See your growth every day</p>
                  </div>
                </div>

                <div className="arc-card p-3.5 flex items-center gap-3.5 bg-white">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center text-xl flex-shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0A192F]">Stay Consistent</h3>
                    <p className="text-xs text-[#64748B]">Build habits that last</p>
                  </div>
                </div>

                <div className="arc-card p-3.5 flex items-center gap-3.5 bg-white">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#EF4444] flex items-center justify-center text-xl flex-shrink-0">
                    ❤️
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0A192F]">Feel Better</h3>
                    <p className="text-xs text-[#64748B]">A healthier, happier you</p>
                  </div>
                </div>

                <div className="arc-card p-3.5 flex items-center gap-3.5 bg-white">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#F59E0B] flex items-center justify-center text-xl flex-shrink-0">
                    ⭐
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0A192F]">Achieve More</h3>
                    <p className="text-xs text-[#64748B]">Turn your goals into reality</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <button
                onClick={() => setScreen('step-becoming')}
                className="w-full btn-sunset py-4 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Let's Do This →</span>
              </button>

              <div className="flex justify-center items-center gap-1.5 pt-1">
                <button onClick={() => setScreen('welcome-1')} className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#0085FF]" />
                <button onClick={() => setScreen('step-becoming')} className="w-2 h-2 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 1: 02 / 06 - "WHO ARE YOU BECOMING?" (SCREENSHOT 2)
           ========================================================================= */}
        {screen === 'step-becoming' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-[#0085FF] uppercase">
                WINTER ARC
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
                    Who are you <br />
                    <span className="gradient-text">becoming?</span>
                  </h1>
                  <p className="text-[#64748B] text-xs font-medium mt-1">
                    Choose what <strong className="text-[#0A192F]">matters to you</strong>. You can select multiple.
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-handwriting text-lg text-[#0085FF] -rotate-6 inline-block leading-tight select-none">
                    Better Habits <br /> Brighter Future
                  </span>
                  <div className="w-16 h-1 bg-[#FF7A00] rounded-full mt-0.5 ml-auto opacity-70" />
                </div>
              </div>

              {/* 3x3 Card Grid */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                {[
                  { id: 'Stronger', label: 'Stronger', desc: 'Build a healthier body', icon: '🏋️', color: 'blue' },
                  { id: 'Sharper', label: 'Sharper', desc: 'Improve focus and clarity', icon: '🧠', color: 'pink' },
                  { id: 'Disciplined', label: 'Disciplined', desc: 'Be consistent in everything', icon: '🎯', color: 'orange' },
                  { id: 'Knowledgeable', label: 'Knowledgeable', desc: 'Learn new skills and grow', icon: '📖', color: 'purple' },
                  { id: 'Successful', label: 'Successful', desc: 'Build the career I want', icon: '📊', color: 'amber' },
                  { id: 'Peaceful', label: 'Peaceful', desc: 'A calmer and happier mind', icon: '🍃', color: 'green' },
                  { id: 'Healthy', label: 'Healthy', desc: 'Feel good inside and out', icon: '❤️', color: 'rose' },
                  { id: 'Financially Free', label: 'Financially Free', desc: 'Better money habits', icon: '🪙', color: 'gold' },
                  { id: 'Better Relationships', label: 'Better Relationships', desc: 'Be a better friend, family member', icon: '👥', color: 'indigo' },
                ].map((item) => {
                  const isSelected = becomingSelections.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleBecoming(item.id)}
                      className={`relative p-2.5 rounded-2xl flex flex-col items-center text-center transition-all bg-white ${
                        isSelected
                          ? item.color === 'orange'
                            ? 'arc-card-selected-orange'
                            : 'arc-card-selected-blue'
                          : 'arc-card hover:border-slate-300'
                      }`}
                    >
                      {/* Check badge */}
                      {isSelected && (
                        <div
                          className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                            item.color === 'orange' ? 'bg-[#FF7A00]' : 'bg-[#0085FF]'
                          }`}
                        >
                          ✓
                        </div>
                      )}
                      <span className="text-2xl mt-1 mb-1">{item.icon}</span>
                      <span className="text-xs font-bold text-[#0A192F] leading-tight">{item.label}</span>
                      <span className="text-[9px] text-[#64748B] leading-tight mt-1 line-clamp-2">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => setScreen('step-identity')}
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Next →</span>
              </button>

              <div className="flex justify-center items-center">
                <span className="font-handwriting text-base text-[#0085FF]">
                  Discipline today, a different tomorrow.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: 03 / 06 - "YOUR IDENTITY" (SCREENSHOT 1)
           ========================================================================= */}
        {screen === 'step-identity' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-[#0085FF] uppercase">
                WINTER ARC
              </div>
              <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
                Your <span className="gradient-text">Identity</span>
              </h1>
              <p className="text-[#64748B] text-xs font-medium mt-1">
                Complete the sentence below. This will be your guide throughout the Arc.
              </p>

              {/* Quote Card */}
              <div className="arc-card p-5 bg-white mt-4 relative">
                <span className="text-4xl text-blue-200 font-serif leading-none block -mb-2 select-none">
                  “
                </span>
                <span className="text-xs font-bold text-[#94A3B8] tracking-wider uppercase block mb-1.5">
                  I am becoming...
                </span>

                <textarea
                  value={identityText}
                  onChange={(e) => setIdentityText(e.target.value.slice(0, 100))}
                  rows={2}
                  className="w-full text-lg sm:text-xl font-extrabold text-[#0085FF] bg-transparent resize-none border-b-2 border-blue-400/50 pb-1 focus:outline-none focus:border-[#0085FF]"
                />

                <div className="text-right text-[11px] text-[#94A3B8] font-semibold mt-2">
                  {identityText.length} / 100
                </div>
              </div>

              {/* Inspiration Chips */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#0A192F]">Need inspiration?</span>
                  <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Tap to use</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'a healthier and happier me',
                    'the best version of myself',
                    'more disciplined and consistent',
                    'mentally stronger and calmer',
                    'focused, productive and successful',
                    'financially free and independent',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setIdentityText(chip)}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[#0085FF] text-xs font-semibold hover:bg-blue-100 transition"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remember Box */}
              <div className="arc-card p-3.5 bg-amber-50/50 border-amber-100 flex items-start gap-3 mt-4">
                <span className="text-xl">💡</span>
                <div>
                  <h4 className="text-xs font-bold text-[#B45309]">Remember</h4>
                  <p className="text-[11px] text-[#92400E] leading-relaxed">
                    Your identity is not what you are now, but what you are becoming.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => setScreen('step-goals')}
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Next →</span>
              </button>

              <div className="flex justify-center items-center">
                <span className="font-handwriting text-base text-[#0085FF]">
                  Same You But Stronger ~
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: 03 / 06 - "WHAT ARE YOUR GOALS?" (NEW SCREENSHOT 3)
           ========================================================================= */}
        {screen === 'step-goals' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-[#0085FF] uppercase">
                WINTER ARC
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
                    What Are Your <br />
                    <span className="gradient-text">Goals?</span>
                  </h1>
                  <p className="text-[#64748B] text-xs font-medium mt-1">
                    Choose what you want to achieve during your Winter Arc. Set clear goals to stay motivated.
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-handwriting text-lg text-[#0085FF] -rotate-6 inline-block leading-tight select-none">
                    Bigger Goals <br /> A Brighter You
                  </span>
                  <div className="w-16 h-1 bg-[#FF7A00] rounded-full mt-0.5 ml-auto opacity-70" />
                </div>
              </div>

              {/* 2-column Goals Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { name: 'Get Fit', desc: 'Build a stronger, healthier body', icon: '🏋️', color: 'blue' },
                  { name: 'Read More', desc: 'Learn, grow and expand your mind', icon: '📖', color: 'pink' },
                  { name: 'Advance Career', desc: 'Build skills and create opportunities', icon: '💼', color: 'orange' },
                  { name: 'Improve Finances', desc: 'Gain financial freedom', icon: '🪙', color: 'green' },
                  { name: 'Be More Spiritual', desc: 'Find peace and inner clarity', icon: '🧘', color: 'purple' },
                  { name: 'Stronger Relationships', desc: 'Build deeper and meaningful connections', icon: '❤️', color: 'rose' },
                ].map((g) => {
                  const isSelected = selectedGoals.includes(g.name);
                  return (
                    <button
                      key={g.name}
                      onClick={() => toggleGoal(g.name)}
                      className={`relative p-3 rounded-2xl flex items-start gap-2.5 text-left transition-all bg-white ${
                        isSelected ? 'arc-card-selected-blue' : 'arc-card hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{g.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-[#0A192F] leading-tight">{g.name}</h4>
                        <p className="text-[10px] text-[#64748B] leading-snug mt-0.5">{g.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#0085FF] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Goal Card */}
              <div className="arc-card p-3 bg-white mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base text-[#0085FF]">🎯</span>
                  <div>
                    <h5 className="text-xs font-bold text-[#0A192F]">Add a Custom Goal</h5>
                    <p className="text-[10px] text-[#64748B]">Have something else in mind? Add your own goal.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Start a business, Learn a new language..."
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#E8EEF5] text-xs text-[#0A192F] focus:outline-none focus:border-[#0085FF]"
                  />
                  <button
                    onClick={addCustomGoal}
                    className="w-8 h-8 rounded-xl bg-blue-50 text-[#0085FF] font-bold text-base flex items-center justify-center hover:bg-blue-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Selected Summary Banner */}
              <div className="arc-card p-3 bg-blue-50/40 border-blue-100 flex items-center gap-2.5 mt-3">
                <span className="text-base text-[#0085FF]">🚩</span>
                <p className="text-[11px] text-[#0A192F] font-medium leading-snug">
                  You have selected <strong>{selectedGoals.length} goals</strong>. Focus on what truly matters. You can always update them later.
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => setScreen('step-duration')}
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Next →</span>
              </button>

              <div className="flex justify-center items-center">
                <span className="font-handwriting text-base text-[#0085FF]">
                  Discipline Turns Goals Into Reality
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: 04 / 06 - "CHOOSE YOUR ARC DURATION" (SCREENSHOT 4)
           ========================================================================= */}
        {screen === 'step-duration' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-[#0085FF] uppercase">
                WINTER ARC
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
                    Choose Your <br />
                    <span className="gradient-text">Arc Duration</span>
                  </h1>
                  <p className="text-[#64748B] text-xs font-medium mt-1">
                    How long do you want to commit? A focused period can create extraordinary results.
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-handwriting text-lg text-[#0085FF] -rotate-6 inline-block leading-tight select-none">
                    Discipline Today <br /> Freedom Tomorrow
                  </span>
                  <div className="w-16 h-1 bg-[#FF7A00] rounded-full mt-0.5 ml-auto opacity-70" />
                </div>
              </div>

              {/* 2x2 Grid of Duration Options */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { days: '30', label: '30 Days', sub: 'Build the habit', icon: '📅', color: 'blue' },
                  { days: '60', label: '60 Days', sub: 'Go deeper', icon: '📅', color: 'purple' },
                  { days: '90', label: '90 Days', sub: 'Transform completely', icon: '📅', color: 'orange' },
                  { days: 'custom', label: 'Custom', sub: 'Set your own dates', icon: '🎛️', color: 'cyan' },
                ].map((d) => {
                  const isSelected = selectedDuration === d.days;
                  return (
                    <button
                      key={d.days}
                      onClick={() => setSelectedDuration(d.days)}
                      className={`p-4 rounded-2xl flex flex-col items-center text-center transition-all bg-white relative ${
                        isSelected ? 'arc-card-selected-orange' : 'arc-card hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{d.icon}</span>
                      <h4 className="text-sm font-extrabold text-[#0A192F]">{d.label}</h4>
                      <p className="text-[10px] text-[#64748B] mt-0.5">{d.sub}</p>
                      <div
                        className={`w-5 h-5 rounded-full border-2 mt-2 flex items-center justify-center ${
                          isSelected ? 'border-[#0085FF] bg-[#0085FF] text-white text-xs' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dates Preview Card */}
              <div className="arc-card p-3.5 bg-white mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#94A3B8] font-semibold block">Start Date</span>
                  <span className="text-xs font-bold text-[#0A192F]">Nov 1, 2025</span>
                </div>
                <span className="text-slate-300 text-sm">→</span>
                <div className="text-right">
                  <span className="text-[10px] text-[#94A3B8] font-semibold block">End Date</span>
                  <span className="text-xs font-bold text-[#0A192F]">Jan 29, 2026</span>
                </div>
              </div>

              {/* Tip Banner */}
              <div className="arc-card p-3.5 bg-blue-50/50 border-blue-100 flex items-center gap-3 mt-3">
                <span className="text-xl">🎯</span>
                <div>
                  <h5 className="text-xs font-bold text-[#0A192F]">90 days can change your life.</h5>
                  <p className="text-[11px] text-[#64748B]">Same you, but a stronger version.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => setScreen('step-focus')}
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Next →</span>
              </button>

              <div className="flex justify-center items-center">
                <span className="font-handwriting text-base text-[#0085FF]">
                  Higher Discipline Brighter You ~
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: 05 / 06 - "WHAT ARE YOUR MAIN FOCUS AREAS?" (SCREENSHOT 5)
           ========================================================================= */}
        {screen === 'step-focus' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-[#0085FF] uppercase">
                WINTER ARC
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
                    What are your <br />
                    <span className="gradient-text">main focus areas?</span>
                  </h1>
                  <p className="text-[#64748B] text-xs font-medium mt-1">
                    Choose the areas you want to work on. You can always change this later.
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-handwriting text-lg text-[#0085FF] -rotate-6 inline-block leading-tight select-none">
                    Small Steps <br /> Big Results
                  </span>
                  <div className="w-16 h-1 bg-[#FF7A00] rounded-full mt-0.5 ml-auto opacity-70" />
                </div>
              </div>

              {/* 2-column Focus Areas Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { name: 'Body', desc: 'Get stronger and healthier', icon: '💪', color: 'blue' },
                  { name: 'Mind', desc: 'Be calmer and focused', icon: '🧠', color: 'orange' },
                  { name: 'Knowledge', desc: 'Learn new skills and grow', icon: '📖', color: 'blue' },
                  { name: 'Career', desc: 'Build the future you want', icon: '💼', color: 'orange' },
                  { name: 'Money', desc: 'Build financial freedom', icon: '🪙', color: 'gold' },
                  { name: 'Relationships', desc: 'Be a better friend & family member', icon: '❤️', color: 'rose' },
                  { name: 'Spirituality', desc: 'Find purpose and inner peace', icon: '🍃', color: 'green' },
                  { name: 'Other', desc: 'Set your own focus area', icon: '💬', color: 'slate' },
                ].map((area) => {
                  const isSelected = selectedAreas.includes(area.name);
                  return (
                    <button
                      key={area.name}
                      onClick={() => toggleArea(area.name)}
                      className={`relative p-3 rounded-2xl flex items-start gap-2.5 text-left transition-all bg-white ${
                        isSelected
                          ? area.color === 'orange'
                            ? 'arc-card-selected-orange'
                            : 'arc-card-selected-blue'
                          : 'arc-card hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{area.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-[#0A192F]">{area.name}</h4>
                        <p className="text-[10px] text-[#64748B] leading-snug mt-0.5">{area.desc}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                          isSelected
                            ? area.color === 'orange'
                              ? 'bg-[#FF7A00] border-[#FF7A00] text-white'
                              : 'bg-[#0085FF] border-[#0085FF] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tip Banner */}
              <div className="arc-card p-3.5 bg-blue-50/50 border-blue-100 flex items-center gap-3 mt-4">
                <span className="text-xl">🎯</span>
                <div>
                  <h5 className="text-xs font-bold text-[#0A192F]">A balanced you leads to a better tomorrow.</h5>
                  <p className="text-[11px] text-[#64748B]">You can focus on multiple areas at the same time.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => setScreen('step-habits')}
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Next →</span>
              </button>

              <div className="flex justify-center items-center">
                <span className="font-handwriting text-base text-[#0085FF]">
                  Discipline Today Freedom Tomorrow
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 6: 06 / 06 - "CHOOSE YOUR HABITS" (NEW SCREENSHOT 7)
           ========================================================================= */}
        {screen === 'step-habits' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-[#0085FF] uppercase">
                WINTER ARC
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
                    Choose Your <br />
                    <span className="gradient-text">Habits</span>
                  </h1>
                  <p className="text-[#64748B] text-xs font-medium mt-1">
                    Small habits. Massive results. Select the habits you want to include in your Arc.
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-handwriting text-lg text-[#0085FF] -rotate-6 inline-block leading-tight select-none">
                    Better Habits <br /> Brighter Future
                  </span>
                  <div className="w-16 h-1 bg-[#FF7A00] rounded-full mt-0.5 ml-auto opacity-70" />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-2 mt-2">
                {['All', 'Body', 'Mind', 'Knowledge', 'Career'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setHabitFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      habitFilter === cat
                        ? 'bg-[#0085FF] text-white shadow-sm'
                        : 'bg-white border border-[#E8EEF5] text-[#64748B] hover:text-[#0A192F]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => setScreen('step-create-habit')}
                  className="px-2.5 py-1 rounded-full text-xs font-bold text-[#FF7A00] bg-orange-50 border border-orange-200 ml-auto flex-shrink-0"
                >
                  + Custom
                </button>
              </div>

              {/* 2-column Habit Cards */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { name: 'Workout', desc: 'Get stronger and healthier', icon: '🏋️', area: 'Body', color: 'blue' },
                  { name: 'Meditation', desc: 'A calmer and focused mind', icon: '🧘', area: 'Mind', color: 'orange' },
                  { name: 'Read Books', desc: 'Learn and grow daily', icon: '📖', area: 'Knowledge', color: 'blue' },
                  { name: 'Deep Work', desc: 'Focus on your goals', icon: '💻', area: 'Career', color: 'blue' },
                  { name: 'Drink Water', desc: 'Stay hydrated', icon: '💧', area: 'Body', color: 'slate' },
                  { name: 'Sleep Early', desc: 'Better energy tomorrow', icon: '🌙', area: 'Body', color: 'orange' },
                  { name: 'Daily Steps', desc: 'Move more', icon: '🏃', area: 'Body', color: 'slate' },
                  { name: 'Limit Screen Time', desc: 'Be present', icon: '📵', area: 'Mind', color: 'slate' },
                  { name: 'Track Expenses', desc: 'Build financial discipline', icon: '🎯', area: 'Career', color: 'slate' },
                  { name: 'Gratitude', desc: 'A happier you', icon: '❤️', area: 'Mind', color: 'slate' },
                ]
                  .filter((h) => habitFilter === 'All' || h.area === habitFilter)
                  .map((h) => {
                    const isSelected = selectedHabits.includes(h.name);
                    return (
                      <button
                        key={h.name}
                        onClick={() => toggleHabit(h.name)}
                        className={`relative p-3 rounded-2xl flex items-start gap-2.5 text-left transition-all bg-white ${
                          isSelected
                            ? h.color === 'orange'
                              ? 'arc-card-selected-orange'
                              : 'arc-card-selected-blue'
                            : 'arc-card hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{h.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-extrabold text-[#0A192F]">{h.name}</h4>
                          <p className="text-[10px] text-[#64748B] leading-snug mt-0.5">{h.desc}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                            isSelected
                              ? h.color === 'orange'
                                ? 'bg-[#FF7A00] border-[#FF7A00] text-white'
                                : 'bg-[#0085FF] border-[#0085FF] text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && '✓'}
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Tip box */}
              <div className="arc-card p-3 bg-blue-50/40 border-blue-100 flex items-center gap-2.5 mt-3">
                <span className="text-base text-[#0085FF]">✨</span>
                <p className="text-[11px] text-[#0A192F] font-medium leading-snug">
                  You can always add, remove or edit habits later. Start simple and be consistent.
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => setScreen('step-ready')}
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Create My Arc →</span>
              </button>

              <div className="flex justify-center items-center">
                <span className="font-handwriting text-base text-[#0085FF]">
                  Discipline Creates Freedom
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-STEP: "CREATE A HABIT" (SCREENSHOT 4 OF SET 2)
           ========================================================================= */}
        {screen === 'step-create-habit' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-[#0085FF] uppercase">
                WINTER ARC
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
                    Create a <span className="gradient-text">Habit</span>
                  </h1>
                  <p className="text-[#64748B] text-xs font-medium mt-1">
                    Turn your intentions into actions. Small consistent habits create extraordinary results.
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-handwriting text-lg text-[#0085FF] -rotate-6 inline-block leading-tight select-none">
                    Discipline <br /> Builds Freedom
                  </span>
                  <div className="w-16 h-1 bg-[#FF7A00] rounded-full mt-0.5 ml-auto opacity-70" />
                </div>
              </div>

              {/* Habit Form */}
              <div className="space-y-3 mt-3">
                {/* Habit Name */}
                <div className="arc-card p-3.5 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#64748B]">Habit Name</span>
                    <span className="text-[10px] text-[#94A3B8]">0/50</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Workout, Read Books, Drink Water..."
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value.slice(0, 50))}
                    className="w-full text-xs font-semibold text-[#0A192F] focus:outline-none"
                  />
                </div>

                {/* Category Pills */}
                <div className="arc-card p-3 bg-white">
                  <span className="text-xs font-bold text-[#64748B] block mb-2">Category / Area</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Body', 'Mind', 'Knowledge', 'Career', 'Finance', 'Spirituality', 'Relationships', 'Other'].map(
                      (cat) => (
                        <button
                          key={cat}
                          onClick={() => setNewHabitArea(cat)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            newHabitArea === cat
                              ? 'bg-[#0085FF] text-white shadow-sm'
                              : 'bg-slate-50 border border-[#E8EEF5] text-[#64748B]'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Tracking Type */}
                <div className="arc-card p-3 bg-white">
                  <span className="text-xs font-bold text-[#64748B] block mb-2">Tracking Type</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['Yes / No', 'Quantity', 'Duration', 'Count'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setNewHabitType(type)}
                        className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-all ${
                          newHabitType === type
                            ? 'border-[#0085FF] bg-blue-50/60 text-[#0085FF]'
                            : 'border-[#E8EEF5] text-[#64748B]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency Mon-Sun */}
                <div className="arc-card p-3 bg-white">
                  <span className="text-xs font-bold text-[#64748B] block mb-2">Frequency</span>
                  <div className="grid grid-cols-7 gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => {
                      const isSelected = newHabitDays.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() => toggleHabitDay(d)}
                          className={`py-1.5 rounded-lg text-center text-xs font-bold transition-all ${
                            isSelected ? 'bg-[#0085FF] text-white shadow-sm' : 'bg-slate-100 text-[#64748B]'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Minimum Day & Reminder 2-column */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="arc-card p-3 bg-white">
                    <span className="text-xs font-bold text-[#64748B] block mb-1">Minimum Day</span>
                    <input
                      type="number"
                      defaultValue="1"
                      className="w-full text-xs font-bold text-[#0A192F] border-b border-[#E8EEF5] pb-1 focus:outline-none"
                    />
                    <span className="text-[9px] text-[#94A3B8] block mt-1">Start tracking from this day</span>
                  </div>

                  <div className="arc-card p-3 bg-white">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-[#64748B]">Reminder</span>
                      <input
                        type="checkbox"
                        checked={newHabitReminder}
                        onChange={(e) => setNewHabitReminder(e.target.checked)}
                        className="accent-[#0085FF]"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#0A192F]">{newHabitTime}</span>
                    <span className="text-[9px] text-[#94A3B8] block mt-1">We'll remind you at this time</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={handleSaveCustomHabit}
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Create Habit →</span>
              </button>

              <div className="flex justify-center items-center">
                <span className="font-handwriting text-base text-[#0085FF]">
                  Small Habits Big Results ~
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 7: 06 / 06 - "YOUR ARC IS READY!" (SCREENSHOT 5 OF SET 2)
           ========================================================================= */}
        {screen === 'step-ready' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-[#0085FF] uppercase">
                WINTER ARC
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
                    Your Arc is <br />
                    <span className="gradient-text">Ready!</span>
                  </h1>
                  <p className="text-[#64748B] text-xs font-medium mt-1">
                    Review your plan below. You're all set to begin your 90-day transformation.
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-handwriting text-lg text-[#0085FF] -rotate-6 inline-block leading-tight select-none">
                    Same You <br /> Stronger Soon
                  </span>
                  <div className="w-16 h-1 bg-[#FF7A00] rounded-full mt-0.5 ml-auto opacity-70" />
                </div>
              </div>

              {/* Summary Cards */}
              <div className="space-y-2.5 mt-3">
                {/* Duration & Identity */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="arc-card p-3 bg-white">
                    <span className="text-[10px] font-semibold text-[#94A3B8]">Duration</span>
                    <div className="text-sm font-black text-[#0A192F]">{selectedDuration} Days</div>
                    <div className="text-[9px] text-[#64748B] mt-0.5">Nov 1, 2025 → Jan 29, 2026</div>
                  </div>

                  <div className="arc-card p-3 bg-white">
                    <span className="text-[10px] font-semibold text-[#94A3B8]">Your Identity</span>
                    <div className="text-xs font-bold text-[#0085FF] line-clamp-2 mt-0.5">
                      "{identityText}"
                    </div>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="arc-card p-3 bg-white">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-[#0A192F]">
                      Focus Areas ({selectedAreas.length})
                    </span>
                    <button
                      onClick={() => setScreen('step-focus')}
                      className="text-[11px] font-bold text-[#0085FF]"
                    >
                      Edit &gt;
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedAreas.map((a) => (
                      <span
                        key={a}
                        className="px-2 py-0.5 rounded-lg bg-blue-50 text-[#0085FF] text-[10px] font-bold"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div className="arc-card p-3 bg-white">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-[#0A192F]">
                      Goals ({selectedGoals.length})
                    </span>
                    <button
                      onClick={() => setScreen('step-goals')}
                      className="text-[11px] font-bold text-[#0085FF]"
                    >
                      Edit &gt;
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedGoals.map((g) => (
                      <span
                        key={g}
                        className="px-2 py-0.5 rounded-lg bg-purple-50 text-[#7B61FF] text-[10px] font-bold"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Habits */}
                <div className="arc-card p-3 bg-white">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-[#0A192F]">
                      Habits ({selectedHabits.length})
                    </span>
                    <button
                      onClick={() => setScreen('step-habits')}
                      className="text-[11px] font-bold text-[#0085FF]"
                    >
                      Edit &gt;
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedHabits.map((h) => (
                      <span
                        key={h}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 text-[#10B981] text-[10px] font-bold"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tip Box */}
                <div className="arc-card p-3 bg-blue-50/50 border-blue-100 flex items-center gap-3">
                  <span className="text-xl">🏔️</span>
                  <div>
                    <h5 className="text-xs font-bold text-[#0A192F]">You're prepared. Now it's time to begin.</h5>
                    <p className="text-[11px] text-[#64748B]">Discipline today creates a brighter tomorrow.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => setScreen('step-all-set')}
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Continue Review →</span>
              </button>

              <div className="flex justify-center items-center">
                <span className="font-handwriting text-base text-[#0085FF]">
                  Discipline Creates Freedom
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 7B: "YOU'RE ALL SET!" (SCREENSHOT FROM USER UPLOAD media_1789748738313.jpg)
           ========================================================================= */}
        {screen === 'step-all-set' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-[#0085FF] uppercase">
                WINTER ARC
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
                    You're <span className="gradient-text">All Set!</span>
                  </h1>
                  <p className="text-[#64748B] text-xs font-medium mt-1">
                    Here's your Arc summary. Review your choices and start your journey.
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-handwriting text-base text-[#0085FF] -rotate-6 inline-block leading-tight select-none">
                    Discipline Today <br /> A Better Tomorrow
                  </span>
                  <div className="w-16 h-1 bg-[#FF7A00] rounded-full mt-0.5 ml-auto opacity-70" />
                </div>
              </div>

              {/* Vision Card with Rocket Icon */}
              <div className="arc-card p-4 bg-white mt-3 border-blue-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg shadow-md">
                    🚀
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#94A3B8] tracking-widest uppercase block">
                      YOUR ARC VISION
                    </span>
                    <p className="text-xs font-extrabold text-[#0A192F] italic">
                      “I am becoming {identityText}”
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold text-[#475569]">
                  <span>📅</span>
                  <span>Duration: {selectedDuration} Days (Nov 1, 2025 → Jan 29, 2026)</span>
                </div>
              </div>

              {/* Focus Areas Section */}
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-black text-[#0A192F] uppercase tracking-wide">
                    Your Focus Areas
                  </h3>
                  <span className="text-[10px] font-bold text-[#0085FF] bg-blue-50 px-2 py-0.5 rounded-full">
                    {selectedAreas.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {selectedAreas.map((area, idx) => (
                    <div key={area} className="arc-card p-2.5 bg-white flex items-center gap-2">
                      <span className="text-base">
                        {idx === 0 ? '💪' : idx === 1 ? '🧠' : idx === 2 ? '📖' : idx === 3 ? '💼' : '✨'}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#0A192F]">{area}</div>
                        <div className="text-[9px] text-[#64748B]">Focus on your goals</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banner */}
              <div className="arc-card p-3 bg-blue-50/50 border-blue-100 mt-3 flex items-center gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <h5 className="text-xs font-bold text-[#0A192F]">Small steps. Big results.</h5>
                  <p className="text-[11px] text-[#64748B]">Consistency today creates the life you want tomorrow.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => setScreen('step-mountain-ready')}
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Start My Winter Arc →</span>
              </button>

              <div className="flex justify-center items-center">
                <span className="font-handwriting text-base text-[#0085FF]">
                  A Stronger Brighter You Ahead
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 7C: "YOU'RE READY!" (SCREENSHOT WITH MOUNTAIN TRAIL media_1789748738333.jpg)
           ========================================================================= */}
        {screen === 'step-mountain-ready' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2">
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-extrabold tracking-[0.14em] text-[#0085FF] uppercase">
                    WINTER ARC
                  </div>
                  <div className="text-[10px] text-[#94A3B8] font-semibold">
                    Discipline Today · A Brighter Tomorrow
                  </div>
                </div>
                <button
                  onClick={() => setScreen('celebration')}
                  className="text-xs font-bold text-[#0085FF]"
                >
                  Skip
                </button>
              </div>

              <div className="mt-2 text-center">
                <h1 className="text-3xl font-black font-display text-[#0A192F] tracking-tight">
                  You're <span className="gradient-text">Ready!</span>
                </h1>
                <p className="text-[#64748B] text-xs font-medium mt-0.5 max-w-xs mx-auto">
                  Your Winter Arc starts now. You've set your vision, focus areas and habits.
                </p>
              </div>

              {/* Glowing Mountain Summit Trail Illustration */}
              <div className="relative w-full h-40 rounded-2xl overflow-hidden my-3 border border-slate-200 shadow-sm">
                <Image
                  src="/assets/mountain-trail.jpg"
                  alt="Mountain trail winding to sunrise summit with flag"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex flex-col justify-between p-3 pointer-events-none">
                  <span className="text-[8px] tracking-[0.2em] font-extrabold text-white/90 uppercase">
                    DISCIPLINE · FOCUS · CONSISTENCY · FREEDOM
                  </span>
                  <span className="font-handwriting text-white text-base self-end -rotate-3 text-shadow">
                    Same You A Stronger Version
                  </span>
                </div>
              </div>

              {/* 4 Summary Action Rows */}
              <div className="space-y-2">
                <div className="arc-card p-3 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-[#0085FF]">🎯</span>
                    <div>
                      <div className="text-xs font-bold text-[#0A192F]">Your Vision</div>
                      <div className="text-[10px] text-[#64748B] truncate max-w-[200px]">“I am becoming {identityText}”</div>
                    </div>
                  </div>
                  <span className="text-xs text-[#94A3B8]">&gt;</span>
                </div>

                <div className="arc-card p-3 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-[#FF7A00]">📅</span>
                    <div>
                      <div className="text-xs font-bold text-[#0A192F]">Arc Duration</div>
                      <div className="text-[10px] text-[#64748B]">{selectedDuration} Days</div>
                    </div>
                  </div>
                  <span className="text-xs text-[#94A3B8]">&gt;</span>
                </div>

                <div className="arc-card p-3 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-[#7B61FF]">🧩</span>
                    <div>
                      <div className="text-xs font-bold text-[#0A192F]">Focus Areas</div>
                      <div className="text-[10px] text-[#64748B]">{selectedAreas.length} areas selected</div>
                    </div>
                  </div>
                  <span className="text-xs text-[#94A3B8]">&gt;</span>
                </div>

                <div className="arc-card p-3 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-[#10B981]">⚡</span>
                    <div>
                      <div className="text-xs font-bold text-[#0A192F]">Habits</div>
                      <div className="text-[10px] text-[#64748B]">{selectedHabits.length} habits selected</div>
                    </div>
                  </div>
                  <span className="text-xs text-[#94A3B8]">&gt;</span>
                </div>
              </div>

              {/* Quote */}
              <div className="arc-card p-3 bg-blue-50/50 border-blue-100 mt-2 text-center">
                <p className="text-xs font-bold text-[#0A192F] italic">
                  “A small step today creates a <span className="gradient-text">brighter tomorrow.</span>”
                </p>
                <span className="text-[9px] text-[#94A3B8] uppercase tracking-wider block mt-0.5">— WINTER ARC</span>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={() => setScreen('celebration')}
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Let's Begin →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 8: "WELCOME TO YOUR WINTER ARC!" (CELEBRATION SCREENSHOT 1 OF SET 2)
           ========================================================================= */}
        {screen === 'celebration' && (
          <div className="animate-fade-in flex flex-col justify-between flex-1 pt-2 pb-2 text-center">
            <div>
              {/* Checkmark Badge with Glowing Sunset Ring */}
              <div className="relative w-20 h-20 mx-auto mt-2 mb-3">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0085FF] via-[#7B61FF] to-[#FF7A00] animate-pulse opacity-40 blur-md" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-[#0085FF] via-[#7B61FF] to-[#FF7A00] p-1 flex items-center justify-center shadow-lg">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-2xl text-[#0085FF] font-black">✓</span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black font-display text-[#0A192F] tracking-tight">
                Welcome to Your <br />
                <span className="gradient-text">Winter Arc!</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 max-w-xs mx-auto">
                You've taken the first step towards a stronger, healthier and more purposeful you.
              </p>

              {/* 6 Metric Cards (2-column layout) */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-left">
                <div className="arc-card p-3 bg-white flex items-center gap-2.5">
                  <span className="text-xl">📅</span>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] font-semibold block">Duration</span>
                    <span className="text-xs font-bold text-[#0A192F]">{selectedDuration} Days</span>
                  </div>
                </div>

                <div className="arc-card p-3 bg-white flex items-center gap-2.5">
                  <span className="text-xl">🎯</span>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] font-semibold block">Focus Areas</span>
                    <span className="text-xs font-bold text-[#0A192F]">{selectedAreas.length} Areas</span>
                  </div>
                </div>

                <div className="arc-card p-3 bg-white flex items-center gap-2.5">
                  <span className="text-xl">⚡</span>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] font-semibold block">Habits</span>
                    <span className="text-xs font-bold text-[#0A192F]">{selectedHabits.length} Habits</span>
                  </div>
                </div>

                <div className="arc-card p-3 bg-white flex items-center gap-2.5">
                  <span className="text-xl">📊</span>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] font-semibold block">Your Goal</span>
                    <span className="text-xs font-bold text-[#0A192F]">A Stronger You</span>
                  </div>
                </div>

                <div className="arc-card p-3 bg-white flex items-center gap-2.5">
                  <span className="text-xl">🚩</span>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] font-semibold block">Journey</span>
                    <span className="text-xs font-bold text-[#0A192F]">Starts Now</span>
                  </div>
                </div>

                <div className="arc-card p-3 bg-white flex items-center gap-2.5">
                  <span className="text-xl">❤️</span>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] font-semibold block">Mindset</span>
                    <span className="text-xs font-bold text-[#0A192F] leading-tight">Discipline Creates Freedom</span>
                  </div>
                </div>
              </div>

              {/* Quote Card */}
              <div className="arc-card p-3.5 bg-blue-50/40 border-blue-100 mt-3 text-center">
                <p className="text-xs font-extrabold text-[#0A192F] italic">
                  “Discipline today creates a <span className="gradient-text">brighter tomorrow.</span>”
                </p>
                <span className="text-[9px] font-bold text-[#94A3B8] tracking-widest uppercase block mt-1">
                  — WINTER ARC
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Link
                href="/today"
                className="w-full btn-sunset py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Begin My Journey →</span>
              </Link>

              <div className="text-[10px] font-bold tracking-widest uppercase text-[#94A3B8]">
                A Disciplined You · A Brighter Tomorrow
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Mountain Sunrise Bottom Graphic ── */}
      <div className="w-full max-w-md mx-auto relative h-24 sm:h-28 overflow-hidden pointer-events-none select-none z-0">
        <Image
          src="/assets/mountain-sunrise.jpg"
          alt="Snowy mountain peaks with morning alpine sunrise glow"
          fill
          className="object-cover object-bottom opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />
      </div>
    </div>
  );
}
