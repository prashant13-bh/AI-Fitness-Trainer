'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, FitnessGoal, FitnessLevel, DietPreference } from '@/lib/types';

const STEPS = 4;

const GOALS: { value: FitnessGoal; label: string; emoji: string; desc: string }[] = [
  { value: 'lose-weight', label: 'Lose Weight', emoji: '🔥', desc: 'Burn fat and slim down' },
  { value: 'build-muscle', label: 'Build Muscle', emoji: '💪', desc: 'Gain strength and size' },
  { value: 'get-fit', label: 'Get Fit', emoji: '⚡', desc: 'Overall health & fitness' },
  { value: 'increase-strength', label: 'Get Stronger', emoji: '🏋️', desc: 'Increase max strength' },
  { value: 'improve-endurance', label: 'Endurance', emoji: '🏃', desc: 'Run farther, longer' },
];

const LEVELS: { value: FitnessLevel; label: string; emoji: string; desc: string }[] = [
  { value: 'beginner', label: 'Beginner', emoji: '🌱', desc: 'Just starting out' },
  { value: 'intermediate', label: 'Intermediate', emoji: '💡', desc: '1-3 years experience' },
  { value: 'advanced', label: 'Advanced', emoji: '🚀', desc: '3+ years, serious athlete' },
];

const DIETS: { value: DietPreference; label: string; emoji: string }[] = [
  { value: 'standard', label: 'Anything', emoji: '🍽️' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'keto', label: 'Keto', emoji: '🥩' },
  { value: 'paleo', label: 'Paleo', emoji: '🍖' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { saveProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    goal: 'get-fit',
    fitnessLevel: 'beginner',
    dietPreference: 'standard',
    daysPerWeek: 4,
    gender: 'male',
  });

  const next = () => setStep(s => Math.min(s + 1, STEPS - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const finish = async () => {
    setLoading(true);
    try {
      await saveProfile(profile as UserProfile);
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg, #060A14 0%, #0A0E1A 100%)' }}>
      <div style={{ maxWidth: '430px', margin: '0 auto', padding: '1.5rem', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', paddingTop: '2rem', marginBottom: '2rem' }}>
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="animate-fadeInUp">
          {/* STEP 0: Goal */}
          {step === 0 && (
            <div>
              <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                What's your <span className="gradient-text">goal?</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                We'll personalize everything for you
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {GOALS.map(g => (
                  <div
                    key={g.value}
                    onClick={() => setProfile(p => ({ ...p, goal: g.value }))}
                    style={{
                      padding: '1rem 1.25rem',
                      border: `1.5px solid ${profile.goal === g.value ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '16px',
                      background: profile.goal === g.value ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{g.emoji}</span>
                    <div>
                      <div className="font-display" style={{ fontWeight: 700, color: profile.goal === g.value ? 'var(--ice-blue)' : 'white' }}>{g.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{g.desc}</div>
                    </div>
                    {profile.goal === g.value && <span style={{ marginLeft: 'auto', color: 'var(--ice-blue)' }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Fitness Level */}
          {step === 1 && (
            <div>
              <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Your <span className="gradient-text">fitness level</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Be honest — we'll adapt to you over time
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {LEVELS.map(l => (
                  <div
                    key={l.value}
                    onClick={() => setProfile(p => ({ ...p, fitnessLevel: l.value }))}
                    style={{
                      padding: '1.25rem',
                      border: `1.5px solid ${profile.fitnessLevel === l.value ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '16px',
                      background: profile.fitnessLevel === l.value ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{l.emoji}</span>
                    <div>
                      <div className="font-display" style={{ fontWeight: 700, color: profile.fitnessLevel === l.value ? 'var(--ice-blue)' : 'white', fontSize: '1.05rem' }}>{l.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{l.desc}</div>
                    </div>
                    {profile.fitnessLevel === l.value && <span style={{ marginLeft: 'auto', color: 'var(--ice-blue)', fontSize: '1.25rem' }}>✓</span>}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label className="input-label">Workout days per week</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {[2, 3, 4, 5, 6].map(d => (
                    <button
                      key={d}
                      onClick={() => setProfile(p => ({ ...p, daysPerWeek: d }))}
                      style={{
                        flex: 1, padding: '0.75rem', borderRadius: '12px',
                        border: `1.5px solid ${profile.daysPerWeek === d ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                        background: profile.daysPerWeek === d ? 'rgba(0,212,255,0.1)' : 'transparent',
                        color: profile.daysPerWeek === d ? 'var(--ice-blue)' : 'var(--text-secondary)',
                        fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Body Stats */}
          {step === 2 && (
            <div>
              <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Your <span className="gradient-text">body stats</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Used only to personalize your AI plans
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="input-label">Gender</label>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {[{v:'male', e:'♂️', l:'Male'},{v:'female', e:'♀️', l:'Female'},{v:'other', e:'⚧', l:'Other'}].map(g => (
                      <button
                        key={g.v}
                        onClick={() => setProfile(p => ({ ...p, gender: g.v as any }))}
                        style={{
                          flex: 1, padding: '0.75rem 0.5rem', borderRadius: '12px',
                          border: `1.5px solid ${profile.gender === g.v ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                          background: profile.gender === g.v ? 'rgba(0,212,255,0.1)' : 'transparent',
                          color: profile.gender === g.v ? 'var(--ice-blue)' : 'var(--text-secondary)',
                          fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                          fontFamily: 'var(--font-display)',
                        }}
                      >{g.e} {g.l}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="input-label">Age</label>
                    <input type="number" className="input-field" placeholder="25" min={12} max={99}
                      value={profile.age || ''}
                      onChange={e => setProfile(p => ({ ...p, age: +e.target.value }))} />
                  </div>
                  <div>
                    <label className="input-label">Height (cm)</label>
                    <input type="number" className="input-field" placeholder="175" min={100} max={250}
                      value={profile.height || ''}
                      onChange={e => setProfile(p => ({ ...p, height: +e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="input-label">Current Weight (kg)</label>
                  <input type="number" className="input-field" placeholder="75" min={30} max={300}
                    value={profile.weight || ''}
                    onChange={e => setProfile(p => ({ ...p, weight: +e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Diet */}
          {step === 3 && (
            <div>
              <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Diet <span className="gradient-text">preference</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                So we can generate the right meal plans for you
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                {DIETS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => setProfile(p => ({ ...p, dietPreference: d.value }))}
                    className={`select-chip ${profile.dietPreference === d.value ? 'selected' : ''}`}
                    style={{ fontSize: '0.9rem' }}
                  >
                    {d.emoji} {d.label}
                  </button>
                ))}
              </div>

              {/* Done summary */}
              <div className="glass-card-primary" style={{ padding: '1.25rem', borderRadius: '20px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
                <div className="font-display" style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>You're all set!</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Your AI trainer is ready to transform you. The Winter Arch challenge awaits!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '2rem', marginTop: '1.5rem' }}>
          {step > 0 && (
            <button className="btn-secondary" onClick={prev} style={{ flex: '0 0 auto', width: '120px' }}>
              ← Back
            </button>
          )}
          {step < STEPS - 1 ? (
            <button className="btn-primary" onClick={next} style={{ flex: 1 }}>
              Continue →
            </button>
          ) : (
            <button className="btn-primary" onClick={finish} disabled={loading} style={{ flex: 1, opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Setting up...' : '🚀 Let\'s Go!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
