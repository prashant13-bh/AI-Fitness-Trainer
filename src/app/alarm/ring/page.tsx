'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const QUOTES = [
  "The pain you feel today will be the strength you feel tomorrow.",
  "Champions are made when nobody is watching.",
  "Your only competition is who you were yesterday.",
  "The winter is cold. Your excuses are colder. Get up.",
  "Rise before the world wakes. That's your edge.",
];

const MORNING_STEPS = [
  { icon: '🚿', label: 'Cold Bath', duration: 5 },
  { icon: '🧘', label: 'Stretching', duration: 8 },
  { icon: '🏃', label: 'Sprint Session', duration: 10 },
  { icon: '💪', label: 'Main Workout', duration: 30 },
];

export default function AlarmRingPage() {
  const router = useRouter();
  const [time, setTime] = useState('');
  const [snoozed, setSnoozed] = useState(false);
  const [snoozeCount, setSnoozeCount] = useState(0);
  const [slideX, setSlideX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const savedCfg = useMemo(() => {
    if (typeof window === 'undefined') return { snoozeLimit: 1, challengeDay: 14 };
    const raw = localStorage.getItem('winterarch_alarm');
    return raw ? JSON.parse(raw) : { snoozeLimit: 1, challengeDay: 14 };
  }, []);
  const snoozeMax: number = savedCfg.snoozeLimit ?? 1;
  const challengeDay: number = savedCfg.challengeDay ?? 14;

  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = now.getHours() % 12 || 12;
      const m = String(now.getMinutes()).padStart(2,'0');
      const ap = now.getHours() < 12 ? 'AM' : 'PM';
      setTime(`${h}:${m} ${ap}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);



  // Vibrate on load
  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }
  }, []);

  // Slider logic
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    startXRef.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - startXRef.current;
    const maxSlide = (sliderRef.current?.offsetWidth ?? 300) - 56 - 8;
    setSlideX(Math.max(0, Math.min(dx, maxSlide)));
  };
  const handleTouchEnd = () => {
    const maxSlide = (sliderRef.current?.offsetWidth ?? 300) - 56 - 8;
    if (slideX > maxSlide * 0.75) {
      setSlideX(maxSlide);
      setDismissed(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setTimeout(() => router.push('/dashboard'), 800);
    } else {
      setSlideX(0);
    }
    setDragging(false);
  };

  const handleSnooze = () => {
    if (snoozeCount >= snoozeMax) return;
    setSnoozeCount(c => c + 1);
    setSnoozed(true);
    if (navigator.vibrate) navigator.vibrate(200);
    setTimeout(() => {
      setSnoozed(false);
      if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 400]);
    }, 5 * 60 * 1000); // 5 min snooze
  };

  const totalTime = MORNING_STEPS.reduce((s,m) => s + m.duration, 0);

  if (dismissed) {
    return (
      <div style={{ minHeight: '100dvh', background: '#060A14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }} className="animate-scaleIn">🔥</div>
        <div className="font-display" style={{ fontSize: '2rem', fontWeight: 900, textAlign: 'center', marginBottom: '0.5rem' }}>
          <span className="gradient-text">Let&apos;s Go!</span>
        </div>
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>Loading Day {challengeDay}...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg, #010409 0%, #060A14 50%, #0A0414 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Animated background glow rings */}
      {[1,2,3].map(i => (
        <div key={i} style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
          width: `${150 + i*100}px`, height: `${150 + i*100}px`,
          borderRadius: '50%',
          border: `1px solid rgba(0,212,255,${0.15 - i*0.04})`,
          animation: `pulse-glow ${1.5 + i*0.5}s ease-in-out infinite ${i*0.3}s`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Snowflakes */}
      {['❄','❅','❆','✦','❄','❅'].map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${5 + (i * 13) % 40}%`,
          left: `${8 + (i * 17) % 84}%`,
          color: `rgba(0,212,255,${0.2 + (i%3)*0.1})`,
          fontSize: `${0.7 + (i%3)*0.3}rem`,
          animation: `float ${3 + i}s ease-in-out infinite ${i*0.5}s`,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>{s}</div>
      ))}

      {/* Content */}
      <div style={{ width: '100%', maxWidth: '430px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.5rem', minHeight: '100dvh', zIndex: 1 }}>

        {/* Day badge */}
        <div style={{ marginTop: '2rem', marginBottom: '1rem', padding: '0.4rem 1.25rem', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem' }}>❄️</span>
          <span className="font-display" style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ice-blue)' }}>
            WINTER ARCH · DAY {challengeDay}
          </span>
        </div>

        {/* Clock */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div className="font-mono" style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1, color: 'white' }}>
            {time.split(' ')[0]}
          </div>
          <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ice-blue)', lineHeight: 1 }}>
            {time.split(' ')[1]}
          </div>
        </div>

        {/* Wake up message */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="font-display" style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white', lineHeight: 1.2 }}>
            Rise, Warrior 🔥
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Your morning routine starts now
          </div>
        </div>

        {/* Quote */}
        <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '18px', padding: '1rem 1.25rem', marginBottom: '1.5rem', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: 1.6 }}>
            &ldquo;{quote}&rdquo;
          </div>
        </div>

        {/* Today's morning steps */}
        <div style={{ width: '100%', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', marginBottom: '0.75rem' }}>
            Today&apos;s Morning · {totalTime} min total
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {MORNING_STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px' }}>
                <span style={{ fontSize: '0.9rem' }}>{step.icon}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{step.label}</span>
                <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{step.duration}m</span>
              </div>
            ))}
          </div>
        </div>

        {/* SLIDE TO RISE UP */}
        <div style={{ width: '100%', marginBottom: '1.5rem' }}>
          <div
            ref={sliderRef}
            style={{ position: 'relative', height: '64px', background: 'rgba(255,255,255,0.06)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}
          >
            {/* Fill trail */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${slideX + 64}px`,
              background: 'linear-gradient(90deg, rgba(0,212,255,0.15), rgba(123,47,190,0.1))',
              borderRadius: '32px',
              transition: dragging ? 'none' : 'width 0.3s ease',
            }} />

            {/* Slider thumb */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                position: 'absolute',
                left: `${slideX + 4}px`,
                top: '4px',
                width: '56px', height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', cursor: 'grab',
                boxShadow: `0 0 ${20 + slideX/5}px rgba(0,212,255,0.5)`,
                transition: dragging ? 'none' : 'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                userSelect: 'none', touchAction: 'none',
                zIndex: 2,
              }}
            >
              {slideX > 200 ? '✅' : '▶▶'}
            </div>

            {/* Text */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span className="font-display" style={{ fontSize: '0.88rem', fontWeight: 700, color: `rgba(255,255,255,${0.4 - slideX/500})`, letterSpacing: '0.05em' }}>
                slide to rise up →
              </span>
            </div>
          </div>

          {/* Also works with tap for desktop testing */}
          <button
            onClick={() => { setDismissed(true); setTimeout(() => router.push('/dashboard'), 800); }}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', cursor: 'pointer', marginTop: '0.5rem', display: 'block', margin: '0.5rem auto 0', fontFamily: 'var(--font-display)' }}
          >
            (tap here to dismiss on desktop)
          </button>
        </div>

        {/* Snooze */}
        {snoozeCount < snoozeMax ? (
          snoozed ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              😴 Snoozed — alarm in 5 min ({snoozeMax - snoozeCount} left after this)
            </div>
          ) : (
            <button
              onClick={handleSnooze}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', padding: '0.6rem 1.5rem', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              😴 Snooze 5 min ({snoozeMax - snoozeCount}× left)
            </button>
          )
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#EF4444', fontSize: '0.82rem', fontWeight: 700 }}>⛔ No more snoozes, Warrior</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Get up and start your day!</div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Bottom motivator */}
        <div style={{ textAlign: 'center', paddingBottom: '2rem', marginTop: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>❄️</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.1em' }}>WINTER ARCH</div>
        </div>
      </div>
    </div>
  );
}
