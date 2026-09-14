'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Home' },
  { href: '/habits', icon: '✅', label: 'Habits' },
  { href: '/alarm', icon: '⏰', label: 'Alarm' },
  { href: '/workout', icon: '💪', label: 'Workout' },
  { href: '/profile', icon: '👤', label: 'Profile' },
];

const SIDEBAR_EXTRAS = [
  { href: '/challenge', icon: '❄️', label: 'Challenge' },
  { href: '/planner', icon: '🤖', label: 'AI Planner' },
  { href: '/nutrition', icon: '🥗', label: 'Nutrition' },
  { href: '/progress', icon: '📊', label: 'Progress' },
  { href: '/trainer', icon: '🎯', label: 'AI Trainer' },
  { href: '/history', icon: '📋', label: 'History' },
];


export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

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
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Desktop Sidebar (visible ≥ 1024px) ── */}
      <aside className="desktop-sidebar" aria-label="Desktop navigation">
        {/* Brand */}
        <div className="sidebar-brand">
          <div style={{ fontSize: '1.5rem' }}>❄️</div>
          <span className="font-display" style={{ fontWeight: 900, fontSize: '1rem', background: 'linear-gradient(135deg,#00D4FF,#7B2FBE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Winter Arch
          </span>
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
            Main
          </div>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />

          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
            Features
          </div>
          {SIDEBAR_EXTRAS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Winter Arch v1.0 ❄️
          </div>
        </div>
      </aside>
    </>
  );
}
