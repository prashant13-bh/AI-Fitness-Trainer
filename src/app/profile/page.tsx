'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    { icon: '🔔', label: 'Notifications', action: 'toggle' },
    { icon: '📏', label: 'Units (Metric / Imperial)', action: 'toggle' },
    { icon: '🌙', label: 'Dark Mode', action: 'toggle' },
    { icon: '🔒', label: 'Privacy Policy', action: 'link' },
    { icon: '⭐', label: 'Rate the App', action: 'link' },
    { icon: '📢', label: 'Share Winter Arch', action: 'link' },
  ];

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }} className="animate-fadeInUp">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your</p>
            <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
              <span className="gradient-text">Profile</span>
            </h1>
          </div>
          <button onClick={() => setEditMode(p => !p)} className="btn-icon">
            {editMode ? '✕' : '✏️'}
          </button>
        </div>

        {/* Avatar + Level */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }} className="animate-fadeInUp delay-100">
          {/* Avatar */}
          <div style={{
            width: '90px', height: '90px', borderRadius: '28px', margin: '0 auto 0.875rem',
            background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: 800, color: 'white',
            fontFamily: 'var(--font-display)',
          }} className="animate-pulse-glow">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.15rem' }}>{displayName}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{email}</p>

          {/* Level badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.875rem', background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(123,47,190,0.15))', border: '1px solid rgba(0,212,255,0.25)', borderRadius: '20px' }}>
            <span>{LEVEL_EMOJIS[level]}</span>
            <span className="font-display" style={{ fontWeight: 700, fontSize: '0.88rem', textTransform: 'capitalize', color: 'var(--ice-blue)' }}>{level}</span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="glass-card" style={{ padding: '1rem 1.25rem', borderRadius: '18px', marginBottom: '1.25rem' }} className="animate-fadeInUp delay-200">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Level Progress</span>
            <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--ice-blue)' }}>{xp} / {nextLevelXP} XP</span>
          </div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'right' }}>
            {nextLevelXP - xp} XP to next level
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }} className="animate-fadeInUp delay-200">
          {profileStats.map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ice-blue)' }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Body Stats (from profile) */}
        {userData?.profile && (
          <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1.25rem' }} className="animate-fadeInUp delay-300">
            <div className="section-title" style={{ marginBottom: '0.875rem' }}>Body Stats</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { label: 'Age', value: userData.profile.age || '--', icon: '🎂' },
                { label: 'Height', value: userData.profile.height ? `${userData.profile.height}cm` : '--', icon: '📏' },
                { label: 'Weight', value: userData.profile.weight ? `${userData.profile.weight}kg` : '--', icon: '⚖️' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>{s.icon}</div>
                  <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{s.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="pill pill-blue">🎯 {userData.profile.goal?.replace(/-/g,' ')}</span>
              <span className="pill pill-violet">⚡ {userData.profile.fitnessLevel}</span>
              <span className="pill pill-success">🥗 {userData.profile.dietPreference}</span>
            </div>
          </div>
        )}

        {/* Settings */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp delay-300">
          <div className="section-title" style={{ marginBottom: '0.75rem' }}>Settings</div>
          <div className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            {settings.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: i < settings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                  <span className="font-display" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.action === 'toggle' ? '●' : '›'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Nav Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }} className="animate-fadeInUp delay-400">
          {[
            { href: '/progress', icon: '📊', label: 'My Progress' },
            { href: '/history', icon: '📋', label: 'Workout History' },
            { href: '/planner', icon: '🤖', label: 'AI Planner' },
            { href: '/challenge', icon: '❄️', label: 'Challenges' },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ padding: '0.875rem 1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s' }}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span className="font-display" style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          className="btn-secondary"
          onClick={handleLogout}
          disabled={loggingOut}
          style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444', marginBottom: '1rem', opacity: loggingOut ? 0.7 : 1 }}
        >
          {loggingOut ? '⏳ Signing out...' : '🚪 Sign Out'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Winter Arch v1.0 · Made with ❄️ by the community
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
