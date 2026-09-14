'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { getUserLevel, LEVEL_THRESHOLDS, getNextLevelXP } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const { userData, firebaseUser, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const displayName = userData?.displayName || firebaseUser?.displayName || 'Athlete';
  const email = userData?.email || firebaseUser?.email || '';
  const xp = userData?.xp ?? 120;
  const streak = userData?.streak ?? 3;
  const level = getUserLevel(xp);
  const nextLevelXP = getNextLevelXP(level);
  const currentLevelXP = LEVEL_THRESHOLDS[level];
  const xpProgress = Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);

  const LEVEL_EMOJIS: Record<string, string> = { rookie: '🌱', iron: '⚙️', steel: '💠', diamond: '💎', legend: '👑' };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push('/');
  };

  const profileStats = [
    { icon: '🔥', value: streak, label: 'Day Streak' },
    { icon: '⚡', value: xp, label: 'Total XP' },
    { icon: '💪', value: 24, label: 'Workouts' },
    { icon: '✅', value: '87%', label: 'Habit Rate' },
  ];

  const settings = [
    { icon: '🔔', label: 'Push Notifications' },
    { icon: '📏', label: 'Units (Metric / Imperial)' },
    { icon: '🌙', label: 'Dark Mode (Always Active)' },
    { icon: '🔒', label: 'Privacy & Security' },
    { icon: '⭐', label: 'Rate Winter Arch' },
    { icon: '📢', label: 'Share App with Friends' },
  ];

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }} className="animate-fadeInUp">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Athlete Profile</p>
            <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
              <span className="gradient-text">Account Settings</span>
            </h1>
          </div>
          <button onClick={() => setEditMode(p => !p)} className="btn-icon">
            {editMode ? '✕' : '✏️ Edit'}
          </button>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="desktop-grid-split">
          {/* Left Column: Athlete Identity & Level Progress */}
          <div className="animate-fadeInUp delay-100">
            {/* Avatar & Info Card */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px', textAlign: 'center', marginBottom: '1.25rem', border: '1px solid rgba(0,212,255,0.15)' }}>
              <div style={{
                width: '90px', height: '90px', borderRadius: '28px', margin: '0 auto 0.875rem',
                background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', fontWeight: 800, color: 'white',
                fontFamily: 'var(--font-display)', boxShadow: '0 0 30px rgba(0,212,255,0.3)',
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>

              <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.15rem', color: 'white' }}>{displayName}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{email}</p>

              {/* Level badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.875rem', background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(123,47,190,0.15))', border: '1px solid rgba(0,212,255,0.25)', borderRadius: '20px' }}>
                <span>{LEVEL_EMOJIS[level]}</span>
                <span className="font-display" style={{ fontWeight: 700, fontSize: '0.88rem', textTransform: 'capitalize', color: 'var(--ice-blue)' }}>{level} Tier</span>
              </div>
            </div>

            {/* XP Level Progress Bar */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Level Progress</span>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--ice-blue)', fontWeight: 700 }}>{xp} / {nextLevelXP} XP</span>
              </div>
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'right' }}>
                {nextLevelXP - xp} XP needed for next tier
              </div>
            </div>

            {/* Profile Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {profileStats.map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                  <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ice-blue)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Settings & Logout */}
          <div className="animate-fadeInUp delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px' }}>
              <div className="section-title" style={{ marginBottom: '1rem' }}>Preferences & Controls</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {settings.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                      <span className="font-display" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>›</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                width: '100%', padding: '0.9rem', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.08)', color: '#EF4444',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {loggingOut ? 'Logging out...' : '🚪 Log Out of Account'}
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
