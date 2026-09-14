'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ALARM_SOUNDS = [
  { id: 'winter', label: '❄️ Winter Arch Anthem', file: null },
  { id: 'beep', label: '📳 Classic Beep', file: null },
  { id: 'nature', label: '🌊 Nature Waves', file: null },
  { id: 'power', label: '⚡ Power Up Synth', file: null },
];

const MORNING_STEPS = [
  { id: 'bath', icon: '🚿', label: 'Cold Bath', duration: 5, desc: 'Activate your nervous system' },
  { id: 'stretch', icon: '🧘', label: 'Stretching', duration: 8, desc: 'Warm up your muscles' },
  { id: 'sprint', icon: '🏃', label: 'Sprint Session', duration: 10, desc: '6× 50m sprints with rest' },
  { id: 'workout', icon: '💪', label: 'Main Workout', duration: 30, desc: 'AI-personalized to your body' },
  { id: 'nutrition', icon: '🥗', label: 'Breakfast', duration: 15, desc: 'Fuel your gains' },
];

const QUOTES = [
  "The pain you feel today will be the strength you feel tomorrow.",
  "Champions are made when nobody is watching.",
  "Your only competition is who you were yesterday.",
  "The winter is cold. Your excuses are colder. Get up.",
  "Every champion was once a contender who refused to give up.",
  "Rise before the world wakes. That's your edge.",
];

type AlarmConfig = {
  enabled: boolean;
  hour: number;
  minute: number;
  ampm: 'AM' | 'PM';
  days: number[];
  sound: string;
  vibrate: boolean;
  morningSteps: string[];
  snoozeLimit: number;
  challengeDay: number;
};

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: '52px', height: '28px', borderRadius: '14px', cursor: 'pointer',
        background: value ? 'linear-gradient(135deg, #00D4FF, #7B2FBE)' : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'all 0.3s ease', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: '4px',
        left: value ? '28px' : '4px',
        width: '20px', height: '20px', borderRadius: '50%',
        background: 'white', transition: 'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}

export default function AlarmPage() {
  const [alarm, setAlarm] = useState<AlarmConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('winterarch_alarm');
      if (saved) return JSON.parse(saved);
    }
    return {
      enabled: false,
      hour: 5,
      minute: 30,
      ampm: 'AM',
      days: [1, 2, 3, 4, 5],
      sound: 'winter',
      vibrate: true,
      morningSteps: ['bath', 'stretch', 'sprint', 'workout', 'nutrition'],
      snoozeLimit: 1,
      challengeDay: 14,
    };
  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setNotifGranted(Notification.permission === 'granted');
    }
  }, []);

  const saveAlarm = () => {
    localStorage.setItem('winterarch_alarm', JSON.stringify(alarm));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const requestNotifPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const perm = await Notification.requestPermission();
      setNotifGranted(perm === 'granted');
    }
  };

  const updateAlarm = (key: keyof AlarmConfig, value: any) => {
    setAlarm(prev => ({ ...prev, [key]: value }));
  };

  const toggleDay = (day: number) => {
    setAlarm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const toggleStep = (stepId: string) => {
    setAlarm(prev => ({
      ...prev,
      morningSteps: prev.morningSteps.includes(stepId)
        ? prev.morningSteps.filter(s => s !== stepId)
        : [...prev.morningSteps, stepId],
    }));
  };

  const formatTime = () => {
    const h = String(alarm.hour).padStart(2, '0');
    const m = String(alarm.minute).padStart(2, '0');
    return `${h}:${m} ${alarm.ampm}`;
  };

  const totalRoutineTime = MORNING_STEPS
    .filter(s => alarm.morningSteps.includes(s.id))
    .reduce((sum, s) => sum + s.duration, 0);

  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Disciplined Waking</p>
          <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
            <span className="gradient-text">Morning Alarm & Routine</span>
          </h1>
        </div>

        {/* Master Toggle */}
        <div className="glass-card-primary animate-fadeInUp delay-100" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div className="font-display" style={{ fontWeight: 700, fontSize: '1rem' }}>Winter Arch Alarm</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {alarm.enabled ? `⏰ Rings at ${formatTime()} daily` : 'Alarm disabled — turn on to build your routine'}
            </div>
          </div>
          <ToggleSwitch value={alarm.enabled} onChange={v => updateAlarm('enabled', v)} />
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="desktop-grid-split">
          {/* Left Column: Time & Alarm Settings */}
          <div className="animate-fadeInUp">
            {/* Time Display Hero Card */}
            <div
              onClick={() => setShowTimePicker(true)}
              className="glass-card"
              style={{ padding: '2rem 1.25rem', borderRadius: '24px', textAlign: 'center', marginBottom: '1.25rem', cursor: 'pointer', border: '1px solid rgba(0,212,255,0.15)', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div className="font-mono" style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px' }}>
                <span style={{ color: 'white' }}>{String(alarm.hour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}</span>
              </div>
              <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ice-blue)', marginTop: '0.25rem' }}>{alarm.ampm}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Tap to change wake up time</div>
            </div>

            {/* Repeat Days */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="section-title" style={{ marginBottom: '0.75rem' }}>Repeat Days</div>
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
                {DAYS.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => toggleDay(i)}
                    style={{
                      flex: 1, padding: '0.6rem 0', borderRadius: '12px', cursor: 'pointer',
                      background: alarm.days.includes(i)
                        ? 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(123,47,190,0.25))'
                        : 'rgba(255,255,255,0.04)',
                      color: alarm.days.includes(i) ? 'var(--ice-blue)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.72rem',
                      border: `1.5px solid ${alarm.days.includes(i) ? 'rgba(0,212,255,0.4)' : 'transparent'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Alarm Sound */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="section-title" style={{ marginBottom: '0.75rem' }}>Alarm Sound</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {ALARM_SOUNDS.map(s => (
                  <div
                    key={s.id}
                    onClick={() => updateAlarm('sound', s.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.875rem 1.25rem', borderRadius: '14px', cursor: 'pointer',
                      background: alarm.sound === s.id ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${alarm.sound === s.id ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.05)'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    <span className="font-display" style={{ fontWeight: 600, fontSize: '0.9rem', color: alarm.sound === s.id ? 'var(--ice-blue)' : 'var(--text-primary)' }}>{s.label}</span>
                    {alarm.sound === s.id && <span style={{ color: 'var(--ice-blue)', fontSize: '1rem' }}>●</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Vibrate & Snooze Settings */}
            <div className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              {[
                {
                  icon: '📳', label: 'Vibration', sub: 'Vibrate on trigger',
                  control: <ToggleSwitch value={alarm.vibrate} onChange={v => updateAlarm('vibrate', v)} />
                },
                {
                  icon: '😴', label: 'Snooze Limit', sub: `Max ${alarm.snoozeLimit}× snooze allowed`,
                  control: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {[0,1,2,3].map(n => (
                        <button key={n} onClick={() => updateAlarm('snoozeLimit', n)}
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: `1.5px solid ${alarm.snoozeLimit === n ? 'rgba(0,212,255,0.5)' : 'transparent'}`, background: alarm.snoozeLimit === n ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)', color: alarm.snoozeLimit === n ? 'var(--ice-blue)' : 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  )
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                    <div>
                      <div className="font-display" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                    </div>
                  </div>
                  {item.control}
                </div>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={saveAlarm}
              className="btn-primary"
              style={{ fontSize: '1rem', background: saved ? 'linear-gradient(135deg, #10B981, #059669)' : undefined, marginBottom: '1.5rem' }}
            >
              {saved ? '✅ Alarm Saved!' : `⏰ Save Alarm — ${formatTime()}`}
            </button>
          </div>

          {/* Right Column: Morning Routine Step Builder */}
          <div className="animate-fadeInUp delay-100">
            <div style={{ marginBottom: '1rem', padding: '1rem 1.25rem', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="font-display" style={{ fontWeight: 700 }}>Total Morning Routine</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>5-Step discipline sequence</div>
              </div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ice-blue)' }}>{totalRoutineTime}m</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {MORNING_STEPS.map((step, i) => {
                const active = alarm.morningSteps.includes(step.id);
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
                      background: active ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1.5px solid ${active ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: '18px', cursor: 'pointer', transition: 'all 0.3s',
                    }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: active ? 'linear-gradient(135deg,#00D4FF,#7B2FBE)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: active ? '#000' : 'var(--text-muted)', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{step.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="font-display" style={{ fontWeight: 700, fontSize: '0.95rem', color: active ? 'white' : 'var(--text-muted)' }}>{step.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{step.desc} · {step.duration} min</div>
                    </div>
                    <ToggleSwitch value={active} onChange={() => toggleStep(step.id)} />
                  </div>
                );
              })}
            </div>

            {/* Test Alarm Trigger Link */}
            <Link href="/alarm/ring" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ width: '100%', padding: '0.875rem', borderRadius: '16px', fontSize: '0.9rem' }}>
                🔔 Launch Live Alarm Ring Simulator
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Centered Desktop Time Picker Modal */}
      {showTimePicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowTimePicker(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-surface)', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(0,212,255,0.15)' }} className="animate-scaleIn">
            <div className="font-display" style={{ fontWeight: 800, fontSize: '1.3rem', textAlign: 'center', marginBottom: '1.5rem', color: 'white' }}>Set Wake Up Time</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {/* Hour */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateAlarm('hour', alarm.hour === 12 ? 1 : alarm.hour + 1)} style={{ background: 'none', border: 'none', color: 'var(--ice-blue)', fontSize: '1.5rem', cursor: 'pointer' }}>▲</button>
                <div className="font-mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', width: '80px', textAlign: 'center' }}>{String(alarm.hour).padStart(2, '0')}</div>
                <button onClick={() => updateAlarm('hour', alarm.hour === 1 ? 12 : alarm.hour - 1)} style={{ background: 'none', border: 'none', color: 'var(--ice-blue)', fontSize: '1.5rem', cursor: 'pointer' }}>▼</button>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>HOUR</div>
              </div>

              <div className="font-mono" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--ice-blue)', marginBottom: '2rem' }}>:</div>

              {/* Minute */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateAlarm('minute', alarm.minute === 59 ? 0 : alarm.minute + 1)} style={{ background: 'none', border: 'none', color: 'var(--ice-blue)', fontSize: '1.5rem', cursor: 'pointer' }}>▲</button>
                <div className="font-mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', width: '80px', textAlign: 'center' }}>{String(alarm.minute).padStart(2, '0')}</div>
                <button onClick={() => updateAlarm('minute', alarm.minute === 0 ? 59 : alarm.minute - 1)} style={{ background: 'none', border: 'none', color: 'var(--ice-blue)', fontSize: '1.5rem', cursor: 'pointer' }}>▼</button>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MINUTE</div>
              </div>

              {/* AM/PM */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '0.5rem' }}>
                {(['AM', 'PM'] as const).map(p => (
                  <button key={p} onClick={() => updateAlarm('ampm', p)} style={{
                    width: '56px', height: '44px', borderRadius: '12px', fontWeight: 800,
                    fontFamily: 'var(--font-display)', fontSize: '1rem', border: 'none', cursor: 'pointer',
                    background: alarm.ampm === p ? 'linear-gradient(135deg,#00D4FF,#7B2FBE)' : 'rgba(255,255,255,0.08)',
                    color: alarm.ampm === p ? '#000' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}>{p}</button>
                ))}
              </div>
            </div>

            <button className="btn-primary" onClick={() => setShowTimePicker(false)}>
              ✅ Set {String(alarm.hour).padStart(2,'0')}:{String(alarm.minute).padStart(2,'0')} {alarm.ampm}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
