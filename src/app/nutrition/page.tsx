'use client';

import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import { FOOD_DATABASE } from '@/lib/data';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

type LoggedItem = {
  id: string;
  meal: MealType;
  name: string;
  emoji: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  qty: number;
};

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_ICONS: Record<MealType, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

const INITIAL_LOG: LoggedItem[] = [
  { id: '1', meal: 'breakfast', name: 'Rolled Oats', emoji: '🌾', calories: 150, protein: 5, carbs: 27, fat: 2.5, qty: 1 },
  { id: '2', meal: 'breakfast', name: 'Whole Egg', emoji: '🥚', calories: 156, protein: 12, carbs: 1.2, fat: 10, qty: 2 },
  { id: '3', meal: 'lunch', name: 'Chicken Breast', emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, qty: 1 },
  { id: '4', meal: 'lunch', name: 'Brown Rice', emoji: '🍚', calories: 216, protein: 5, carbs: 45, fat: 1.8, qty: 1 },
];

export default function NutritionPage() {
  const [log, setLog] = useState<LoggedItem[]>(INITIAL_LOG);
  const [water, setWater] = useState(5); // glasses (250ml each)
  const [showAdd, setShowAdd] = useState(false);
  const [addMeal, setAddMeal] = useState<MealType>('breakfast');
  const [search, setSearch] = useState('');

  const waterGoal = 8; // glasses
  const calorieGoal = 2200;
  const proteinGoal = 160;
  const carbsGoal = 220;
  const fatGoal = 65;

  const totalCalories = log.reduce((s, i) => s + i.calories * i.qty, 0);
  const totalProtein = log.reduce((s, i) => s + i.protein * i.qty, 0);
  const totalCarbs = log.reduce((s, i) => s + i.carbs * i.qty, 0);
  const totalFat = log.reduce((s, i) => s + i.fat * i.qty, 0);

  const remaining = calorieGoal - totalCalories;

  const addFood = (food: typeof FOOD_DATABASE[0]) => {
    const item: LoggedItem = {
      id: Date.now().toString(),
      meal: addMeal,
      name: food.name,
      emoji: food.emoji,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      qty: 1,
    };
    setLog(prev => [...prev, item]);
    setShowAdd(false);
    setSearch('');
  };

  const removeItem = (id: string) => setLog(prev => prev.filter(i => i.id !== id));

  const filteredFoods = FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const MacroBar = ({ value, goal, color, label }: { value: number; goal: number; color: string; label: string }) => (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
        <span className="font-mono" style={{ fontSize: '0.7rem', color }}>{Math.round(value)}g</span>
      </div>
      <div className="macro-bar">
        <div className="macro-fill" style={{ width: `${Math.min(100, (value/goal)*100)}%`, background: color }} />
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Today's</p>
            <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
              <span className="gradient-text">Nutrition</span>
            </h1>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-icon" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', gap: '0.35rem', borderRadius: '12px' }}>
            + Log Food
          </button>
        </div>

        {/* Calorie Ring */}
        <div className="glass-card-primary animate-fadeInUp delay-100" style={{ padding: '1.25rem', borderRadius: '20px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {(() => {
              const size = 90, stroke = 10, r = (size-stroke)/2, circ = 2*Math.PI*r;
              const pct = Math.min(100, (totalCalories/calorieGoal)*100);
              const offset = circ * (1 - pct/100);
              return (
                <svg width={size} height={size}>
                  <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,107,53,0.1)" strokeWidth={stroke}/>
                  <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#FF6B35" strokeWidth={stroke}
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                    style={{transform:'rotate(-90deg)',transformOrigin:'50% 50%',transition:'stroke-dashoffset 1s ease'}}/>
                </svg>
              );
            })()}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: '#FF6B35', lineHeight: 1 }}>{totalCalories}</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>kcal</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#FF6B35' }}>{totalCalories}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Eaten</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: remaining > 0 ? '#10B981' : '#EF4444' }}>{Math.abs(remaining)}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{remaining > 0 ? 'Left' : 'Over'}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{calorieGoal}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Goal</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <MacroBar value={totalProtein} goal={proteinGoal} color="#00D4FF" label="Protein" />
              <MacroBar value={totalCarbs} goal={carbsGoal} color="#7B2FBE" label="Carbs" />
              <MacroBar value={totalFat} goal={fatGoal} color="#F59E0B" label="Fat" />
            </div>
          </div>
        </div>

        {/* Water Tracker */}
        <div className="glass-card animate-fadeInUp delay-200" style={{ padding: '1rem 1.25rem', borderRadius: '18px', marginBottom: '1.25rem', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>💧</span>
              <span className="font-display" style={{ fontWeight: 700 }}>Water Intake</span>
            </div>
            <span className="font-mono" style={{ color: 'var(--ice-blue)', fontSize: '0.9rem', fontWeight: 700 }}>{water}/{waterGoal} glasses</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {Array.from({ length: waterGoal }, (_, i) => (
              <div key={i} onClick={() => setWater(i + 1)} style={{
                flex: 1, height: '32px', borderRadius: '8px', cursor: 'pointer',
                background: i < water ? 'linear-gradient(180deg, rgba(0,212,255,0.8), rgba(0,212,255,0.4))' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${i < water ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.05)'}`,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setWater(Math.max(0, water-1))} className="btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>− Remove</button>
            <button onClick={() => setWater(Math.min(waterGoal, water+1))} className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>+ Add Glass</button>
          </div>
        </div>

        {/* Meal Log */}
        {MEAL_ORDER.map(meal => {
          const mealItems = log.filter(i => i.meal === meal);
          if (mealItems.length === 0) return null;
          const mealCals = mealItems.reduce((s, i) => s + i.calories * i.qty, 0);
          return (
            <div key={meal} style={{ marginBottom: '1rem' }} className="animate-fadeInUp delay-300">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>{MEAL_ICONS[meal]}</span>
                  <span className="font-display" style={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '0.95rem' }}>{meal}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="font-mono" style={{ fontSize: '0.8rem', color: '#FF6B35' }}>{mealCals} kcal</span>
                  <button onClick={() => { setAddMeal(meal); setShowAdd(true); }} style={{ background: 'rgba(0,212,255,0.1)', border: 'none', borderRadius: '8px', color: 'var(--ice-blue)', fontSize: '0.75rem', padding: '0.2rem 0.5rem', cursor: 'pointer' }}>+ Add</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {mealItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '1.1rem' }}>{item.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div className="font-display" style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>P:{item.protein}g C:{item.carbs}g F:{item.fat}g</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="font-mono" style={{ fontSize: '0.85rem', color: '#FF6B35', fontWeight: 700 }}>{item.calories * item.qty} kcal</div>
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.5)', cursor: 'pointer', fontSize: '0.9rem', padding: '0.25rem' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Add first item CTA */}
        {log.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🥗</div>
            <div className="font-display" style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Start Logging</div>
            <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Track your meals to reach your goals</div>
            <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Log First Meal</button>
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '430px', margin: '0 auto', background: 'var(--bg-surface)', borderRadius: '28px 28px 0 0', padding: '1.5rem', maxHeight: '80dvh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.08)' }} className="animate-fadeInUp">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div className="font-display" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Add Food</div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {MEAL_ORDER.map(m => (
                  <button key={m} onClick={() => setAddMeal(m)} style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', border: `1px solid ${addMeal === m ? 'rgba(0,212,255,0.4)' : 'transparent'}`, background: addMeal === m ? 'rgba(0,212,255,0.1)' : 'transparent', color: addMeal === m ? 'var(--ice-blue)' : 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                    {MEAL_ICONS[m]}
                  </button>
                ))}
              </div>
            </div>
            <input className="input-field" placeholder="Search food..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: '0.75rem' }} />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredFoods.map(food => (
                <div key={food.id} onClick={() => addFood(food)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '1.25rem' }}>{food.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{food.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{food.serving} · P:{food.protein}g C:{food.carbs}g F:{food.fat}g</div>
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FF6B35' }}>{food.calories}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

