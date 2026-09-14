'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import { WINTER_ARCH_CHALLENGE, WORKOUTS } from '@/lib/data';

const CHALLENGE_DAYS = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  emoji: ['💪','🔥','⚡','🏃','🧱','🌊','🎯','💥','⛰️','🦁','🌅','🔄','💎','🏋️','🦾','⚔️','🌟','🔩','🛡️','👑','🚀','❄️','🌪️','🔑','🏆','💫','🎪','🌈','🔥','🎖️'][i],
  title: [
    'Ignition Day', 'Burn Protocol', 'Power Rush', 'Endurance Run', 'Core Shred',
    'Strength Wave', 'Target Practice', 'Explosive Force', 'Mountain Climb', 'King Mode',
    'Sunrise Session', 'Reset & Restore', 'Diamond Grind', 'Iron Day', 'Arms of Steel',
    'Battle Day', 'Star Performance', 'Metal Workshop', 'Shield Up', 'Crown Protocol',
    'Rocket Launch', 'Frost Bite', 'Storm Training', 'Key Unlock', 'Championship',
    'Cosmic Push', 'Grand Show', 'Rainbow Day', 'Final Fire', 'Victory Day'
  ][i],
  xp: [50,55,55,60,60,65,65,70,70,75,60,50,75,75,80,80,85,80,80,90,90,90,90,90,100,100,100,100,100,200][i],
  completed: i < 5,
}));

function ChallengeRing({ day, total, size = 120 }: { day: number; total: number; size?: number }) {
  const percent = (day / total) * 100;
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth={12} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth={12}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.2s ease' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF"/>
            <stop offset="100%" stopColor="#7B2FBE"/>
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ice-blue)', lineHeight: 1 }}>{day}</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>of {total}</div>
      </div>
    </div>
  );
}

export default function ChallengePage() {
  const [currentDay] = useState(5);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const xpEarned = CHALLENGE_DAYS.slice(0, currentDay).reduce((sum, d) => sum + d.xp, 0);
  const completedCount = CHALLENGE_DAYS.filter(d => d.completed).length;

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }} className="animate-fadeInUp">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Challenge</p>
            <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
              <span className="gradient-text">Winter Arch</span>
            </h1>
          </div>
          <div className="streak-badge">🏔️ {xpEarned} XP</div>
        </div>

        {/* Challenge Card */}
        <div className="challenge-card" style={{ padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }} className="animate-fadeInUp delay-100">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>30-Day Transformation Challenge</div>
          <ChallengeRing day={currentDay} total={30} size={130} />
          <div style={{ textAlign: 'center' }}>
            <div className="font-display" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Day {currentDay + 1} Next Up</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{CHALLENGE_DAYS[currentDay].emoji} {CHALLENGE_DAYS[currentDay].title}</div>
          </div>
          <Link href="/workout" style={{ textDecoration: 'none', width: '100%' }}>
            <button className="btn-primary" style={{ fontSize: '0.95rem' }}>
              ⚡ Start Day {currentDay + 1}
            </button>
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }} className="animate-fadeInUp delay-200">
          {[
            { icon: '✅', value: completedCount, label: 'Completed', color: '#10B981' },
            { icon: '🔥', value: `${Math.round((completedCount/30)*100)}%`, label: 'Progress', color: '#FF6B35' },
            { icon: '👥', value: '1.2K', label: 'Athletes', color: '#7B2FBE' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-200">
          <div className="section-header">
            <div className="section-title">30-Day Journey</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{completedCount}/30 days</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
            {CHALLENGE_DAYS.map((d, i) => {
              const isCurrent = i === currentDay;
              const isFuture = i > currentDay;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedDay(selectedDay === d.day ? null : d.day)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: d.completed
                      ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,47,190,0.2))'
                      : isCurrent
                      ? 'rgba(0,212,255,0.1)'
                      : 'rgba(255,255,255,0.03)',
                    border: d.completed
                      ? '1.5px solid rgba(0,212,255,0.4)'
                      : isCurrent
                      ? '1.5px solid rgba(0,212,255,0.3)'
                      : '1px solid rgba(255,255,255,0.04)',
                    opacity: isFuture ? 0.4 : 1,
                  }}
                >
                  <span style={{ fontSize: d.completed ? '1rem' : '0.8rem' }}>{d.completed ? '✓' : d.emoji}</span>
                  <span className="font-mono" style={{ fontSize: '0.55rem', color: d.completed ? 'var(--ice-blue)' : isCurrent ? 'white' : 'var(--text-muted)', marginTop: '2px' }}>
                    D{d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Detail */}
        {selectedDay && (
          <div className="glass-card-primary" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1.25rem' }} className="animate-scaleIn">
            {(() => {
              const d = CHALLENGE_DAYS[selectedDay - 1];
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{d.emoji}</span>
                    <div>
                      <div className="font-display" style={{ fontWeight: 700 }}>Day {d.day}: {d.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>+{d.xp} XP</div>
                    </div>
                    {d.completed && <span className="pill pill-success" style={{ marginLeft: 'auto' }}>✓ Done</span>}
                  </div>
                  {!d.completed && (
                    <Link href="/workout" style={{ textDecoration: 'none' }}>
                      <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}>
                        Start This Day →
                      </button>
                    </Link>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Reward */}
        <div className="glass-card-fire" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1.25rem' }} className="animate-fadeInUp delay-400">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🏔️</span>
            <div>
              <div className="font-display" style={{ fontWeight: 700, color: 'var(--fire-orange)' }}>Challenge Reward</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Complete 30 days to earn</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span className="pill pill-fire">2,000 XP</span>
                <span className="pill pill-fire">🏔️ Mountain Badge</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
