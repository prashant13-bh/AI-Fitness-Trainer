'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Winter Arc Core 5 Tabs
const NAV_ITEMS = [
  { href: '/today', icon: '⚡', label: 'Today' },
  { href: '/arc', icon: '❄️', label: 'Arc' },
  { href: '/progress', icon: '📈', label: 'Progress' },
  { href: '/coach', icon: '🤖', label: 'Coach' },
  { href: '/profile', icon: '👤', label: 'You' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { userData, user } = useAuth();
  
  const isActive = (href: string) => {
    if (href === '/today') return pathname === '/today';
    if (href === '/profile') return pathname === '/profile';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const displayName = userData?.name || user?.user_metadata?.full_name || 'Warrior';
  const userLevel = userData?.level ?? 1;
  const streak = 8; // Streak

  return (
    <>
      {/* ── Mobile Bottom Nav (visible < 1024px) ── */}
      <nav className="bottom-nav" aria-label="Winter Arc navigation">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? 'active' : ''}`}
                aria-label={item.label}
              >
                <span style={{ 
                  fontSize: '1.25rem',
                  filter: active ? 'drop-shadow(0 0 8px rgba(0,212,255,0.6))' : 'none',
                  transform: active ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s ease, filter 0.2s ease'
                }}>
                  {item.icon}
                </span>
                <span style={{
                  fontWeight: active ? 700 : 500,
                  letterSpacing: active ? '0.02em' : 'normal',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase'
                }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Desktop Sidebar (fixed position on left for ≥ 1024px) ── */}
      <aside className="desktop-sidebar" aria-label="Winter Arc desktop navigation">
        {/* Brand */}
        <div className="sidebar-brand">
          <div style={{ fontSize: '1.75rem', filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.7))' }}>❄️</div>
          <div>
            <span className="font-display" style={{ fontWeight: 900, fontSize: '1.15rem', background: 'linear-gradient(135deg,#00D4FF,#7B2FBE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              WINTER ARC
            </span>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              90 Days of Discipline
            </div>
          </div>
        </div>

        {/* User Card */}
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', margin: '0.75rem 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.05rem', fontWeight: 800, color: 'white',
            fontFamily: 'var(--font-display)', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,212,255,0.25)'
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-display" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.15rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--fire-orange)', fontWeight: 700 }}>
                🔥 {streak}d Streak
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--ice-blue)', fontWeight: 600 }}>
                Lvl {userLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Core Winter Arc Navigation Links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem', padding: '0 0.5rem' }}>
            Core Transformation Loop
          </div>
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${active ? 'active' : ''}`}
                aria-label={item.label}
              >
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontWeight: active ? 700 : 500 }}>{item.label}</span>
                {item.href === '/today' && (
                  <span className="pill pill-blue" style={{ marginLeft: 'auto', fontSize: '0.58rem', padding: '0.1rem 0.4rem' }}>
                    EXECUTE
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Action Button */}
        <div style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>
          <Link href="/today" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', width: '100%', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span>⚡</span>
              <span>Lock In Today</span>
            </button>
          </Link>
        </div>

        {/* Footer info */}
        <div style={{ padding: '0.5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Winter Arc V1
          </div>
          <span className="pill pill-blue" style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem' }}>
            90-DAY PROTOCOL
          </span>
        </div>
      </aside>
    </>
  );
}
