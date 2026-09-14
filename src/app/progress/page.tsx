'use client';

import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

const WEIGHT_DATA = [74.5, 74.2, 74.0, 73.8, 73.5, 73.4, 73.2, 73.0, 72.8, 72.5, 72.3, 72.0, 71.8, 71.6];
const WORKOUT_DATA = [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1]; // did workout?
const CALORIE_DATA = [1950, 2100, 1800, 2200, 2050, 2300, 1900, 2100, 2000, 2200, 2050, 1850, 2100, 2200];
const DAYS_LABELS = ['Aug 18','Aug 19','Aug 20','Aug 21','Aug 22','Aug 23','Aug 24','Aug 25','Aug 26','Aug 27','Aug 28','Aug 29','Aug 30','Aug 31'];

function MiniLineChart({ data, color, height = 60 }: { data: number[]; color: string; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 300, h = height;
  const points = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 10) - 5,
  ]);
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const areaD = pathD + ` L ${points[points.length-1][0]} ${h} L ${points[0][0]} ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: `${height}px` }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace('#','')})`}/>
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {points.map((p, i) => i === points.length - 1 && (
        <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={color} stroke="#0D1425" strokeWidth="2"/>
      ))}
    </svg>
  );
}

const ACHIEVEMENTS = [
  { icon: '🔥', title: 'First Workout', desc: 'Complete your first session', earned: true, date: 'Aug 18' },
  { icon: '📅', title: '7-Day Streak', desc: 'Work out 7 days in a row', earned: true, date: 'Aug 25' },
  { icon: '💧', title: 'Hydration Hero', desc: 'Hit water goal 7 days', earned: true, date: 'Aug 22' },
  { icon: '💪', title: 'Push-Up Pro', desc: 'Complete 100 push-ups total', earned: false },
  { icon: '🏋️', title: 'Iron Will', desc: 'Complete 10 strength workouts', earned: false },
  { icon: '❄️', title: 'Winter Warrior', desc: 'Finish Winter Arch challenge', earned: false },
];

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'body' | 'achievements'>('stats');
  const [weight, setWeight] = useState('');
  const [measurements, setMeasurements] = useState({ chest: '', waist: '', hips: '', arms: '' });

  const currentWeight = WEIGHT_DATA[WEIGHT_DATA.length - 1];
  const startWeight = WEIGHT_DATA[0];
  const weightLost = (startWeight - currentWeight).toFixed(1);
  const workoutCount = WORKOUT_DATA.filter(Boolean).length;
  const avgCalories = Math.round(CALORIE_DATA.reduce((s,v) => s+v, 0) / CALORIE_DATA.length);

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Analytics</p>
          <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
            <span className="gradient-text">Progress</span>
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '4px', marginBottom: '1.25rem' }}>
          {(['stats', 'body', 'achievements'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '0.6rem 0.25rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', transition: 'all 0.3s',
              background: activeTab === tab ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,47,190,0.2))' : 'transparent',
              color: activeTab === tab ? 'var(--ice-blue)' : 'var(--text-muted)',
            }}>
              {tab === 'stats' ? '📊 Stats' : tab === 'body' ? '📏 Body' : '🏆 Badges'}
            </button>
          ))}
        </div>

        {/* STATS */}
        {activeTab === 'stats' && (
          <div className="animate-fadeInUp">
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { icon: '⚖️', value: `${weightLost}kg`, label: 'Weight Lost', color: '#10B981', pos: true },
                { icon: '💪', value: `${workoutCount}`, label: 'Workouts Done', color: '#00D4FF' },
                { icon: '🔥', value: `${workoutCount * 280}`, label: 'Calories Burned', color: '#FF6B35' },
                { icon: '🥗', value: `${avgCalories}`, label: 'Avg Daily Kcal', color: '#7B2FBE' },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                  <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Weight chart */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="section-title">Weight Trend</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#10B981' }}>{currentWeight} kg</span>
                  <span style={{ fontSize: '0.75rem', color: '#10B981' }}>↓ {weightLost}kg</span>
                </div>
              </div>
              <MiniLineChart data={WEIGHT_DATA} color="#10B981" height={80} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Aug 18</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Aug 31</span>
              </div>
            </div>

            {/* Calories chart */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="section-title">Daily Calories</div>
                <span className="font-mono" style={{ fontSize: '0.85rem', color: '#FF6B35' }}>avg {avgCalories}</span>
              </div>
              <MiniLineChart data={CALORIE_DATA} color="#FF6B35" height={70} />
            </div>

            {/* Workout streak heatmap */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1rem' }}>
              <div className="section-title" style={{ marginBottom: '0.75rem' }}>Workout Days</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {WORKOUT_DATA.map((done, i) => (
                  <div key={i} style={{ flex: 1 }}>
                    <div style={{
                      height: '32px', borderRadius: '6px',
                      background: done ? 'linear-gradient(180deg, rgba(0,212,255,0.8), rgba(123,47,190,0.6))' : 'rgba(255,255,255,0.05)',
                      transition: 'all 0.2s',
                    }} />
                    <div style={{ textAlign: 'center', fontSize: '0.5rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {DAYS_LABELS[i].split(' ')[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BODY */}
        {activeTab === 'body' && (
          <div className="animate-fadeInUp">
            <div className="glass-card-primary" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1.25rem' }}>
              <div className="section-title" style={{ marginBottom: '0.75rem' }}>Log Today's Stats</div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label className="input-label">Weight (kg)</label>
                <input className="input-field" type="number" placeholder={`${currentWeight}`} value={weight}
                  onChange={e => setWeight(e.target.value)} step={0.1} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                {[
                  { key: 'chest' as const, label: 'Chest (cm)', placeholder: '95' },
                  { key: 'waist' as const, label: 'Waist (cm)', placeholder: '82' },
                  { key: 'hips' as const, label: 'Hips (cm)', placeholder: '96' },
                  { key: 'arms' as const, label: 'Arms (cm)', placeholder: '35' },
                ].map(m => (
                  <div key={m.key}>
                    <label className="input-label">{m.label}</label>
                    <input className="input-field" type="number" placeholder={m.placeholder}
                      value={measurements[m.key]} onChange={e => setMeasurements(p => ({ ...p, [m.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <button className="btn-primary">💾 Save Measurements</button>
            </div>

            {/* Historical summary */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px' }}>
              <div className="section-title" style={{ marginBottom: '1rem' }}>2-Week Summary</div>
              {[
                { label: 'Starting Weight', value: `${startWeight} kg`, color: 'var(--text-secondary)' },
                { label: 'Current Weight', value: `${currentWeight} kg`, color: '#10B981' },
                { label: 'Total Lost', value: `${weightLost} kg`, color: '#00D4FF' },
                { label: 'Workouts Completed', value: `${workoutCount} / 14`, color: '#7B2FBE' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="animate-fadeInUp">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ACHIEVEMENTS.map((ach, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
                  background: ach.earned ? 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(123,47,190,0.06))' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${ach.earned ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.04)'}`,
                  borderRadius: '18px', opacity: ach.earned ? 1 : 0.5,
                }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
                    background: ach.earned ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,47,190,0.2))' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                    filter: ach.earned ? 'none' : 'grayscale(1)',
                  }}>
                    {ach.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: '0.95rem', color: ach.earned ? 'white' : 'var(--text-muted)' }}>{ach.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{ach.desc}</div>
                    {ach.earned && <div style={{ fontSize: '0.7rem', color: 'var(--ice-blue)', marginTop: '0.25rem' }}>✓ Earned {ach.date}</div>}
                  </div>
                  {ach.earned ? (
                    <span style={{ fontSize: '1.25rem' }}>✨</span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Locked</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
