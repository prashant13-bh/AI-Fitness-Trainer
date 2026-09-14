'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/habits', icon: '✅', label: 'Habits Tracker' },
  { href: '/alarm', icon: '⏰', label: 'Morning Alarm' },
  { href: '/workout', icon: '💪', label: 'Workouts' },
  { href: '/profile', icon: '👤', label: 'Profile' },
];

const SIDEBAR_EXTRAS = [
  { href: '/challenge', icon: '❄️', label: 'Winter Challenge' },
  { href: '/planner', icon: '🤖', label: 'AI Planner' },
  { href: '/nutrition', icon: '🥗', label: 'Nutrition & Water' },
  { href: '/progress', icon: '📊', label: 'Analytics' },
  { href: '/trainer', icon: '🎯', label: 'AI Trainer' },
  { href: '/history', icon: '📋', label: 'Workout History' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { userData, firebaseUser } = useAuth();
  
  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  const displayName = userData?.displayName || firebaseUser?.displayName || 'Athlete';
  const streak = userData?.streak ?? 3;

  return (
    <>
      {/* ── Mobile Bottom Nav (visible < 1024px) ── */}
      <nav className="bottom-nav" aria-label="Main navigation">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
              <span>{item.label === 'Dashboard' ? 'Home' : item.label.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Desktop Sidebar (fixed position on left for ≥ 1024px) ── */}
      <aside className="desktop-sidebar" aria-label="Desktop navigation">
        {/* Brand */}
        <div className="sidebar-brand">
          <div style={{ fontSize: '1.75rem', filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.5))' }}>❄️</div>
          <div>
            <span className="font-display" style={{ fontWeight: 900, fontSize: '1.1rem', background: 'linear-gradient(135deg,#00D4FF,#7B2FBE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              WINTER ARCH
            </span>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Fitness Ecosystem
            </div>
          </div>
        </div>

        {/* User Card */}
        <div style={{ padding: '0.75rem 0.875rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', margin: '0.75rem 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 800, color: 'white',
            fontFamily: 'var(--font-display)', flexShrink: 0,
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-display" style={{ fontWeight: 700, fontSize: '0.85rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--fire-orange)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              🔥 {streak} Day Streak
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem', padding: '0 0.5rem' }}>
            Main Menu
          </div>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span style={{ fontSize: '1.15rem', flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />

          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem', padding: '0 0.5rem' }}>
            AI & Features
          </div>
          {SIDEBAR_EXTRAS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span style={{ fontSize: '1.15rem', flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Quick Action Button */}
        <div style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>
          <Link href="/workout" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', width: '100%', borderRadius: '12px' }}>
              ⚡ Start Workout
            </button>
          </Link>
        </div>

        {/* Footer info */}
        <div style={{ padding: '0.5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Winter Arch v1.0
          </div>
          <span className="pill pill-blue" style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem' }}>
            PWA READY
          </span>
        </div>
      </aside>
    </>
  );
}
