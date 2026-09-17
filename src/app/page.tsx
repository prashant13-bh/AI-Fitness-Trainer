'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const snowflakes = ['❄', '❅', '❆', '✦', '⋆'];

function SnowParticle({ delay, x }: { delay: number; x: number }) {
  return (
    <span
      className="snow-particle"
      style={{
        left: `${x}%`,
        top: '-20px',
        animationDuration: `${3 + Math.random() * 4}s`,
        animationDelay: `${delay}s`,
        fontSize: `${0.5 + Math.random() * 0.8}rem`,
      }}
    >
      {snowflakes[Math.floor(Math.random() * snowflakes.length)]}
    </span>
  );
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  delay: Math.random() * 5,
  x: Math.random() * 100,
}));

const features = [
  { icon: '⚡', title: 'Daily Protocol & Minimum Day', desc: 'Lock in your habits. Protect streaks even on your hardest days.' },
  { icon: '❄️', title: '90-Day Arc Matrix', desc: 'One promise. Defined identity. Track all 90 days of transformation.' },
  { icon: '📈', title: 'Winter Score & Analytics', desc: 'Consistency over streaks. Measure true long-term psychological change.' },
  { icon: '🤖', title: 'AI Transformation Coach', desc: 'Context-aware stoic mentorship, weekly reviews, and tactical planning.' },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      router.push('/today');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Snow Particles */}
      {PARTICLES.map(p => (
        <SnowParticle key={p.id} delay={p.delay} x={p.x} />
      ))}

      {/* Subtle Glacier Ambient Orbs (No neon purple!) */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(2, 132, 199, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Desktop & Mobile Responsive Outer Wrapper */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Minimal Nav */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>❄️</span>
            <span className="font-display gradient-text" style={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
              WINTER ARC
            </span>
          </div>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}>
              Sign In
            </button>
          </Link>
        </nav>

        {/* Hero Section */}
        <header style={{ paddingTop: 'clamp(2.5rem, 6vw, 4.5rem)', textAlign: 'center', maxWidth: '750px', margin: '0 auto' }} className="animate-fadeInUp">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 0.85rem', borderRadius: '999px',
            background: 'var(--ice-blue-dim)', border: '1px solid rgba(56, 189, 248, 0.25)',
            fontSize: '0.75rem', fontWeight: 800, color: 'var(--ice-blue)',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.25rem'
          }}>
            <span>❄️</span>
            <span>The 90-Day Transformation Protocol</span>
          </div>

          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', margin: '0 0 1rem 0' }}>
            Become who you said <br />
            <span className="gradient-text">you'd become.</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: '580px', margin: '0 auto 2rem', lineHeight: 1.5 }}>
            <strong style={{ color: 'white' }}>90 days. One promise. Zero excuses.</strong>
            <br />
            Lock in daily habits, protect consistency with Minimum Day protocol, and forge an unbreakable identity.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ fontSize: '1rem', padding: '0.95rem 2rem', borderRadius: '14px' }}>
                ⚡ Begin Your 90-Day Arc
              </button>
            </Link>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ fontSize: '1rem', padding: '0.95rem 1.75rem', borderRadius: '14px' }}>
                Enter Protocol
              </button>
            </Link>
          </div>
        </header>

        {/* 4 Core Pillars Grid (Responsive 2x2 on tablet/desktop, 1col on mobile) */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem'
        }} className="animate-fadeInUp delay-200">
          {features.map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.4rem', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'var(--ice-blue-dim)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                {f.icon}
              </div>
              <h2 className="font-display" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'white', margin: 0 }}>
                {f.title}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Core Philosophy Banner */}
        <section className="glass-card" style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          marginBottom: '3.5rem',
          textAlign: 'center',
          borderLeft: '4px solid var(--ice-blue)'
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            THE WINTER ARC MASTER PROTOCOL
          </div>
          <div className="font-display" style={{ fontSize: '0.95rem', color: 'white', fontWeight: 700, marginTop: '0.35rem' }}>
            ONBOARD → DEFINE IDENTITY → CREATE ARC → DAILY HABITS → EXECUTE TODAY → CHECK-IN → PROGRESS
          </div>
        </section>

        {/* Footer */}
        <footer style={{ marginTop: 'auto', padding: '1.5rem 0 2rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Winter Arc V1 · Built for Unwavering Discipline
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
            <Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Login</Link>
            <Link href="/signup" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Signup</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
