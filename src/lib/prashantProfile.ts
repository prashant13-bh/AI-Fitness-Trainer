// ============================================================
// PRASHANT HIREMATH — Personal Glow-Up 2027 Profile
// Born: 13 August 2000 | Height: 167cm | Weight: 70kg
// Goal: Full Glow-Up by December 31, 2027
// ============================================================

export interface PhaseGoal {
  phase: string;
  period: string;
  bodyGoal: string;
  skinGoal: string;
  targetWeight: string;
  milestones: string[];
}

export interface RoutineTask {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'BODY' | 'SKIN' | 'MIND' | 'NUTRITION' | 'SLEEP';
  duration: string;
  isKeystone?: boolean;
  winterSpecific?: boolean;
}

export interface SkinProtocol {
  timeOfDay: 'AM' | 'PM';
  steps: {
    step: number;
    product: string;
    instruction: string;
    why: string;
  }[];
}

export const PRASHANT_PROFILE = {
  name: 'Prashant',
  trainingName: 'Bruce',          // Gym alias — used in all training contexts
  fullName: 'Prashant Hiremath',
  dob: '2000-08-13',
  height: 167, // cm
  currentWeight: 70, // kg
  targetWeight: 63, // kg (lean athletic)
  bodyType: 'Skinny Fat',
  skinIssues: ['Hyperpigmentation', 'Post-Acne Marks', 'Betnovate-N Recovery'],
  challengeStartDate: '2026-10-01', // Winter ARC starts Oct 1
  challengeEndDate: '2027-12-31',
  bmi: 25.1, // 70 / (1.67 * 1.67)
  peakWeight: 92, // kg (4 years ago)
  weightLost: 22, // kg already lost
  origin: 'North Karnataka',
  diet: 'Vegetarian',
};

// ── 2027 PHASE ROADMAP ──────────────────────────────────────
export const GLOW_UP_PHASES: PhaseGoal[] = [
  {
    phase: 'Phase 1 — Winter Arc Foundation',
    period: 'Oct 1 → Dec 31, 2026',
    bodyGoal: 'Recomposition: Lose 4–5 kg fat, build lean muscle base. Target: 65–66 kg.',
    skinGoal: 'Heal Betnovate-N damage, reduce hyperpigmentation 60%, clear active acne.',
    targetWeight: '65–66 kg',
    milestones: [
      'Stop all steroid-based creams completely ✅ Done',
      'Start consistent 5x/week workout (calisthenics + weights)',
      'Skin barrier repair — Ceramide + Niacinamide protocol',
      '3L water daily, no processed foods',
      '10PM sleep, 5:30AM wake-up',
    ],
  },
  {
    phase: 'Phase 2 — The Transformation',
    period: 'Jan 1 → Jun 30, 2027',
    bodyGoal: 'Cut to 63 kg lean, visible abs foundation, V-taper begins, jawline defined.',
    skinGoal: 'Hyperpigmentation 80% reduced. Even skin tone. Acne scars fading. Natural glow.',
    targetWeight: '63–64 kg',
    milestones: [
      'Consistent caloric deficit + high protein diet',
      'Add face yoga + gua sha for jawline definition',
      'Sunscreen 100% every single day (no exceptions)',
      'Introduce Vitamin C serum for pigmentation',
      'Posture correction — 2 cm height appearance boost',
    ],
  },
  {
    phase: 'Phase 3 — Glow-Up Complete',
    period: 'Jul 1 → Dec 31, 2027',
    bodyGoal: '63 kg lean athletic build. Abs visible at 15% body fat. Confident posture.',
    skinGoal: 'Natural radiant glow. Clear complexion. Scars gone. Zero acne. Glass skin.',
    targetWeight: '62–63 kg',
    milestones: [
      'Maintain lean physique with muscle',
      'Full glass skin routine locked in',
      'Before/After transformation documented',
      'Mental glow-up: confidence, discipline, vision',
      '🏆 THE PRASHANT GLOW-UP 2027 COMPLETE',
    ],
  },
];

// ── DAILY MORNING ROUTINE ────────────────────────────────────
export const MORNING_ROUTINE: RoutineTask[] = [
  {
    id: 'm1',
    time: '05:30',
    title: 'Wake Up — No Snooze Rule',
    description: 'Rise immediately. The discipline starts the moment the alarm goes. Drink 500ml water first thing.',
    category: 'MIND',
    duration: '5 min',
    isKeystone: true,
    winterSpecific: true,
  },
  {
    id: 'm2',
    time: '05:35',
    title: 'AM Skin Protocol (3 Steps)',
    description: 'Gentle Cleanser → Niacinamide Serum → Moisturizer + SPF 50. No touching face throughout the day.',
    category: 'SKIN',
    duration: '10 min',
    isKeystone: true,
  },
  {
    id: 'm3',
    time: '05:50',
    title: 'Cold Water Face Wash',
    description: 'Wash face with cold water only. Cold reduces inflammation & puffiness. Activates skin blood flow.',
    category: 'SKIN',
    duration: '5 min',
    winterSpecific: true,
  },
  {
    id: 'm4',
    time: '06:00',
    title: 'Morning Movement — Face Yoga + Posture',
    description: '5 min face yoga (jawline, cheekbone lifts) + 10 min posture stretching (opens chest, aligns spine).',
    category: 'BODY',
    duration: '15 min',
  },
  {
    id: 'm5',
    time: '06:20',
    title: 'Workout (Calisthenics + Compound Lifts)',
    description: 'Push-Pull-Legs rotation. 45-60 min. Focus: chest, back, shoulders for V-taper. Core every day.',
    category: 'BODY',
    duration: '45–60 min',
    isKeystone: true,
  },
  {
    id: 'm6',
    time: '07:20',
    title: 'High Protein Breakfast',
    description: '3-4 eggs + oats + banana. OR Greek yoghurt + nuts. Target: 40g protein minimum.',
    category: 'NUTRITION',
    duration: '20 min',
  },
  {
    id: 'm7',
    time: '07:45',
    title: 'Cold Shower (Post-Workout)',
    description: 'End shower with 60-90 sec cold. Boosts testosterone, reduces cortisol, tightens pores.',
    category: 'BODY',
    duration: '15 min',
    winterSpecific: true,
  },
];

// ── MIDDAY ROUTINE ───────────────────────────────────────────
export const MIDDAY_ROUTINE: RoutineTask[] = [
  {
    id: 'd1',
    time: '13:00',
    title: 'Healthy Lunch — High Protein',
    description: 'Dal + Rice + Vegetables (sabzi). OR Chicken + Roti + Salad. No fried food. Avoid sugar completely.',
    category: 'NUTRITION',
    duration: '30 min',
    isKeystone: true,
  },
  {
    id: 'd2',
    time: '13:30',
    title: '10-Min Walk After Lunch',
    description: 'Post-meal walk improves insulin sensitivity and burns extra fat. Non-negotiable.',
    category: 'BODY',
    duration: '10 min',
  },
  {
    id: 'd3',
    time: '15:00',
    title: 'Re-Apply Sunscreen (Outdoors)',
    description: 'If outside: re-apply SPF 50 PA+++ every 2 hours. Hyperpigmentation CANNOT heal without sun protection.',
    category: 'SKIN',
    duration: '2 min',
    isKeystone: true,
  },
  {
    id: 'd4',
    time: '16:00',
    title: 'Healthy Snack + Hydration Check',
    description: 'Fruit, nuts, or chana. Must have consumed at least 2L water by 4PM. Dehydration causes dull skin.',
    category: 'NUTRITION',
    duration: '10 min',
  },
];

// ── EVENING / NIGHT ROUTINE ──────────────────────────────────
export const EVENING_ROUTINE: RoutineTask[] = [
  {
    id: 'e1',
    time: '19:00',
    title: 'Light Dinner — No Carbs After 7PM',
    description: 'Sabji + Dal + Salad. OR 3-egg omelette. No rice/roti after 7PM — burns fat while you sleep.',
    category: 'NUTRITION',
    duration: '30 min',
    isKeystone: true,
  },
  {
    id: 'e2',
    time: '20:00',
    title: 'Evening Walk — 30 Minutes',
    description: '30-min brisk walk after dinner. This alone burns 150–200 extra calories daily. Critical for fat loss.',
    category: 'BODY',
    duration: '30 min',
  },
  {
    id: 'e3',
    time: '21:00',
    title: 'PM Skin Protocol (5 Steps — Healing Mode)',
    description: 'Double Cleanse → Niacinamide → Vitamin C Serum → Retinol (2-3x/week) → Heavy Moisturizer.',
    category: 'SKIN',
    duration: '15 min',
    isKeystone: true,
  },
  {
    id: 'e4',
    time: '21:30',
    title: 'Gua Sha + Jade Roller',
    description: '5 min gua sha (jawline, lymphatic drainage) + 3 min jade roller. Reduces puffiness, defines jaw.',
    category: 'SKIN',
    duration: '8 min',
  },
  {
    id: 'e5',
    time: '21:45',
    title: 'Screen-Free Wind Down',
    description: 'No phone after 9:45 PM. Read, journal, or breathe. Phone light destroys skin repair hormones (melatonin).',
    category: 'MIND',
    duration: '30 min',
    isKeystone: true,
  },
  {
    id: 'e6',
    time: '22:00',
    title: 'Sleep — 7.5–8 Hours',
    description: '80% of skin repair happens between 10PM–2AM (growth hormone peak). Sleep is your BEST skincare.',
    category: 'SLEEP',
    duration: '7.5–8 hrs',
    isKeystone: true,
  },
];

// ── SKIN PROTOCOL ────────────────────────────────────────────
export const AM_SKIN_PROTOCOL: SkinProtocol = {
  timeOfDay: 'AM',
  steps: [
    {
      step: 1,
      product: 'Gentle Cleanser (CeraVe / Cetaphil)',
      instruction: 'Use lukewarm water, gentle circular motion. Pat dry — never rub.',
      why: 'Removes overnight oil without stripping the damaged skin barrier.',
    },
    {
      step: 2,
      product: 'Niacinamide 10% Serum (Minimalist / The Ordinary)',
      instruction: '3-4 drops, tap lightly on face. Focus on dark spots.',
      why: 'Reduces hyperpigmentation, controls oil, strengthens barrier damaged by Betnovate-N.',
    },
    {
      step: 3,
      product: 'Lightweight Moisturizer (CeraVe PM Lotion)',
      instruction: 'Apply while skin is slightly damp for better absorption.',
      why: 'Ceramides rebuild the skin barrier destroyed by steroids.',
    },
    {
      step: 4,
      product: 'Sunscreen SPF 50 PA+++ (Anessa / Minimalist)',
      instruction: 'Generous amount. 2 finger-length rule. Cover ears and neck too.',
      why: 'WITHOUT sunscreen, hyperpigmentation CANNOT fade. This is the most important step.',
    },
  ],
};

export const PM_SKIN_PROTOCOL: SkinProtocol = {
  timeOfDay: 'PM',
  steps: [
    {
      step: 1,
      product: 'Oil Cleanser (Banila Co / Kiehl\'s) — If Sunscreen Used',
      instruction: 'Massage on dry face, emulsify with water, rinse.',
      why: 'Removes sunscreen/SPF completely before actives.',
    },
    {
      step: 2,
      product: 'Gentle Cleanser (CeraVe Foaming)',
      instruction: 'Second cleanse. Lukewarm water. Clean canvas for actives.',
      why: 'Double cleanse ensures no SPF residue blocks nighttime serums.',
    },
    {
      step: 3,
      product: 'Niacinamide 10% Serum',
      instruction: 'Same as AM. Focus on dark spots.',
      why: 'Niacinamide works day and night for faster pigmentation reduction.',
    },
    {
      step: 4,
      product: 'Vitamin C Serum 10-15% (Minimalist / Mamaearth C)',
      instruction: 'Apply after niacinamide. Start 3x/week, work up to daily.',
      why: 'Brightens skin, fades dark spots, boosts collagen damaged by Betnovate-N.',
    },
    {
      step: 5,
      product: 'Retinol 0.1–0.2% (Minimalist — start low) — 2-3x/week ONLY',
      instruction: 'Pea-sized amount. ONLY 2-3 nights per week. Skip if skin is irritated.',
      why: 'Speeds cell turnover, fades acne scars, prevents new acne. Start low to avoid purging.',
    },
    {
      step: 6,
      product: 'Heavy Moisturizer (Vaseline / CeraVe Healing Ointment)',
      instruction: 'Seal everything in. Heavy layer OK at night — you\'re sleeping.',
      why: 'Skin repair overnight requires maximum hydration and barrier sealing.',
    },
  ],
};

// ── WORKOUT PLAN (weekly) ─────────────────────────────────────
export const WEEKLY_WORKOUT = [
  { day: 'Monday', focus: 'Push (Chest + Shoulders + Triceps)', exercises: ['Push-ups 4x15', 'Pike Push-ups 3x12', 'Dumbbell Chest Press 4x12', 'Lateral Raises 3x15', 'Tricep Dips 3x12'], intensity: 'HIGH' },
  { day: 'Tuesday', focus: 'Pull (Back + Biceps)', exercises: ['Pull-ups / Assisted Pull-ups 4x8', 'Dumbbell Row 4x12', 'Face Pulls 3x15', 'Bicep Curls 4x12', 'Lat Pulldown 3x12'], intensity: 'HIGH' },
  { day: 'Wednesday', focus: 'Legs + Core (FAT BURN)', exercises: ['Squats 4x15', 'Lunges 3x12 each', 'Glute Bridge 3x20', 'Plank 3x60sec', 'Mountain Climbers 3x30'], intensity: 'HIGH' },
  { day: 'Thursday', focus: 'Push (Variation)', exercises: ['Incline Push-ups 4x15', 'Arnold Press 4x12', 'Cable Fly / Chest Fly 3x15', 'Overhead Press 4x12', 'Skull Crushers 3x12'], intensity: 'MODERATE' },
  { day: 'Friday', focus: 'Pull + Core (FAT BURN)', exercises: ['Chin-ups 4x8', 'T-Bar Row 4x12', 'Hammer Curls 3x12', 'Reverse Fly 3x15', 'Hanging Leg Raises 4x12'], intensity: 'HIGH' },
  { day: 'Saturday', focus: 'Full Body HIIT (Maximum Fat Burn)', exercises: ['Burpees 3x15', 'Jump Squats 3x20', 'Push-up to Row 3x12', 'Sprint Intervals 5x30sec', 'Bear Crawl 3x20m'], intensity: 'MAX' },
  { day: 'Sunday', focus: 'Active Recovery', exercises: ['30-min Walk', '20-min Stretching', '10-min Face Yoga', 'Gua Sha + Jade Roller', 'Meal Prep for the week'], intensity: 'LOW' },
];

// ── NUTRITION RULES ──────────────────────────────────────────
export const NUTRITION_RULES = [
  { rule: 'Protein Target', value: '120–140g/day', why: 'Preserves muscle while burning fat. Minimum 1.8g/kg body weight.' },
  { rule: 'Water Intake', value: '3–3.5 Liters/day', why: 'Dehydration = dull skin + bloating. Track every glass.' },
  { rule: 'Caloric Deficit', value: '300–400 kcal below maintenance', why: 'Slow cut preserves muscle. Target ~1750–1900 kcal/day.' },
  { rule: 'No Sugar Policy', value: 'Zero refined sugar', why: 'Sugar causes insulin spikes → more acne → slower skin healing.' },
  { rule: 'No Processed Food', value: 'Home-cooked preferred', why: 'Seed oils, additives worsen skin inflammation.' },
  { rule: 'Carbs Timing', value: 'Only before/after workout', why: 'Carbs at night = fat storage. Evening meal = protein + veggies only.' },
  { rule: 'Skin Foods', value: 'Eggs, Fish, Nuts, Berries, Greens', why: 'Vitamin C, E, Zinc, Omega-3 = skin glow from inside.' },
];

// ── REMINDER SCHEDULE ─────────────────────────────────────────
export const REMINDER_SCHEDULE = [
  { id: 'r1', time: '05:30', label: '⏰ WAKE UP — Rise & Shine Prashant!', type: 'morning' },
  { id: 'r2', time: '05:35', label: '🧴 AM Skin Routine Time', type: 'skin' },
  { id: 'r3', time: '06:20', label: '💪 WORKOUT TIME — No excuses!', type: 'workout' },
  { id: 'r4', time: '08:00', label: '🥗 Breakfast — Hit your 40g protein', type: 'nutrition' },
  { id: 'r5', time: '13:00', label: '🍽️ Lunch — Clean, high protein meal', type: 'nutrition' },
  { id: 'r6', time: '15:00', label: '☀️ Re-apply Sunscreen!', type: 'skin' },
  { id: 'r7', time: '16:00', label: '💧 Hydration Check — 2L minimum by now', type: 'hydration' },
  { id: 'r8', time: '19:00', label: '🥗 Dinner — Protein only, no carbs!', type: 'nutrition' },
  { id: 'r9', time: '20:00', label: '🚶 Evening Walk — 30 min fat burn', type: 'workout' },
  { id: 'r10', time: '21:00', label: '🌙 PM Skin Routine — Glow Mode ON', type: 'skin' },
  { id: 'r11', time: '21:30', label: '💎 Gua Sha + Jade Roller time', type: 'skin' },
  { id: 'r12', time: '21:45', label: '📵 Put the phone down. Wind down.', type: 'sleep' },
  { id: 'r13', time: '22:00', label: '😴 SLEEP — Skin repairs while you sleep!', type: 'sleep' },
];
