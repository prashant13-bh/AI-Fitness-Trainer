'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PRASHANT_PROFILE,
  GLOW_UP_PHASES,
  MORNING_ROUTINE,
  MIDDAY_ROUTINE,
  EVENING_ROUTINE,
  AM_SKIN_PROTOCOL,
  PM_SKIN_PROTOCOL,
  WEEKLY_WORKOUT,
  NUTRITION_RULES,
  REMINDER_SCHEDULE,
} from '@/lib/prashantProfile';
import {
  Flame, Moon, Sun, Droplets, Dumbbell, Apple, Brain, Star,
  Bell, BellOff, Check, ChevronDown, ChevronUp, Target,
  Heart, Zap, Trophy, Sparkles, Clock, Volume2, Calendar,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────
type TabId = 'dashboard' | 'routine' | 'skin' | 'workout' | 'nutrition' | 'goals';

interface CompletedTasks {
  [key: string]: boolean;
}

// ── Helpers ────────────────────────────────────────────────────
function getDaysSinceOct1() {
  const start = new Date('2026-10-01');
  const today = new Date();
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

function getDaysUntilDec2027() {
  const end = new Date('2027-12-31');
  const today = new Date();
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function getAge() {
  const dob = new Date('2000-08-13');
  const today = new Date();
  const age = Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  return age;
}

function getCurrentPhase(): number {
  const today = new Date();
  if (today <= new Date('2026-12-31')) return 0;
  if (today <= new Date('2027-06-30')) return 1;
  return 2;
}

function getTodayKey() {
  return `prashant_glowup_${new Date().toISOString().split('T')[0]}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 20) return 'Good Evening';
  return 'Good Night';
}

// ── Category configs ──────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { color: string; bg: string; Icon: React.ComponentType<{ className?: string }> }> = {
  BODY:      { color: '#FF7A00', bg: 'bg-orange-50',   Icon: Dumbbell },
  SKIN:      { color: '#A855F7', bg: 'bg-purple-50',   Icon: Sparkles },
  MIND:      { color: '#0085FF', bg: 'bg-blue-50',     Icon: Brain },
  NUTRITION: { color: '#10B981', bg: 'bg-emerald-50',  Icon: Apple },
  SLEEP:     { color: '#6366F1', bg: 'bg-indigo-50',   Icon: Moon },
};

// ── Sub-components ─────────────────────────────────────────────

function GlowBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
      style={{ background: color }}
    >
      {label}
    </span>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-black text-[#0A192F] tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ── DASHBOARD TAB ─────────────────────────────────────────────
function DashboardTab({ completed, onToggle }: { completed: CompletedTasks; onToggle: (id: string) => void }) {
  const dayNum = getDaysSinceOct1();
  const daysLeft = getDaysUntilDec2027();
  const currentPhase = getCurrentPhase();
  const allTasks = [...MORNING_ROUTINE, ...MIDDAY_ROUTINE, ...EVENING_ROUTINE];
  const todayDone = allTasks.filter(t => completed[t.id]).length;
  const todayScore = Math.round((todayDone / allTasks.length) * 100);
  const greeting = getGreeting();

  // BMI
  const bmi = (PRASHANT_PROFILE.currentWeight / ((PRASHANT_PROFILE.height / 100) ** 2)).toFixed(1);

  return (
    <div className="space-y-5">
      {/* HERO CARD */}
      <div
        className="relative rounded-3xl overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg, #0A192F 0%, #1E3A5F 40%, #2D1B4E 100%)' }}
      >
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #FF7A00, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7B61FF, transparent)' }} />

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">{greeting}</p>
              <h1 className="text-3xl font-black text-white mt-1 tracking-tight">
                Bruce 🔥
              </h1>
              <p className="text-sm font-semibold text-[#94A3B8] mt-0.5">Glow-Up 2027 — Day {dayNum}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">{todayScore}%</div>
              <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Today's Score</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-[10px] font-bold text-[#64748B] mb-1.5">
              <span>Daily Protocol: {todayDone}/{allTasks.length} done</span>
              <span>{daysLeft} days to Dec 2027</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${todayScore}%`,
                  background: 'linear-gradient(90deg, #0085FF, #7B61FF, #FF7A00)',
                }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Age', val: `${getAge()}y` },
              { label: 'Weight', val: `${PRASHANT_PROFILE.currentWeight}kg` },
              { label: 'BMI', val: bmi },
              { label: 'Lost', val: '22kg ↓' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-base font-black text-white">{s.val}</div>
                <div className="text-[9px] font-bold text-[#64748B] uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PHASE PROGRESS */}
      <div className="arc-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0085FF]">2027 Phase Roadmap</span>
          <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, #0085FF, #7B61FF)' }}>
            Phase {currentPhase + 1} Active
          </span>
        </div>
        <div className="space-y-3">
          {GLOW_UP_PHASES.map((phase, i) => {
            const isActive = i === currentPhase;
            const isDone = i < currentPhase;
            return (
              <div
                key={i}
                className={`rounded-2xl p-4 border transition-all ${
                  isActive
                    ? 'border-[#7B61FF] bg-gradient-to-r from-blue-50/80 to-purple-50/80'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-[#E8EEF5] bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-[#0A192F]">{phase.phase}</span>
                  {isDone ? (
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">✅ DONE</span>
                  ) : isActive ? (
                    <span className="text-[9px] font-black text-[#7B61FF] bg-purple-100 px-2 py-0.5 rounded-full">⚡ ACTIVE</span>
                  ) : (
                    <span className="text-[9px] font-black text-[#94A3B8] bg-slate-100 px-2 py-0.5 rounded-full">⏳ NEXT</span>
                  )}
                </div>
                <p className="text-[10px] text-[#64748B] font-semibold">{phase.period}</p>
                <p className="text-xs text-[#475569] mt-1.5 font-medium">{phase.bodyGoal}</p>
                <p className="text-xs text-[#7B61FF] mt-0.5 font-medium">💜 {phase.skinGoal}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK COMPLETE TODAY */}
      <div className="arc-card p-5">
        <SectionHeader
          title="Today's Key Disciplines"
          subtitle="Tap to mark complete. These are your keystones."
        />
        <div className="space-y-2">
          {allTasks.filter(t => t.isKeystone).map(task => {
            const cfg = CATEGORY_CONFIG[task.category];
            const Icon = cfg.Icon;
            const done = completed[task.id];
            return (
              <div
                key={task.id}
                onClick={() => onToggle(task.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  done
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-[#E8EEF5] hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    done ? 'bg-emerald-500 text-white' : `${cfg.bg} text-[${cfg.color}]`
                  }`}
                  style={!done ? { color: cfg.color } : {}}
                >
                  {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${done ? 'line-through text-[#94A3B8]' : 'text-[#0A192F]'}`}>
                    {task.time} — {task.title}
                  </p>
                  <p className="text-[10px] text-[#64748B] mt-0.5 truncate">{task.duration} · {task.category}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                }`}>
                  {done && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOTIVATION */}
      <div
        className="rounded-3xl p-5 text-white text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FF7A00 0%, #FF4500 50%, #CC0000 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 text-[120px] flex items-center justify-center font-black">🔥</div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Bruce's Daily Mantra</p>
        <p className="text-lg font-black leading-snug">
          "From 92kg to 70kg — I already proved I can. Now I go from 70 to Legendary."
        </p>
        <p className="text-xs font-bold mt-2 opacity-70">Winter ARC 2026 → Glow-Up 2027 🏆</p>
      </div>
    </div>
  );
}

// ── ROUTINE TAB ───────────────────────────────────────────────
function RoutineTab({ completed, onToggle }: { completed: CompletedTasks; onToggle: (id: string) => void }) {
  const sections = [
    { label: '🌅 Morning Routine', color: '#FF9500', tasks: MORNING_ROUTINE, time: '5:30 AM – 8:00 AM' },
    { label: '☀️ Midday Routine',  color: '#10B981', tasks: MIDDAY_ROUTINE,  time: '1:00 PM – 4:00 PM' },
    { label: '🌙 Evening Routine', color: '#7B61FF', tasks: EVENING_ROUTINE, time: '7:00 PM – 10:00 PM' },
  ];

  const [openSection, setOpenSection] = useState<string>('🌅 Morning Routine');

  return (
    <div className="space-y-4">
      {sections.map(section => {
        const sectionDone = section.tasks.filter(t => completed[t.id]).length;
        const isOpen = openSection === section.label;
        return (
          <div key={section.label} className="arc-card overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 text-left"
              onClick={() => setOpenSection(isOpen ? '' : section.label)}
            >
              <div>
                <div className="text-sm font-black text-[#0A192F]">{section.label}</div>
                <div className="text-[10px] text-[#64748B] font-medium mt-0.5">{section.time} · {sectionDone}/{section.tasks.length} done</div>
              </div>
              <div className="flex items-center gap-2">
                {/* mini progress */}
                <div className="flex gap-1">
                  {section.tasks.map(t => (
                    <div key={t.id} className={`w-2 h-2 rounded-full ${completed[t.id] ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  ))}
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-[#E8EEF5] divide-y divide-[#E8EEF5]">
                {section.tasks.map(task => {
                  const cfg = CATEGORY_CONFIG[task.category];
                  const Icon = cfg.Icon;
                  const done = completed[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => onToggle(task.id)}
                      className={`p-4 cursor-pointer transition-all ${
                        done ? 'bg-emerald-50/60' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            done ? 'bg-emerald-500 text-white' : cfg.bg
                          }`}
                          style={!done ? { color: cfg.color } : {}}
                        >
                          {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold ${done ? 'line-through text-[#94A3B8]' : 'text-[#0A192F]'}`}>
                              {task.time} — {task.title}
                            </span>
                            {task.isKeystone && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">⭐ KEY</span>
                            )}
                            {task.winterSpecific && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600">❄️ WINTER</span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">{task.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock className="w-3 h-3 text-[#94A3B8]" />
                            <span className="text-[10px] font-bold text-[#94A3B8]">{task.duration}</span>
                            <span style={{ color: cfg.color }} className="text-[10px] font-black uppercase">
                              {task.category}
                            </span>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'
                        }`}>
                          {done && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── SKIN TAB ───────────────────────────────────────────────────
function SkinTab() {
  const [activeProtocol, setActiveProtocol] = useState<'AM' | 'PM'>('AM');
  const protocol = activeProtocol === 'AM' ? AM_SKIN_PROTOCOL : PM_SKIN_PROTOCOL;

  const warnings = [
    { icon: '🚫', text: 'NEVER use Betnovate-N or any steroid cream again. Ever.' },
    { icon: '☀️', text: 'Sunscreen is MANDATORY every single day. No excuses.' },
    { icon: '🚿', text: 'Cold water only for face washing. No hot water (worsens pigmentation).' },
    { icon: '🤚', text: 'Stop touching your face. Hands carry bacteria → new acne.' },
    { icon: '💧', text: '3L water/day. Dehydration = dull, ashy skin.' },
    { icon: '😴', text: 'Sleep by 10PM. Skin repairs ONLY during deep sleep.' },
  ];

  return (
    <div className="space-y-5">
      {/* BETNOVATE WARNING */}
      <div className="rounded-3xl p-5 border-2 border-red-200 bg-red-50">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">⚠️</span>
          <h3 className="text-sm font-black text-red-700">Betnovate-N Recovery Protocol</h3>
        </div>
        <p className="text-xs text-red-600 font-semibold leading-relaxed">
          You've stopped Betnovate-N ✅ — great decision! Steroid creams thin the skin and cause steroid-induced hyperpigmentation. 
          Recovery takes 3–6 months with the right protocol. <strong>DO NOT go back to it. Ever.</strong>
        </p>
      </div>

      {/* GOLDEN RULES */}
      <div className="arc-card p-5">
        <SectionHeader title="🛡️ Skin Golden Rules" subtitle="Break these and you restart the clock." />
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-[#E8EEF5]">
              <span className="text-base shrink-0">{w.icon}</span>
              <p className="text-xs text-[#0A192F] font-semibold leading-relaxed">{w.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROTOCOL TOGGLE */}
      <div className="arc-card p-5">
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveProtocol('AM')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              activeProtocol === 'AM'
                ? 'text-white shadow-md'
                : 'bg-slate-100 text-[#64748B]'
            }`}
            style={activeProtocol === 'AM' ? { background: 'linear-gradient(90deg, #FF9500, #FF7A00)' } : {}}
          >
            🌅 AM Protocol (4 steps)
          </button>
          <button
            onClick={() => setActiveProtocol('PM')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              activeProtocol === 'PM'
                ? 'text-white shadow-md'
                : 'bg-slate-100 text-[#64748B]'
            }`}
            style={activeProtocol === 'PM' ? { background: 'linear-gradient(90deg, #7B61FF, #A855F7)' } : {}}
          >
            🌙 PM Protocol ({PM_SKIN_PROTOCOL.steps.length} steps)
          </button>
        </div>

        <div className="space-y-3">
          {protocol.steps.map((step) => (
            <div key={step.step} className="rounded-2xl border border-[#E8EEF5] overflow-hidden">
              <div
                className="p-3 flex items-center gap-3"
                style={{
                  background: activeProtocol === 'AM'
                    ? 'linear-gradient(90deg, rgba(255,149,0,0.08), transparent)'
                    : 'linear-gradient(90deg, rgba(123,97,255,0.08), transparent)',
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0"
                  style={{
                    background: activeProtocol === 'AM'
                      ? 'linear-gradient(135deg, #FF9500, #FF7A00)'
                      : 'linear-gradient(135deg, #7B61FF, #A855F7)',
                  }}
                >
                  {step.step}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-[#0A192F]">{step.product}</p>
                </div>
              </div>
              <div className="p-3 space-y-1.5 bg-white">
                <p className="text-[11px] font-semibold text-[#0A192F]">
                  <span className="text-[10px] font-black text-[#0085FF] uppercase mr-1.5">HOW:</span>
                  {step.instruction}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  <span className="text-[10px] font-black text-[#A855F7] uppercase mr-1.5">WHY:</span>
                  {step.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INGREDIENTS TO BUY */}
      <div className="arc-card p-5">
        <SectionHeader title="🛒 What to Buy (Priority Order)" />
        <div className="space-y-2">
          {[
            { priority: '1', name: 'Sunscreen SPF 50 PA+++', brand: 'Anemia / Minimalist / Biore UV', cost: '₹400–800', why: 'Most critical. Nothing works without this.' },
            { priority: '2', name: 'Niacinamide 10% Serum', brand: 'Minimalist / The Ordinary', cost: '₹500–800', why: 'Repairs Betnovate damage, fades pigmentation.' },
            { priority: '3', name: 'CeraVe Gentle Cleanser', brand: 'CeraVe / Cetaphil', cost: '₹700–1200', why: 'Rebuilds damaged skin barrier with ceramides.' },
            { priority: '4', name: 'Vitamin C Serum 10%', brand: 'Minimalist / Mamaearth', cost: '₹600–900', why: 'Brightening + collagen for PM use.' },
            { priority: '5', name: 'Heavy Moisturizer', brand: 'CeraVe PM Lotion / Vaseline', cost: '₹300–800', why: 'Night sealing = maximum skin repair.' },
            { priority: '6', name: 'Retinol 0.1%', brand: 'Minimalist (START LOW)', cost: '₹500–700', why: 'Cell turnover, fades scars — introduce slowly.' },
          ].map(item => (
            <div key={item.priority} className="flex items-start gap-3 p-3 rounded-xl border border-[#E8EEF5] bg-slate-50/50">
              <span className="w-6 h-6 rounded-full bg-[#0085FF] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                {item.priority}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-[#0A192F]">{item.name}</p>
                <p className="text-[10px] text-[#64748B] font-medium">{item.brand} · {item.cost}</p>
                <p className="text-[10px] text-[#A855F7] font-semibold mt-0.5">{item.why}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── WORKOUT TAB ───────────────────────────────────────────────
function WorkoutTab() {
  const dayIndex = new Date().getDay(); // 0=Sun
  const daysOrder = [6, 0, 1, 2, 3, 4, 5]; // Mon first
  const todayIdx = daysOrder.indexOf(dayIndex === 0 ? 6 : dayIndex - 1);

  const intensityColor: Record<string, string> = {
    HIGH: '#FF7A00',
    MODERATE: '#0085FF',
    MAX: '#EF4444',
    LOW: '#10B981',
  };

  return (
    <div className="space-y-5">
      {/* BODY RECOMP INFO */}
      <div
        className="rounded-3xl p-5 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0052FF 0%, #7B61FF 60%, #FF7A00 100%)' }}
      >
        <div className="absolute top-0 right-0 opacity-10 text-[80px] font-black">💪</div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Your Body Composition Goal</p>
        <h2 className="text-2xl font-black">From Skinny Fat → Lean Athletic</h2>
        <p className="text-xs font-semibold opacity-80 mt-2 leading-relaxed">
          Target: 63 kg @ 15% body fat. You need to lose ~7 kg fat while gaining muscle simultaneously. 
          This is body recomposition — possible since you're returning to fitness.
        </p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Current', val: '70 kg', sub: '~25% fat (est.)' },
            { label: 'Target', val: '63 kg', sub: '~15% fat' },
            { label: 'Timeline', val: '15 mo', sub: 'By Dec 2027' },
          ].map(s => (
            <div key={s.label} className="text-center bg-white/10 rounded-xl p-2">
              <div className="text-base font-black">{s.val}</div>
              <div className="text-[9px] font-bold opacity-80">{s.label}</div>
              <div className="text-[9px] opacity-60">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WEEKLY SCHEDULE */}
      <div className="arc-card p-5">
        <SectionHeader title="📅 Weekly Workout Plan" subtitle="6 days training + 1 active recovery" />
        <div className="space-y-2.5">
          {WEEKLY_WORKOUT.map((day, i) => {
            const isToday = i === todayIdx;
            return (
              <div
                key={day.day}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isToday
                    ? 'border-[#FF7A00] shadow-md shadow-orange-100'
                    : 'border-[#E8EEF5]'
                }`}
              >
                <div
                  className={`flex items-center justify-between px-4 py-3 ${
                    isToday ? 'bg-gradient-to-r from-orange-50 to-yellow-50' : 'bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#0A192F]">{day.day}</span>
                      {isToday && (
                        <span className="text-[9px] font-black text-white bg-[#FF7A00] px-2 py-0.5 rounded-full">TODAY</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] font-medium mt-0.5">{day.focus}</p>
                  </div>
                  <span
                    className="text-[9px] font-black px-2 py-1 rounded-full text-white"
                    style={{ background: intensityColor[day.intensity] || '#0085FF' }}
                  >
                    {day.intensity}
                  </span>
                </div>
                <div className="bg-slate-50/80 px-4 py-2.5 flex flex-wrap gap-1.5">
                  {day.exercises.map((ex, j) => (
                    <span key={j} className="text-[10px] font-semibold bg-white border border-[#E8EEF5] px-2 py-0.5 rounded-lg text-[#475569]">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BODY PART FOCUS */}
      <div className="arc-card p-5">
        <SectionHeader title="🎯 Priority Body Areas" subtitle="What to build for your glow-up" />
        <div className="grid grid-cols-2 gap-3">
          {[
            { area: 'Shoulders & Traps', why: 'Creates illusion of broader frame', priority: 'HIGH', icon: '🦾' },
            { area: 'Chest', why: 'Fills out shirts, improves posture', priority: 'HIGH', icon: '💪' },
            { area: 'Back (V-taper)', why: 'Visual width from behind', priority: 'HIGH', icon: '🔱' },
            { area: 'Core & Abs', why: 'Reveals definition when fat drops', priority: 'MEDIUM', icon: '⚡' },
            { area: 'Jawline (Face Yoga)', why: 'Defines face structure naturally', priority: 'HIGH', icon: '✨' },
            { area: 'Legs', why: 'Balance + testosterone boost', priority: 'MEDIUM', icon: '🦵' },
          ].map(b => (
            <div key={b.area} className="p-3 rounded-2xl border border-[#E8EEF5] bg-slate-50/50">
              <div className="text-xl mb-1">{b.icon}</div>
              <p className="text-xs font-black text-[#0A192F]">{b.area}</p>
              <p className="text-[10px] text-[#64748B] mt-0.5">{b.why}</p>
              <span className={`text-[9px] font-black mt-1.5 inline-block px-2 py-0.5 rounded-full ${
                b.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
              }`}>{b.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── NUTRITION TAB ─────────────────────────────────────────────
function NutritionTab() {
  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div
        className="rounded-3xl p-5 text-white"
        style={{ background: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)' }}
      >
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Your Nutrition Goal</p>
        <h2 className="text-xl font-black">1750–1900 kcal/day · 120–140g protein</h2>
        <p className="text-xs font-semibold opacity-80 mt-2">
          Caloric deficit of 300–400 kcal for fat loss. High protein to protect muscle during cut.
        </p>
      </div>

      {/* GOLDEN RULES */}
      <div className="arc-card p-5">
        <SectionHeader title="🥗 Nutrition Rules" />
        <div className="space-y-2.5">
          {NUTRITION_RULES.map((rule, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#E8EEF5] bg-white">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <span className="text-base">{['💪', '💧', '📉', '🚫', '🏠', '⏰', '✨'][i]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-[#0A192F]">{rule.rule}</span>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                    {rule.value}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">{rule.why}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MEAL PLAN */}
      <div className="arc-card p-5">
        <SectionHeader title="🍽️ Sample Daily Meal Plan" />
        <div className="space-y-3">
          {[
            {
              meal: 'Breakfast (7:30 AM)', kcal: '450 kcal', protein: '40g',
              items: ['3 whole eggs (scrambled/boiled)', '1 cup oats with banana', '1 glass milk/soy milk'],
              icon: '🌅',
            },
            {
              meal: 'Lunch (1:00 PM)', kcal: '600 kcal', protein: '40g',
              items: ['1 cup dal (protein-rich)', '1 cup rice (small portion)', '100g paneer or chicken', 'Mixed sabji + salad'],
              icon: '☀️',
            },
            {
              meal: 'Evening Snack (4:00 PM)', kcal: '200 kcal', protein: '15g',
              items: ['1 banana + 20 almonds', 'OR: 1 cup chana (roasted)', '1 glass buttermilk'],
              icon: '🌤️',
            },
            {
              meal: 'Dinner (7:00 PM)', kcal: '450 kcal', protein: '35g',
              items: ['3-egg omelette (no yolk for 2)', '2 roti / 1 cup dal', 'Vegetables (no rice/heavy carbs)'],
              icon: '🌙',
            },
          ].map(m => (
            <div key={m.meal} className="rounded-2xl border border-[#E8EEF5] overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50/60 to-transparent">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{m.icon}</span>
                  <span className="text-xs font-black text-[#0A192F]">{m.meal}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{m.kcal}</span>
                  <span className="text-[9px] font-black text-[#0085FF] bg-blue-50 px-2 py-0.5 rounded-full">{m.protein}</span>
                </div>
              </div>
              <ul className="p-3 space-y-1">
                {m.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-[11px] text-[#475569]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FOODS TO EAT / AVOID */}
      <div className="grid grid-cols-2 gap-4">
        <div className="arc-card p-4">
          <p className="text-xs font-black text-emerald-600 mb-3">✅ Eat Daily</p>
          {['Eggs', 'Chicken/Fish', 'Dal/Paneer', 'Oats', 'Green veggies', 'Berries', 'Nuts/seeds', 'Curd/yoghurt', 'Turmeric milk'].map(f => (
            <div key={f} className="flex items-center gap-1.5 py-1">
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="text-[11px] text-[#475569]">{f}</span>
            </div>
          ))}
        </div>
        <div className="arc-card p-4">
          <p className="text-xs font-black text-red-500 mb-3">🚫 Avoid Always</p>
          {['Sugar & sweets', 'Fried food', 'Maida/white bread', 'Cold drinks', 'Chips/junk', 'Alcohol', 'Late night carbs', 'Processed meat', 'Fruit juices'].map(f => (
            <div key={f} className="flex items-center gap-1.5 py-1">
              <div className="w-3 h-3 rounded-full bg-red-200 shrink-0 flex items-center justify-center">
                <div className="w-1.5 h-0.5 bg-red-500 rounded-full" />
              </div>
              <span className="text-[11px] text-[#475569]">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── GOALS TAB ─────────────────────────────────────────────────
function GoalsTab() {
  const currentPhase = getCurrentPhase();

  return (
    <div className="space-y-5">
      {/* TRANSFORMATION TIMELINE */}
      <div className="arc-card p-5">
        <SectionHeader title="🏆 The 2027 Glow-Up Roadmap" subtitle="Bruce · Born 13 Aug 2000" />
        <div className="relative pl-8 space-y-5">
          {/* vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0085FF] via-[#7B61FF] to-[#FF7A00] rounded-full" />

          {GLOW_UP_PHASES.map((phase, i) => {
            const isActive = i === currentPhase;
            const isDone = i < currentPhase;
            const colors = ['#0085FF', '#7B61FF', '#FF7A00'];
            return (
              <div key={i} className="relative">
                {/* dot */}
                <div
                  className="absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-white shadow-md"
                  style={{ background: colors[i] }}
                >
                  {isDone ? '✓' : i + 1}
                </div>

                <div
                  className={`rounded-2xl border p-4 transition-all ${
                    isActive
                      ? 'border-[#7B61FF] shadow-md'
                      : isDone
                      ? 'border-emerald-200'
                      : 'border-[#E8EEF5]'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, rgba(123,97,255,0.05), rgba(0,133,255,0.05))' } : {}}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[#0A192F]">{phase.phase}</span>
                    <span className="text-[9px] font-black text-white px-2 py-0.5 rounded-full"
                      style={{ background: colors[i] }}>
                      {phase.targetWeight}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-[#94A3B8] mb-2">{phase.period}</p>
                  <p className="text-[11px] font-semibold text-[#475569] mb-1">💪 {phase.bodyGoal}</p>
                  <p className="text-[11px] font-semibold text-[#A855F7] mb-3">✨ {phase.skinGoal}</p>
                  
                  <div className="space-y-1.5">
                    {phase.milestones.map((m, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full border border-[#E8EEF5] flex items-center justify-center shrink-0 mt-0.5 bg-white">
                          {(isDone || (isActive && j === 0)) && (
                            <Check className="w-2.5 h-2.5 text-emerald-500 stroke-[3]" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#475569]">{m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BEFORE / AFTER VISION */}
      <div className="arc-card p-5">
        <SectionHeader title="📸 Before → After Vision" />
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-4">
            <p className="text-[10px] font-black text-red-500 uppercase mb-3">NOW (Sep 2026)</p>
            {[
              '70 kg skinny fat', '~25% body fat (est.)', 'Hyperpigmentation', 'Post-acne marks', 'Uneven skin tone', 'Dull complexion', 'No visible muscle',
            ].map(t => (
              <p key={t} className="text-[11px] text-[#64748B] py-0.5">• {t}</p>
            ))}
          </div>
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4">
            <p className="text-[10px] font-black text-emerald-600 uppercase mb-3">GOAL (Dec 2027)</p>
            {[
              '63 kg lean athlete', '~15% body fat', 'Clear, even skin', 'Zero acne marks', 'Radiant glow', 'Glass skin texture', 'Visible V-taper',
            ].map(t => (
              <p key={t} className="text-[11px] text-[#475569] py-0.5">✅ {t}</p>
            ))}
          </div>
        </div>
      </div>

      {/* MONTHLY MILESTONES */}
      <div className="arc-card p-5">
        <SectionHeader title="📅 Monthly Progress Checkpoints" />
        <div className="space-y-2">
          {[
            { month: 'Oct 2026', body: '69 kg · Workout habit locked in', skin: 'Barrier healing begins · Redness reducing' },
            { month: 'Nov 2026', body: '67–68 kg · Strength improving', skin: 'Pigmentation 20% lighter' },
            { month: 'Dec 2026', body: '65–66 kg · Phase 1 complete!', skin: '40% pigmentation faded · No new acne' },
            { month: 'Mar 2027', body: '64 kg · Muscle visible', skin: 'Even skin tone · Scars fading' },
            { month: 'Jun 2027', body: '63 kg · Phase 2 complete!', skin: '80% pigmentation gone · Natural glow' },
            { month: 'Dec 2027', body: '62–63 kg LEAN · GLOW-UP COMPLETE 🏆', skin: '🌟 GLASS SKIN ACHIEVED' },
          ].map((m, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-[#E8EEF5] bg-white">
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#0085FF] to-[#FF7A00] shrink-0 mt-1.5" />
              <div className="flex-1">
                <p className="text-[10px] font-black text-[#0085FF] mb-0.5">{m.month}</p>
                <p className="text-[11px] font-semibold text-[#0A192F]">💪 {m.body}</p>
                <p className="text-[11px] text-[#A855F7]">✨ {m.skin}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── REMINDERS TAB ─────────────────────────────────────────────
function RemindersTab() {
  const [notifGranted, setNotifGranted] = useState(false);
  const [activeReminders, setActiveReminders] = useState<Set<string>>(new Set());
  const [alarmActive, setAlarmActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
    }
    // Load saved reminders
    try {
      const saved = localStorage.getItem('prashant_active_reminders');
      if (saved) setActiveReminders(new Set(JSON.parse(saved)));
      setAlarmActive(localStorage.getItem('prashant_alarm_active') === 'true');
    } catch {}
  }, []);

  // Audio alarm synthesizer for morning wake-up
  const playAlarmChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      // Upbeat motivating 6-note wake-up chime
      const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + idx * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.16 + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.16);
        osc.stop(ctx.currentTime + idx * 0.16 + 0.33);
      });
    } catch {}
  };

  // Poll for reminders every minute
  useEffect(() => {
    if (!notifGranted) return;
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      REMINDER_SCHEDULE.forEach(r => {
        if (activeReminders.has(r.id) && r.time === currentTime) {
          try {
            new Notification('Bruce — Glow-Up Reminder 🔥', {
              body: r.label,
              icon: '/favicon.ico',
              tag: `bruce_reminder_${r.id}`,
            });
          } catch {}
        }
      });
      // Morning alarm: rings audio chime + push notification
      if (alarmActive && currentTime === '05:30') {
        playAlarmChime();
        try {
          new Notification('⏰ WAKE UP BRUCE!', {
            body: '5:30 AM — Rise & Shine! Your Winter Arc routine starts NOW. No snooze allowed! 🔥',
            icon: '/favicon.ico',
            tag: 'bruce_morning_alarm',
          });
        } catch {}
      }
    }, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [notifGranted, activeReminders, alarmActive]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifGranted(perm === 'granted');
    }
  };

  const toggleReminder = (id: string) => {
    setActiveReminders(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('prashant_active_reminders', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleAll = () => {
    if (activeReminders.size === REMINDER_SCHEDULE.length) {
      setActiveReminders(new Set());
      localStorage.setItem('prashant_active_reminders', JSON.stringify([]));
    } else {
      const all = new Set(REMINDER_SCHEDULE.map(r => r.id));
      setActiveReminders(all);
      localStorage.setItem('prashant_active_reminders', JSON.stringify([...all]));
    }
  };

  const toggleAlarm = () => {
    const next = !alarmActive;
    setAlarmActive(next);
    localStorage.setItem('prashant_alarm_active', String(next));
    if (next && notifGranted) {
      playAlarmChime();
      new Notification('✅ Morning Alarm Set!', {
        body: 'Your 5:30 AM wake-up alarm is active. Sleep well, Bruce! 🌙',
      });
    }
  };

  const typeColors: Record<string, string> = {
    morning: '#FF9500', workout: '#FF7A00', nutrition: '#10B981',
    skin: '#A855F7', hydration: '#0085FF', sleep: '#6366F1',
  };

  return (
    <div className="space-y-5">
      {/* NOTIFICATION PERMISSION */}
      {!notifGranted && (
        <div
          className="rounded-3xl p-5 text-white"
          style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
        >
          <div className="flex items-start gap-3">
            <BellOff className="w-8 h-8 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-black mb-1">Enable Notifications First!</h3>
              <p className="text-xs opacity-90 mb-3">
                Without notifications, your reminders won't work. Tap below to enable them so you never miss a routine.
              </p>
              <button
                onClick={requestPermission}
                className="bg-white text-red-600 text-xs font-black px-4 py-2 rounded-xl"
              >
                🔔 Enable Notifications Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MORNING ALARM */}
      <div
        className={`rounded-3xl p-5 transition-all ${
          alarmActive
            ? 'border-2 border-orange-300 shadow-lg shadow-orange-100'
            : 'border-2 border-[#E8EEF5]'
        } bg-white`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md"
              style={{
                background: alarmActive
                  ? 'linear-gradient(135deg, #FF9500, #FF7A00)'
                  : '#F1F5F9',
              }}
            >
              ⏰
            </div>
            <div>
              <h3 className="text-base font-black text-[#0A192F]">Morning Alarm</h3>
              <p className="text-xs text-[#64748B]">5:30 AM · Daily · No Snooze</p>
              {alarmActive && (
                <p className="text-[10px] font-black text-[#FF7A00] mt-0.5">🔥 ACTIVE — Tomorrow: 5:30 AM</p>
              )}
            </div>
          </div>
          <button
            onClick={notifGranted ? toggleAlarm : requestPermission}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              alarmActive ? 'bg-[#FF7A00]' : 'bg-slate-200'
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                alarmActive ? 'left-7' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Audio Preview */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500">Wake-up audio chime</span>
          <button
            onClick={playAlarmChime}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF7A00] text-xs font-black transition"
          >
            <span>🔊</span>
            <span>Test Alarm Sound</span>
          </button>
        </div>
      </div>

      {/* REMINDER CONTROLS */}
      <div className="arc-card p-5">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="⚡ Daily Reminders" subtitle="Customize your routine alerts" />
          <button
            onClick={notifGranted ? toggleAll : requestPermission}
            className="text-[10px] font-black text-[#0085FF] bg-blue-50 px-3 py-1.5 rounded-xl"
          >
            {activeReminders.size === REMINDER_SCHEDULE.length ? 'Disable All' : 'Enable All'}
          </button>
        </div>

        <div className="space-y-2">
          {REMINDER_SCHEDULE.map(r => {
            const isOn = activeReminders.has(r.id);
            const color = typeColors[r.type] || '#0085FF';
            return (
              <div
                key={r.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isOn ? 'border-[#E8EEF5] bg-white shadow-sm' : 'border-[#E8EEF5] bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{ background: color }}
                  >
                    {r.time.split(':')[0] >= '12' ? '🌙' : '☀️'}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isOn ? 'text-[#0A192F]' : 'text-[#94A3B8]'}`}>
                      {r.label}
                    </p>
                    <p className="text-[10px] font-bold mt-0.5" style={{ color }}>
                      {r.time} {r.time >= '12:00' ? 'PM' : 'AM'} · {r.type.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => notifGranted ? toggleReminder(r.id) : requestPermission()}
                  className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${
                    isOn ? 'bg-[#0085FF]' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                      isOn ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* TEST NOTIFICATION & AUDIO */}
      {notifGranted && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              new Notification('🔥 Test — Bruce Glow-Up!', {
                body: 'Notifications are working! You\'ll never miss a routine again.',
                icon: '/favicon.ico',
              });
            }}
            className="py-3 px-2 rounded-2xl border-2 border-dashed border-[#0085FF] text-[#0085FF] text-xs font-black text-center"
          >
            🔔 Test Notification
          </button>
          <button
            onClick={playAlarmChime}
            className="py-3 px-2 rounded-2xl border-2 border-dashed border-[#FF7A00] text-[#FF7A00] text-xs font-black text-center"
          >
            🔊 Test Wake Chime
          </button>
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function GlowUpPage() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [completed, setCompleted] = useState<CompletedTasks>({});

  // Load completed tasks from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(getTodayKey());
      if (raw) setCompleted(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleTask = useCallback((id: string) => {
    setCompleted(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(getTodayKey(), JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Home',     icon: '🏠' },
    { id: 'routine',   label: 'Routine',  icon: '📋' },
    { id: 'skin',      label: 'Skin',     icon: '✨' },
    { id: 'workout',   label: 'Workout',  icon: '💪' },
    { id: 'nutrition', label: 'Diet',     icon: '🥗' },
    { id: 'goals',     label: 'Goals',    icon: '🏆' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(248,250,252,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E8EEF5',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base font-black shadow-md"
            style={{ background: 'linear-gradient(135deg, #0085FF, #7B61FF, #FF7A00)' }}
          >
            B
          </div>
          <div>
            <p className="text-xs font-black text-[#0A192F] leading-tight">Bruce's Glow-Up</p>
            <p className="text-[9px] text-[#94A3B8] font-bold">Day {getDaysSinceOct1()} · Winter Arc 2026</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('routine')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-[10px] font-black shadow-md"
          style={{ background: 'linear-gradient(90deg, #FF7A00, #FF4500)' }}
        >
          <Flame className="w-3.5 h-3.5 fill-white" />
          Today's Protocol
        </button>
      </header>

      {/* ── CONTENT ── */}
      <main className="px-4 pt-4 pb-28 max-w-2xl mx-auto">
        {activeTab === 'dashboard'  && <DashboardTab completed={completed} onToggle={toggleTask} />}
        {activeTab === 'routine'    && <RoutineTab   completed={completed} onToggle={toggleTask} />}
        {activeTab === 'skin'       && <SkinTab />}
        {activeTab === 'workout'    && <WorkoutTab />}
        {activeTab === 'nutrition'  && <NutritionTab />}
        {activeTab === 'goals'      && <GoalsTab />}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-2"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid #E8EEF5',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
                  isActive ? 'scale-110' : 'opacity-60 hover:opacity-80'
                }`}
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                <span
                  className="text-[9px] font-black"
                  style={{ color: isActive ? '#0085FF' : '#94A3B8' }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-[#0085FF]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
