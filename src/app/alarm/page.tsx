'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ALARM_SOUNDS = [
  { id: 'winter', label: '❄️ Winter Arch', file: null },
  { id: 'beep', label: '📳 Classic Beep', file: null },
  { id: 'nature', label: '🌊 Nature Waves', file: null },
  { id: 'power', label: '⚡ Power Up', file: null },
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
  "The warrior who fights himself is the strongest of all.",
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
      days: [1, 2, 3, 4, 5], // Mon–Fri
      sound: 'winter',
      vibrate: true,
      morningSteps: ['bath', 'stretch', 'sprint', 'workout', 'nutrition'],
      snoozeLimit: 1,
      challengeDay: 14,
    };
  });

  const [activeTab, setActiveTab] = useState<'alarm' | 'routine' | 'preview'>('alarm');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);

  // Check notification permission
  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setNotifGranted(Notification.permission === 'granted');
    }
  }, []);

  const saveAlarm = () => {
    localStorage.setItem('winterarch_alarm', JSON.stringify(alarm));
    scheduleNotifications(alarm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const requestNotifPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const perm = await Notification.requestPermission();
      setNotifGranted(perm === 'granted');
    }
  };

  const scheduleNotifications = (cfg: AlarmConfig) => {
    if (!notifGranted || !cfg.enabled) return;
    // Schedule via service worker (postMessage)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_ALARM',
        alarm: cfg,
      });
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Morning</p>
          <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
            <span className="gradient-text">Alarm & Routine</span>
          </h1>
        </div>

        {/* Master Toggle */}
        <div className="glass-card-primary animate-fadeInUp delay-100" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div className="font-display" style={{ fontWeight: 700, fontSize: '1rem' }}>Winter Arch Alarm</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {alarm.enabled ? `⏰ Rings at ${formatTime()} daily` : 'Alarm is off — warriors wake up first'}
            </div>
          </div>
          <ToggleSwitch value={alarm.enabled} onChange={v => updateAlarm('enabled', v)} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '4px', marginBottom: '1.25rem' }}>
          {(['alarm', 'routine', 'preview'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '0.6rem 0.25rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', transition: 'all 0.3s',
              background: activeTab === tab ? 'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(123,47,190,0.2))' : 'transparent',
              color: activeTab === tab ? 'var(--ice-blue)' : 'var(--text-muted)',
            }}>
              {tab === 'alarm' ? '⏰ Alarm' : tab === 'routine' ? '📋 Routine' : '👁 Preview'}
            </button>
          ))}
        </div>

        {/* ═══════ ALARM TAB ═══════ */}
        {activeTab === 'alarm' && (
          <div className="animate-fadeInUp">

            {/* Time Display */}
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
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Tap to change time</div>
            </div>

            {/* Day Selector */}
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
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                {[
                  { label: 'Everyday', days: [0,1,2,3,4,5,6] },
                  { label: 'Weekdays', days: [1,2,3,4,5] },
                  { label: 'Weekends', days: [0,6] },
                ].map(preset => (
                  <button key={preset.label}
                    onClick={() => updateAlarm('days', preset.days)}
                    style={{ padding: '0.3rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.05)', color: 'var(--ice-blue)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound */}
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

            {/* Vibrate + Snooze */}
            <div className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              {[
                {
                  icon: '📳', label: 'Vibration', sub: 'Vibrate with alarm',
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

            {/* Notification Permission */}
            {!notifGranted && (
              <div className="glass-card-fire" style={{ padding: '1rem 1.25rem', borderRadius: '16px', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--fire-orange)', fontWeight: 700, marginBottom: '0.25rem' }}>⚠️ Notifications Required</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Enable notifications to receive your morning alarm reminders</div>
                <button onClick={requestNotifPermission} className="btn-fire" style={{ padding: '0.6rem', fontSize: '0.85rem' }}>
                  🔔 Enable Notifications
                </button>
              </div>
            )}

            {notifGranted && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#10B981' }}>✅</span>
                <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 600 }}>Notifications enabled — alarm will ring!</span>
              </div>
            )}
          </div>
        )}

        {/* ═══════ ROUTINE TAB ═══════ */}
        {activeTab === 'routine' && (
          <div className="animate-fadeInUp">
            <div style={{ marginBottom: '1rem', padding: '0.875rem 1.25rem', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="font-display" style={{ fontWeight: 700 }}>Total Morning Time</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your full morning routine</div>
              </div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ice-blue)' }}>{totalRoutineTime}m</div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
              Toggle steps to customize your morning routine:
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
                    {/* Step number */}
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

            {/* Routine Timeline */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px' }}>
              <div className="section-title" style={{ marginBottom: '1rem' }}>Your Morning Timeline</div>
              {(() => {
                let currentTime = alarm.hour * 60 + alarm.minute;
                if (alarm.ampm === 'PM' && alarm.hour !== 12) currentTime += 720;
                return alarm.morningSteps.map(stepId => {
                  const step = MORNING_STEPS.find(s => s.id === stepId);
                  if (!step) return null;
                  const startH = Math.floor(currentTime / 60) % 12 || 12;
                  const startM = currentTime % 60;
                  const startAmPm = currentTime < 720 ? 'AM' : 'PM';
                  currentTime += step.duration;
                  const endH = Math.floor(currentTime / 60) % 12 || 12;
                  const endM = currentTime % 60;
                  const endAmPm = currentTime < 720 ? 'AM' : 'PM';
                  return (
                    <div key={stepId} style={{ display: 'flex', gap: '0.875rem', marginBottom: '0.875rem', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ice-blue)', marginTop: '6px' }} />
                        <div style={{ width: '1px', flex: 1, background: 'rgba(0,212,255,0.2)', minHeight: '24px', marginTop: '3px' }} />
                      </div>
                      <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="font-display" style={{ fontWeight: 700, fontSize: '0.88rem' }}>{step.icon} {step.label}</span>
                          <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ice-blue)' }}>
                            {String(startH).padStart(2,'0')}:{String(startM).padStart(2,'0')} {startAmPm}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{step.duration} minutes</div>
                      </div>
                    </div>
                  );
                });
              })()}
              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', flexShrink: 0, marginLeft: 0 }} />
                <span className="font-display" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#10B981' }}>🎉 Morning Complete!</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ PREVIEW TAB ═══════ */}
        {activeTab === 'preview' && (
          <div className="animate-fadeInUp">
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
              Preview of what users will see on alarm day
            </div>

            {/* Alarm Screen Preview */}
            <div style={{ background: '#060A14', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(0,212,255,0.15)', marginBottom: '1.25rem' }}>
              {/* Status bar */}
              <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                <span>5:30</span><span>●●●●</span>
              </div>

              {/* Snow particles simulation */}
              <div style={{ textAlign: 'center', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(0,212,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Snowflakes */}
                {['❄','❅','❆','✦'].map((s, i) => (
                  <span key={i} style={{ position: 'absolute', top: `${10 + i*15}%`, left: `${10 + i*20}%`, color: 'rgba(0,212,255,0.3)', fontSize: '0.8rem' }}>{s}</span>
                ))}

                <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }} className="animate-float">❄️</div>

                <div className="font-mono" style={{ fontSize: '4rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                  {String(alarm.hour).padStart(2,'0')}:{String(alarm.minute).padStart(2,'0')}
                </div>
                <div className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ice-blue)', marginTop: '0.25rem' }}>{alarm.ampm}</div>

                <div style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>
                  <div className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>Rise, Warrior. 🔥</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Day {alarm.challengeDay} of your Winter Arch begins now
                  </div>
                </div>

                <div style={{ padding: '0.75rem 1rem', margin: '1rem 0', background: 'rgba(0,212,255,0.06)', borderRadius: '14px', border: '1px solid rgba(0,212,255,0.12)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{quote}"
                  </div>
                </div>

                {/* Today's preview */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  {alarm.morningSteps.map(stepId => {
                    const s = MORNING_STEPS.find(x => x.id === stepId);
                    return s ? (
                      <div key={stepId} style={{ padding: '0.3rem 0.6rem', borderRadius: '20px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {s.icon} {s.label}
                      </div>
                    ) : null;
                  })}
                </div>

                {/* Slide to wake up */}
                <div style={{ position: 'relative', height: '56px', background: 'rgba(255,255,255,0.06)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,#00D4FF,#7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0, boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
                    ▶
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-display)' }}>
                    slide to rise up  →
                  </div>
                </div>

                {/* Snooze */}
                <button style={{ marginTop: '0.875rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  😴 Snooze ({alarm.snoozeLimit}× max)
                </button>
              </div>
            </div>

            <Link href="/alarm/ring" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                🔔 Test Alarm Screen
              </button>
            </Link>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={saveAlarm}
          className="btn-primary"
          style={{ marginTop: '0.5rem', fontSize: '1rem', background: saved ? 'linear-gradient(135deg, #10B981, #059669)' : undefined }}
        >
          {saved ? '✅ Alarm Saved!' : `⏰ Save Alarm — ${formatTime()}`}
        </button>

        {alarm.enabled && (
          <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Your alarm will ring every {alarm.days.map(d => DAYS[d]).join(', ')} at {formatTime()}
          </p>
        )}
      </div>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowTimePicker(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '430px', margin: '0 auto', background: 'var(--bg-surface)', borderRadius: '28px 28px 0 0', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }} className="animate-fadeInUp">
            <div className="font-display" style={{ fontWeight: 700, fontSize: '1.2rem', textAlign: 'center', marginBottom: '1.5rem' }}>Set Wake Up Time</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {/* Hour */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateAlarm('hour', alarm.hour === 12 ? 1 : alarm.hour + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>▲</button>
                <div className="font-mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', width: '80px', textAlign: 'center' }}>{String(alarm.hour).padStart(2, '0')}</div>
                <button onClick={() => updateAlarm('hour', alarm.hour === 1 ? 12 : alarm.hour - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>▼</button>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>HOUR</div>
              </div>

              <div className="font-mono" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--ice-blue)', marginBottom: '2rem' }}>:</div>

              {/* Minute */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateAlarm('minute', alarm.minute === 59 ? 0 : alarm.minute + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>▲</button>
                <div className="font-mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', width: '80px', textAlign: 'center' }}>{String(alarm.minute).padStart(2, '0')}</div>
                <button onClick={() => updateAlarm('minute', alarm.minute === 0 ? 59 : alarm.minute - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>▼</button>
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

            {/* Quick presets */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { h: 4, m: 30, ap: 'AM', label: '4:30 AM' },
                { h: 5, m: 0, ap: 'AM', label: '5:00 AM' },
                { h: 5, m: 30, ap: 'AM', label: '5:30 AM' },
                { h: 6, m: 0, ap: 'AM', label: '6:00 AM' },
                { h: 6, m: 30, ap: 'AM', label: '6:30 AM' },
                { h: 7, m: 0, ap: 'AM', label: '7:00 AM' },
              ].map(t => (
                <button key={t.label}
                  onClick={() => { updateAlarm('hour', t.h); updateAlarm('minute', t.m); updateAlarm('ampm', t.ap as 'AM'|'PM'); }}
                  style={{
                    padding: '0.4rem 0.875rem', borderRadius: '20px',
                    border: `1.5px solid ${alarm.hour === t.h && alarm.minute === t.m && alarm.ampm === t.ap ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    background: alarm.hour === t.h && alarm.minute === t.m && alarm.ampm === t.ap ? 'rgba(0,212,255,0.1)' : 'transparent',
                    color: alarm.hour === t.h && alarm.minute === t.m ? 'var(--ice-blue)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                  }}>
                  {t.label}
                </button>
              ))}
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
