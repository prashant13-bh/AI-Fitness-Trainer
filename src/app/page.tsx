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
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg, #060A14 0%, #0A0E1A 50%, #10082A 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Snow Particles */}
      {PARTICLES.map(p => (
        <SnowParticle key={p.id} delay={p.delay} x={p.x} />
      ))}

      {/* Background glow orbs */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: '320px', height: '320px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '25%', left: '-15%',
        width: '280px', height: '280px',
        background: 'radial-gradient(circle, rgba(123,47,190,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '440px', margin: '0 auto', padding: '0 1.5rem', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        {/* Header Logo */}
        <div style={{ paddingTop: '3.5rem', textAlign: 'center' }} className="animate-fadeInUp">
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '84px', height: '84px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(123,47,190,0.3) 100%)',
            border: '1px solid rgba(0,212,255,0.4)',
            borderRadius: '28px',
            fontSize: '2.5rem',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 32px rgba(0,212,255,0.3)',
          }} className="animate-pulse-glow">
            ❄️
          </div>

          <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--ice-blue)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            THE 90-DAY PROTOCOL
          </div>

          <h1 className="font-display" style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.05, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            <span className="gradient-text">WINTER</span>
            <br />
            <span style={{ color: 'white' }}>ARC</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.75rem', maxWidth: '300px', margin: '0.75rem auto 0', lineHeight: 1.4 }}>
            <strong style={{ color: 'white' }}>90 days. One promise.</strong>
            <br />
            Become the person you said you'd become.
          </p>
        </div>

        {/* Feature Carousel */}
        <div style={{ marginTop: '2.25rem', flex: 1 }} className="animate-fadeInUp delay-200">
          <div style={{ position: 'relative', height: '110px', marginBottom: '1rem' }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: activeFeature === i ? 1 : 0,
                  transform: activeFeature === i ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.98)',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  pointerEvents: activeFeature === i ? 'auto' : 'none',
                }}
              >
                <div className="glass-card-primary" style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', height: '100%' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(123,47,190,0.3))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem',
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-display" style={{ fontWeight: 800, fontSize: '0.98rem', color: 'white' }}>{f.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.3 }}>{f.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '1.5rem' }}>
            {features.map((_, i) => (
              <div
                key={i}
                style={{
                  height: '5px',
                  borderRadius: '3px',
                  background: activeFeature === i ? 'linear-gradient(90deg, #00D4FF, #7B2FBE)' : 'rgba(255,255,255,0.1)',
                  width: activeFeature === i ? '24px' : '8px',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Core Philosophy Banner */}
          <div className="glass-card" style={{ padding: '0.9rem 1rem', borderRadius: '14px', marginBottom: '1.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CORE LOOP PHILOSOPHY
            </div>
            <div style={{ fontSize: '0.82rem', color: 'white', fontWeight: 600, marginTop: '0.25rem' }}>
              Identity → Arc → Habits → Execute → Check-in → Return
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ paddingBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="animate-fadeInUp delay-400">
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: '1.05rem', width: '100%', padding: '0.95rem' }}>
              ⚡ Begin Your 90-Day Arc
            </button>
          </Link>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ width: '100%', padding: '0.85rem' }}>
              Enter Protocol (Sign In)
            </button>
          </Link>
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Free V1 Transformation Product · PWA Ready
          </p>
        </div>
      </div>
    </div>
  );
}
