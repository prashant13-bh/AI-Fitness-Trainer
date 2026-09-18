'use client';

import React, { useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import { User, Bell, Shield, Moon, Download, LogOut, ChevronRight, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReview, setEveningReview] = useState(true);
  const [quietHours, setQuietHours] = useState(true);
  const [identityText, setIdentityText] = useState('disciplined, strong and focused.');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveIdentity = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] pb-28 pt-4 px-4 select-none">
      <div className="max-w-md mx-auto space-y-4">
        {/* ── HEADER ── */}
        <header className="pt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">
            PROFILE & PROTOCOL SETTINGS
          </span>
          <h1 className="text-2xl font-black font-display text-[#0A192F] tracking-tight">
            My Account
          </h1>
        </header>

        {/* ── USER IDENTITY CARD ── */}
        <div className="arc-card p-5 bg-white border border-[#E8EEF5] flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0085FF] via-[#7B61FF] to-[#FF7A00] p-0.5 shadow-md shrink-0">
            <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-xl font-black text-[#0085FF]">
              P
            </div>
          </div>
          <div>
            <h2 className="text-base font-black text-[#0A192F]">Prashant Hiremath</h2>
            <p className="text-xs text-[#64748B] font-medium">The Unstoppable Producer</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0085FF] text-[10px] font-extrabold">
                Day 17 / 90
              </span>
              <span className="px-2 py-0.5 rounded-md bg-orange-50 text-[#FF7A00] text-[10px] font-extrabold">
                Level 1 · 450 XP
              </span>
            </div>
          </div>
        </div>

        {/* ── EDIT IDENTITY STATEMENT ── */}
        <div className="arc-card p-4 bg-white border border-[#E8EEF5] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#0A192F]">
              Identity Affirmation
            </span>
            <span className="text-[10px] text-[#0085FF] font-bold">Daily Anchor</span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={identityText}
              onChange={(e) => setIdentityText(e.target.value)}
              className="w-full text-xs font-semibold text-[#0A192F] bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#0085FF]"
            />
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-[10px] text-[#94A3B8]">“I am becoming {identityText}”</span>
            <button
              onClick={handleSaveIdentity}
              className="text-[10px] font-bold text-[#0085FF] hover:underline"
            >
              {isSaved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* ── NOTIFICATIONS SETTINGS ── */}
        <div className="arc-card p-4 bg-white border border-[#E8EEF5] space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Bell className="w-4 h-4 text-[#0085FF]" />
            <h3 className="text-xs font-black uppercase text-[#0A192F]">
              Notification Protocol
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0A192F]">Morning Protocol Alarm</div>
              <div className="text-[10px] text-[#64748B]">7:00 AM wake up & cold shower reminder</div>
            </div>
            <input
              type="checkbox"
              checked={morningReminder}
              onChange={(e) => setMorningReminder(e.target.checked)}
              className="accent-[#0085FF] w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0A192F]">Evening Review Nudge</div>
              <div className="text-[10px] text-[#64748B]">9:30 PM score log & honesty check</div>
            </div>
            <input
              type="checkbox"
              checked={eveningReview}
              onChange={(e) => setEveningReview(e.target.checked)}
              className="accent-[#0085FF] w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0A192F]">Quiet Hours DND</div>
              <div className="text-[10px] text-[#64748B]">10:00 PM – 6:30 AM silent mode</div>
            </div>
            <input
              type="checkbox"
              checked={quietHours}
              onChange={(e) => setQuietHours(e.target.checked)}
              className="accent-[#0085FF] w-4 h-4"
            />
          </div>
        </div>

        {/* ── DATA & PRIVACY ── */}
        <div className="arc-card p-4 bg-white border border-[#E8EEF5] space-y-2">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black uppercase text-[#0A192F]">
              Data & Cloud Sync
            </h3>
          </div>

          <button
            onClick={() => alert('Exporting all 90-day logs to JSON...')}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-[#475569] hover:text-[#0A192F]"
          >
            <div className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              <span>Export Transformation Data (JSON)</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
