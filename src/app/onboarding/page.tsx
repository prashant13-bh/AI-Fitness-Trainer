'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getUserProfile, saveUserProfile, DEFAULT_PROFILE } from '@/lib/userProfile';
import { syncProfileToSupabase } from '@/lib/supabase/sync';
import { Sparkles, Check, ArrowRight, Shield, Bell, Calendar, User, Dumbbell, Droplets, Brain, BookOpen, Apple, Plus, AlertCircle } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  // Wizard Steps: 1: Welcome | 2: Account & Identity | 3: Challenge Setup | 4: Daily Habits | 5: Notifications | 6: Covenant & Launch
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState('Prashant Hiremath');
  const [email, setEmail] = useState('prashant@example.com');
  const [identityText, setIdentityText] = useState('disciplined, strong and focused.');
  const [duration, setDuration] = useState<number>(90);
  const [focusAreas, setFocusAreas] = useState<string[]>(['Body', 'Mind', 'Career', 'Knowledge']);
  
  const [habits, setHabits] = useState([
    { id: '1', title: 'Morning Cold Shower & Hydration', category: 'BODY', target: '1 cold shower', selected: true },
    { id: '2', title: 'Strength Workout / Conditioning', category: 'BODY', target: '45 min', selected: true },
    { id: '3', title: 'Deep Work / High Output', category: 'CAREER', target: '90 min', selected: true },
    { id: '4', title: 'Read Non-Fiction', category: 'KNOWLEDGE', target: '15 pages', selected: true },
    { id: '5', title: 'Clean Nutrition & No Sugar', category: 'BODY', target: 'Zero sugar', selected: true },
  ]);

  const [newHabitName, setNewHabitName] = useState('');
  const [morningAlarm, setMorningAlarm] = useState('07:00 AM');
  const [eveningReview, setEveningReview] = useState('09:30 PM');
  const [quietHours, setQuietHours] = useState(true);
  const [signature, setSignature] = useState('Prashant Hiremath');
  const [errorMsg, setErrorMsg] = useState('');

  // Load existing profile on mount
  useEffect(() => {
    const existing = getUserProfile();
    if (existing.name) setName(existing.name);
    if (existing.email) setEmail(existing.email);
    if (existing.identity) setIdentityText(existing.identity);
    if (existing.duration) setDuration(existing.duration);
    if (existing.focusAreas?.length) setFocusAreas(existing.focusAreas);
    if (existing.signature) setSignature(existing.signature);
  }, []);

  const toggleFocusArea = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, selected: !h.selected } : h))
    );
  };

  const addCustomHabit = () => {
    if (!newHabitName.trim()) return;
    const newH = {
      id: Date.now().toString(),
      title: newHabitName.trim(),
      category: 'CUSTOM',
      target: 'Daily target',
      selected: true,
    };
    setHabits((prev) => [...prev, newH]);
    setNewHabitName('');
  };

  // Step Navigators with Validation
  const handleNextFromAccount = () => {
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!identityText.trim()) {
      setErrorMsg('Please enter your identity affirmation statement');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleNextFromChallenge = () => {
    if (focusAreas.length === 0) {
      setErrorMsg('Please select at least one focus area');
      return;
    }
    setErrorMsg('');
    setStep(4);
  };

  const handleNextFromHabits = () => {
    const selectedCount = habits.filter((h) => h.selected).length;
    if (selectedCount === 0) {
      setErrorMsg('Please select at least one core habit');
      return;
    }
    setErrorMsg('');
    setStep(5);
  };

  const handleNextFromSchedule = () => {
    setErrorMsg('');
    setStep(6);
  };

  const handleLaunchChallenge = () => {
    if (!signature.trim()) {
      setErrorMsg('Please sign your name to seal the commitment');
      return;
    }

    const selectedHabits = habits
      .filter((h) => h.selected)
      .map(({ id, title, category, target }) => ({ id, title, category, target }));

    const payload = {
      name: name.trim(),
      email: email.trim(),
      identity: identityText.trim(),
      duration,
      startDate: new Date().toISOString().split('T')[0],
      focusAreas,
      habits: selectedHabits,
      morningAlarm,
      eveningReview,
      quietHours,
      signature: signature.trim(),
      isSetupComplete: true,
    };

    saveUserProfile(payload);
    syncProfileToSupabase(payload).catch((e) => console.warn('Supabase sync:', e));

    router.push('/today');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] flex flex-col justify-between relative select-none">
      {/* ── TOP HEADER (Steps 2-6) ── */}
      {step > 1 && (
        <header className="w-full max-w-xl lg:max-w-2xl mx-auto pt-6 px-4 flex items-center justify-between z-20">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#0A192F] hover:bg-slate-200/60 transition"
          >
            ←
          </button>

          <div className="flex-1 mx-3 max-w-[140px]">
            <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[#0085FF] via-[#7B61FF] to-[#FF7A00]"
                style={{ width: `${((step - 1) / 5) * 100}%` }}
              />
            </div>
          </div>

          <span className="text-xs font-bold text-[#64748B] font-mono">
            0{step - 1} / 05
          </span>
        </header>
      )}

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="w-full max-w-xl lg:max-w-2xl mx-auto px-4 flex-1 flex flex-col justify-between z-10 py-4">
        {/* =========================================================================
            STEP 1: WELCOME HERO (HIGH-IMPACT ENTRY)
           ========================================================================= */}
        {step === 1 && (
          <div className="flex flex-col justify-between flex-1 animate-in fade-in duration-300">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#0085FF] mt-4">
                WINTER ARC · CHALLENGE REGISTRATION
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-[#0A192F] tracking-tight mt-1">
                A Better You <br />
                <span className="gradient-text">Starts Now</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-1.5">
                90 days. One promise. A different you. Fill your personal details to begin.
              </p>

              {/* 4 Feature Value Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                <div className="arc-card p-3 bg-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0085FF] flex items-center justify-center text-lg">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0A192F]">Build Core Habits</h3>
                    <p className="text-[10px] text-[#64748B]">Small disciplines daily create massive change.</p>
                  </div>
                </div>

                <div className="arc-card p-3 bg-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-[#FF7A00] flex items-center justify-center text-lg">
                    🧠
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0A192F]">Clear Focused Mind</h3>
                    <p className="text-[10px] text-[#64748B]">Zero cheap dopamine during deep work.</p>
                  </div>
                </div>

                <div className="arc-card p-3 bg-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-[#7B61FF] flex items-center justify-center text-lg">
                    📊
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0A192F]">Track 90-Day Matrix</h3>
                    <p className="text-[10px] text-[#64748B]">Visual daily consistency score ring.</p>
                  </div>
                </div>

                <div className="arc-card p-3 bg-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                    🏔️
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0A192F]">Stronger You</h3>
                    <p className="text-[10px] text-[#64748B]">Discipline today creates freedom tomorrow.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Hero & Button */}
            <div className="pt-6 space-y-3">
              <div className="text-center">
                <span className="font-handwriting text-xl text-[#0085FF] -rotate-3 inline-block">
                  Same You But Stronger ~
                </span>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full btn-sunset py-4 text-base font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20"
              >
                <span>Start Challenge Setup →</span>
              </button>

              <p className="text-[10px] text-center font-bold text-[#94A3B8] uppercase tracking-wider">
                A Disciplined You · A Brighter Tomorrow
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: ACCOUNT & IDENTITY DETAILS
           ========================================================================= */}
        {step === 2 && (
          <div className="flex flex-col justify-between flex-1 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
                  STEP 01 OF 05
                </span>
                <h2 className="text-2xl font-black font-display text-[#0A192F] tracking-tight">
                  Your <span className="gradient-text">Account & Identity</span>
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-1">
                  Tell us who you are and who you are becoming in this Arc.
                </p>
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Full Name & Email Card */}
              <div className="arc-card p-4 bg-white space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#0A192F] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prashant Hiremath"
                    className="w-full text-xs font-semibold text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0085FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0A192F] block mb-1">
                    Email Address (for backup & notifications)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. prashant@example.com"
                    className="w-full text-xs font-semibold text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0085FF]"
                  />
                </div>
              </div>

              {/* Identity Statement Card */}
              <div className="arc-card p-4 bg-white space-y-2 border-blue-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0A192F]">
                    Identity Affirmation *
                  </label>
                  <span className="text-[10px] text-[#0085FF] font-bold">Daily Guide</span>
                </div>
                <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100">
                  <span className="text-xs font-bold text-[#64748B] block mb-1">I am becoming...</span>
                  <input
                    type="text"
                    value={identityText}
                    onChange={(e) => setIdentityText(e.target.value)}
                    placeholder="disciplined, strong and focused."
                    className="w-full text-xs font-extrabold text-[#0085FF] bg-transparent focus:outline-none"
                  />
                </div>

                {/* Quick Inspiration Chips */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-[#94A3B8] block mb-1.5">
                    Need inspiration? Tap to use:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'disciplined, strong and focused.',
                      'relentless, calm and high-output.',
                      'the healthiest and best version of myself.',
                      'financially free and unstoppable.',
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setIdentityText(chip)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-[#475569] hover:bg-blue-50 hover:text-[#0085FF] transition-colors text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleNextFromAccount}
                className="w-full btn-sunset py-3.5 text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Continue to Challenge Setup →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: ARC DURATION & FOCUS AREAS
           ========================================================================= */}
        {step === 3 && (
          <div className="flex flex-col justify-between flex-1 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
                  STEP 02 OF 05
                </span>
                <h2 className="text-2xl font-black font-display text-[#0A192F] tracking-tight">
                  Choose Your <span className="gradient-text">Arc Parameters</span>
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-1">
                  How long do you want to commit to total transformation?
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Duration Options */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { days: 30, label: '30 Days', desc: 'Build Habit' },
                  { days: 60, label: '60 Days', desc: 'Go Deeper' },
                  { days: 90, label: '90 Days', desc: 'Complete Arc' },
                ].map((d) => (
                  <button
                    key={d.days}
                    type="button"
                    onClick={() => setDuration(d.days)}
                    className={`arc-card p-3 text-center transition-all ${
                      duration === d.days
                        ? 'border-[#0085FF] bg-blue-50/50 shadow-md ring-1 ring-[#0085FF]'
                        : 'bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base font-black font-display text-[#0A192F] block">
                      {d.label}
                    </span>
                    <span className="text-[10px] font-bold text-[#64748B] block mt-0.5">
                      {d.desc}
                    </span>
                    {duration === d.days && (
                      <span className="inline-block w-2 h-2 rounded-full bg-[#0085FF] mt-2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Focus Areas Selection */}
              <div className="arc-card p-4 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#0A192F]">
                    Focus Areas ({focusAreas.length} selected) *
                  </label>
                  <span className="text-[10px] text-[#64748B]">Multi-select</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {[
                    { name: 'Body', icon: '💪', desc: 'Strength & fitness' },
                    { name: 'Mind', icon: '🧠', desc: 'Calm & focus' },
                    { name: 'Knowledge', icon: '📖', desc: 'Learning & reading' },
                    { name: 'Career', icon: '💼', desc: 'High output work' },
                    { name: 'Finances', icon: '🪙', desc: 'Money discipline' },
                    { name: 'Spirituality', icon: '🌿', desc: 'Purpose & peace' },
                  ].map((area) => {
                    const isSelected = focusAreas.includes(area.name);
                    return (
                      <button
                        key={area.name}
                        type="button"
                        onClick={() => toggleFocusArea(area.name)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-blue-50/60 border-[#0085FF] text-[#0A192F]'
                            : 'bg-slate-50 border-slate-200 text-[#64748B]'
                        }`}
                      >
                        <span className="text-lg">{area.icon}</span>
                        <div>
                          <span className="text-xs font-bold block">{area.name}</span>
                          <span className="text-[9px] text-[#94A3B8]">{area.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleNextFromChallenge}
                className="w-full btn-sunset py-3.5 text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Select Daily Habits →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: DAILY HABITS PROTOCOL
           ========================================================================= */}
        {step === 4 && (
          <div className="flex flex-col justify-between flex-1 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
                  STEP 03 OF 05
                </span>
                <h2 className="text-2xl font-black font-display text-[#0A192F] tracking-tight">
                  Your Daily <span className="gradient-text">Protocol Habits</span>
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-1">
                  Select your core non-negotiable daily habits (3–5 recommended).
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Habit Cards */}
              <div className="space-y-2">
                {habits.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className={`arc-card p-3 flex items-center justify-between cursor-pointer transition-all ${
                      h.selected
                        ? 'bg-blue-50/40 border-[#0085FF] shadow-sm'
                        : 'bg-white opacity-60 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {h.category === 'BODY' ? '💪' : h.category === 'CAREER' ? '💻' : h.category === 'KNOWLEDGE' ? '📖' : '✨'}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#0A192F]">{h.title}</div>
                        <div className="text-[10px] text-[#64748B]">{h.category} · {h.target}</div>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        h.selected ? 'bg-[#0085FF] border-[#0085FF] text-white' : 'border-slate-300'
                      }`}
                    >
                      {h.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Habit Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Add custom habit (e.g. 10k Steps)..."
                  className="flex-1 text-xs bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#0085FF]"
                />
                <button
                  type="button"
                  onClick={addCustomHabit}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleNextFromHabits}
                className="w-full btn-sunset py-3.5 text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Set Daily Schedule →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: SCHEDULE & NOTIFICATIONS
           ========================================================================= */}
        {step === 5 && (
          <div className="flex flex-col justify-between flex-1 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
                  STEP 04 OF 05
                </span>
                <h2 className="text-2xl font-black font-display text-[#0A192F] tracking-tight">
                  Daily Rhythm & <span className="gradient-text">Reminders</span>
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-1">
                  Configure your waking anchor and evening score calibration times.
                </p>
              </div>

              <div className="arc-card p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-[#0A192F] block">
                      Morning Wakeup & Protocol Alarm
                    </label>
                    <span className="text-[10px] text-[#64748B]">Cold shower & workout reminder</span>
                  </div>
                  <input
                    type="text"
                    value={morningAlarm}
                    onChange={(e) => setMorningAlarm(e.target.value)}
                    className="w-24 text-center text-xs font-bold text-[#0085FF] bg-blue-50 border border-blue-200 rounded-lg py-1.5 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-bold text-[#0A192F] block">
                      Evening Review & Score Nudge
                    </label>
                    <span className="text-[10px] text-[#64748B]">Honesty check & daily reflection</span>
                  </div>
                  <input
                    type="text"
                    value={eveningReview}
                    onChange={(e) => setEveningReview(e.target.value)}
                    className="w-24 text-center text-xs font-bold text-[#FF7A00] bg-orange-50 border border-orange-200 rounded-lg py-1.5 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-bold text-[#0A192F] block">
                      Do Not Disturb Quiet Hours
                    </label>
                    <span className="text-[10px] text-[#64748B]">10:00 PM – 6:30 AM silent mode</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={quietHours}
                    onChange={(e) => setQuietHours(e.target.checked)}
                    className="accent-[#0085FF] w-4 h-4"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleNextFromSchedule}
                className="w-full btn-sunset py-3.5 text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Review & Sign Covenant →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 6: COVENANT & COMMITMENT LAUNCH
           ========================================================================= */}
        {step === 6 && (
          <div className="flex flex-col justify-between flex-1 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
                  STEP 05 OF 05 · FINAL COMMITMENT
                </span>
                <h2 className="text-2xl font-black font-display text-[#0A192F] tracking-tight">
                  Seal Your <span className="gradient-text">Winter Arc Covenant</span>
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-1">
                  Review your challenge commitments and digitally sign to launch Day 1.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Covenant Summary Card */}
              <div className="arc-card p-4 bg-white border-2 border-[#FED7AA] space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#FF7A00]" />
                    <span className="text-xs font-black uppercase text-[#0A192F]">
                      90-Day Transformation Contract
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#0085FF] bg-blue-50 px-2 py-0.5 rounded-full">
                    {duration} Days
                  </span>
                </div>

                <div className="text-xs space-y-2 text-[#475569]">
                  <div>
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase block">Candidate</span>
                    <span className="font-extrabold text-[#0A192F]">{name}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase block">Identity Pledge</span>
                    <span className="italic font-bold text-[#0085FF]">“I am becoming {identityText}”</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase block">
                      Daily Non-Negotiable Habits ({habits.filter((h) => h.selected).length})
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {habits.filter((h) => h.selected).map((h) => (
                        <span key={h.id} className="px-2 py-0.5 rounded-md bg-slate-100 text-[#0A192F] text-[10px] font-bold">
                          {h.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Signature Input */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1">
                    Digital Signature (Type your full name) *
                  </label>
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="e.g. Prashant Hiremath"
                    className="w-full font-handwriting text-xl text-[#0085FF] bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#0085FF]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={handleLaunchChallenge}
                className="w-full btn-sunset py-4 text-base font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25"
              >
                <span>Seal Contract & Launch Day 1 →</span>
              </button>
              <div className="text-center font-handwriting text-base text-[#0085FF]">
                Discipline Creates Freedom
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Mountain Sunrise Bottom Graphic ── */}
      <div className="w-full max-w-md mx-auto relative h-20 overflow-hidden pointer-events-none select-none z-0">
        <Image
          src="/assets/mountain-sunrise.jpg"
          alt="Snowy mountain sunrise"
          fill
          className="object-cover object-bottom opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />
      </div>
    </div>
  );
}
