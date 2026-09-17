'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { calculateLevel } from '@/lib/scoring';

export default function ProfilePage() {
  const router = useRouter();
  const { userData, user, logout, updateUserData } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [identityInput, setIdentityInput] = useState(userData?.identity_statement || 'I am forging an unbreakable version of myself.');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const displayName = userData?.name || user?.user_metadata?.full_name || 'Warrior';
  const email = userData?.email || user?.email || '';
  const xp = userData?.xp ?? 340;
  const streak = 8;
  const levelInfo = calculateLevel(xp);
  const currentDay = 17;
  const totalDays = 90;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/');
  };

  const handleSaveIdentity = async () => {
    try {
      await updateUserData({
        identity_statement: identityInput,
      });
      setIsEditingIdentity(false);
      setSaveStatus('Identity updated');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('Failed to update');
    }
  };

  return (
    <div className="app-container">
      <BottomNav />

      <main className="page-content" style={{ paddingBottom: '7rem' }}>
        {/* Toast Notification */}
        {saveStatus && (
          <div style={{
            position: 'fixed',
            top: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.95), rgba(123,47,190,0.95))',
            color: 'white',
            padding: '0.65rem 1.25rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,212,255,0.4)',
          }}>
            {saveStatus}
          </div>
        )}

        {/* ── Header ── */}
        <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--ice-blue)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              PROTOCOL IDENTITY
            </div>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
              {displayName}
            </h1>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {email}
            </div>
          </div>

          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 900, color: 'white',
            boxShadow: '0 4px 16px rgba(0,212,255,0.3)'
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* ── Progression & Level Card ── */}
        <section className="glass-card" style={{
          padding: '1.25rem',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(14,24,48,0.7) 0%, rgba(6,10,20,0.85) 100%)',
          border: '1px solid rgba(0,212,255,0.25)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div>
              <span className="pill pill-blue" style={{ fontSize: '0.65rem' }}>
                LEVEL {levelInfo.level}
              </span>
              <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginTop: '0.35rem' }}>
                Mastery Progression
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--ice-blue)' }}>
                {xp} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>XP</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Next: {levelInfo.nextLevelXp} XP
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', margin: '0.75rem 0 0.35rem' }}>
            <div style={{ width: `${levelInfo.progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #00D4FF, #7B2FBE)', borderRadius: '999px', transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>{levelInfo.progressPercent}% of current tier</span>
            <span>🔥 {streak}-Day Active Streak</span>
          </div>
        </section>

        {/* ── Identity Statement Card ── */}
        <section className="glass-card" style={{ padding: '1.25rem', borderRadius: '18px', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              IDENTITY COVENANT
            </span>
            <button
              onClick={() => {
                if (isEditingIdentity) handleSaveIdentity();
                else setIsEditingIdentity(true);
              }}
              style={{ background: 'none', border: 'none', color: 'var(--ice-blue)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {isEditingIdentity ? 'Save ✓' : 'Edit ✎'}
            </button>
          </div>

          {isEditingIdentity ? (
            <div>
              <textarea
                value={identityInput}
                onChange={(e) => setIdentityInput(e.target.value)}
                className="input-field"
                rows={3}
                style={{ width: '100%', fontSize: '0.9rem', lineHeight: 1.4 }}
              />
            </div>
          ) : (
            <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'white', lineHeight: 1.5, margin: '0.25rem 0 0' }}>
              "{userData?.identity_statement || identityInput}"
            </p>
          )}
        </section>

        {/* ── Active Arc Overview ── */}
        <section className="glass-card" style={{ padding: '1.25rem', borderRadius: '18px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            ACTIVE ARC SUMMARY
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Status</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', marginTop: '0.15rem' }}>
                Day {currentDay} of {totalDays}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Remaining</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--ice-blue)', marginTop: '0.15rem' }}>
                {totalDays - currentDay} Days Left
              </div>
            </div>
          </div>
        </section>

        {/* ── Notification Protocol (Section 5 Spec) ── */}
        <section className="glass-card" style={{ padding: '1.25rem', borderRadius: '18px', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              NOTIFICATION PROTOCOL
            </span>
            <span className="pill pill-blue" style={{ fontSize: '0.65rem' }}>
              QUIET HOURS ACTIVE
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.4 }}>
            Reminders keep the wire connected. Quiet hours automatically silence alerts between 10:30 PM and 6:30 AM.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.65rem 0.85rem', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>🌅 Morning Reminder (7:00 AM)</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>"Your Arc starts now. ❄️"</div>
              </div>
              <span style={{ color: 'var(--ice-blue)', fontSize: '0.85rem', fontWeight: 700 }}>ON</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.65rem 0.85rem', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>⚡ Habit Reminders</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>"Keep the promise. Never take a zero."</div>
              </div>
              <span style={{ color: 'var(--ice-blue)', fontSize: '0.85rem', fontWeight: 700 }}>ON</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.65rem 0.85rem', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>🔒 Evening Check-in (9:30 PM)</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>"Before the day ends... did you show up?"</div>
              </div>
              <span style={{ color: 'var(--ice-blue)', fontSize: '0.85rem', fontWeight: 700 }}>ON</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.65rem 0.85rem', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>🏆 Milestone Alerts</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Days 7, 14, 30, 60, 90 breakthroughs</div>
              </div>
              <span style={{ color: 'var(--ice-blue)', fontSize: '0.85rem', fontWeight: 700 }}>ON</span>
            </div>
          </div>

          <button
            onClick={async () => {
              if (typeof window !== 'undefined' && 'Notification' in window) {
                const perm = await Notification.requestPermission();
                if (perm === 'granted') {
                  new Notification('Winter Arc Protocol ❄️', {
                    body: 'Your Arc is active. Reminders are configured.',
                  });
                  setSaveStatus('Live test notification dispatched! 🔔');
                  setTimeout(() => setSaveStatus(null), 3500);
                } else {
                  setSaveStatus('Notification permission not granted.');
                  setTimeout(() => setSaveStatus(null), 3500);
                }
              }
            }}
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>🔔</span>
            <span>Enable & Test Notification Alert</span>
          </button>
        </section>

        {/* ── System Actions & Logout ── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => router.push('/onboarding')}
            style={{
              padding: '0.85rem',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>📜 Reset / Re-Onboard Arc</span>
            <span style={{ color: 'var(--text-muted)' }}>→</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              padding: '0.85rem',
              borderRadius: '14px',
              background: 'rgba(255, 59, 48, 0.12)',
              border: '1px solid rgba(255, 59, 48, 0.3)',
              color: '#ff6b6b',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🚪</span>
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out of Winter Arc'}</span>
          </button>
        </section>
      </main>
    </div>
  );
}
