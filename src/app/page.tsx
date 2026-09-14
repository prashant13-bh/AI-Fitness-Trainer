'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  { icon: '🤖', title: 'AI Trainer', desc: 'Live pose detection & rep counting' },
  { icon: '✅', title: 'Habit Architect', desc: 'Build unbreakable daily habits' },
  { icon: '📊', title: 'Smart Planner', desc: 'AI-generated weekly workout plans' },
  { icon: '🔥', title: '30-Day Challenge', desc: 'Winter Arch transformation program' },
];

export default function LandingPage() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 2500);
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
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '30%', left: '-20%',
        width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(123,47,190,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '430px', margin: '0 auto', padding: '0 1.5rem', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        {/* Header Logo */}
        <div style={{ paddingTop: '3rem', textAlign: 'center' }} className="animate-fadeInUp">
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(123,47,190,0.3) 100%)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: '28px',
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
          }} className="animate-pulse-glow">
            ❄️
          </div>

          <h1 className="font-display" style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.25rem' }}>
            <span className="gradient-text">Winter</span>
            <br />
            <span style={{ color: 'white' }}>Arch</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.75rem', maxWidth: '260px', margin: '0.75rem auto 0' }}>
            Your AI-powered fitness companion. Transform your body this winter.
          </p>
        </div>

        {/* Feature Carousel */}
        <div style={{ marginTop: '2.5rem', flex: 1 }} className="animate-fadeInUp delay-200">
          {/* Feature Cards */}
          <div style={{ position: 'relative', height: '100px', marginBottom: '1rem' }}>
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
                <div className="glass-card-primary" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', height: '100%' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,47,190,0.2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'white' }}>{f.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{f.desc}</div>
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
                  height: '6px',
                  borderRadius: '3px',
                  background: activeFeature === i ? 'linear-gradient(90deg, #00D4FF, #7B2FBE)' : 'rgba(255,255,255,0.1)',
                  width: activeFeature === i ? '24px' : '8px',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              { value: '1,247', label: 'Athletes' },
              { value: '30', label: 'Day Challenge' },
              { value: '4.9★', label: 'Rated' },
            ].map((stat, i) => (
              <div key={i} className="glass-card" style={{ padding: '0.875rem 0.5rem', textAlign: 'center', borderRadius: '16px' }}>
                <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ice-blue)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ paddingBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="animate-fadeInUp delay-400">
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: '1.05rem' }}>
              🚀 Start Winter Arch Challenge
            </button>
          </Link>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary">
              Already training? Sign In
            </button>
          </Link>
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Free to join · No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
