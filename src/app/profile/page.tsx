'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import { getUserProfile, saveUserProfile, resetUserProfile, ChallengeProfile, DEFAULT_PROFILE } from '@/lib/userProfile';
import { User, Bell, Shield, Moon, Download, RotateCcw, Check, Sparkles, ChevronRight, Edit3, Clock, Flame, Database } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<ChallengeProfile>(DEFAULT_PROFILE);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [identityInput, setIdentityInput] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    const current = getUserProfile();
    setProfile(current);
    setIdentityInput(current.identity || '');
  }, []);

  const handleSaveIdentity = () => {
    if (!identityInput.trim()) return;
    const updated = saveUserProfile({ identity: identityInput.trim() });
    setProfile(updated);
    setIsEditingIdentity(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleToggleQuietHours = () => {
    const updated = saveUserProfile({ quietHours: !profile.quietHours });
    setProfile(updated);
  };

  const handleRecalibrate = () => {
    if (confirm('Do you want to recalibrate your challenge parameters and details?')) {
      resetUserProfile();
      window.location.href = '/onboarding';
    }
  };

  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'P';

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
                ✓ Changes Saved
              </span>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#0085FF] text-xs font-bold border border-blue-100">
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Cloud Active</span>
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
                  <h2 className="text-lg font-black text-[#0A192F]">
                    {profile.name || 'Prashant Hiremath'}
                  </h2>
                  <p className="text-xs text-[#64748B]">{profile.email || 'prashant@example.com'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-[#0085FF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      Day 17 of {profile.duration}
                    </span>
                    <span className="text-[10px] font-bold text-[#FF7A00] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                      8D Streak 🔥
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
                {!isEditingIdentity ? (
                  <button
                    onClick={() => setIsEditingIdentity(true)}
                    className="text-xs font-bold text-[#0085FF] flex items-center gap-1 hover:underline"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveIdentity}
                    className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                )}
              </div>

              {!isEditingIdentity ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-sm font-semibold text-[#0A192F] italic">
                    “{profile.identity || 'I am becoming disciplined, strong and focused.'}”
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={identityInput}
                    onChange={(e) => setIdentityInput(e.target.value)}
                    className="w-full text-sm text-[#0A192F] p-3 rounded-xl border border-[#0085FF] focus:outline-none bg-blue-50/20"
                    placeholder="Enter who you are becoming..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingIdentity(false)}
                      className="text-xs text-[#64748B] px-3 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveIdentity}
                      className="text-xs font-bold text-white bg-[#0085FF] px-4 py-1 rounded-xl shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Non-Negotiables List */}
            <div className="arc-card p-5 bg-white border border-[#E8EEF5]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
                  Active Non-Negotiables ({profile.habits?.length || 5})
                </h3>
                <span className="text-[10px] text-[#64748B] font-semibold">Gold Standard</span>
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
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
                Daily Cadence & Reminders
              </h3>

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
                <span className="text-[10px] font-black text-[#FF7A00] bg-orange-50 px-2 py-0.5 rounded-full">
                  Sealed
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64748B] block">Signed by</span>
                  <span className="font-handwriting text-2xl text-[#0085FF]">
                    {profile.signature || profile.name || 'Prashant Hiremath'}
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
                Protocol Recalibration
              </h3>
              <p className="text-xs text-[#64748B]">
                Need to adjust your habits or restart the arc setup? You can re-run the challenge registration wizard.
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
                  onClick={() => alert('Winter Arc protocol data downloaded!')}
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
    </ResponsiveShell>
  );
}
