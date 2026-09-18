'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import { getUserProfile, saveUserProfile, resetUserProfile, ChallengeProfile, DEFAULT_PROFILE } from '@/lib/userProfile';
import { User, Bell, Shield, Moon, Download, RotateCcw, Check, Sparkles, ChevronRight, Edit3 } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<ChallengeProfile>(DEFAULT_PROFILE);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [identityInput, setIdentityInput] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    const current = getUserProfile();
    setProfile(current);
    setIdentityInput(current.identity);
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] pb-28 pt-4 px-4 select-none">
      <div className="max-w-md mx-auto space-y-4">
        {/* ── HEADER ── */}
        <header className="pt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
            ACCOUNT & CHALLENGE SETTINGS
          </span>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black font-display text-[#0A192F] tracking-tight">
              My Profile
            </h1>
            {saveToast && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-in fade-in">
                ✓ Saved
              </span>
            )}
          </div>
        </header>

        {/* ── USER PROFILE CARD ── */}
        <div className="arc-card p-5 bg-white border border-[#E8EEF5] flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0085FF] via-[#7B61FF] to-[#FF7A00] p-0.5 shadow-md shrink-0">
            <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-xl font-black text-[#0085FF]">
              {initial}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-black text-[#0A192F] truncate">
              {profile.name || 'Prashant Hiremath'}
            </h2>
            <p className="text-xs text-[#64748B] truncate">{profile.email || 'Winter Arc Practitioner'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0085FF] text-[10px] font-extrabold">
                {profile.duration}-Day Arc
              </span>
              <span className="px-2 py-0.5 rounded-md bg-orange-50 text-[#FF7A00] text-[10px] font-extrabold">
                Active Protocol
              </span>
            </div>
          </div>
        </div>

        {/* ── IDENTITY STATEMENT (EDITABLE) ── */}
        <div className="arc-card p-4 bg-white border border-[#E8EEF5] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#0A192F]">
              Identity Affirmation
            </span>
            <button
              onClick={() => setIsEditingIdentity(!isEditingIdentity)}
              className="text-[10px] text-[#0085FF] font-bold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditingIdentity ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {isEditingIdentity ? (
            <div className="space-y-2 pt-1">
              <input
                type="text"
                value={identityInput}
                onChange={(e) => setIdentityInput(e.target.value)}
                className="w-full text-xs font-semibold text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#0085FF]"
              />
              <button
                onClick={handleSaveIdentity}
                className="btn-sunset text-xs py-1.5 px-4 rounded-full font-bold shadow-sm"
              >
                Save Affirmation
              </button>
            </div>
          ) : (
            <p className="text-xs font-bold text-[#0085FF] italic bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
              “I am becoming {profile.identity}”
            </p>
          )}
        </div>

        {/* ── ACTIVE CHALLENGE PARAMETERS ── */}
        <div className="arc-card p-4 bg-white border border-[#E8EEF5] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-[#0A192F]">
              Challenge Parameters
            </span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Sealed 🔒
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-[#94A3B8] font-bold block uppercase">Duration</span>
              <span className="text-sm font-black text-[#0A192F]">{profile.duration} Days</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-[#94A3B8] font-bold block uppercase">Started On</span>
              <span className="text-xs font-bold text-[#0A192F]">{profile.startDate}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">
              Focus Areas ({profile.focusAreas?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1">
              {profile.focusAreas?.map((area) => (
                <span key={area} className="px-2 py-0.5 rounded-lg bg-blue-50 text-[#0085FF] text-[10px] font-bold">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">
              Active Protocol Habits ({profile.habits?.length || 0})
            </span>
            <div className="space-y-1">
              {profile.habits?.map((h) => (
                <div key={h.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                  <span className="font-semibold text-[#0A192F]">{h.title}</span>
                  <span className="text-[10px] text-[#64748B] font-bold">{h.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── NOTIFICATION SCHEDULE ── */}
        <div className="arc-card p-4 bg-white border border-[#E8EEF5] space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Bell className="w-4 h-4 text-[#0085FF]" />
            <h3 className="text-xs font-black uppercase text-[#0A192F]">
              Daily Notification Schedule
            </h3>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-[#0A192F]">Morning Protocol Alarm</div>
              <div className="text-[10px] text-[#64748B]">Cold shower & workout start</div>
            </div>
            <span className="font-black text-[#0085FF] bg-blue-50 px-2 py-1 rounded-lg">
              {profile.morningAlarm}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <div>
              <div className="font-bold text-[#0A192F]">Evening Review Nudge</div>
              <div className="text-[10px] text-[#64748B]">Daily consistency score entry</div>
            </div>
            <span className="font-black text-[#FF7A00] bg-orange-50 px-2 py-1 rounded-lg">
              {profile.eveningReview}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <div>
              <div className="font-bold text-[#0A192F]">Quiet Hours DND</div>
              <div className="text-[10px] text-[#64748B]">10:00 PM – 6:30 AM silent mode</div>
            </div>
            <input
              type="checkbox"
              checked={profile.quietHours}
              onChange={handleToggleQuietHours}
              className="accent-[#0085FF] w-4 h-4"
            />
          </div>
        </div>

        {/* ── ACTIONS & RECALIBRATION ── */}
        <div className="space-y-2">
          <button
            onClick={handleRecalibrate}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-[#475569] hover:text-[#0A192F] hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span>Recalibrate / Re-enter Challenge Parameters</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
