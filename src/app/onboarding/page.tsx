'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';

const TOTAL_STEPS = 5;

const IDENTITY_OPTIONS = [
  {
    id: 'producer',
    title: 'The Unstoppable Producer',
    desc: 'I execute every single day without waiting for motivation or permission.',
    icon: '⚡',
  },
  {
    id: 'athlete',
    title: 'The Resilient Athlete',
    desc: 'My physical and mental standards are forged through relentless discipline.',
    icon: '🛡️',
  },
  {
    id: 'scholar',
    title: 'The Deep Thinker',
    desc: 'I master deep focus, absorb wisdom daily, and eliminate digital distraction.',
    icon: '🧠',
  },
  {
    id: 'architect',
    title: 'The Life Architect',
    desc: 'I build my health, career, and character with deliberate craftsmanship.',
    icon: '🏛️',
  },
];

const LIFE_AREAS = [
  { id: 'Body', label: 'Body & Physical Health', icon: '🏋️' },
  { id: 'Mind', label: 'Mind & Mental Clarity', icon: '🧘' },
  { id: 'Career', label: 'Career & High-Output Work', icon: '💼' },
  { id: 'Knowledge', label: 'Knowledge & Skill Mastery', icon: '📖' },
  { id: 'Discipline', label: 'Discipline & Clean Habits', icon: '💧' },
];

const HABIT_TEMPLATES = [
  { id: 'h-1', name: 'Cold Shower & 1L Water', area: 'Discipline', type: 'binary', target: 'Done', min: 'Done', selected: true },
  { id: 'h-2', name: 'Strength or Conditioning Workout', area: 'Body', type: 'duration', target: '45 min', min: '15 min', selected: true },
  { id: 'h-3', name: 'Deep Work / High-Leverage Task', area: 'Career', type: 'duration', target: '90 min', min: '30 min', selected: true },
  { id: 'h-4', name: 'Read Non-Fiction', area: 'Knowledge', type: 'quantity', target: '15 pages', min: '5 pages', selected: true },
  { id: 'h-5', name: 'Zero Sugar & Clean Fuel', area: 'Body', type: 'binary', target: 'Done', min: 'Done', selected: true },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userData, updateUserData } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [selectedIdentity, setSelectedIdentity] = useState(IDENTITY_OPTIONS[0].title);
  const [customIdentity, setCustomIdentity] = useState('');
  const [arcDuration, setArcDuration] = useState(90);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['Body', 'Career', 'Knowledge']);
  const [habits, setHabits] = useState(HABIT_TEMPLATES);
  const [signature, setSignature] = useState(userData?.name || user?.user_metadata?.full_name || '');

  const toggleArea = (id: string) => {
    if (selectedAreas.includes(id)) {
      if (selectedAreas.length > 1) {
        setSelectedAreas(selectedAreas.filter(a => a !== id));
      }
    } else {
      setSelectedAreas([...selectedAreas, id]);
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, selected: !h.selected } : h));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    const finalIdentity = customIdentity.trim() || selectedIdentity;

    try {
      // 1. Update user profile in Supabase
      await updateUserData({
        identity_statement: finalIdentity,
        selected_areas: selectedAreas,
        onboarding_completed: true,
      });

      // 2. Persist active Arc and Habits to Supabase if connected
      const supabase = getSupabaseClient();
      if (user) {
        const todayStr = new Date().toISOString().split('T')[0];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + arcDuration);
        const endDateStr = endDate.toISOString().split('T')[0];

        // Insert Arc
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: arcData } = await (supabase.from('arcs') as any).insert({
          user_id: user.id,
          name: `${arcDuration}-Day Winter Arc`,
          type: 'winter',
          start_date: todayStr,
          end_date: endDateStr,
          duration: arcDuration,
          identity_statement: finalIdentity,
          status: 'active'
        }).select().single();

        const activeArcId = arcData?.id || user.id;

        // Insert Selected Habits
        const activeHabits = habits.filter(h => h.selected);
        for (const h of activeHabits) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('habits') as any).insert({
            user_id: user.id,
            arc_id: activeArcId,
            name: h.name,
            area: h.area,
            type: h.type,
            active: true
          });
        }
      }

      // Save local flag
      localStorage.setItem('winter_arc_onboarded', 'true');
      localStorage.setItem('winter_arc_identity', finalIdentity);

      router.push('/today');
    } catch (err) {
      console.error('Onboarding save error, continuing to /today', err);
      router.push('/today');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #060A14 0%, #080D1A 50%, #0E162B 100%)',
      padding: '2rem 1.25rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Progress Dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                style={{
                  width: step === i + 1 ? '24px' : '8px',
                  height: '6px',
                  borderRadius: '999px',
                  background: step >= i + 1 ? 'linear-gradient(90deg, #00D4FF, #7B2FBE)' : 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>

        {/* ── STEP 1: DEFINE IDENTITY ── */}
        {step === 1 && (
          <div className="animate-fadeInUp">
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              PHASE 1 · IDENTITY SHIFT
            </span>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', margin: '0.3rem 0 0.5rem', lineHeight: 1.2 }}>
              Who will you become in 90 days?
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              Transformation does not start with habits. It starts with an uncompromising identity statement.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {IDENTITY_OPTIONS.map((item) => {
                const isSelected = selectedIdentity === item.title && !customIdentity;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedIdentity(item.title);
                      setCustomIdentity('');
                    }}
                    style={{
                      background: isSelected ? 'rgba(0, 212, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--ice-blue)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '16px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 16px rgba(0,212,255,0.2)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, paddingLeft: '2.15rem' }}>
                      "{item.desc}"
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Identity Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>
                Or Craft Your Custom Identity
              </label>
              <input
                type="text"
                placeholder="e.g. I am a relentless builder who honors every commitment."
                value={customIdentity}
                onChange={(e) => setCustomIdentity(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.88rem' }}
              />
            </div>

            <button onClick={nextStep} className="btn-primary" style={{ width: '100%', padding: '0.95rem' }}>
              Confirm Identity →
            </button>
          </div>
        )}

        {/* ── STEP 2: CREATE ARC DURATION ── */}
        {step === 2 && (
          <div className="animate-fadeInUp">
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              PHASE 2 · THE COMMITMENT
            </span>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', margin: '0.3rem 0 0.5rem', lineHeight: 1.2 }}>
              Choose Your Arc Duration
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              The Winter Arc standard is 90 days. Enough time to rewrite neurochemistry, habit loops, and identity.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
              {[
                { days: 90, title: '90-Day Full Winter Arc', desc: 'The Gold Standard. Total psychological and physical transformation.', tag: 'RECOMMENDED' },
                { days: 60, title: '60-Day Momentum Forge', desc: 'Sustained acceleration for focused seasonal breakthrough.', tag: 'INTENSE' },
                { days: 30, title: '30-Day Sprint Arc', desc: 'High-intensity sprint to establish unshakeable baseline consistency.', tag: 'SPRINT' },
              ].map((opt) => (
                <div
                  key={opt.days}
                  onClick={() => setArcDuration(opt.days)}
                  style={{
                    background: arcDuration === opt.days ? 'rgba(0, 212, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${arcDuration === opt.days ? 'var(--ice-blue)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '16px',
                    padding: '1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>{opt.title}</span>
                    <span className="pill pill-blue" style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>
                      {opt.tag}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {opt.desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={prevStep} className="btn-secondary" style={{ flex: 1 }}>Back</button>
              <button onClick={nextStep} className="btn-primary" style={{ flex: 2 }}>Lock Duration →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: TRANSFORMATION AREAS ── */}
        {step === 3 && (
          <div className="animate-fadeInUp">
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              PHASE 3 · TRANSFORMATION PILLARS
            </span>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', margin: '0.3rem 0 0.5rem', lineHeight: 1.2 }}>
              Select Focus Pillars
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              Choose the areas where you are raising your standards for this Arc.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}>
              {LIFE_AREAS.map((area) => {
                const isSelected = selectedAreas.includes(area.id);
                return (
                  <div
                    key={area.id}
                    onClick={() => toggleArea(area.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isSelected ? 'rgba(0, 212, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--ice-blue)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '14px',
                      padding: '0.9rem 1.1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{area.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'white' }}>{area.label}</span>
                    </div>
                    <span style={{ color: isSelected ? 'var(--ice-blue)' : 'rgba(255,255,255,0.2)', fontSize: '1.1rem' }}>
                      {isSelected ? '✓' : '+'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={prevStep} className="btn-secondary" style={{ flex: 1 }}>Back</button>
              <button onClick={nextStep} className="btn-primary" style={{ flex: 2 }}>Next: Habits →</button>
            </div>
          </div>
        )}

        {/* ── STEP 4: DAILY HABITS & MINIMUMS ── */}
        {step === 4 && (
          <div className="animate-fadeInUp">
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              PHASE 4 · DAILY PROTOCOL
            </span>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', margin: '0.3rem 0 0.5rem', lineHeight: 1.2 }}>
              Core Habits & Minimums
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              Every habit has a target and a <strong>Minimum Day</strong> threshold so you never take a zero.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}>
              {habits.map((h) => (
                <div
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  style={{
                    background: h.selected ? 'rgba(0, 212, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${h.selected ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                    borderRadius: '14px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{h.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Target: <span style={{ color: 'var(--ice-blue)' }}>{h.target}</span> · Minimum: <span style={{ color: 'var(--sun-yellow)' }}>{h.min}</span>
                    </div>
                  </div>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '8px',
                    background: h.selected ? 'var(--ice-blue)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#060A14', fontWeight: 900, fontSize: '0.85rem'
                  }}>
                    {h.selected ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={prevStep} className="btn-secondary" style={{ flex: 1 }}>Back</button>
              <button onClick={nextStep} className="btn-primary" style={{ flex: 2 }}>The Contract →</button>
            </div>
          </div>
        )}

        {/* ── STEP 5: SIGN THE WINTER ARC CONTRACT ── */}
        {step === 5 && (
          <div className="animate-fadeInUp">
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ice-blue)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              PHASE 5 · THE SOLEMN AGREEMENT
            </span>
            <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', margin: '0.3rem 0 0.5rem', lineHeight: 1.2 }}>
              Sign Your Arc Contract
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              This is not a temporary challenge. This is a binding promise to yourself.
            </p>

            {/* Contract Paper Card */}
            <div className="glass-card" style={{
              padding: '1.5rem',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(14,24,48,0.9) 0%, rgba(6,10,20,0.95) 100%)',
              border: '1px solid rgba(0,212,255,0.35)',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 32px rgba(0,212,255,0.15)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>📜</span>
                <div className="font-display" style={{ fontWeight: 900, fontSize: '1.1rem', color: 'white', letterSpacing: '0.05em' }}>
                  WINTER ARC COVENANT
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--ice-blue)', fontWeight: 700, letterSpacing: '0.1em' }}>
                  {arcDuration}-DAY PROTOCOL
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                "I hereby commit to the next {arcDuration} days of disciplined execution. I will embody my identity: <strong>"{customIdentity.trim() || selectedIdentity}"</strong>. I will honor my habits, protect my minimum days, and show up even when motivation fades. One promise kept today is better than ten planned for tomorrow."
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>
                  Your Signature (Full Name)
                </label>
                <input
                  type="text"
                  placeholder="Enter your name to sign"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="input-field"
                  style={{
                    fontFamily: 'serif',
                    fontStyle: 'italic',
                    fontSize: '1.2rem',
                    letterSpacing: '0.05em',
                    color: 'var(--ice-blue)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={prevStep} className="btn-secondary" style={{ flex: 1 }}>Back</button>
              <button
                onClick={handleCompleteOnboarding}
                disabled={loading || !signature.trim()}
                className="btn-primary"
                style={{
                  flex: 2,
                  padding: '1rem',
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)',
                  boxShadow: '0 6px 24px rgba(0,212,255,0.4)',
                  opacity: !signature.trim() ? 0.6 : 1
                }}
              >
                {loading ? 'Sealing Arc...' : '⚡ Seal Arc & Begin'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
