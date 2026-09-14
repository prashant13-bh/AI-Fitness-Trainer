'use client';

import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';

type ChatMessage = { role: 'user' | 'ai'; text: string; timestamp: Date };

const PLAN_DAYS = [
  {
    day: 'Monday', emoji: '💪',
    workout: { name: 'Power Push Day', duration: 45, calories: 280 },
    meals: [
      { meal: 'Breakfast', name: 'Oats + Protein Shake', cals: 420, protein: 32 },
      { meal: 'Lunch', name: 'Chicken Rice Bowl', cals: 550, protein: 45 },
      { meal: 'Dinner', name: 'Salmon + Broccoli', cals: 480, protein: 38 },
    ],
    aiTip: 'Push day! Focus on chest and shoulder activation in your warm-up.',
    isRestDay: false,
  },
  {
    day: 'Tuesday', emoji: '🧘',
    workout: null,
    meals: [
      { meal: 'Breakfast', name: 'Greek Yogurt Parfait', cals: 320, protein: 22 },
      { meal: 'Lunch', name: 'Quinoa Salad', cals: 420, protein: 18 },
      { meal: 'Dinner', name: 'Veggie Stir Fry + Eggs', cals: 380, protein: 25 },
    ],
    aiTip: 'Active recovery day. Try 20 min yoga or a walk.',
    isRestDay: true,
  },
  {
    day: 'Wednesday', emoji: '⚡',
    workout: { name: 'HIIT Storm', duration: 20, calories: 350 },
    meals: [
      { meal: 'Breakfast', name: 'Banana + Eggs', cals: 380, protein: 28 },
      { meal: 'Lunch', name: 'Tuna Wrap', cals: 490, protein: 42 },
      { meal: 'Dinner', name: 'Ground Turkey + Sweet Potato', cals: 520, protein: 40 },
    ],
    aiTip: 'HIIT day! Eat 30g carbs 1 hour before for peak energy.',
    isRestDay: false,
  },
  {
    day: 'Thursday', emoji: '🔥',
    workout: { name: 'Leg Day Blaster', duration: 40, calories: 300 },
    meals: [
      { meal: 'Breakfast', name: 'Whey Shake + Oats', cals: 440, protein: 35 },
      { meal: 'Lunch', name: 'Brown Rice + Chicken', cals: 560, protein: 48 },
      { meal: 'Dinner', name: 'Beef + Vegetables', cals: 500, protein: 42 },
    ],
    aiTip: 'Leg day! Stay hydrated — legs need extra blood flow.',
    isRestDay: false,
  },
  {
    day: 'Friday', emoji: '🧱',
    workout: { name: 'Core Crusher', duration: 25, calories: 180 },
    meals: [
      { meal: 'Breakfast', name: 'Avocado Toast + Eggs', cals: 400, protein: 24 },
      { meal: 'Lunch', name: 'Salmon Salad', cals: 460, protein: 38 },
      { meal: 'Dinner', name: 'Chicken Curry + Rice', cals: 540, protein: 44 },
    ],
    aiTip: 'Core day! Breathe properly — exhale on the effort.',
    isRestDay: false,
  },
  {
    day: 'Saturday', emoji: '🚀',
    workout: { name: 'Winter Arch Full Body', duration: 50, calories: 400 },
    meals: [
      { meal: 'Breakfast', name: 'Pancakes + Protein', cals: 480, protein: 30 },
      { meal: 'Lunch', name: 'Buddha Bowl', cals: 520, protein: 28 },
      { meal: 'Dinner', name: 'Steak + Roasted Veggies', cals: 580, protein: 50 },
    ],
    aiTip: 'Saturday is for your main challenge workout. Go all out!',
    isRestDay: false,
  },
  {
    day: 'Sunday', emoji: '😴',
    workout: null,
    meals: [
      { meal: 'Breakfast', name: 'Smoothie Bowl', cals: 340, protein: 18 },
      { meal: 'Lunch', name: 'Light Sandwich', cals: 380, protein: 22 },
      { meal: 'Dinner', name: 'Soup + Whole Grain Bread', cals: 350, protein: 16 },
    ],
    aiTip: 'Rest and recover. Sleep 8+ hours to maximize gains.',
    isRestDay: true,
  },
];

const STARTER_MESSAGES: ChatMessage[] = [
  { role: 'ai', text: "Hey! I'm your Winter Arch AI Coach 🤖❄️\n\nI can help you:\n• Generate personalized workout plans\n• Suggest meals based on your goals\n• Answer fitness & nutrition questions\n• Adjust your plan based on progress\n\nWhat would you like to work on today?", timestamp: new Date() }
];

const AI_RESPONSES: Record<string, string> = {
  default: "Great question! Based on your profile, I recommend focusing on progressive overload this week. Increase your workout intensity by 10% and ensure you're hitting 1.6-2g of protein per kg of body weight. Remember, consistency beats perfection — even a 20-minute workout is better than none! 💪",
  plan: "Your Winter Arch weekly plan is already optimized for your goals! I've scheduled 5 workout days with 2 rest days. The intensity progressively increases each week. For best results, don't skip Wednesday HIIT — it's your biggest calorie burn day! ❄️",
  meal: "For muscle building, aim for: Breakfast 400-480 kcal (focus on protein + slow carbs), Lunch 500-560 kcal (lean protein + complex carbs), Dinner 450-520 kcal (protein + vegetables, minimal carbs). Total: ~1800-2200 kcal/day with 150-170g protein. 🥗",
  rest: "Rest days are just as important as workout days! On rest days: do 20-30 min light walking or yoga, eat at maintenance calories, prioritize 8hr sleep, do foam rolling for recovery. Your muscles grow during rest, not during the workout! 😴",
};

export default function PlannerPage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generating, setGenerating] = useState(false);

  const day = PLAN_DAYS[selectedDay];

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date() }]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const lower = userMsg.toLowerCase();
    const response = lower.includes('plan') ? AI_RESPONSES.plan
      : lower.includes('meal') || lower.includes('food') || lower.includes('eat') ? AI_RESPONSES.meal
      : lower.includes('rest') || lower.includes('recover') ? AI_RESPONSES.rest
      : AI_RESPONSES.default;

    setMessages(prev => [...prev, { role: 'ai', text: response, timestamp: new Date() }]);
    setIsTyping(false);
  };

  const regeneratePlan = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    setGenerating(false);
  };

  const totalDayCalories = day.meals.reduce((s, m) => s + m.cals, 0);
  const totalDayProtein = day.meals.reduce((s, m) => s + m.protein, 0);

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100dvh' }}>
      <div className="page-content" style={{ paddingTop: '1.25rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }} className="animate-fadeInUp">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI-Powered Co-Pilot</p>
          <h1 className="font-display" style={{ fontSize: '1.7rem', fontWeight: 900 }}>
            <span className="gradient-text">Weekly Plan & AI Coach</span>
          </h1>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="desktop-grid-split">
          {/* Left Column: 7-Day Plan Details */}
          <div>
            {/* Generate button */}
            <div style={{ marginBottom: '1rem' }}>
              <button onClick={regeneratePlan} style={{
                width: '100%', padding: '0.875rem', borderRadius: '14px',
                background: generating ? 'rgba(0,212,255,0.05)' : 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(123,47,190,0.12))',
                border: '1px solid rgba(0,212,255,0.25)', color: 'var(--ice-blue)',
                fontFamily: 'var(--font-display)', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.3s',
              }}>
                {generating ? '⏳ Generating your optimized 7-day schedule...' : '🤖 Regenerate 7-Day Plan with Gemini AI'}
              </button>
            </div>

            {/* Day Selector Chips */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
              {PLAN_DAYS.map((d, i) => (
                <button key={i} onClick={() => setSelectedDay(i)} style={{
                  flexShrink: 0, padding: '0.5rem 0.875rem', borderRadius: '12px',
                  border: `1.5px solid ${selectedDay === i ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  background: selectedDay === i ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.02)',
                  color: selectedDay === i ? 'var(--ice-blue)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  <div>{d.emoji}</div>
                  <div style={{ fontSize: '0.65rem', marginTop: '0.15rem' }}>{d.day.slice(0,3)}</div>
                </button>
              ))}
            </div>

            {/* Day Detail Cards */}
            <div className="animate-scaleIn">
              {/* Workout Card */}
              <div style={{ marginBottom: '1rem' }}>
                <div className="section-title" style={{ marginBottom: '0.5rem' }}>Workout Schedule</div>
                {day.isRestDay || !day.workout ? (
                  <div className="glass-card" style={{ padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>😴</span>
                    <div>
                      <div className="font-display" style={{ fontWeight: 700, color: '#10B981' }}>Rest & Recovery Day</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>20 min light walk or stretching recommended</div>
                    </div>
                  </div>
                ) : (
                  <Link href="/workout" style={{ textDecoration: 'none' }}>
                    <div className="glass-card-primary" style={{ padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>💪</span>
                      <div style={{ flex: 1 }}>
                        <div className="font-display" style={{ fontWeight: 700 }}>{day.workout.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          ⏱ {day.workout.duration}min · 🔥 {day.workout.calories}cal
                        </div>
                      </div>
                      <div style={{ color: 'var(--ice-blue)' }}>▶</div>
                    </div>
                  </Link>
                )}
              </div>

              {/* AI Tip */}
              <div className="glass-card" style={{ padding: '0.875rem 1rem', borderRadius: '16px', marginBottom: '1rem', border: '1px solid rgba(0,212,255,0.1)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.1rem' }}>🤖</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>{day.aiTip}</p>
                </div>
              </div>

              {/* Meals */}
              <div className="section-title" style={{ marginBottom: '0.5rem' }}>Meal Plan & Nutrition</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
                {day.meals.map((m, i) => (
                  <div key={i} className="glass-card" style={{ padding: '0.875rem 1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.meal}</div>
                      <div className="font-display" style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.15rem' }}>{m.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FF6B35' }}>{m.cals} kcal</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.protein}g protein</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Day Totals */}
              <div className="glass-card-primary" style={{ padding: '1rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FF6B35' }}>{totalDayCalories}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL KCAL</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00D4FF' }}>{totalDayProtein}g</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROTEIN</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10B981' }}>{day.workout?.calories || 0}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>CAL BURNED</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Coach Chat Assistant */}
          <div>
            <div className="section-title" style={{ marginBottom: '0.5rem' }}>Ask AI Coach</div>
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '560px', border: '1px solid rgba(0,212,255,0.15)' }}>
              {/* Chat Messages */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.875rem', paddingRight: '0.25rem' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.role === 'ai' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>🤖</div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Winter Arch AI</span>
                      </div>
                    )}
                    <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}
                      style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', lineHeight: 1.55 }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #00D4FF, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>🤖</div>
                    <div className="chat-bubble-ai" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '0.75rem 1rem' }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ice-blue)', animation: `pulse-glow 1s ${i*0.2}s infinite` }} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompts */}
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', padding: '0.75rem 0 0.5rem', scrollbarWidth: 'none', flexShrink: 0 }}>
                {['Adjust plan', 'High protein meals', 'Recovery tips'].map(q => (
                  <button key={q} onClick={() => setInput(q)}
                    style={{ flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.05)', color: 'var(--ice-blue)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginTop: '0.25rem' }}>
                <input className="input-field" style={{ flex: 1, borderRadius: '14px', fontSize: '0.85rem' }} placeholder="Ask AI coach..." value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                <button onClick={sendMessage} disabled={!input.trim() || isTyping}
                  style={{ width: '42px', height: '42px', borderRadius: '14px', background: input.trim() ? 'linear-gradient(135deg, #00D4FF, #7B2FBE)' : 'rgba(255,255,255,0.05)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', fontSize: '1rem', transition: 'all 0.3s', flexShrink: 0 }}>
                  ↑
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
