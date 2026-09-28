'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import {
  TrendingDown, TrendingUp, Flame, Star, Camera,
  Sparkles, Dumbbell, Apple, Droplets, Moon,
  ChevronLeft, ChevronRight, ZoomIn, X, Award,
  Target, BarChart3, Activity, Eye,
} from 'lucide-react';
import BeforeAfterSlider from '@/components/progress/BeforeAfterSlider';


// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface DayRecord {
  dayNum: number;
  date: string;
  weekday: string;
  weight: string;
  waterGlasses: number;
  mood: number;
  energyLevel: number;
  skinCondition: number;
  note: string;
  workoutNotes: string;
  skinNotes: string;
  photos: { type: string; dataUrl: string; caption: string; timestamp: string }[];
  exercisesDone: number;
  exercisesTotal: number;
  mealsDone: number;
  mealsTotal: number;
  skinStepsDone: number;
  skinStepsTotal: number;
  score: number;
}

interface WeekSummary {
  weekNum: number;
  startDay: number;
  endDay: number;
  avgScore: number;
  workoutDays: number;
  perfectDays: number;
  avgWeight: number | null;
  photoDays: number;
}

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const START_DATE = new Date('2026-10-01');
const TARGET_WEIGHT = 63;
const START_WEIGHT = 70;
const TOTAL_ARC_DAYS = 457;
const EXERCISES_PER_DAY = 8;
const MEALS_PER_DAY = 6;
const SKIN_STEPS_PER_DAY = 12; // 5 AM + 7 PM

const PHASES = [
  { name: 'Phase 1 — Foundation', start: 1,   end: 92,  target: 65, color: '#FF7A00', emoji: '🌱' },
  { name: 'Phase 2 — Transform',  start: 93,  end: 274, target: 63, color: '#0085FF', emoji: '⚡' },
  { name: 'Phase 3 — Glow-Up',    start: 275, end: 457, target: 62, color: '#10B981', emoji: '🏆' },
];

const SKIN_CONDITIONS = ['Very Bad', 'Poor', 'Okay', 'Good', 'Glowing ✨'];
const MOOD_LABELS = ['Terrible', 'Poor', 'Okay', 'Good', 'Amazing 🔥'];
const BADGES_DEF = [
  { id: 'day1',       icon: '🔥', title: 'Arc Ignited',       desc: 'Day 1 logged',               threshold: 1,   type: 'days' },
  { id: 'week1',      icon: '💪', title: '7-Day Iron Will',   desc: '7 consecutive days logged',   threshold: 7,   type: 'days' },
  { id: 'week2',      icon: '⚡', title: '2-Week Beast',      desc: '14 days of discipline',       threshold: 14,  type: 'days' },
  { id: 'month1',     icon: '🛡️', title: 'Month 1 Complete',  desc: '30 days in the Arc',          threshold: 30,  type: 'days' },
  { id: 'photos10',   icon: '📸', title: 'Photo Logger',      desc: '10 photos documented',        threshold: 10,  type: 'photos' },
  { id: 'perfect5',   icon: '⭐', title: 'Perfect Week',      desc: '5 days with 80%+ score',      threshold: 5,   type: 'perfect' },
  { id: 'skinstreak', icon: '✨', title: 'Skin Healer',       desc: 'Skin protocol 10 days',       threshold: 10,  type: 'skin' },
  { id: 'water10',    icon: '💧', title: 'Hydration King',    desc: '8+ glasses 10 days',          threshold: 10,  type: 'water' },
  { id: 'phase1',     icon: '🌾', title: 'Phase 1 Complete',  desc: 'Completed Foundation phase',  threshold: 92,  type: 'days' },
  { id: 'phase2',     icon: '🌟', title: 'Phase 2 Complete',  desc: 'Completed Transformation',    threshold: 274, type: 'days' },
  { id: 'phase3',     icon: '👑', title: 'Glow-Up 2027',      desc: 'Full Arc completed!',         threshold: 457, type: 'days' },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getCurrentArcDay() {
  const today = new Date();
  const diff = Math.floor((today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

function getDateForDay(dayNum: number) {
  const d = new Date(START_DATE);
  d.setDate(d.getDate() + dayNum - 1);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getWeekdayForDay(dayNum: number) {
  const d = new Date(START_DATE);
  d.setDate(d.getDate() + dayNum - 1);
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
}

function loadAllDayRecords(upToDay: number): DayRecord[] {
  const records: DayRecord[] = [];
  for (let d = 1; d <= upToDay; d++) {
    try {
      const raw = localStorage.getItem(`bruce_arc_v2_day_${d}`);
      if (raw) {
        const data = JSON.parse(raw);
        const exDone = Object.values(data.completedExercises || {}).filter(Boolean).length;
        const mealDone = Object.values(data.completedMeals || {}).filter(Boolean).length;
        const skinDone = Object.values(data.completedSkinSteps || {}).filter(Boolean).length;
        const totalDone = exDone + mealDone + skinDone;
        const totalItems = EXERCISES_PER_DAY + MEALS_PER_DAY + SKIN_STEPS_PER_DAY;
        records.push({
          dayNum: d,
          date: getDateForDay(d),
          weekday: getWeekdayForDay(d),
          weight: data.weight || '',
          waterGlasses: data.waterGlasses || 0,
          mood: data.mood || 0,
          energyLevel: data.energyLevel || 0,
          skinCondition: data.skinCondition || 0,
          note: data.note || '',
          workoutNotes: data.workoutNotes || '',
          skinNotes: data.skinNotes || '',
          photos: data.photos || [],
          exercisesDone: exDone,
          exercisesTotal: EXERCISES_PER_DAY,
          mealsDone: mealDone,
          mealsTotal: MEALS_PER_DAY,
          skinStepsDone: skinDone,
          skinStepsTotal: SKIN_STEPS_PER_DAY,
          score: Math.round((totalDone / totalItems) * 100),
        });
      }
    } catch {}
  }
  return records;
}

function getWeeks(records: DayRecord[]): WeekSummary[] {
  const weeks: WeekSummary[] = [];
  const daysPerWeek = 7;
  const totalWeeks = Math.ceil(records.length / daysPerWeek);
  for (let w = 0; w < totalWeeks; w++) {
    const weekRecords = records.slice(w * 7, w * 7 + 7);
    const weights = weekRecords.map(r => parseFloat(r.weight)).filter(n => !isNaN(n));
    weeks.push({
      weekNum: w + 1,
      startDay: w * 7 + 1,
      endDay: Math.min((w + 1) * 7, records.length),
      avgScore: weekRecords.length ? Math.round(weekRecords.reduce((a, r) => a + r.score, 0) / weekRecords.length) : 0,
      workoutDays: weekRecords.filter(r => r.exercisesDone >= 4).length,
      perfectDays: weekRecords.filter(r => r.score >= 80).length,
      avgWeight: weights.length ? Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10 : null,
      photoDays: weekRecords.filter(r => r.photos.length > 0).length,
    });
  }
  return weeks;
}

// ─────────────────────────────────────────────────────────────
// MINI SVG LINE CHART
// ─────────────────────────────────────────────────────────────
function LineChart({ data, color, height = 60, showDots = true, fillGradient = true, reverse = false }: {
  data: number[];
  color: string;
  height?: number;
  showDots?: boolean;
  fillGradient?: boolean;
  reverse?: boolean;
}) {
  if (data.length < 2) return (
    <div className="flex items-center justify-center h-full text-[10px] text-[#94A3B8]" style={{ height }}>
      Not enough data yet
    </div>
  );

  const width = 300;
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const padX = 10;
  const padY = 8;

  const toX = (i: number) => padX + (i / (data.length - 1)) * (width - padX * 2);
  const toY = (v: number) => {
    const pct = (v - minVal) / range;
    const y = reverse ? pct : 1 - pct;
    return padY + y * (height - padY * 2);
  };

  const points = data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const pathD = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');
  const fillPath = `${pathD} L${toX(data.length - 1)},${height} L${toX(0)},${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fillGradient && (
        <path d={fillPath} fill={`url(#grad-${color.replace('#', '')})`} />
      )}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {showDots && data.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill={color} stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SCORE BAR CHART (for weekly heatmap)
// ─────────────────────────────────────────────────────────────
function ScoreBar({ score, day, isToday }: { score: number; day: string; isToday?: boolean }) {
  const color = score >= 80 ? '#10B981' : score >= 50 ? '#FF9500' : score > 0 ? '#94A3B8' : '#E2E8F0';
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-black text-[#0A192F]">{score > 0 ? `${score}` : ''}</span>
      <div className="w-8 rounded-xl overflow-hidden bg-slate-100 relative" style={{ height: 56 }}>
        <div className="absolute bottom-0 left-0 right-0 rounded-xl transition-all duration-700"
          style={{ height: `${Math.max(score, 4)}%`, background: isToday ? 'linear-gradient(135deg,#0085FF,#7B61FF)' : color }} />
      </div>
      <span className={`text-[9px] font-bold ${isToday ? 'text-[#0085FF]' : 'text-[#94A3B8]'}`}>{day}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PHOTO GALLERY MODAL
// ─────────────────────────────────────────────────────────────
function PhotoGallery({ photos, onClose }: {
  photos: { dataUrl: string; caption: string; timestamp: string; type: string; day: number; date: string }[];
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? photos : photos.filter(p => p.type === filter);
  const types = ['all', 'body', 'face', 'meal', 'workout', 'skin'];

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" onClick={onClose}>
      <div className="flex items-center justify-between p-4" onClick={e => e.stopPropagation()}>
        <p className="text-white font-black text-sm">📸 Progress Gallery ({filtered.length} photos)</p>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto" onClick={e => e.stopPropagation()}>
        {types.map(t => (
          <button key={t} onClick={() => { setFilter(t); setActive(0); }}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-black transition-all ${filter === t ? 'bg-white text-[#0A192F]' : 'bg-white/15 text-white'}`}>
            {t === 'all' ? `All (${photos.length})` : t}
          </button>
        ))}
      </div>

      {/* Main photo */}
      <div className="flex-1 flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
        {filtered.length > 0 ? (
          <div className="max-w-sm w-full">
            <img src={filtered[active]?.dataUrl} alt="" className="w-full rounded-2xl object-contain max-h-[55vh]" />
            <div className="mt-3 text-center">
              <p className="text-white font-black text-sm">{filtered[active]?.caption}</p>
              <p className="text-white/50 text-xs mt-1">Day {filtered[active]?.day} · {filtered[active]?.date}</p>
            </div>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white disabled:opacity-30">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-white/60 text-xs">{active + 1} / {filtered.length}</span>
              <button onClick={() => setActive(a => Math.min(filtered.length - 1, a + 1))} disabled={active === filtered.length - 1}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white disabled:opacity-30">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white/50 text-sm">No {filter} photos yet</p>
        )}
      </div>

      {/* Thumbnails */}
      {filtered.length > 1 && (
        <div className="flex gap-2 px-4 pb-6 overflow-x-auto" onClick={e => e.stopPropagation()}>
          {filtered.map((p, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === active ? 'border-white scale-110' : 'border-transparent opacity-60'}`}>
              <img src={p.dataUrl} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function ProgressPage() {
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'weight' | 'skin' | 'compare' | 'streaks' | 'badges' | 'gallery'>('overview');
  const [weekOffset, setWeekOffset] = useState(0);

  const currentDay = getCurrentArcDay();

  useEffect(() => {
    setRecords(loadAllDayRecords(currentDay));
  }, [currentDay]);

  // ── Derived data ──
  const loggedDays = records.filter(r => r.score > 0).length;
  const perfectDays = records.filter(r => r.score >= 80).length;
  const totalPhotos = records.reduce((a, r) => a + r.photos.length, 0);
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = records.length - 1; i >= 0; i--) {
      if (records[i].score >= 40) streak++;
      else break;
    }
    return streak;
  }, [records]);

  const weights = records.filter(r => r.weight && !isNaN(parseFloat(r.weight)));
  const latestWeight = weights.length ? parseFloat(weights[weights.length - 1].weight) : START_WEIGHT;
  const weightLost = Math.max(0, START_WEIGHT - latestWeight);
  const weightToGo = Math.max(0, latestWeight - TARGET_WEIGHT);

  const skinRecords = records.filter(r => r.skinCondition > 0);
  const avgSkin = skinRecords.length ? Math.round(skinRecords.reduce((a, r) => a + r.skinCondition, 0) / skinRecords.length * 10) / 10 : 0;
  const latestSkin = skinRecords.length ? skinRecords[skinRecords.length - 1].skinCondition : 0;

  const weeks = useMemo(() => getWeeks(records), [records]);

  // Last 28 days scores for score chart
  const last28Scores = records.slice(-28).map(r => r.score);

  // All photos flat
  const allPhotos = records.flatMap(r => r.photos.map(p => ({ ...p, day: r.dayNum, date: r.date })));

  // Badge calculation
  const skinStreakDays = records.filter(r => r.skinStepsDone >= 8).length;
  const waterDays = records.filter(r => r.waterGlasses >= 8).length;
  const badgeStatus = BADGES_DEF.map(b => {
    let unlocked = false;
    if (b.type === 'days') unlocked = currentDay >= b.threshold;
    if (b.type === 'photos') unlocked = totalPhotos >= b.threshold;
    if (b.type === 'perfect') unlocked = perfectDays >= b.threshold;
    if (b.type === 'skin') unlocked = skinStreakDays >= b.threshold;
    if (b.type === 'water') unlocked = waterDays >= b.threshold;
    return { ...b, unlocked };
  });

  // Current phase
  const currentPhase = PHASES.find(p => currentDay >= p.start && currentDay <= p.end) || PHASES[0];
  const phaseProgress = Math.round(((currentDay - currentPhase.start) / (currentPhase.end - currentPhase.start)) * 100);

  // Week for chart
  const currentWeek = Math.ceil(currentDay / 7);
  const chartWeek = Math.max(1, currentWeek - weekOffset);
  const weekStart = (chartWeek - 1) * 7;
  const weekRecordsForChart = records.slice(weekStart, weekStart + 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => ({
    day: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i],
    score: weekRecordsForChart[i]?.score ?? 0,
    isToday: weekStart + i + 1 === currentDay,
  }));

  const noDataYet = records.length === 0;

  return (
    <ResponsiveShell>
      <div className="w-full max-w-2xl mx-auto py-4 px-4 pb-36 select-none">

        {/* ── HERO ── */}
        <div className="rounded-3xl overflow-hidden mb-4"
          style={{ background: 'linear-gradient(135deg, #0A192F 0%, #1E3A5F 50%, #2D1B4E 100%)' }}>
          <div className="p-5">
            <span className="text-[10px] font-black text-[#FF7A00] uppercase tracking-widest">BRUCE · GLOW-UP 2027</span>
            <h1 className="text-2xl font-black text-white mt-1 leading-tight">Progress Dashboard</h1>
            <p className="text-xs text-white/50 mt-0.5">Arc Day {currentDay} of {TOTAL_ARC_DAYS} · {TOTAL_ARC_DAYS - currentDay} days to transformation</p>

            {/* Phase bar */}
            <div className="mt-4 p-3 rounded-2xl bg-white/10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[9px] font-black uppercase" style={{ color: currentPhase.color }}>{currentPhase.emoji} {currentPhase.name}</span>
                  <p className="text-[10px] text-white/60">Days {currentPhase.start}–{currentPhase.end} · Target: {currentPhase.target}kg</p>
                </div>
                <span className="text-xl font-black text-white">{phaseProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${phaseProgress}%`, background: currentPhase.color }} />
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[
                { label: 'Days In', val: currentDay, color: '#FF7A00', emoji: '📅' },
                { label: 'Logged', val: loggedDays, color: '#10B981', emoji: '✅' },
                { label: 'Streak', val: `${currentStreak}d`, color: '#0085FF', emoji: '🔥' },
                { label: 'Photos', val: totalPhotos, color: '#7B61FF', emoji: '📸' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-2xl p-2.5 text-center">
                  <div className="text-base">{s.emoji}</div>
                  <div className="text-base font-black text-white">{s.val}</div>
                  <div className="text-[8px] font-bold" style={{ color: s.color }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {([
            { key: 'overview', label: '📊 Overview' },
            { key: 'weight',   label: '⚖️ Weight' },
            { key: 'skin',     label: '✨ Skin' },
            { key: 'compare',  label: '⚡ Compare' },
            { key: 'streaks',  label: '🔥 Streaks' },
            { key: 'badges',   label: '🏆 Badges' },
            { key: 'gallery',  label: '📸 Gallery' },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-[10px] font-black transition-all ${activeTab === t.key ? 'text-white shadow-md' : 'bg-white text-[#64748B] border border-[#E8EEF5]'}`}
              style={activeTab === t.key ? { background: 'linear-gradient(135deg, #0085FF, #7B61FF)' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {noDataYet && (
              <div className="arc-card p-8 bg-white text-center">
                <div className="text-5xl mb-3">📊</div>
                <p className="text-sm font-black text-[#0A192F]">No data logged yet</p>
                <p className="text-xs text-[#64748B] mt-1">Go to the Arc Day Planner and start checking off tasks. Your progress will appear here automatically.</p>
              </div>
            )}

            {/* Weekly Score Bar Chart */}
            <div className="arc-card p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-black text-[#0085FF] uppercase">Week {chartWeek} Score</p>
                  <p className="text-xs font-bold text-[#64748B]">Days {weekStart + 1}–{Math.min(weekStart + 7, currentDay)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setWeekOffset(o => o + 1)} disabled={chartWeek <= 1}
                    className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                  </button>
                  <button onClick={() => setWeekOffset(o => Math.max(0, o - 1))} disabled={weekOffset === 0}
                    className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center disabled:opacity-30">
                    <ChevronRight className="w-4 h-4 text-[#64748B]" />
                  </button>
                </div>
              </div>
              <div className="flex items-end justify-between gap-1">
                {weekDays.map((d, i) => (
                  <ScoreBar key={i} score={d.score} day={d.day} isToday={d.isToday} />
                ))}
              </div>
              <div className="flex gap-3 mt-3 text-[9px] font-bold text-[#94A3B8]">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-500"/> 80%+ great</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-orange-400"/> 50–79% ok</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-[#0085FF]"/> today</div>
              </div>
            </div>

            {/* Last 28 days score trend */}
            {last28Scores.length >= 2 && (
              <div className="arc-card p-4 bg-white">
                <p className="text-[10px] font-black text-[#7B61FF] uppercase mb-1">Score Trend (last {last28Scores.length} days)</p>
                <p className="text-[10px] text-[#94A3B8] mb-3">Your consistency over time</p>
                <LineChart data={last28Scores} color="#7B61FF" height={70} showDots={last28Scores.length <= 14} />
              </div>
            )}

            {/* Category breakdown */}
            {loggedDays > 0 && (
              <div className="arc-card p-4 bg-white">
                <p className="text-[10px] font-black text-[#0A192F] uppercase mb-3">Average Daily Breakdown</p>
                {[
                  { label: 'Workout', done: records.reduce((a, r) => a + r.exercisesDone, 0), total: records.length * EXERCISES_PER_DAY, color: '#FF7A00', emoji: '💪' },
                  { label: 'Meals',   done: records.reduce((a, r) => a + r.mealsDone, 0),    total: records.length * MEALS_PER_DAY,     color: '#10B981', emoji: '🌾' },
                  { label: 'Skin',    done: records.reduce((a, r) => a + r.skinStepsDone, 0), total: records.length * SKIN_STEPS_PER_DAY, color: '#A855F7', emoji: '✨' },
                ].map(cat => {
                  const pct = cat.total > 0 ? Math.round((cat.done / cat.total) * 100) : 0;
                  return (
                    <div key={cat.label} className="mb-3 last:mb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#0A192F]">{cat.emoji} {cat.label}</span>
                        <span className="text-xs font-black" style={{ color: cat.color }}>{pct}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: cat.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Weekly summaries */}
            {weeks.length > 0 && (
              <div className="arc-card p-4 bg-white">
                <p className="text-[10px] font-black text-[#0A192F] uppercase mb-3">Weekly Summary</p>
                <div className="space-y-2">
                  {weeks.slice().reverse().slice(0, 4).map(w => (
                    <div key={w.weekNum} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-[#E8EEF5]">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-black"
                        style={{ background: w.avgScore >= 80 ? '#10B981' : w.avgScore >= 50 ? '#FF9500' : '#94A3B8' }}>
                        W{w.weekNum}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-[#0A192F]">Days {w.startDay}–{w.endDay}</p>
                        <p className="text-[9px] text-[#94A3B8]">{w.workoutDays}/7 workouts · {w.perfectDays} perfect days{w.avgWeight ? ` · ${w.avgWeight}kg avg` : ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black" style={{ color: w.avgScore >= 80 ? '#10B981' : '#FF9500' }}>{w.avgScore}%</p>
                        {w.photoDays > 0 && <p className="text-[9px] text-[#7B61FF]">📸 {w.photoDays} days</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ WEIGHT TAB ═══ */}
        {activeTab === 'weight' && (
          <div className="space-y-4">
            {/* Weight hero card */}
            <div className="rounded-3xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #065F46, #10B981)' }}>
              <p className="text-[10px] font-black text-emerald-200 uppercase">Bruce's Weight Journey</p>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-black">{latestWeight}</span>
                <span className="text-lg font-bold opacity-70 mb-1">kg</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white/15 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-black">{START_WEIGHT} kg</p>
                  <p className="text-[9px] opacity-70">Started Oct 1</p>
                </div>
                <div className="bg-white/15 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-black text-emerald-200">-{weightLost.toFixed(1)} kg</p>
                  <p className="text-[9px] opacity-70">Lost so far</p>
                </div>
                <div className="bg-white/15 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-black">{weightToGo.toFixed(1)} kg</p>
                  <p className="text-[9px] opacity-70">To goal ({TARGET_WEIGHT}kg)</p>
                </div>
              </div>
            </div>

            {/* Weight chart */}
            <div className="arc-card p-4 bg-white">
              <p className="text-[10px] font-black text-[#10B981] uppercase mb-1">Weight Chart</p>
              <p className="text-[10px] text-[#94A3B8] mb-3">Goal: {TARGET_WEIGHT} kg by Dec 31, 2027 · {weights.length} data points</p>
              {weights.length >= 2 ? (
                <>
                  <LineChart
                    data={weights.map(r => parseFloat(r.weight))}
                    color="#10B981"
                    height={100}
                    reverse={true}
                    showDots={weights.length <= 20}
                  />
                  <div className="flex justify-between text-[9px] text-[#94A3B8] mt-1">
                    <span>{weights[0]?.date}</span>
                    <span className="font-black text-emerald-600">Target: {TARGET_WEIGHT}kg</span>
                    <span>{weights[weights.length - 1]?.date}</span>
                  </div>
                </>
              ) : (
                <div className="h-24 flex flex-col items-center justify-center text-[#94A3B8]">
                  <p className="text-2xl mb-1">⚖️</p>
                  <p className="text-xs font-bold">Log your weight daily in Arc Day → Diary</p>
                  <p className="text-[10px] mt-0.5">Need 2+ data points to show chart</p>
                </div>
              )}
            </div>

            {/* Weight log */}
            {weights.length > 0 && (
              <div className="arc-card p-4 bg-white">
                <p className="text-[10px] font-black text-[#0A192F] uppercase mb-3">Weight Log (recent)</p>
                <div className="space-y-1.5">
                  {weights.slice().reverse().slice(0, 10).map((r, i) => {
                    const prev = weights[weights.length - 1 - i - 1];
                    const diff = prev ? parseFloat(r.weight) - parseFloat(prev.weight) : 0;
                    return (
                      <div key={r.dayNum} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-[#E8EEF5]">
                        <div>
                          <p className="text-xs font-black text-[#0A192F]">Day {r.dayNum} · {r.date}</p>
                          <p className="text-[9px] text-[#94A3B8]">{r.weekday}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {diff !== 0 && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${diff < 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                            </span>
                          )}
                          <p className="text-sm font-black text-[#0A192F]">{r.weight} kg</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Phase weight targets */}
            <div className="arc-card p-4 bg-white">
              <p className="text-[10px] font-black text-[#0A192F] uppercase mb-3">Weight Milestones</p>
              <div className="space-y-2">
                {[
                  { label: 'Started (Peak)', weight: 92, note: '4 years ago', done: true, color: '#94A3B8' },
                  { label: 'When Bruce started', weight: 70, note: 'Oct 1, 2026', done: true, color: '#FF7A00' },
                  { label: 'Phase 1 Target', weight: 65, note: 'Dec 31, 2026', done: latestWeight <= 65, color: '#FF7A00' },
                  { label: 'Phase 2 Target', weight: 63, note: 'Jun 30, 2027', done: latestWeight <= 63, color: '#0085FF' },
                  { label: 'Final Goal 🏆', weight: 62, note: 'Dec 31, 2027', done: latestWeight <= 62, color: '#10B981' },
                ].map(m => (
                  <div key={m.weight} className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E8EEF5]"
                    style={{ background: m.done ? `${m.color}15` : 'white' }}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${m.done ? 'text-white' : 'bg-slate-100 text-[#94A3B8]'}`}
                      style={m.done ? { background: m.color } : {}}>
                      {m.done ? '✓' : '○'}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-black ${m.done ? 'text-[#0A192F]' : 'text-[#94A3B8]'}`}>{m.label}</p>
                      <p className="text-[9px] text-[#94A3B8]">{m.note}</p>
                    </div>
                    <span className="text-sm font-black" style={{ color: m.color }}>{m.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ SKIN TAB ═══ */}
        {activeTab === 'skin' && (
          <div className="space-y-4">
            {/* Skin hero */}
            <div className="rounded-3xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #6D28D9, #A855F7)' }}>
              <p className="text-[10px] font-black text-purple-200 uppercase">Bruce's Skin Healing Journey</p>
              <p className="text-xs text-purple-200/70 mt-0.5">Betnovate-N recovery + hyperpigmentation treatment</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white/15 rounded-xl p-2.5 text-center">
                  <p className="text-base font-black">{latestSkin > 0 ? SKIN_CONDITIONS[latestSkin - 1] : '—'}</p>
                  <p className="text-[9px] opacity-70">Latest</p>
                </div>
                <div className="bg-white/15 rounded-xl p-2.5 text-center">
                  <p className="text-base font-black">{avgSkin > 0 ? avgSkin.toFixed(1) : '—'}/5</p>
                  <p className="text-[9px] opacity-70">Avg condition</p>
                </div>
                <div className="bg-white/15 rounded-xl p-2.5 text-center">
                  <p className="text-base font-black">{skinStreakDays}</p>
                  <p className="text-[9px] opacity-70">Skin protocol days</p>
                </div>
              </div>
            </div>

            {/* Skin condition chart */}
            <div className="arc-card p-4 bg-white">
              <p className="text-[10px] font-black text-[#A855F7] uppercase mb-1">Skin Condition Trend</p>
              <p className="text-[10px] text-[#94A3B8] mb-3">1=Very bad → 5=Glowing ✨ · Log daily in Arc Day → Diary</p>
              {skinRecords.length >= 2 ? (
                <LineChart data={skinRecords.map(r => r.skinCondition)} color="#A855F7" height={80} showDots={skinRecords.length <= 20} />
              ) : (
                <div className="h-20 flex items-center justify-center text-[#94A3B8] text-xs">
                  Log skin condition daily → chart appears here
                </div>
              )}
            </div>

            {/* Skin protocol completion */}
            <div className="arc-card p-4 bg-white">
              <p className="text-[10px] font-black text-[#A855F7] uppercase mb-3">Skin Protocol Completion</p>
              {[
                { label: 'AM Protocol (5 steps)', done: records.filter(r => r.skinStepsDone >= 5).length, total: loggedDays || 1 },
                { label: 'Full Protocol (12 steps)', done: records.filter(r => r.skinStepsDone >= 12).length, total: loggedDays || 1 },
                { label: 'Sunscreen Applied', done: records.filter(r => r.skinStepsDone >= 2).length, total: loggedDays || 1 },
              ].map(item => {
                const pct = Math.round((item.done / item.total) * 100);
                return (
                  <div key={item.label} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] font-bold text-[#0A192F]">{item.label}</span>
                      <span className="text-[11px] font-black text-[#A855F7]">{item.done}/{item.total} days ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#A855F7' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Skin healing timeline */}
            <div className="arc-card p-4 bg-white">
              <p className="text-[10px] font-black text-[#0A192F] uppercase mb-3">Expected Healing Timeline</p>
              {[
                { milestone: '30 Days', expected: 'Skin barrier healing starts. Less redness. Betnovate damage reducing.', achieved: currentDay >= 30, day: 30 },
                { milestone: '60 Days', expected: 'Hyperpigmentation visibly lighter. Pores tightening. Fewer breakouts.', achieved: currentDay >= 60, day: 60 },
                { milestone: '90 Days', expected: '50-60% pigmentation reduction visible. Skin texture improved significantly.', achieved: currentDay >= 92, day: 92 },
                { milestone: '6 Months', expected: '80% pigmentation cleared. Scars fading. Consistent glow appearing.', achieved: currentDay >= 183, day: 183 },
                { milestone: '1 Year', expected: 'Glass skin achieved. Zero active acne. Natural radiant complexion.', achieved: currentDay >= 366, day: 366 },
                { milestone: 'Dec 2027 🏆', expected: 'Complete transformation. Bruce\'s skin is unrecognizable from Day 1.', achieved: currentDay >= 457, day: 457 },
              ].map(m => (
                <div key={m.day} className={`flex items-start gap-3 p-2.5 rounded-xl mb-2 border ${m.achieved ? 'border-purple-200 bg-purple-50' : 'border-[#E8EEF5] bg-white'}`}>
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-black mt-0.5 ${m.achieved ? 'bg-[#A855F7] text-white' : 'bg-slate-100 text-[#94A3B8]'}`}>
                    {m.achieved ? '✓' : currentDay < m.day ? `D${m.day}` : '○'}
                  </div>
                  <div>
                    <p className={`text-xs font-black ${m.achieved ? 'text-[#6D28D9]' : 'text-[#0A192F]'}`}>{m.milestone}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{m.expected}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ COMPARE TAB ═══ */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            <BeforeAfterSlider photos={allPhotos} />
          </div>
        )}

        {/* ═══ STREAKS TAB ═══ */}
        {activeTab === 'streaks' && (
          <div className="space-y-4">
            {/* Streak stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Current Streak', val: `${currentStreak}`, sub: 'days in a row', color: '#FF7A00', emoji: '🔥' },
                { label: 'Perfect Days', val: perfectDays, sub: '80%+ score', color: '#10B981', emoji: '⭐' },
                { label: 'Total Logged', val: loggedDays, sub: `of ${currentDay} days`, color: '#0085FF', emoji: '✅' },
                { label: 'Consistency', val: `${loggedDays && currentDay ? Math.round((loggedDays / currentDay) * 100) : 0}%`, sub: 'days logged', color: '#7B61FF', emoji: '📈' },
              ].map(s => (
                <div key={s.label} className="arc-card p-4 bg-white text-center">
                  <div className="text-3xl mb-1">{s.emoji}</div>
                  <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[10px] font-black text-[#0A192F]">{s.label}</div>
                  <div className="text-[9px] text-[#94A3B8]">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Water / Mood / Energy */}
            <div className="arc-card p-4 bg-white">
              <p className="text-[10px] font-black text-[#0085FF] uppercase mb-3">Daily Metrics Average</p>
              {[
                { label: '💧 Water (avg glasses)', avg: records.filter(r => r.waterGlasses > 0).length ? Math.round(records.filter(r=>r.waterGlasses>0).reduce((a,r)=>a+r.waterGlasses,0)/records.filter(r=>r.waterGlasses>0).length*10)/10 : 0, max: 10, color: '#0085FF', target: 8 },
                { label: '😊 Mood (avg)', avg: records.filter(r => r.mood > 0).length ? Math.round(records.filter(r=>r.mood>0).reduce((a,r)=>a+r.mood,0)/records.filter(r=>r.mood>0).length*10)/10 : 0, max: 5, color: '#FF7A00', target: 4 },
                { label: '⚡ Energy (avg)', avg: records.filter(r => r.energyLevel > 0).length ? Math.round(records.filter(r=>r.energyLevel>0).reduce((a,r)=>a+r.energyLevel,0)/records.filter(r=>r.energyLevel>0).length*10)/10 : 0, max: 5, color: '#7B61FF', target: 4 },
              ].map(m => (
                <div key={m.label} className="mb-3 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] font-bold text-[#0A192F]">{m.label}</span>
                    <span className="text-[11px] font-black" style={{ color: m.color }}>{m.avg}/{m.max}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(m.avg / m.max) * 100}%`, background: m.color }} />
                  </div>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">Target: {m.target}/{m.max}</p>
                </div>
              ))}
            </div>

            {/* Full arc heatmap */}
            {loggedDays > 0 && (
              <div className="arc-card p-4 bg-white">
                <p className="text-[10px] font-black text-[#0A192F] uppercase mb-3">All-Time Arc Heatmap</p>
                <div className="grid grid-cols-[repeat(7,1fr)] gap-1">
                  {['S','M','T','W','T','F','S'].map((d,i) => (
                    <div key={i} className="text-center text-[8px] font-black text-[#94A3B8] pb-0.5">{d}</div>
                  ))}
                  {/* Offset: Oct 1 2026 = Thursday = index 4 in week */}
                  {Array.from({ length: 4 }).map((_,i) => <div key={`off${i}`} />)}
                  {Array.from({ length: currentDay }, (_, i) => {
                    const d = i + 1;
                    const r = records.find(rec => rec.dayNum === d);
                    const score = r?.score ?? 0;
                    const bg = score >= 80 ? '#10B981' : score >= 50 ? '#FF9500' : score > 0 ? '#94A3B8' : '#F1F5F9';
                    return (
                      <div key={d} className="aspect-square rounded-md" style={{ background: bg }}
                        title={`Day ${d}: ${score}%`} />
                    );
                  })}
                </div>
                <div className="flex gap-3 mt-3 text-[9px] font-bold text-[#94A3B8]">
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-emerald-500"/><span>80%+</span></div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-orange-400"/><span>50%+</span></div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-slate-300"/><span>Started</span></div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-slate-100"/><span>Missed</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ BADGES TAB ═══ */}
        {activeTab === 'badges' && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4 text-white text-center"
              style={{ background: 'linear-gradient(135deg, #92400E, #FF7A00)' }}>
              <p className="text-[10px] font-black uppercase opacity-80">Bruce's Achievement Board</p>
              <p className="text-base font-black mt-0.5">
                {badgeStatus.filter(b => b.unlocked).length} / {badgeStatus.length} Badges Earned
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {badgeStatus.map(b => (
                <div key={b.id}
                  className={`arc-card p-4 text-center transition-all ${b.unlocked ? 'bg-white border-2 border-[#FF7A00]' : 'bg-slate-50 opacity-50'}`}>
                  <div className={`text-3xl mb-2 ${!b.unlocked ? 'grayscale' : ''}`}>{b.icon}</div>
                  <p className={`text-xs font-black ${b.unlocked ? 'text-[#0A192F]' : 'text-[#94A3B8]'}`}>{b.title}</p>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">{b.desc}</p>
                  {b.unlocked && (
                    <span className="inline-block mt-2 text-[8px] font-black text-white bg-[#FF7A00] px-2 py-0.5 rounded-full">UNLOCKED ✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ GALLERY TAB ═══ */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            {showGallery && allPhotos.length > 0 && (
              <PhotoGallery photos={allPhotos} onClose={() => setShowGallery(false)} />
            )}

            <div className="rounded-2xl p-4 bg-purple-50 border-2 border-purple-100">
              <p className="text-xs font-black text-[#7B61FF] mb-1">📸 {totalPhotos} Photos Documented</p>
              <p className="text-[11px] text-[#475569]">
                Your visual transformation record. Every photo is proof of Bruce's discipline. Compare Day 1 → Day 30 → Day 90 to see the real change.
              </p>
            </div>

            {/* Photo stats */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { type: 'body', emoji: '💪', label: 'Body' },
                { type: 'face', emoji: '✨', label: 'Face' },
                { type: 'meal', emoji: '🌾', label: 'Meals' },
                { type: 'workout', emoji: '🔥', label: 'Workout' },
                { type: 'skin', emoji: '🔬', label: 'Skin' },
              ].map(pt => {
                const count = allPhotos.filter(p => p.type === pt.type).length;
                return (
                  <div key={pt.type} className="arc-card p-2.5 bg-white text-center">
                    <div className="text-lg">{pt.emoji}</div>
                    <div className="text-sm font-black text-[#0085FF]">{count}</div>
                    <div className="text-[8px] text-[#94A3B8] font-bold">{pt.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Before / After Transformation Split Slider */}
            <BeforeAfterSlider photos={allPhotos} />

            {allPhotos.length > 0 ? (
              <>
                <button onClick={() => setShowGallery(true)}
                  className="w-full py-3 rounded-2xl text-white font-black text-sm shadow-md"
                  style={{ background: 'linear-gradient(135deg, #7B61FF, #A855F7)' }}>
                  🔍 Open Full Gallery ({totalPhotos} photos)
                </button>

                {/* Recent photos grid */}
                <div className="arc-card p-4 bg-white">
                  <p className="text-[10px] font-black text-[#0A192F] uppercase mb-3">Recent Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {allPhotos.slice(-12).reverse().map((p, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group cursor-pointer"
                        onClick={() => setShowGallery(true)}>
                        <img src={p.dataUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <ZoomIn className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                          <p className="text-[8px] text-white font-bold">Day {p.day}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body comparison tip */}
                <div className="arc-card p-4 bg-white border-2 border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-700 uppercase mb-2">📊 How to Use Your Photos</p>
                  <div className="space-y-1.5 text-[11px] text-[#475569]">
                    <p>📅 <strong>Every Sunday</strong> — Take body front-facing photo (same pose, same time)</p>
                    <p>✨ <strong>Every day</strong> — Take face/skin photo in natural window light</p>
                    <p>🔬 <strong>Weekly</strong> — Skin close-up (right cheek) to track pigmentation healing</p>
                    <p>🔥 <strong>Monthly</strong> — Compare body Day 1 vs Day 30 vs Day 60 for motivation</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="arc-card p-8 bg-white text-center">
                <div className="text-5xl mb-3">📸</div>
                <p className="text-sm font-black text-[#0A192F]">No photos yet</p>
                <p className="text-xs text-[#64748B] mt-1 mb-4">Go to Arc Day → Photos tab and upload your first body/skin photo. This gallery will fill up fast!</p>
                <a href="/arc" className="inline-block px-6 py-2 rounded-xl text-white text-xs font-black"
                  style={{ background: 'linear-gradient(135deg, #7B61FF, #A855F7)' }}>
                  📸 Upload First Photo →
                </a>
              </div>
            )}
          </div>
        )}

      </div>
    </ResponsiveShell>
  );
}
