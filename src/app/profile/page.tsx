'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import {
  getUserProfile,
  saveUserProfile,
  resetUserProfile,
  calculateChallengeDay,
  ChallengeProfile,
  DEFAULT_PROFILE,
} from '@/lib/userProfile';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  Moon,
  Download,
  RotateCcw,
  Check,
  Edit3,
  Clock,
  Database,
  X,
  Plus,
  Trash2,
  Calendar,
  User,
  Mail,
  FileCheck,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, userData, updateUserData } = useAuth();
  const [profile, setProfile] = useState<ChallengeProfile>(DEFAULT_PROFILE);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [identityInput, setIdentityInput] = useState('');
  const [durationInput, setDurationInput] = useState<number>(90);
  const [startDateInput, setStartDateInput] = useState('');
  const [morningAlarmInput, setMorningAlarmInput] = useState('07:00 AM');
  const [eveningReviewInput, setEveningReviewInput] = useState('09:30 PM');
  const [signatureInput, setSignatureInput] = useState('');
  const [habitsInput, setHabitsInput] = useState(DEFAULT_PROFILE.habits);

  // Quick inline habit adder
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitTarget, setNewHabitTarget] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<'BODY' | 'MIND' | 'CAREER' | 'KNOWLEDGE' | 'CUSTOM'>('BODY');

  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('✓ Changes Saved');

  const syncFormWithProfile = useCallback((p: ChallengeProfile) => {
    setNameInput(p.name || userData?.name || '');
    setEmailInput(p.email || user?.email || userData?.email || '');
    setIdentityInput(p.identity || '');
    setDurationInput(p.duration || 90);
    setStartDateInput(p.startDate || new Date().toISOString().split('T')[0]);
    setMorningAlarmInput(p.morningAlarm || '07:00 AM');
    setEveningReviewInput(p.eveningReview || '09:30 PM');
    setSignatureInput(p.signature || '');
    setHabitsInput(p.habits || DEFAULT_PROFILE.habits);
  }, [user, userData]);

  // Load profile on mount
  useEffect(() => {
    const current = getUserProfile();
    setProfile(current);
    syncFormWithProfile(current);
  }, [syncFormWithProfile]);

  const openEditModal = () => {
    syncFormWithProfile(profile);
    setIsEditModalOpen(true);
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const updatedData: Partial<ChallengeProfile> = {
      name: nameInput.trim() || 'Athlete',
      email: emailInput.trim(),
      identity: identityInput.trim() || 'disciplined, strong and focused.',
      duration: durationInput,
      startDate: startDateInput || new Date().toISOString().split('T')[0],
      morningAlarm: morningAlarmInput.trim() || '07:00 AM',
      eveningReview: eveningReviewInput.trim() || '09:30 PM',
      signature: signatureInput.trim(),
      habits: habitsInput,
      isSetupComplete: true,
    };

    const saved = saveUserProfile(updatedData);
    setProfile(saved);

    // Sync with auth user row if available
    try {
      if (updateUserData && (updatedData.name || updatedData.email)) {
        await updateUserData({
          name: updatedData.name,
          email: updatedData.email,
        });
      }
    } catch (err) {
      console.warn('Failed to sync updated user data to Supabase:', err);
    }

    setIsEditModalOpen(false);
    setToastMessage('✓ Profile and Protocol Settings Updated');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleToggleQuietHours = () => {
    const updated = saveUserProfile({ quietHours: !profile.quietHours });
    setProfile(updated);
  };

  const handleRecalibrate = () => {
    if (confirm('Do you want to recalibrate your challenge parameters and details? This will launch the onboarding wizard.')) {
      resetUserProfile();
      window.location.href = '/onboarding';
    }
  };

  const handleExportData = () => {
    try {
      const data = {
        profile,
        exportedAt: new Date().toISOString(),
        system: 'MaxxDaddy.ai Winter Arc Protocol v1.0.0',
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `maxxdaddy_profile_${(profile.name || 'athlete').toLowerCase().replace(/\s+/g, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Failed to export data', e);
    }
  };

  // Add habit in modal
  const handleAddHabit = () => {
    if (!newHabitTitle.trim()) return;
    const newH = {
      id: Date.now().toString(),
      title: newHabitTitle.trim(),
      category: newHabitCategory,
      target: newHabitTarget.trim() || 'Daily Standard',
    };
    setHabitsInput((prev) => [...prev, newH]);
    setNewHabitTitle('');
    setNewHabitTarget('');
  };

  // Delete habit in modal
  const handleDeleteHabit = (id: string) => {
    if (habitsInput.length <= 1) {
      alert('You must retain at least one non-negotiable habit for the protocol.');
      return;
    }
    setHabitsInput((prev) => prev.filter((h) => h.id !== id));
  };

  // Calculate dynamic challenge day
  const dayInfo = calculateChallengeDay(profile.startDate, profile.duration);
  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'A';

  return (
    <ResponsiveShell>
      <div className="w-full max-w-6xl mx-auto py-6 px-4 lg:px-8 pb-28 lg:pb-12 select-none">
        {/* ── HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
              ACCOUNT & CHALLENGE ARCHITECTURE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#0A192F] tracking-tight mt-0.5">
              Protocol Settings
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#64748B] mt-0.5">
              Manage your identity, non-negotiables, schedule, and cloud synchronization.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {saveToast && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-in fade-in">
                {toastMessage}
              </span>
            )}
            <button
              onClick={openEditModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0085FF] text-white text-xs font-bold hover:bg-[#0070D6] shadow-sm transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile & Arc</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0085FF] text-xs font-bold border border-blue-100">
              <Database className="w-3.5 h-3.5" />
              <span>Local & Cloud Active</span>
            </div>
          </div>
        </header>

        {/* ── RESPONSIVE DUAL COLUMN (lg:grid-cols-12) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* ── LEFT COLUMN: IDENTITY & HABITS (lg:col-span-6) ── */}
          <div className="lg:col-span-6 space-y-5">
            {/* User Profile Card */}
            <div className="arc-card p-6 bg-white border border-[#E8EEF5] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0085FF] via-[#7B61FF] to-[#FF7A00] p-0.5 shadow-md shrink-0">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-2xl font-black text-[#0085FF]">
                    {initial}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-[#0A192F]">
                      {profile.name || 'Athlete'}
                    </h2>
                    <button
                      onClick={openEditModal}
                      className="text-slate-400 hover:text-[#0085FF] p-1 rounded transition"
                      title="Edit Profile Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#64748B]">{profile.email || 'No email registered'}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-[#0085FF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      Day {dayInfo.currentDay} of {dayInfo.totalDays}
                    </span>
                    <span className="text-[10px] font-bold text-[#FF7A00] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                      {dayInfo.daysRemaining} Days Left
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                      Started {profile.startDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Identity Statement Card */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">
                  IDENTITY AFFIRMATION STATEMENT
                </span>
                <button
                  onClick={openEditModal}
                  className="text-xs font-bold text-[#0085FF] flex items-center gap-1 hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-sm font-semibold text-[#0A192F] italic">
                  “{profile.identity || 'I am becoming disciplined, strong and focused.'}”
                </p>
              </div>
            </div>

            {/* Non-Negotiables List */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
                  Active Non-Negotiables ({profile.habits?.length || 0})
                </h3>
                <button
                  onClick={openEditModal}
                  className="text-xs font-bold text-[#0085FF] hover:underline"
                >
                  Manage Habits →
                </button>
              </div>

              <div className="space-y-2">
                {profile.habits?.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#0A192F] block">{h.title}</span>
                      <span className="text-[10px] text-[#64748B] font-semibold">
                        Target: {h.target}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-[#0085FF]">
                      {h.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: SCHEDULE & CLOUD (lg:col-span-6) ── */}
          <div className="lg:col-span-6 space-y-5">
            {/* Daily Schedule & Alarms */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
                  Daily Cadence & Reminders
                </h3>
                <button
                  onClick={openEditModal}
                  className="text-xs font-bold text-[#0085FF] hover:underline"
                >
                  Change Times
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF7A00] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] font-bold block">Morning Wake</span>
                    <span className="text-xs font-black text-[#0A192F]">
                      {profile.morningAlarm || '07:00 AM'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#7B61FF] flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] font-bold block">Evening Review</span>
                    <span className="text-xs font-black text-[#0A192F]">
                      {profile.eveningReview || '09:30 PM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quiet hours toggle */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#0085FF]" />
                  <div>
                    <span className="text-xs font-bold text-[#0A192F] block">Quiet Hours Mode</span>
                    <span className="text-[10px] text-[#64748B]">Mute non-arc notifications</span>
                  </div>
                </div>
                <button
                  onClick={handleToggleQuietHours}
                  className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    profile.quietHours ? 'bg-[#0085FF] justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>

            {/* Digital Covenant Signature Block */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">
                  DIGITAL COMMITMENT SIGNATURE
                </span>
                <button
                  onClick={openEditModal}
                  className="text-[10px] font-bold text-[#0085FF] hover:underline"
                >
                  Update Signature ✍️
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64748B] block">Signed by</span>
                  <span className="font-handwriting text-2xl text-[#0085FF]">
                    {profile.signature || profile.name || 'Unsigned'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-[#64748B] block">Challenge Duration</span>
                  <span className="text-xs font-black text-[#0A192F]">{profile.duration} Days</span>
                </div>
              </div>
            </div>

            {/* Data Management & Recalibrate */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5] space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
                Protocol Recalibration & Export
              </h3>
              <p className="text-xs text-[#64748B]">
                Need to adjust your habits or restart the arc setup? You can re-run the challenge registration wizard or export your protocol data.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleRecalibrate}
                  className="flex-1 py-3 rounded-2xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recalibrate Challenge</span>
                </button>
                <button
                  onClick={handleExportData}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 text-[#475569] hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COMPREHENSIVE EDIT PROFILE MODAL ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0085FF]">
                  CUSTOMIZE PROTOCOL
                </span>
                <h2 className="text-xl font-black text-[#0A192F]">Edit Profile & Arc Settings</h2>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#0A192F] flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAll} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0A192F] block mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#0085FF]" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full text-xs text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0085FF]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0A192F] block mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0085FF]" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0085FF]"
                    required
                  />
                </div>
              </div>

              {/* Challenge Duration & Start Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0A192F] block mb-1">
                    Challenge Duration
                  </label>
                  <div className="flex gap-2">
                    {[30, 60, 90].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setDurationInput(d)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black transition ${
                          durationInput === d
                            ? 'bg-[#0085FF] text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {d} Days
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0A192F] block mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0085FF]" /> Start Date
                  </label>
                  <input
                    type="date"
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
                    className="w-full text-xs text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#0085FF]"
                  />
                  <span className="text-[10px] text-[#64748B] block mt-1">
                    Currently Day {calculateChallengeDay(startDateInput, durationInput).currentDay} of {durationInput}
                  </span>
                </div>
              </div>

              {/* Alarms (Morning Wake & Evening Review) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0A192F] block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF7A00]" /> Morning Wake Alarm
                  </label>
                  <input
                    type="text"
                    value={morningAlarmInput}
                    onChange={(e) => setMorningAlarmInput(e.target.value)}
                    placeholder="e.g. 06:30 AM"
                    className="w-full text-xs text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0085FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0A192F] block mb-1 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-[#7B61FF]" /> Evening Review Time
                  </label>
                  <input
                    type="text"
                    value={eveningReviewInput}
                    onChange={(e) => setEveningReviewInput(e.target.value)}
                    placeholder="e.g. 09:30 PM"
                    className="w-full text-xs text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0085FF]"
                  />
                </div>
              </div>

              {/* Identity Statement */}
              <div>
                <label className="text-xs font-bold text-[#0A192F] block mb-1">
                  Identity Affirmation Statement
                </label>
                <textarea
                  rows={2}
                  value={identityInput}
                  onChange={(e) => setIdentityInput(e.target.value)}
                  placeholder="Who are you becoming through this protocol?"
                  className="w-full text-xs text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#0085FF]"
                />
              </div>

              {/* Digital Commitment Signature */}
              <div>
                <label className="text-xs font-bold text-[#0A192F] block mb-1 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-[#0085FF]" /> Digital Commitment Signature
                </label>
                <input
                  type="text"
                  value={signatureInput}
                  onChange={(e) => setSignatureInput(e.target.value)}
                  placeholder="Type your full name to sign"
                  className="w-full font-handwriting text-xl text-[#0085FF] bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#0085FF]"
                />
              </div>

              {/* Habit Management Section */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#0A192F] block">
                    Manage Non-Negotiable Habits ({habitsInput.length})
                  </label>
                  <span className="text-[10px] text-[#64748B]">Click trash to remove</span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {habitsInput.map((h) => (
                    <div
                      key={h.id}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-bold text-[#0A192F] block truncate">{h.title}</span>
                        <span className="text-[10px] text-[#64748B]">Target: {h.target}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteHabit(h.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition shrink-0"
                        title="Remove Habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new habit inline */}
                <div className="mt-3 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <span className="text-[10px] font-bold text-[#0085FF] block uppercase">
                    + Add New Custom Habit
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      placeholder="Habit title (e.g. 100 Pushups)"
                      value={newHabitTitle}
                      onChange={(e) => setNewHabitTitle(e.target.value)}
                      className="sm:col-span-6 text-xs text-[#0A192F] bg-white border border-slate-200 rounded-xl p-2 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Target (e.g. 100 reps)"
                      value={newHabitTarget}
                      onChange={(e) => setNewHabitTarget(e.target.value)}
                      className="sm:col-span-4 text-xs text-[#0A192F] bg-white border border-slate-200 rounded-xl p-2 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddHabit}
                      className="sm:col-span-2 py-2 rounded-xl bg-[#0085FF] text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#0070D6] transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <div className="flex gap-1.5 text-[10px]">
                    {(['BODY', 'MIND', 'CAREER', 'KNOWLEDGE', 'CUSTOM'] as const).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setNewHabitCategory(cat)}
                        className={`px-2 py-0.5 rounded-full font-bold transition ${
                          newHabitCategory === cat
                            ? 'bg-[#0085FF] text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-sunset px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ResponsiveShell>
  );
}
