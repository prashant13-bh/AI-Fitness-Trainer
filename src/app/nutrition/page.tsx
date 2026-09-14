'use client';

import { useState } from 'react';
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
  const [water, setWater] = useState(5);
  const [showAdd, setShowAdd] = useState(false);
  const [addMeal, setAddMeal] = useState<MealType>('breakfast');
  const [search, setSearch] = useState('');

  const waterGoal = 8;
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
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Fuel</p>
            <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
              <span className="gradient-text">Nutrition & Water</span>
            </h1>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-icon" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', gap: '0.35rem', borderRadius: '12px' }}>
            + Log Food
          </button>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="desktop-grid-split">
          {/* Left Column: Meal Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fadeInUp delay-100">
            <div className="section-title">Today&apos;s Meals</div>
            {MEAL_ORDER.map(mType => {
              const items = log.filter(i => i.meal === mType);
              const mealCals = items.reduce((s, i) => s + i.calories * i.qty, 0);
              return (
                <div key={mType} className="glass-card" style={{ padding: '1rem 1.25rem', borderRadius: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{MEAL_ICONS[mType]}</span>
                      <span className="font-display" style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'capitalize' }}>{mType}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="font-mono" style={{ fontSize: '0.85rem', color: '#FF6B35', fontWeight: 700 }}>{mealCals} kcal</span>
                      <button onClick={() => { setAddMeal(mType); setShowAdd(true); }}
                        style={{ background: 'rgba(0,212,255,0.1)', border: 'none', color: 'var(--ice-blue)', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>
                        +
                      </button>
                    </div>
                  </div>

                  {items.length === 0 ? (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.25rem 0' }}>Nothing logged yet</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                          <span style={{ fontSize: '1.1rem' }}>{item.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div className="font-display" style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>P: {item.protein * item.qty}g · C: {item.carbs * item.qty}g · F: {item.fat * item.qty}g</div>
                          </div>
                          <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.calories * item.qty} kcal</span>
                          <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 0.25rem' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Calories Overview & Hydration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeInUp delay-200">
            {/* Calories Overview */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 900, color: remaining >= 0 ? '#00D4FF' : '#EF4444', lineHeight: 1 }}>
                    {Math.abs(remaining)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>
                    {remaining >= 0 ? 'Kcal Remaining' : 'Kcal Over Goal'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FF6B35' }}>{totalCalories}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>of {calorieGoal} kcal</div>
                </div>
              </div>

              {/* Macros Bars */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <MacroBar value={totalProtein} goal={proteinGoal} color="#00D4FF" label="PROTEIN" />
                <MacroBar value={totalCarbs} goal={carbsGoal} color="#7B2FBE" label="CARBS" />
                <MacroBar value={totalFat} goal={fatGoal} color="#F59E0B" label="FAT" />
              </div>
            </div>

            {/* Hydration Tracker */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(0,212,255,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>💧</span>
                  <div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: '0.95rem' }}>Hydration Tracker</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{water * 250}ml / {waterGoal * 250}ml</div>
                  </div>
                </div>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00D4FF' }}>
                  {water}/{waterGoal}
                </div>
              </div>

              {/* Water Glasses */}
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between', marginBottom: '1rem' }}>
                {Array.from({ length: waterGoal }).map((_, i) => (
                  <button key={i} onClick={() => setWater(i + 1)}
                    style={{
                      flex: 1, height: '38px', borderRadius: '10px',
                      background: i < water ? 'linear-gradient(180deg, #00D4FF 0%, #0077FF 100%)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${i < water ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
                    }}>
                    {i < water ? '💧' : ''}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secondary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => setWater(p => Math.max(0, p - 1))}>- 250ml</button>
                <button className="btn-primary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => setWater(p => Math.min(waterGoal, p + 1))}>+ 250ml</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Food Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-surface)', borderRadius: '24px', padding: '1.75rem', maxHeight: '80dvh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,212,255,0.15)' }} className="animate-scaleIn">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div className="font-display" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>Log Food to {addMeal}</div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
            </div>

            <input className="input-field" placeholder="Search food item..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: '1rem' }} />

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredFoods.map(f => (
                <div key={f.name} onClick={() => addFood(f)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '1.25rem' }}>{f.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: '0.88rem' }}>{f.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>P: {f.protein}g · C: {f.carbs}g · F: {f.fat}g</div>
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', color: '#FF6B35', fontWeight: 700 }}>{f.calories} kcal</div>
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
