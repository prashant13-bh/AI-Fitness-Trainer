'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import {
  Check, ChevronLeft, ChevronRight, Camera, Upload,
  Trash2, ZoomIn, X, BookOpen, Flame, Dumbbell,
  Apple, Sparkles, Moon, Sun, Wind, Brain, Droplets,
  Coffee, Clock, Eye, ChevronDown, ChevronUp, Star,
  BarChart3, Share2, Play, Pause, RotateCcw, Download,
} from 'lucide-react';
import { exportAllDataBackup } from '@/lib/backupEngine';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  tip: string;
}

interface WorkoutDay {
  name: string;
  focus: string;
  intensity: 'MAX' | 'HIGH' | 'MOD' | 'LOW';
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
  totalTime: string;
  targetMuscles: string;
  bruceNote: string;
  preworkout: string;
}

interface SkinStep {
  id: string;
  step: number;
  timeOfDay: 'AM' | 'PM';
  product: string;
  instruction: string;
  why: string;
  emoji: string;
}

interface NKMeal {
  time: string;
  label: string;
  name: string;
  english: string;
  items: string[];
  protein: number;
  kcal: number;
  tip: string;
  emoji: string;
  preworkout?: boolean;
}

interface DayPhoto {
  type: 'body' | 'face' | 'meal' | 'workout' | 'skin';
  dataUrl: string;
  caption: string;
  timestamp: string;
}

interface DayData {
  completedTasks: Record<string, boolean>;
  completedExercises: Record<string, boolean>;
  completedSkinSteps: Record<string, boolean>;
  completedMeals: Record<string, boolean>;
  photos: DayPhoto[];
  weight: string;
  waterGlasses: number;
  mood: number;
  energyLevel: number;
  skinCondition: number; // 1-5
  note: string;
  workoutNotes: string;
  skinNotes: string;
}

// ═══════════════════════════════════════════════════════════════
// SKIN PROTOCOL — EVERY SINGLE STEP AS INDIVIDUAL CHECKBOXES
// ═══════════════════════════════════════════════════════════════
const AM_SKIN_STEPS: SkinStep[] = [
  { id: 'am1', step: 1, timeOfDay: 'AM', product: 'Cold Water Splash', instruction: 'Splash face 10× with cold water. Activates blood flow, reduces puffiness from sleep.', why: 'Cold water reduces morning skin inflammation — especially important for Betnovate-N recovery.', emoji: '💧' },
  { id: 'am2', step: 2, timeOfDay: 'AM', product: 'Gentle Cleanser (CeraVe / Cetaphil)', instruction: 'Wet face. Apply small amount, gentle circular motion 60 seconds. Rinse with cold water. PAT DRY — never rub.', why: 'Removes overnight sebum without stripping ceramides. Damaged skin barrier from steroids = be VERY gentle.', emoji: '🧴' },
  { id: 'am3', step: 3, timeOfDay: 'AM', product: 'Niacinamide 10% Serum (Minimalist / The Ordinary)', instruction: '3-4 drops. Tap gently on cheeks, forehead, chin where dark spots are. Do NOT rub vigorously. Wait 60 seconds to absorb.', why: 'Your #1 ingredient for Betnovate-N hyperpigmentation. Reduces melanin production, controls oil, strengthens weakened barrier.', emoji: '✨' },
  { id: 'am4', step: 4, timeOfDay: 'AM', product: 'Lightweight Moisturizer (CeraVe PM Lotion)', instruction: 'Apply while skin is slightly damp. Small amount, spread evenly. Neck too. 30 seconds gentle massage upward.', why: 'Ceramides directly rebuild the skin barrier destroyed by steroid cream. Hydration = faster hyperpigmentation fading.', emoji: '🫧' },
  { id: 'am5', step: 5, timeOfDay: 'AM', product: 'SPF 50 PA+++ Sunscreen (Anessa / Minimalist / Biore UV)', instruction: '2 FULL finger-lengths. Apply 15 min before going out. Cover: face, neck, ears, back of hands. Reapply every 2 hrs outdoors.', why: 'WITHOUT this step, NO serum can fade your dark spots. UV rays darken pigmentation FASTER than actives can lighten it. This is 50% of your skin journey.', emoji: '☀️' },
];

const PM_SKIN_STEPS: SkinStep[] = [
  { id: 'pm1', step: 1, timeOfDay: 'PM', product: 'Oil Cleanser / Micellar Water', instruction: 'If you wore sunscreen: apply oil cleanser on DRY face. Massage 60 seconds. Add water to emulsify. Rinse. This removes SPF completely.', why: 'SPF residue blocks nighttime actives from penetrating. Double cleanse = clean canvas for healing serums.', emoji: '🫧' },
  { id: 'pm2', step: 2, timeOfDay: 'PM', product: 'CeraVe Foaming Cleanser', instruction: 'Second cleanse with water. 30-45 seconds gentle motion. Cold or lukewarm water. Pat dry completely.', why: 'Removes any remaining sunscreen + daily pollution. Your skin needs a completely clean surface for PM healing.', emoji: '🧴' },
  { id: 'pm3', step: 3, timeOfDay: 'PM', product: 'Niacinamide 10% Serum', instruction: '3-4 drops. Tap on all dark spots. Neck included. Let absorb 2 minutes before next step.', why: 'Niacinamide works day AND night. This doubles the pigmentation-fading effect. Bruce applies it twice daily, every day.', emoji: '✨' },
  { id: 'pm4', step: 4, timeOfDay: 'PM', product: 'Vitamin C Serum 10-15% (Minimalist / Mamaearth C)', instruction: 'Start 3×/week (Mon, Wed, Fri). Work up to daily. 3-4 drops after niacinamide. Slight tingling = normal. Burning = too much, rinse.', why: 'Brightens skin, fades existing dark spots, boosts collagen synthesis damaged by Betnovate-N. Game-changer ingredient.', emoji: '🍊' },
  { id: 'pm5', step: 5, timeOfDay: 'PM', product: 'Retinol 0.1% (Minimalist — start LOWEST dose)', instruction: 'ONLY 2-3 nights/week (Tue, Thu, Sat). Pea-sized amount entire face. Skip if skin is flaky/irritated. Build up over 8 weeks.', why: 'Accelerates cell turnover — removes damaged skin cells, fades scars. But too much = purging. START SLOW. This is a long game.', emoji: '🌙' },
  { id: 'pm6', step: 6, timeOfDay: 'PM', product: 'Heavy Moisturizer (Vaseline / CeraVe Healing Ointment)', instruction: 'GENEROUS layer. This seals everything in. Sleeping skin absorbs deeply. You\'re horizontal — can\'t look shiny, just glow.', why: 'Skin repair is 80% complete between 10PM–2AM. Sealing moisture maximizes the growth hormone peak repair window.', emoji: '🛡️' },
  { id: 'pm7', step: 7, timeOfDay: 'PM', product: 'Gua Sha Tool (5 min)', instruction: 'Use facial oil for slip. Neck upward → jaw → cheekbone → forehead. Always UPWARD and OUTWARD. 3-5 strokes per section.', why: 'Lymphatic drainage reduces puffiness. Over 3-6 months, defines jawline, reduces double chin, lifts facial contours. Bruce\'s secret jaw weapon.', emoji: '💎' },
];

// ═══════════════════════════════════════════════════════════════
// WORKOUTS — EVERY DAY OF WEEK WITH EXACT SETS/REPS
// ═══════════════════════════════════════════════════════════════
const WORKOUTS_BY_DAY: WorkoutDay[] = [
  // SUNDAY (index 0)
  {
    name: 'Active Recovery + Face Yoga',
    focus: 'Mobility · Stretching · Face Yoga · Mental Reset',
    intensity: 'LOW',
    preworkout: '☀️ Just water + morning sunlight. No stimulants on rest day.',
    warmup: ['5 min slow walking', 'Neck rolls 10× each direction', 'Shoulder circles 20×', 'Hip circles 20×'],
    exercises: [
      { name: '🧘 Full Body Stretch Sequence', sets: '1', reps: '15 min', rest: '—', tip: 'Hold each stretch 30-45 seconds. Focus on hips, chest, hamstrings — areas tightest from week\'s training.' },
      { name: '🌞 Face Yoga — Jawline Clench', sets: '3', reps: '20 reps', rest: '30s', tip: 'Clench jaw teeth, hold 2s, release. Feel the masseter muscle. Over 90 days = visible jaw definition.' },
      { name: '🌞 Face Yoga — Cheekbone Lifts', sets: '3', reps: '15 reps', rest: '30s', tip: 'Smile wide, press cheeks up with fingers, hold 5s. Targets zygomatic muscles for higher cheekbones look.' },
      { name: '🌞 Face Yoga — Forehead Smoother', sets: '2', reps: '20 reps', rest: '30s', tip: 'Raise eyebrows while pressing forehead down with palms. Prevents forehead lines, lifts brow area.' },
      { name: '🌞 Face Yoga — Neck & Chin', sets: '3', reps: '15 reps', rest: '30s', tip: 'Tilt head back, chew motion 20×. Reduces double chin, tones platysma muscle under jaw.' },
      { name: '🚶 Brisk Walk', sets: '1', reps: '30 min', rest: '—', tip: 'Sunday walk = mental clarity + active fat burning. No phone. Just you and your thoughts. Solve problems.' },
      { name: '💎 Gua Sha Full Session', sets: '1', reps: '10 min', rest: '—', tip: 'Longer Sunday gua sha — 10 full minutes. Use more facial oil. This is your weekly skin maintenance ritual.' },
    ],
    cooldown: ['5 min meditation / breathing', 'Gratitude journaling', 'Meal prep planning for the week'],
    totalTime: '70 min',
    targetMuscles: 'Full body recovery · Facial muscles · Mind reset',
    bruceNote: 'Sunday is NOT a zero day. Bruce recovers harder than others train. Active recovery is how elite athletes stay injury-free.',
  },
  // MONDAY (index 1)
  {
    name: 'PUSH — Chest + Shoulders + Triceps',
    focus: 'Upper Body Width · Shoulder Boulders · Chest Definition',
    intensity: 'HIGH',
    preworkout: '🍌 1 Banana + 10 peanuts 20 min before. Or black coffee for extra intensity.',
    warmup: [
      'Arm circles 30s forward + backward',
      'Band pull-aparts 20×',
      'Wall angels 15×',
      '10 empty-bar overhead press',
      '2 min light jump rope or jumping jacks',
    ],
    exercises: [
      { name: '💪 Push-ups (Standard)', sets: '4', reps: '15 reps', rest: '60s', tip: 'Chest to floor. Control the descent 2 seconds down. Explode up. This builds chest-tricep connection Bruce needs.' },
      { name: '💪 Pike Push-ups', sets: '3', reps: '12 reps', rest: '60s', tip: 'Hips high (inverted V shape). Targets shoulders heavily. This is Bruce\'s shoulder builder until gym access improves.' },
      { name: '🏋️ Dumbbell Chest Press', sets: '4', reps: '12 reps', rest: '90s', tip: 'Squeeze chest at top. Lower to 90° — no further. Bruce uses moderate weight, full range, never ego-lift.' },
      { name: '🏋️ Lateral Raises', sets: '4', reps: '15 reps', rest: '60s', tip: 'LIGHT weight, controlled. Lead with elbows, not hands. Slight forward lean. This gives Bruce the broad shoulder look.' },
      { name: '💪 Diamond Push-ups', sets: '3', reps: '12 reps', rest: '60s', tip: 'Hands form diamond shape under chest. Hammers triceps. Triceps = 2/3 of upper arm size.' },
      { name: '🏋️ Overhead Dumbbell Press', sets: '3', reps: '12 reps', rest: '90s', tip: 'Neutral grip (palms facing each other) = safer for rotator cuff. Press straight up. Squeeze at top.' },
      { name: '💪 Tricep Dips (Chair)', sets: '3', reps: '15 reps', rest: '60s', tip: 'Keep hips close to chair. Go to 90° elbow. Don\'t go too deep — shoulder protection. Add weight (bag) if easy.' },
      { name: '🏋️ Dumbbell Front Raise', sets: '2', reps: '12 reps', rest: '45s', tip: 'Raise to shoulder height only. No momentum. Slow 3-second negative. Builds anterior deltoid.' },
    ],
    cooldown: ['Chest doorframe stretch 30s', 'Tricep overhead stretch 30s each', 'Shoulder cross-body stretch 30s each', 'Child\'s pose 1 min'],
    totalTime: '55–65 min',
    targetMuscles: 'Chest (pectoralis major/minor) · Shoulders (all 3 heads) · Triceps (all 3 heads)',
    bruceNote: 'Push days build Bruce\'s V-taper from the top. Wide shoulders + defined chest = bigger looking, even at same weight. Form > weight ALWAYS.',
  },
  // TUESDAY (index 2)
  {
    name: 'PULL — Back + Biceps',
    focus: 'Back Width (V-taper) · Bicep Peak · Grip Strength',
    intensity: 'HIGH',
    preworkout: '⚡ Black coffee 30 min before (no milk). Pull workouts need focus and mind-muscle connection.',
    warmup: [
      'Arm circles + shoulder rotations 30s each',
      'Dead hang from bar 30s',
      'Band pull-aparts 20×',
      'Cat-cow stretch 10×',
      'Light dumbbell rows 15× each arm',
    ],
    exercises: [
      { name: '🏋️ Pull-ups / Assisted Pull-ups', sets: '4', reps: '6-8 reps', rest: '120s', tip: 'Best back exercise on planet. If can\'t do full, use band assist or do negative pull-ups (jump up, slow lower 5s). Bruce works toward 10 clean pull-ups.' },
      { name: '🏋️ Dumbbell Bent-Over Row', sets: '4', reps: '12 reps each', rest: '90s', tip: 'Back flat as table. Pull dumbbell to hip, not chest. Feel the lat SQUEEZE at top. This is what builds V-taper.' },
      { name: '💪 Inverted Rows (under table)', sets: '3', reps: '12 reps', rest: '60s', tip: 'Lie under sturdy table. Grab edge, pull chest up. Adjust angle for difficulty. Bodyweight lat machine.' },
      { name: '🏋️ Face Pulls (band/cable)', sets: '3', reps: '15 reps', rest: '60s', tip: 'Pull to face, thumbs behind ears. Fixes forward head posture AND builds rear delts. Bruce does these daily.' },
      { name: '🏋️ Dumbbell Bicep Curls', sets: '4', reps: '12 reps', rest: '60s', tip: 'Full range. Fully extend at bottom. Supinate wrist at top (twist). No swinging. Bruce\'s biceps grow with control.' },
      { name: '🏋️ Hammer Curls', sets: '3', reps: '12 reps each', rest: '60s', tip: 'Neutral grip (thumbs up). Hits brachialis under bicep = makes arm look thicker from all angles. 2 reps slow, 1 explosive.' },
      { name: '💪 Chin-ups (underhand grip)', sets: '3', reps: '6 reps', rest: '90s', tip: 'Underhand grip = more bicep involvement. Slow negative 3 seconds. This exercise alone can double Bruce\'s bicep size in 6 months.' },
      { name: '🏋️ Single-Arm Dumbbell Row', sets: '2', reps: '15 reps each', rest: '45s', tip: 'Extra volume for lat width. Plant knee on bench. Row to hip. Squeeze and hold 1 second at top.' },
    ],
    cooldown: ['Lat stretch (hang from bar) 30s', 'Bicep wall stretch 30s each', 'Doorframe chest/shoulder opener 30s', 'Cat-cow 10×'],
    totalTime: '60–70 min',
    targetMuscles: 'Latissimus dorsi · Rhomboids · Rear delts · Biceps brachii · Brachialis · Traps',
    bruceNote: 'The back makes the body. You can\'t see your own back — but everyone else can. Bruce builds the back that commands a room when he walks in.',
  },
  // WEDNESDAY (index 3)
  {
    name: 'LEGS + CORE — Maximum Fat Burn',
    focus: 'Quadriceps · Hamstrings · Glutes · Full Core',
    intensity: 'HIGH',
    preworkout: '🍌 1 banana + black coffee. Legs take most glycogen — pre-workout carbs are essential today.',
    warmup: [
      '5 min light jogging in place',
      'Leg swings (front-back + side-side) 15× each',
      'Hip circles 20× each direction',
      '10 bodyweight squats (slow)',
      '10 glute bridges',
      'Ankle circles 10× each',
    ],
    exercises: [
      { name: '🦵 Squats (Bodyweight/Goblet)', sets: '4', reps: '20 reps', rest: '60s', tip: 'Feet shoulder-width. Toes slightly out. Go BELOW parallel (thighs below knees). Chest up. This is the king of all exercises.' },
      { name: '🦵 Bulgarian Split Squats', sets: '3', reps: '12 reps each leg', rest: '90s', tip: 'Back foot on chair. Front foot far enough. This exercise is BRUTAL but grows glutes + quads faster than regular squats.' },
      { name: '🦵 Romanian Deadlift (Dumbbells)', sets: '4', reps: '12 reps', rest: '90s', tip: 'Hinge at hips, not knees. Feel hamstring stretch. Dumbbells close to legs. Best hamstring + glute exercise at home.' },
      { name: '🦵 Jump Squats', sets: '3', reps: '15 reps', rest: '60s', tip: 'Explosive! Land soft (toes first, then heel). HIIT element — elevates heart rate, burns fat during the set itself.' },
      { name: '🦵 Glute Bridge / Hip Thrust', sets: '4', reps: '20 reps', rest: '60s', tip: 'Add weight (heavy bag) on hips for progressive overload. Squeeze glutes at top for 2 seconds. Glutes = biggest muscle = most calories burned.' },
      { name: '🦵 Reverse Lunges', sets: '3', reps: '12 reps each', rest: '60s', tip: 'Knee DOESN\'T touch floor. Step back far enough. Easier on knees than forward lunges but same quad/glute activation.' },
      { name: '⚡ Plank (Standard)', sets: '3', reps: '60 seconds', rest: '45s', tip: 'Body straight as board. Don\'t let hips sag OR rise. Squeeze: abs, glutes, and fists simultaneously. Bruce can hold 2 min by Phase 2.' },
      { name: '⚡ Mountain Climbers', sets: '3', reps: '30 seconds', rest: '30s', tip: 'Fast pace. Drives heart rate up. Burns belly fat DIRECTLY while also training core. Bruce\'s abs are built here.' },
      { name: '⚡ Hanging Leg Raises', sets: '3', reps: '12 reps', rest: '60s', tip: 'Hang from bar. Raise legs to 90°. Slow controlled lower. If too hard: bent-knee version first. Lower abs are revealed here.' },
    ],
    cooldown: ['Pigeon pose 60s each hip', 'Figure-4 stretch 45s each', 'Quad stretch standing 30s each', 'Hamstring stretch seated 45s', '5 min walk'],
    totalTime: '65–75 min',
    targetMuscles: 'Quads · Hamstrings · Glutes · Calves · All core muscles (abs + obliques + lower back)',
    bruceNote: 'Leg day is where Bruce\'s fat loss EXPLODES. Legs are the biggest muscles — training them creates the largest EPOC effect (calories burned 48hrs after workout).',
  },
  // THURSDAY (index 4)
  {
    name: 'PUSH VARIATION — Incline + Arnold Press + Chest Fly',
    focus: 'Upper Chest · Shoulder Depth · Tricep Strength',
    intensity: 'MOD',
    preworkout: '🫘 50g roasted shenga + 1 cup chai. Moderate day — no extreme stimulants needed.',
    warmup: [
      'Incline push-ups against wall 15×',
      'Arm circles large 20× each direction',
      'Band pull-aparts 20×',
      'Chest stretch doorframe 30s each side',
      'Light dumbbell chest press 15× (warm-up weight)',
    ],
    exercises: [
      { name: '💪 Incline Push-ups', sets: '4', reps: '15 reps', rest: '60s', tip: 'Hands elevated on chair/couch. UPPER chest focus. This is what creates that defined chest-shoulder separation line. Critical for Bruce\'s look.' },
      { name: '🏋️ Arnold Press', sets: '4', reps: '10 reps', rest: '90s', tip: 'Start with palms facing you, rotate to face forward as you press up. Works all 3 shoulder heads in one movement. Arnold had this for a reason.' },
      { name: '🏋️ Dumbbell Chest Fly', sets: '3', reps: '12 reps', rest: '90s', tip: 'Slight elbow bend. Open wide (deep stretch), then squeeze back together like hugging a tree. STRETCHES pec fibers for growth.' },
      { name: '💪 Decline Push-ups (feet elevated)', sets: '3', reps: '12 reps', rest: '60s', tip: 'Feet on chair. Works lower chest + upper portion. Bruce develops full chest this way — upper, mid, and lower all trained.' },
      { name: '🏋️ Overhead Tricep Extension', sets: '3', reps: '12 reps', rest: '60s', tip: '1 dumbbell overhead with both hands. Lower behind head slowly. Full stretch at bottom. Long head of tricep — makes arm look big even relaxed.' },
      { name: '🏋️ Upright Row', sets: '3', reps: '12 reps', rest: '60s', tip: 'Dumbbells close grip. Pull to chin level. Elbows above hands. Hits upper traps + middle delts = thick shoulder cap.' },
      { name: '💪 Push-up to Side Plank', sets: '3', reps: '10 reps each side', rest: '60s', tip: 'Push-up → rotate into side plank → back down. Combines push + rotation = chest + obliques + shoulder stability.' },
    ],
    cooldown: ['Child\'s pose 1 min', 'Thread-the-needle stretch 30s each', 'Tricep stretch behind head 30s each', 'Doorframe chest stretch 45s'],
    totalTime: '50–60 min',
    targetMuscles: 'Upper chest · All shoulder heads (Arnold press hits all 3) · Triceps long head · Upper traps',
    bruceNote: 'Thursday is moderate intensity — perfect for technique work. Focus on FEELING the muscle, not just moving weight. Mind-muscle connection doubles results.',
  },
  // FRIDAY (index 5)
  {
    name: 'PULL + CORE — Back Width + Abs Definition',
    focus: 'Lat Pulldown · Deadlift Pattern · Core Strength',
    intensity: 'HIGH',
    preworkout: '⚡ Black coffee + 1 banana. Friday = Bruce\'s second highest protein day. Kadle saaru lunch powers this session.',
    warmup: [
      'Dead hang from bar 45 seconds',
      'Scapular pull-ups (just squeeze shoulder blades) 10×',
      'Cat-cow stretch 15×',
      'Good mornings with bodyweight 15×',
      'Core engagement hold 30 seconds',
    ],
    exercises: [
      { name: '🏋️ Chin-ups (max reps)', sets: '4', reps: 'Max reps each', rest: '120s', tip: 'Track your max. Week 1: maybe 3. Week 12: maybe 12. This number IS Bruce\'s progress report. Log every set.' },
      { name: '🏋️ T-Bar Row / Dumbbell Row', sets: '4', reps: '10 reps', rest: '90s', tip: 'Heavier than Tuesday. Same form, more weight. Progressive overload = muscle must grow. Don\'t stay at same weight forever.' },
      { name: '💪 Inverted Row (slow tempo)', sets: '3', reps: '10 reps (3s negative)', rest: '90s', tip: '3 SECONDS to lower. This time under tension is where muscles grow. Slow negatives = 40% more muscle fiber recruitment.' },
      { name: '🏋️ Dumbbell Deadlift', sets: '4', reps: '10 reps', rest: '90s', tip: 'Hip hinge. Back flat. Dumbbells inside legs. Stand straight, squeeze glutes at top. Builds ENTIRE posterior chain (back + glutes + hamstrings).' },
      { name: '🏋️ Renegade Row', sets: '3', reps: '10 reps each arm', rest: '90s', tip: 'Push-up position with dumbbells. Row one arm while other stabilizes. Core + back simultaneously. Advanced but devastating.' },
      { name: '⚡ Plank Variations Circuit', sets: '3', reps: '45s each', rest: '30s between', tip: 'Rotate: Standard → Left side plank → Right side plank. 45 seconds each. = 2.25 min continuous core work. No rest within the circuit.' },
      { name: '⚡ Dragon Flag Progression', sets: '3', reps: '8 reps', rest: '60s', tip: 'Bruce Level: Tuck knees. Advanced: legs straight. This is the most difficult core exercise — Bruce builds to it over 3 months.' },
      { name: '⚡ Bicycle Crunches', sets: '3', reps: '20 reps each side', rest: '45s', tip: 'Slow and controlled. Touch elbow to OPPOSITE knee. Fully extend other leg. Targets all ab regions + obliques simultaneously.' },
    ],
    cooldown: ['Lat stretch hanging 30s', 'Pigeon pose 45s each', 'Child\'s pose 1 min', 'Foam roll back (or tennis ball) 2 min'],
    totalTime: '65–75 min',
    targetMuscles: 'Lats (V-taper) · Rhomboids · Erector spinae · All core muscles · Biceps · Rear delts',
    bruceNote: 'Friday ends the heavy week. Bruce walks out knowing the weekend\'s rest will trigger muscle growth from MON-FRI\'s training. Sleep is the gym on weekends.',
  },
  // SATURDAY (index 6)
  {
    name: 'HIIT — Maximum Fat Burn + Conditioning',
    focus: 'Full Body · Metabolic Conditioning · Fat Loss',
    intensity: 'MAX',
    preworkout: '☕ Black coffee only (no milk, no food 60-90 min before). Fasted HIIT = maximum fat mobilization.',
    warmup: [
      '3 min light jogging in place',
      '20 jumping jacks',
      'High knees 30 seconds',
      'Butt kicks 30 seconds',
      '10 arm circles large',
      '10 hip circles each direction',
    ],
    exercises: [
      { name: '🔥 Burpees', sets: '4', reps: '15 reps (max speed)', rest: '30s', tip: 'Full: squat-plank-pushup-jump. Bruce does these at full intensity. 15 burpees = 200m sprint equivalent in calorie burn.' },
      { name: '🔥 Jump Squats', sets: '4', reps: '20 reps', rest: '30s', tip: 'NO rest on way up. Land soft. Stay low between reps. Heart rate should be 85%+ by set 2. This IS Bruce\'s fat furnace.' },
      { name: '🔥 Sprint Intervals', sets: '6', reps: '30 sec sprint / 30 sec walk', rest: '30s walk between', tip: 'Sprint at 90% max speed. Not jogging — SPRINTING. 6 rounds = 3 min of actual work burns 300+ calories total including EPOC.' },
      { name: '🔥 Push-up + Tuck Jump', sets: '3', reps: '10 + 10 reps', rest: '45s', tip: '10 push-ups → immediately 10 tuck jumps. No rest between. Upper body + legs + cardio = total metabolic chaos (good chaos).' },
      { name: '🔥 Mountain Climbers', sets: '4', reps: '40 seconds', rest: '20s', tip: 'Fast as possible. Hips low. Drive knees to chest alternating. Cardio + core + hip flexors. Bruce does not stop mid-set.' },
      { name: '🔥 Bear Crawl', sets: '3', reps: '20 meters', rest: '30s', tip: 'Knees 1 inch off floor. Move opposite hand-foot simultaneously. Full body coordination + core = unusual muscle activation for growth.' },
      { name: '🔥 Box Jumps / Jump onto chair', sets: '4', reps: '10 reps', rest: '45s', tip: 'Land soft (bend knees). Explosive jump. Step down (don\'t jump down). Develops explosive power + quad strength + fat burn.' },
      { name: '🔥 FINISHER: Tabata Sprints', sets: '8', reps: '20s sprint / 10s rest', rest: '—', tip: '4 minutes total. This is the original Tabata protocol — scientifically proven to increase VO2 max AND burn fat 9x more than steady cardio.' },
    ],
    cooldown: ['5 min slow walking', 'Full body stretch 10 min', 'Cold shower immediately after', 'Tender coconut water (replenish electrolytes)'],
    totalTime: '50–60 min (intense)',
    targetMuscles: 'Entire body — Maximum caloric expenditure · Cardiovascular conditioning · EPOC fat burning (48hrs after)',
    bruceNote: 'Saturday HIIT is the weekly reset. Bruce earns Sunday\'s rest here. This session burns 400-600 calories + triggers 200-300 more calories burned over next 24-48 hrs. This is how Bruce broke through the plateau.',
  },
];

// ═══════════════════════════════════════════════════════════════
// NK VEGETARIAN MEALS — ALL 7 DAYS × 6 MEALS
// ═══════════════════════════════════════════════════════════════
const NK_MEALS_BY_DAY: NKMeal[][] = [
  // SUNDAY (0)
  [
    { time: '07:30', label: 'Breakfast', emoji: '🌅', name: 'Idli + NK Sambar + Shengdana Chutney', english: 'Steamed Rice Cakes + Lentil Soup + Peanut Chutney', items: ['4 soft idli (steam, not fry)', '1.5 cups NK sambar (extra dal, NK spice mix)', '2 tbsp shengdana chutney (fresh today)', '1 cup thick mosaru (curd)'], protein: 20, kcal: 410, tip: 'Sunday breakfast is your weekly treat. Make FRESH shengdana chutney for the week today.' },
    { time: '10:30', label: 'Mid-Morning', emoji: '🍎', name: 'Fruit Salad + Shenga', english: 'NK Protein Fruit Bowl', items: ['Banana + Apple + Guava (seasonal)', '20g roasted peanuts', '1 tsp lemon + chaat masala'], protein: 7, kcal: 200, tip: 'Guava has 4× more Vitamin C than orange. Vitamin C = collagen = skin repair. Eat guava whenever in season.' },
    { time: '13:00', label: 'Lunch', emoji: '🍚', name: 'Vegetable Pulav + Kadale Curry + Curd', english: 'NK Special Sunday Lunch', items: ['1.5 cups vegetable pulav (carrot + peas + beans)', '1 cup kadale curry (black chickpea NK style)', '1 cup thick curd', '2 tbsp shenga chutney pudi', 'Papad + green pickle'], protein: 28, kcal: 550, tip: 'Sunday lunch is Bruce\'s biggest meal of the week. Kadale curry = NK\'s answer to chicken curry. 18g protein in one cup.' },
    { time: '16:00', label: 'Snack', emoji: '🍫', name: 'Shenga Chikki + Adrak Chai', english: 'Peanut Bar + Ginger Tea', items: ['1 piece shenga chikki (40g)', '1 cup ginger tea (minimal milk, no sugar)'], protein: 10, kcal: 200, tip: 'Sunday earned treat. Shenga chikki = peanuts + jaggery. NOT junk food — healthy NK energy bar.' },
    { time: '19:00', label: 'Dinner', emoji: '🌿', name: 'Ragi Mudde + Soppu Saaru + Palya', english: 'Ragi Ball + Greens Rasam + Stir-fry', items: ['1 Ragi Mudde', '1.5 cups soppu saaru (methi + spinach rasam)', '1 cup mixed seasonal palya', '1 cup mosaru'], protein: 20, kcal: 370, tip: 'Light Sunday dinner. Soppu saaru = greens rasam. Methi + spinach = folic acid + iron + zinc = skin repair minerals.' },
    { time: '21:30', label: 'Bedtime', emoji: '🌙', name: 'Haldi Doodh + Walnuts', english: 'Sunday Night Recovery Drink', items: ['200ml warm milk', '1/2 tsp haldi', '2 walnuts crushed', '1/4 tsp ashwagandha', 'Pinch black pepper'], protein: 9, kcal: 180, tip: 'Sunday night = MOST important sleep of week. Walnuts = Omega-3 for skin barrier repair. Ashwagandha = deep sleep.' },
  ],
  // MONDAY (1)
  [
    { time: '07:40', label: 'Breakfast', emoji: '🌾', name: 'Jolada Rotti + Shengdana Chutney + Toor Dal + Mosaru', english: 'Jowar Flatbread + Peanut Chutney + Lentil + Curd', items: ['2 Jolada Rotti (jowar flour fresh made)', '3 tbsp shengdana chutney (roasted peanuts + coconut + garlic)', '1 cup toor dal (togari bele)', '1 cup mosaru'], protein: 28, kcal: 480, tip: 'Shengdana chutney = Bruce\'s protein bomb. 3 tbsp = 15g protein. Make big batch Sunday.' },
    { time: '10:30', label: 'Mid-Morning', emoji: '🌱', name: 'Molake Kosambari', english: 'Sprouted Moong + Carrot Salad', items: ['1 cup sprouted hesaru bele', '1 grated carrot', '1 tbsp lemon', '2 tbsp coconut', 'Salt, chilli, coriander'], protein: 12, kcal: 180, tip: 'Sprouting increases protein 40%. Vitamin C in lemon helps iron absorption. Skin glow food — eat daily.' },
    { time: '13:00', label: 'Lunch', emoji: '🍆', name: 'Ennegayi + Jolada Rotti + Mosaru Anna + Majjige', english: 'Stuffed Brinjal Curry + Jowar Roti + Curd Rice + Buttermilk', items: ['2 Jolada Rotti', 'Ennegayi (stuffed with shenga+coconut masala)', '1 cup curd rice (mosaru anna)', '1 cup majjige (buttermilk)'], protein: 22, kcal: 520, tip: 'Ennegayi masala = NK peanut curry. This is Bruce\'s biggest and most satisfying NK meal. Majjige = gut health = better gains.' },
    { time: '16:00', label: 'Snack', emoji: '🫘', name: 'Hurigadale + Majjige', english: 'Roasted Bengal Gram + Buttermilk', items: ['50g hurigadale (roasted chana / futana)', '1 glass salted majjige', '1 small banana'], protein: 14, kcal: 230, tip: 'Hurigadale (futana) = Bruce\'s gym pocket snack. 100g = 22g protein, costs ₹20. Always carry.' },
    { time: '19:00', label: 'Dinner', emoji: '🌿', name: 'Sabsige Soppu Palya + Ragi Mudde + Hesaru Bele Sambar', english: 'Dill Stir-fry + Finger Millet Ball + Moong Sambar', items: ['1 Ragi Mudde', '2 cups sabsige soppu palya (dill + dal)', '1 cup hesaru bele sambar', 'Raw onion + tomato salad'], protein: 20, kcal: 380, tip: 'Ragi mudde = no white rice at night = fat burns while sleeping. Dill (sabsige) = incredible skin anti-inflammatory.' },
    { time: '21:30', label: 'Bedtime', emoji: '🥛', name: 'Haldi Doodh', english: 'Turmeric Milk', items: ['200ml warm milk', '1/2 tsp haldi', 'Pinch black pepper'], protein: 7, kcal: 120, tip: 'Haldi + black pepper every night. Curcumin reduces skin inflammation. Black pepper makes curcumin 2000% more bioavailable.' },
  ],
  // TUESDAY (2)
  [
    { time: '07:40', label: 'Breakfast', emoji: '🫓', name: 'Akki Rotti + Kadale Chutney + Mosaru', english: 'Rice Flour Flatbread + Chickpea Chutney + Curd', items: ['2 Akki Rotti (rice flour + onion + coriander + green chilli)', '3 tbsp thick kadale chutney (Bengal gram)', '1 cup thick mosaru', '200ml chai (jaggery sweetened)'], protein: 26, kcal: 460, tip: 'Kadale chutney (Bengal gram/chana) = 22g protein per 100g. Bruce\'s chutney protein strategy.' },
    { time: '10:30', label: 'Mid-Morning', emoji: '⚫', name: 'Kadale Usli', english: 'Black Chickpea Stir-fry', items: ['100g cooked kala chana', '1 tsp coconut oil', 'Mustard + curry leaves tempering', '2 tbsp grated coconut', 'Lemon squeeze'], protein: 15, kcal: 220, tip: 'Kadle = NK warrior food. 100g cooked = 19g protein. Make big batch on Sunday, eat Mon-Wed.' },
    { time: '13:00', label: 'Lunch', emoji: '🫓', name: 'Shenga Holige + Jolada Rotti + Toor Dal + Methi Palya + Majjige', english: 'Peanut Flatbread + Jowar Roti + Dal + Fenugreek Stir-fry', items: ['1 Shenga Holige (low jaggery)', '2 Jolada Rotti', '1 cup toor dal', 'Methi palya (fenugreek leaves stir-fry)', '1 cup majjige'], protein: 24, kcal: 540, tip: 'Methi leaves = fenugreek = BEST skin food. Reduces insulin resistance = less hormonal acne. Eat 3× per week.' },
    { time: '16:00', label: 'Snack', emoji: '🥜', name: 'Shenga Coconut Ladoo (2 balls)', english: 'Peanut Energy Balls', items: ['30g ground roasted peanuts', '10g coconut', '1 tsp jaggery', 'Cardamom — 2 small balls'], protein: 10, kcal: 180, tip: 'Make 10 balls on Sunday. Keep refrigerated. Bruce\'s pre-workout NK snack — no sugar crash.' },
    { time: '19:00', label: 'Dinner', emoji: '🍆', name: 'Vangi Bath + Paneer Palya + Hesaru Bele Kosambari', english: 'Brinjal Spiced Rice + Paneer Stir-fry + Moong Salad', items: ['1 cup vangi bath (small portion)', '100g paneer bhurji (NK spices + veggies)', 'Hesaru bele kosambari', '1 cup thin majjige'], protein: 28, kcal: 420, tip: 'Make paneer at home: 1L milk boiled + lemon juice strained. 200g paneer for ₹30. Cheaper + fresher than store.' },
    { time: '21:30', label: 'Bedtime', emoji: '🥜', name: 'Shenga + Warm Water', english: 'Peanuts + Warm Water', items: ['20g roasted shenga', '1 glass warm water with pinch haldi'], protein: 5, kcal: 120, tip: 'Peanuts = slow protein overnight. Paired with warm water + haldi = anti-inflammatory sleep boost.' },
  ],
  // WEDNESDAY (3)
  [
    { time: '07:40', label: 'Breakfast', emoji: '⚫', name: 'Ragi Mudde + Hesaru Bele Sambar', english: 'Finger Millet Ball + Moong Dal Sambar', items: ['250g Ragi Mudde (2 small balls)', '1.5 cups hesaru bele sambar with drumstick', '1 tsp ghee on mudde', '1 cup curd'], protein: 24, kcal: 490, tip: 'Ragi Mudde = NK wrestler food. Highest calcium of any grain. Skin collagen support. Bruce eats mudde = Bruce gets jaw definition.' },
    { time: '10:30', label: 'Mid-Morning', emoji: '🍫', name: 'Shenga Chikki + Majjige', english: 'Peanut Bar + Buttermilk', items: ['40g shenga chikki', '1 glass majjige with jeera + salt', '1 small orange'], protein: 10, kcal: 210, tip: 'Pre-leg day energy. Orange Vitamin C + shenga protein = best NK pre-workout combo.' },
    { time: '13:00', label: 'Lunch', emoji: '🍲', name: 'Bisibele Bath + Raita + Roasted Papad', english: 'Hot Lentil Rice Stew + Yoghurt', items: ['1.5 cups bisibele bath (extra dal, less rice)', '1 cup curd raita with cucumber + carrot', '1 roasted papad', '1 cup majjige'], protein: 20, kcal: 560, tip: 'NK bisibele bath = more dal than rice. Load it with vegetables. Spices (sambar powder, tamarind) are anti-inflammatory.' },
    { time: '16:00', label: 'Snack', emoji: '🫘', name: 'Sprouted Chana Chaat', english: 'Spiced Sprouted Chickpea Bowl', items: ['100g sprouted kabuli chana', '1 onion chopped', '1 tomato chopped', 'Lemon + coriander + chaat masala'], protein: 15, kcal: 190, tip: 'Sprouted chana pre-evening-walk. Resistant starch keeps fat burning for hours after this snack.' },
    { time: '19:00', label: 'Dinner', emoji: '🥬', name: 'Jolada Rotti + Palak Paneer NK Style', english: 'Jowar Roti + NK Spinach Paneer', items: ['2 Jolada Rotti', '150g NK palak paneer (sabsige/spinach + paneer + NK masalas)', 'Thin toor dal', 'Raw onion salad'], protein: 28, kcal: 400, tip: 'NK palak paneer: no cream, no butter. Just groundnut oil + NK garam masala + spinach + paneer. Tastes epic, saves 300 kcal.' },
    { time: '21:30', label: 'Bedtime', emoji: '🥛', name: 'Haldi Doodh + Ashwagandha', english: 'Power Sleep Drink', items: ['200ml warm milk', '1/2 tsp haldi', '1/4 tsp ashwagandha', 'Pinch black pepper'], protein: 7, kcal: 120, tip: 'Leg day = most recovery needed. Ashwagandha reduces DOMS (delayed onset muscle soreness) + improves deep sleep quality.' },
  ],
  // THURSDAY (4)
  [
    { time: '07:40', label: 'Breakfast', emoji: '🍲', name: 'Uppittu + Kadale Chutney + Mosaru', english: 'Semolina Upma + Chickpea Chutney + Curd', items: ['1.5 cups uppittu (rave upma with shenga + veggies)', '3 tbsp kadale chutney (Bengal gram)', '1 cup thick mosaru', '1 glass warm lemon water'], protein: 22, kcal: 440, tip: 'NK uppittu MUST have roasted peanuts inside. Add sabsige soppu (dill) to uppittu for extra skin benefits.' },
    { time: '10:30', label: 'Mid-Morning', emoji: '🌱', name: 'Molake Kadale + Lemon', english: 'Sprouted Chickpeas + Lemon', items: ['1 cup sprouted kabuli chana', '1/2 lemon squeezed', 'Pinch salt + jeera powder', '1 guava or apple'], protein: 12, kcal: 170, tip: 'Sprouting creates Vitamin C IN the food. Lemon adds more. Vitamin C = collagen = faster Betnovate-N scar healing.' },
    { time: '13:00', label: 'Lunch', emoji: '🍆', name: 'Jolada Rotti + Ennegayi + Dalimbe Mosaru', english: 'Jowar Roti + Stuffed Brinjal + Pomegranate Curd', items: ['2 Jolada Rotti', 'Ennegayi (shenga + coconut masala stuffed)', '1 cup dalimbe mosaru (pomegranate yoghurt)', '1 cup sambar'], protein: 26, kcal: 510, tip: 'Dalimbe (pomegranate) in mosaru = SKIN GLOW MEAL. Pomegranate antioxidants fight hyperpigmentation directly. Eat 3×/week.' },
    { time: '16:00', label: 'Snack', emoji: '🫘', name: 'Baked Ambode + Majjige', english: 'Masala Lentil Fritters (Baked) + Buttermilk', items: ['2 baked ambode (chana dal vada — air fry NOT deep fry)', '1 glass thick majjige', 'Green chutney'], protein: 14, kcal: 240, tip: 'Air fry ambode saves 150 kcal vs deep fry. Still tastes great. Chana dal = 22g protein per 100g.' },
    { time: '19:00', label: 'Dinner', emoji: '⚫', name: 'Ragi Rotti + Shengdana Chutney + Gorikayi Palya', english: 'Ragi Flatbread + Peanut Chutney + Cluster Beans', items: ['2 Ragi Rotti (ragi + onion + chilli + coriander)', '2 tbsp shenga chutney', '1.5 cups gorikayi palya (cluster beans)', 'Thin sambar'], protein: 18, kcal: 360, tip: 'Ragi rotti is easier to make than jolada rotti. Mix ragi flour + onion + chilli + coriander + water. Spread thin on tawa.' },
    { time: '21:30', label: 'Bedtime', emoji: '🥛', name: 'Mosaru + Shenga', english: 'Curd + Peanuts', items: ['150ml thick mosaru', '15g roasted peanuts', 'Pinch salt + jeera'], protein: 9, kcal: 150, tip: 'Casein from mosaru + protein from shenga = slow overnight protein release. Bruce\'s nighttime muscle builder.' },
  ],
  // FRIDAY (5)
  [
    { time: '07:40', label: 'Breakfast', emoji: '🫓', name: 'Shenga Holige + Hesaru Bele Dal + Mosaru', english: 'Peanut Sweet Roti + Moong Dal + Curd', items: ['1 Shenga Holige (low jaggery)', '1 Jolada Rotti', '1 cup thick hesaru bele dal', '1 cup mosaru', '3-4 khajoor (dates)'], protein: 28, kcal: 510, tip: 'FRIDAY = Bruce\'s biggest training day. Dates = iron + natural sugar for explosive Pull+Core session energy.' },
    { time: '10:30', label: 'Mid-Morning', emoji: '🥜', name: 'Shenga + Khajoor Mix', english: 'Power Snack', items: ['30g roasted shenga', '3 medjool dates or khajoor', '1 glass warm water'], protein: 8, kcal: 220, tip: 'Shenga + khajoor = protein + iron + natural sugar. Iron = oxygen to working muscles. NK power combo.' },
    { time: '13:00', label: 'Lunch', emoji: '⚫', name: 'Jolada Rotti + Kadle Saaru + Hesaru Bele Kosambari + Majjige', english: 'Jowar Roti + Black Chickpea Curry + Moong Salad + Buttermilk', items: ['2 Jolada Rotti', '1 cup thick kadle saaru (NK black chickpea curry)', 'Hesaru bele kosambari (raw moong salad)', '1 cup majjige', 'Onion + tomato lemon'], protein: 30, kcal: 520, tip: 'Kadle saaru = NK\'s most protein-dense curry. 1 cup = 19g protein. Better than rajma, cheaper than paneer. Bruce\'s Friday fuel.' },
    { time: '16:00', label: 'Snack', emoji: '🍢', name: 'Mosaru Vade', english: 'Lentil Fritter in Curd', items: ['1-2 baked vade (moong + urad dal)', '1 cup thick mosaru with mustard tempering', 'Coriander + pomegranate seeds on top'], protein: 14, kcal: 220, tip: 'Probiotics from mosaru + protein from vade = best post-afternoon-walk recovery snack.' },
    { time: '19:00', label: 'Dinner', emoji: '🧀', name: 'Paneer NK Masala + Ragi Mudde + Sambar', english: 'NK Spiced Paneer + Ragi Ball + Lentil Soup', items: ['150g paneer NK masala (NK spice, groundnut oil, no cream)', '1 Ragi Mudde', '1 cup thin sambar', 'Green salad'], protein: 28, kcal: 400, tip: 'Friday = Bruce\'s PEAK protein day. Paneer + Ragi Mudde + Kadle saaru lunch = 86g protein just from 3 meals.' },
    { time: '21:30', label: 'Bedtime', emoji: '🌙', name: 'Haldi Doodh + Ashwagandha', english: 'Power Sleep Drink', items: ['200ml warm milk', '1/2 tsp haldi', '1/4 tsp ashwagandha', 'Pinch black pepper'], protein: 7, kcal: 120, tip: 'Friday night sleep = MUSCLE BUILD NIGHT. Growth hormone peaks 11PM-2AM. Ashwagandha + haldi = maximum recovery.' },
  ],
  // SATURDAY (6)
  [
    { time: '09:00', label: 'Post-Workout Breakfast', emoji: '🍋', name: 'Chitranna + Mosaru + Extra Shenga', english: 'NK Lemon Rice + Curd + Peanuts', items: ['1 cup chitranna (lemon rice with shenga + curry leaves)', '1 cup thick mosaru', '20g extra roasted peanuts', '1 glass warm lemon water'], protein: 20, kcal: 420, tip: 'Post-HIIT: Chitranna lemon + turmeric reduces oxidative stress from intense training. Eat 30 min after workout.' },
    { time: '11:00', label: 'Mid-Morning', emoji: '🫐', name: 'Jamun / Pomegranate + Shenga', english: 'Antioxidant Recovery Snack', items: ['1 cup jamun (black berry) or pomegranate', '20g roasted shenga', '1 glass water with rock salt'], protein: 6, kcal: 160, tip: 'HIIT day = maximum oxidative stress. Jamun has highest antioxidants of any Indian fruit. Skin repair after HIIT.' },
    { time: '13:00', label: 'Lunch', emoji: '🍲', name: 'Jolada Rotti + Tomato Saaru + Kadale Palya + Curd Raita', english: 'Jowar Roti + Rasam + Chickpea Stir-fry + Yoghurt', items: ['2 Jolada Rotti', '1 cup tomato saaru (rasam)', '1 cup kadale palya (black chickpea + coconut)', '1 cup thick curd raita', 'Raw onion + cucumber'], protein: 28, kcal: 500, tip: 'Tomato saaru after HIIT = electrolytes + potassium. Rasam spices (pepper, jeera) enhance protein absorption.' },
    { time: '16:00', label: 'Snack', emoji: '🥥', name: 'Tender Coconut + Shenga', english: 'Coconut Water + Peanuts', items: ['1 tender coconut with both water AND malai (flesh)', '20g roasted peanuts', 'Pinch rock salt in coconut water'], protein: 7, kcal: 190, tip: 'Tender coconut = best natural post-HIIT electrolyte drink. Replenishes sodium, potassium, magnesium. Better than any sports drink.' },
    { time: '19:00', label: 'Dinner (Light)', emoji: '🥣', name: 'Hesaru Bele Dal + Paneer Bhurji + Sabzi + 1 Jolada Rotti', english: 'Moong Dal + Paneer + Vegetable + Jowar Roti', items: ['1 cup hesaru bele dal', '100g paneer lightly sautéed', '2 cups mixed sabzi (beans + carrot)', '1 Jolada Rotti only (low carb Saturday night)', '1 cup majjige'], protein: 30, kcal: 380, tip: 'Saturday = lowest carb dinner. Saturday night sleep triggers the fat burned by HIIT. Don\'t undo the work with heavy carb dinner.' },
    { time: '21:30', label: 'Bedtime', emoji: '🌰', name: 'Warm Milk + Dry Fruits', english: 'Recovery Night Mix', items: ['200ml warm milk', '3 almonds (badam)', '3 cashews', '2 walnuts (akhrot — Omega-3)', 'Pinch haldi'], protein: 9, kcal: 180, tip: 'Walnuts EVERY Saturday night. Omega-3 in walnuts rebuilds skin barrier destroyed by Betnovate-N. Non-negotiable.' },
  ],
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════
function getCurrentArcDay() {
  const start = new Date('2026-10-01');
  const today = new Date();
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

function getWeekdayForArcDay(arcDay: number): number {
  // Oct 1, 2026 = Thursday = 4
  // arcDay 1 = Thursday
  return (4 + arcDay - 1) % 7; // 0=Sun,1=Mon,...,6=Sat
}

function getDateForDay(dayNum: number): string {
  const start = new Date('2026-10-01');
  start.setDate(start.getDate() + dayNum - 1);
  return start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' });
}

function getDayKey(dayNum: number) { return `bruce_arc_v2_day_${dayNum}`; }

function loadDayData(dayNum: number): DayData {
  if (typeof window === 'undefined') return defaultData();
  try {
    const raw = localStorage.getItem(getDayKey(dayNum));
    if (raw) return { ...defaultData(), ...JSON.parse(raw) };
  } catch {}
  return defaultData();
}

function saveDayData(dayNum: number, data: DayData) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(getDayKey(dayNum), JSON.stringify(data)); } catch {}
}

function defaultData(): DayData {
  return {
    completedTasks: {}, completedExercises: {}, completedSkinSteps: {}, completedMeals: {},
    photos: [], weight: '', waterGlasses: 0, mood: 3, energyLevel: 3, skinCondition: 3,
    note: '', workoutNotes: '', skinNotes: '',
  };
}

const INTENSITY_COLORS: Record<string, string> = { MAX: '#EF4444', HIGH: '#FF7A00', MOD: '#0085FF', LOW: '#10B981' };
const MOODS = ['😴', '😐', '🙂', '😊', '🔥'];
const ENERGY_LEVELS = ['💤', '😑', '⚡', '🚀', '🌟'];
const SKIN_COND = ['😰 Very Bad', '😟 Bad', '😐 Okay', '🙂 Good', '✨ Glowing!'];

const PHOTO_TYPES: { key: DayPhoto['type']; label: string; emoji: string; hint: string }[] = [
  { key: 'body', label: 'Body Progress', emoji: '💪', hint: 'Front pose — same spot, same time every day' },
  { key: 'face', label: 'Face / Skin', emoji: '✨', hint: 'Natural light, no filter — track skin healing daily' },
  { key: 'meal', label: 'Today\'s Meals', emoji: '🌾', hint: 'Snap before eating — NK meal accountability' },
  { key: 'workout', label: 'Workout Proof', emoji: '🔥', hint: 'Gym selfie or exercise photo' },
  { key: 'skin', label: 'Skin Close-up', emoji: '🔬', hint: 'Zoomed skin — track Betnovate-N healing progress' },
];

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function PhotoViewer({ photo, onClose }: { photo: DayPhoto; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white" onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
      <img src={photo.dataUrl} alt={photo.type} className="max-h-[70vh] max-w-full rounded-2xl object-contain" onClick={e => e.stopPropagation()} />
      <p className="text-white font-bold text-sm mt-3">{photo.caption}</p>
      <p className="text-white/50 text-xs mt-1">{photo.timestamp}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════

function parseRestSeconds(restStr: string): number {
  const match = restStr.match(/(\d+)/);
  if (!match) return 60;
  const num = parseInt(match[1], 10);
  if (restStr.toLowerCase().includes('min')) return num * 60;
  return num;
}

function WorkoutSection({ workout, dayData, updateData }: {
  workout: WorkoutDay;
  dayData: DayData;
  updateData: (u: Partial<DayData>) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const doneCount = workout.exercises.filter((_, i) => dayData.completedExercises[`ex_${i}`]).length;

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [initialRest, setInitialRest] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playRestAlert = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      // Upbeat gym rest done alert beep
      [880, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
        gain.gain.setValueAtTime(0.4, ctx.currentTime + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.14);
        osc.stop(ctx.currentTime + idx * 0.14 + 0.26);
      });
    } catch {}
  };

  const startRestTimer = (seconds: number) => {
    setInitialRest(seconds);
    setRestSecondsLeft(seconds);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    if (isTimerRunning && restSecondsLeft !== null && restSecondsLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setRestSecondsLeft(prev => {
          if (prev === null || prev <= 1) {
            setIsTimerRunning(false);
            playRestAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, restSecondsLeft]);

  const toggleEx = (i: number) => {
    updateData({ completedExercises: { ...dayData.completedExercises, [`ex_${i}`]: !dayData.completedExercises[`ex_${i}`] } });
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, #0A192F, #1E3A5F)` }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest">TODAY'S WORKOUT</span>
            <span className="text-[9px] font-black px-2 py-1 rounded-full text-white" style={{ background: INTENSITY_COLORS[workout.intensity] }}>
              {workout.intensity}
            </span>
          </div>
          <h3 className="text-base font-black text-white">{workout.name}</h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">{workout.focus}</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF7A00]">
              <Clock className="w-3.5 h-3.5" /> {workout.totalTime}
            </div>
            <div className="text-[10px] font-bold text-emerald-400">{doneCount}/{workout.exercises.length} exercises done</div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#0085FF] to-[#FF7A00] transition-all duration-500"
              style={{ width: `${Math.round((doneCount / workout.exercises.length) * 100)}%` }} />
          </div>
        </div>
        <div className="px-4 pb-3 bg-black/20">
          <p className="text-[10px] text-amber-300/80 font-semibold">⚡ Pre-workout: {workout.preworkout}</p>
        </div>
      </div>

      {/* ── GYM REST TIMER WIDGET ── */}
      <div className={`rounded-2xl p-3.5 border transition-all ${restSecondsLeft !== null && restSecondsLeft > 0 ? 'bg-orange-50 border-orange-300 shadow-md' : 'bg-white border-[#E8EEF5]'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⏱️</span>
            <div>
              <p className="text-[10px] font-black uppercase text-[#0A192F]">Gym Rest Timer</p>
              <p className="text-[9px] text-[#64748B]">Tap "Rest" on any exercise or pick a preset</p>
            </div>
          </div>
          {restSecondsLeft !== null && (
            <div className="text-right">
              <span className={`text-xl font-black font-mono ${restSecondsLeft === 0 ? 'text-emerald-600 animate-bounce' : 'text-[#FF7A00]'}`}>
                {Math.floor(restSecondsLeft / 60).toString().padStart(2, '0')}:{(restSecondsLeft % 60).toString().padStart(2, '0')}
              </span>
              {restSecondsLeft === 0 && <span className="text-[9px] font-black text-emerald-600 block">HIT NEXT SET! 🔥</span>}
            </div>
          )}
        </div>

        {/* Progress line */}
        {restSecondsLeft !== null && initialRest > 0 && (
          <div className="h-1.5 bg-orange-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.round(((initialRest - (restSecondsLeft || 0)) / initialRest) * 100)}%` }}
            />
          </div>
        )}

        {/* Timer controls */}
        <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-1">
            {[30, 60, 90, 120].map(s => (
              <button
                key={s}
                onClick={() => startRestTimer(s)}
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition ${initialRest === s && isTimerRunning ? 'bg-[#FF7A00] text-white shadow-sm' : 'bg-slate-100 hover:bg-orange-100 text-[#475569]'}`}
              >
                {s}s
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {restSecondsLeft !== null && (
              <>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-2.5 py-1 rounded-lg bg-orange-500 text-white text-[10px] font-black flex items-center gap-1"
                >
                  {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                </button>
                <button
                  onClick={() => setRestSecondsLeft(prev => (prev || 0) + 15)}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#475569] text-[10px] font-bold"
                >
                  +15s
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setRestSecondsLeft(null);
                  }}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500"
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Warm-up */}
      <div className="arc-card p-4 bg-white">
        <p className="text-[10px] font-black text-[#FF9500] uppercase mb-2">🔥 Warm-Up ({workout.warmup.length} steps)</p>
        <div className="space-y-1">
          {workout.warmup.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              <span className="text-[11px] text-[#475569]">{w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-2">
        {(showAll ? workout.exercises : workout.exercises.slice(0, 4)).map((ex, i) => {
          const done = !!dayData.completedExercises[`ex_${i}`];
          return (
            <div key={i} className={`rounded-2xl border overflow-hidden transition-all ${done ? 'border-emerald-300 bg-emerald-50/60' : 'border-[#E8EEF5] bg-white'}`}>
              <div className="flex items-start gap-3 p-3.5">
                <button
                  onClick={() => toggleEx(i)}
                  className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white hover:border-emerald-400'}`}
                >
                  {done && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black ${done ? 'line-through text-[#94A3B8]' : 'text-[#0A192F]'}`}>{ex.name}</p>
                  <div className="flex gap-2 mt-1 flex-wrap items-center">
                    <span className="text-[9px] font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{ex.sets} sets</span>
                    <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{ex.reps}</span>
                    <button
                      onClick={() => startRestTimer(parseRestSeconds(ex.rest))}
                      className="text-[9px] font-bold bg-slate-100 hover:bg-orange-100 hover:text-[#FF7A00] text-[#64748B] px-2 py-0.5 rounded-full transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>⏱️</span>
                      <span>Rest: {ex.rest}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-[#64748B] mt-1.5 italic">💡 {ex.tip}</p>
                </div>
              </div>
            </div>
          );
        })}
        {workout.exercises.length > 4 && (
          <button onClick={() => setShowAll(!showAll)}
            className="w-full py-2.5 rounded-xl border border-dashed border-[#0085FF] text-xs font-black text-[#0085FF]">
            {showAll ? '↑ Show Less' : `↓ Show All ${workout.exercises.length} Exercises`}
          </button>
        )}
      </div>

      {/* Cool-down */}
      <div className="arc-card p-4 bg-white">
        <p className="text-[10px] font-black text-[#7B61FF] uppercase mb-2">🧘 Cool-Down</p>
        <div className="space-y-1">
          {workout.cooldown.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
              <span className="text-[11px] text-[#475569]">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bruce Note */}
      <div className="rounded-2xl p-4 border-2 border-orange-200 bg-orange-50/50">
        <p className="text-[10px] font-black text-[#FF7A00] uppercase mb-1">⚡ Bruce's Mindset</p>
        <p className="text-xs text-[#475569] font-semibold italic">{workout.bruceNote}</p>
      </div>

      {/* Workout Notes */}
      <div className="arc-card p-4 bg-white">
        <p className="text-[10px] font-black text-[#0085FF] uppercase mb-2">📝 Workout Notes</p>
        <textarea rows={3}
          placeholder="How was today's workout? Any PRs? Pain? Notes for next week..."
          value={dayData.workoutNotes}
          onChange={e => updateData({ workoutNotes: e.target.value })}
          className="w-full text-xs text-[#475569] bg-slate-50 rounded-xl p-3 border border-[#E8EEF5] outline-none resize-none focus:border-[#0085FF] transition-colors placeholder:text-[#CBD5E1]" />
      </div>
    </div>
  );
}

function MealSection({ meals, dayData, updateData }: {
  meals: NKMeal[];
  dayData: DayData;
  updateData: (u: Partial<DayData>) => void;
}) {
  const doneMeals = meals.filter((_, i) => dayData.completedMeals[`meal_${i}`]).length;
  const totalProtein = meals.filter((_, i) => dayData.completedMeals[`meal_${i}`]).reduce((a, m) => a + m.protein, 0);
  const targetProtein = meals.reduce((a, m) => a + m.protein, 0);

  const toggleMeal = (i: number) => {
    updateData({ completedMeals: { ...dayData.completedMeals, [`meal_${i}`]: !dayData.completedMeals[`meal_${i}`] } });
  };

  return (
    <div className="space-y-3">
      {/* Macro summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Protein Eaten', val: `${totalProtein}g`, sub: `of ${targetProtein}g`, color: '#0085FF' },
          { label: 'Meals Done', val: `${doneMeals}/${meals.length}`, sub: 'today', color: '#10B981' },
          { label: 'Water', val: `${dayData.waterGlasses}/8`, sub: 'glasses', color: '#7B61FF' },
        ].map(s => (
          <div key={s.label} className="arc-card p-3 bg-white text-center">
            <div className="text-lg font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[9px] font-black text-[#0A192F]">{s.label}</div>
            <div className="text-[8px] text-[#94A3B8]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── INTERACTIVE 4L HYDRATION STATION ── */}
      {(() => {
        const totalMl = (dayData.waterGlasses || 0) * 250;
        const targetMl = 3500;
        const pct = Math.min(100, Math.round((totalMl / targetMl) * 100));

        let statusText = '🌅 Kickstart morning hydration with 500ml';
        if (totalMl >= 3500) statusText = '👑 100% Skin Barrier Flush Complete!';
        else if (totalMl >= 2500) statusText = '⚡ Cellular muscle hydration locked in!';
        else if (totalMl >= 1500) statusText = '💧 On track! Keep sipping throughout the afternoon';

        return (
          <div className="arc-card p-4 bg-white border border-[#E8EEF5]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">💧</span>
                <div>
                  <p className="text-[10px] font-black uppercase text-[#0085FF] tracking-wider">Hydration Engine</p>
                  <p className="text-[11px] font-black text-[#0A192F]">
                    {totalMl} ml <span className="text-slate-400 font-normal">/ {targetMl} ml target</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-[#0085FF]">{pct}%</span>
                <span className="text-[9px] text-slate-400 block font-bold">{dayData.waterGlasses} glasses</span>
              </div>
            </div>

            {/* Visual Fluid Progress Bar */}
            <div className="h-3 bg-blue-50 rounded-full overflow-hidden p-0.5 border border-blue-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0085FF] via-[#00C0FF] to-[#10B981] transition-all duration-500 shadow-sm"
                style={{ width: `${pct}%` }}
              />
            </div>

            <p className="text-[10px] text-[#475569] font-semibold mt-2">{statusText}</p>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => updateData({ waterGlasses: (dayData.waterGlasses || 0) + 1 })}
                className="py-2 px-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0085FF] text-[11px] font-black transition flex items-center justify-center gap-1 active:scale-95"
              >
                <span>+250ml</span>
                <span className="text-[9px] font-bold text-blue-400">(Glass)</span>
              </button>
              <button
                onClick={() => updateData({ waterGlasses: (dayData.waterGlasses || 0) + 2 })}
                className="py-2 px-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-black transition flex items-center justify-center gap-1 active:scale-95"
              >
                <span>+500ml</span>
                <span className="text-[9px] font-bold text-emerald-500">(Bottle)</span>
              </button>
              <button
                onClick={() => updateData({ waterGlasses: Math.max(0, (dayData.waterGlasses || 0) - 1) })}
                className="py-2 px-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-black transition flex items-center justify-center gap-1 active:scale-95"
              >
                <span>-250ml</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Meals */}
      <div className="space-y-2">
        {meals.map((meal, i) => {
          const done = !!dayData.completedMeals[`meal_${i}`];
          const [open, setOpen] = useState(false);
          return (
            <div key={i} className={`rounded-2xl border overflow-hidden transition-all ${done ? 'border-emerald-300' : 'border-[#E8EEF5]'}`}>
              <div className={`flex items-center gap-3 p-3.5 ${done ? 'bg-emerald-50/70' : 'bg-white'}`}>
                <span className="text-xl shrink-0">{meal.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{meal.time}</span>
                    <span className="text-[9px] font-black bg-slate-100 text-[#475569] px-2 py-0.5 rounded-full">{meal.label}</span>
                  </div>
                  <p className={`text-xs font-black mt-0.5 leading-tight ${done ? 'text-[#64748B]' : 'text-[#0A192F]'}`}>{meal.name}</p>
                  <p className="text-[10px] text-[#94A3B8]">{meal.protein}g protein · {meal.kcal} kcal</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setOpen(!open)} className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                  </button>
                  <button onClick={() => toggleMeal(i)}
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white hover:border-emerald-400'}`}>
                    {done && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                </div>
              </div>
              {open && (
                <div className="border-t border-[#E8EEF5] p-3 space-y-2 bg-slate-50/50">
                  <p className="text-[10px] font-black text-[#0085FF] uppercase">What to Make</p>
                  <ul className="space-y-1">
                    {meal.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-[11px] text-[#475569]">
                        <span className="text-emerald-500 shrink-0 font-black">•</span>{item}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl bg-orange-50 border border-orange-100 p-2">
                    <p className="text-[9px] font-black text-[#FF7A00] uppercase mb-0.5">🔥 Bruce's Tip</p>
                    <p className="text-[11px] text-[#475569]">{meal.tip}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkinSection({ dayData, updateData }: {
  dayData: DayData;
  updateData: (u: Partial<DayData>) => void;
}) {
  const [protocol, setProtocol] = useState<'AM' | 'PM'>('AM');
  const steps = protocol === 'AM' ? AM_SKIN_STEPS : PM_SKIN_STEPS;
  const amDone = AM_SKIN_STEPS.filter(s => dayData.completedSkinSteps[s.id]).length;
  const pmDone = PM_SKIN_STEPS.filter(s => dayData.completedSkinSteps[s.id]).length;

  const toggleStep = (id: string) => {
    updateData({ completedSkinSteps: { ...dayData.completedSkinSteps, [id]: !dayData.completedSkinSteps[id] } });
  };

  return (
    <div className="space-y-3">
      {/* Skin condition */}
      <div className="arc-card p-4 bg-white">
        <p className="text-[10px] font-black text-[#A855F7] uppercase mb-2">✨ Today's Skin Condition</p>
        <div className="flex gap-2 flex-wrap">
          {SKIN_COND.map((c, i) => (
            <button key={i} onClick={() => updateData({ skinCondition: i + 1 })}
              className={`text-[10px] font-black px-3 py-1.5 rounded-xl border transition-all ${dayData.skinCondition === i + 1 ? 'border-[#A855F7] bg-purple-50 text-[#A855F7]' : 'border-[#E8EEF5] text-[#94A3B8]'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Protocol toggle */}
      <div className="flex gap-2">
        <button onClick={() => setProtocol('AM')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${protocol === 'AM' ? 'text-white shadow-md' : 'bg-slate-100 text-[#64748B]'}`}
          style={protocol === 'AM' ? { background: 'linear-gradient(135deg, #FF9500, #FF7A00)' } : {}}>
          ☀️ AM ({amDone}/{AM_SKIN_STEPS.length} done)
        </button>
        <button onClick={() => setProtocol('PM')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${protocol === 'PM' ? 'text-white shadow-md' : 'bg-slate-100 text-[#64748B]'}`}
          style={protocol === 'PM' ? { background: 'linear-gradient(135deg, #7B61FF, #A855F7)' } : {}}>
          🌙 PM ({pmDone}/{PM_SKIN_STEPS.length} done)
        </button>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map(step => {
          const done = !!dayData.completedSkinSteps[step.id];
          const [open, setOpen] = useState(false);
          return (
            <div key={step.id} className={`rounded-2xl border overflow-hidden ${done ? 'border-emerald-300 bg-emerald-50/50' : 'border-[#E8EEF5] bg-white'}`}>
              <div className="flex items-center gap-3 p-3.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-black ${done ? 'bg-emerald-500' : 'bg-gradient-to-br from-[#A855F7] to-[#7B61FF]'}`}>
                  {done ? '✓' : step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black ${done ? 'line-through text-[#94A3B8]' : 'text-[#0A192F]'}`}>{step.emoji} {step.product}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setOpen(!open)} className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                  </button>
                  <button onClick={() => toggleStep(step.id)}
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white hover:border-[#A855F7]'}`}>
                    {done && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                </div>
              </div>
              {open && (
                <div className="border-t border-[#E8EEF5] p-3 space-y-2 bg-slate-50/50">
                  <div className="rounded-xl bg-blue-50 p-2.5">
                    <p className="text-[9px] font-black text-[#0085FF] uppercase mb-1">HOW TO APPLY</p>
                    <p className="text-[11px] text-[#475569]">{step.instruction}</p>
                  </div>
                  <div className="rounded-xl bg-purple-50 p-2.5">
                    <p className="text-[9px] font-black text-[#A855F7] uppercase mb-1">WHY THIS STEP</p>
                    <p className="text-[11px] text-[#475569]">{step.why}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Skin notes */}
      <div className="arc-card p-4 bg-white">
        <p className="text-[10px] font-black text-[#A855F7] uppercase mb-2">📝 Skin Notes Today</p>
        <textarea rows={3}
          placeholder="How does skin feel? Any breakouts? Changes in pigmentation? Redness? Log it."
          value={dayData.skinNotes}
          onChange={e => updateData({ skinNotes: e.target.value })}
          className="w-full text-xs text-[#475569] bg-slate-50 rounded-xl p-3 border border-[#E8EEF5] outline-none resize-none focus:border-[#A855F7] transition-colors placeholder:text-[#CBD5E1]" />
      </div>
    </div>
  );
}

function PhotoSection({ dayData, updateData }: { dayData: DayData; updateData: (u: Partial<DayData>) => void }) {
  const [viewPhoto, setViewPhoto] = useState<DayPhoto | null>(null);
  const [activeType, setActiveType] = useState<DayPhoto['type'] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeType) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      updateData({ photos: [...dayData.photos, { type: activeType, dataUrl, caption: PHOTO_TYPES.find(p => p.key === activeType)?.label || '', timestamp: new Date().toLocaleString('en-IN') }] });
      setActiveType(null);
      if (fileRef.current) fileRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = (idx: number) => updateData({ photos: dayData.photos.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-4">
      {viewPhoto && <PhotoViewer photo={viewPhoto} onClose={() => setViewPhoto(null)} />}
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

      <div className="rounded-2xl p-4 bg-purple-50 border-2 border-purple-100">
        <p className="text-xs font-black text-[#7B61FF] mb-1">📸 Daily Documentation Rule</p>
        <p className="text-[11px] text-[#475569]">
          Take at least <strong>Face/Skin photo</strong> every single day. Take <strong>Body photo</strong> every Sunday. Day-to-day changes are invisible — monthly comparison photos show DRAMATIC transformation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {PHOTO_TYPES.map(pt => {
          const existing = dayData.photos.filter(p => p.type === pt.key);
          return (
            <div key={pt.key} className="arc-card bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8EEF5]">
                <div>
                  <p className="text-xs font-black text-[#0A192F]">{pt.emoji} {pt.label}</p>
                  <p className="text-[10px] text-[#94A3B8]">{pt.hint}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#0085FF]">{existing.length} photo{existing.length !== 1 ? 's' : ''}</span>
                  <button onClick={() => { setActiveType(pt.key); setTimeout(() => fileRef.current?.click(), 100); }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #7B61FF, #A855F7)' }}>
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {existing.length > 0 ? (
                <div className="p-3 grid grid-cols-4 gap-2">
                  {existing.map((photo, i) => {
                    const globalIndex = dayData.photos.indexOf(photo);
                    return (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100">
                        <img src={photo.dataUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                          <button onClick={() => setViewPhoto(photo)} className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center"><ZoomIn className="w-3 h-3 text-[#0A192F]" /></button>
                          <button onClick={() => deletePhoto(globalIndex)} className="w-6 h-6 bg-red-500/90 rounded-full flex items-center justify-center"><Trash2 className="w-3 h-3 text-white" /></button>
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={() => { setActiveType(pt.key); setTimeout(() => fileRef.current?.click(), 100); }}
                    className="aspect-square rounded-xl border-2 border-dashed border-[#E8EEF5] flex items-center justify-center hover:border-[#7B61FF] transition-all">
                    <span className="text-[10px] font-black text-[#94A3B8]">+ Add</span>
                  </button>
                </div>
              ) : (
                <button onClick={() => { setActiveType(pt.key); setTimeout(() => fileRef.current?.click(), 100); }}
                  className="w-full h-16 flex items-center justify-center gap-2 text-[#94A3B8] hover:text-[#7B61FF] hover:bg-purple-50 transition-all">
                  <Upload className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Upload {pt.label}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DiarySection({ dayData, updateData }: { dayData: DayData; updateData: (u: Partial<DayData>) => void }) {
  return (
    <div className="space-y-4">
      {/* Weight */}
      <div className="arc-card p-4 bg-white">
        <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">⚖️ Morning Weight (fasted)</p>
        <div className="flex items-center gap-3">
          <input type="number" step="0.1" placeholder="70.0"
            value={dayData.weight}
            onChange={e => updateData({ weight: e.target.value })}
            className="text-3xl font-black text-[#0A192F] bg-transparent outline-none w-24 placeholder:text-[#E2E8F0]" />
          <span className="text-lg font-bold text-[#64748B]">kg</span>
          <div className="ml-auto text-right">
            <p className="text-[10px] font-black text-[#0085FF]">Target: 63 kg</p>
            {dayData.weight && <p className="text-[10px] text-[#94A3B8]">{(parseFloat(dayData.weight) - 63).toFixed(1)} kg to go</p>}
          </div>
        </div>
      </div>

      {/* Mood + Energy + Skin */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Mood', emoji: MOODS, key: 'mood' as const, color: '#FF7A00' },
          { label: 'Energy', emoji: ENERGY_LEVELS, key: 'energyLevel' as const, color: '#7B61FF' },
        ].map(item => (
          <div key={item.key} className="arc-card p-3 bg-white col-span-1">
            <p className="text-[9px] font-black uppercase mb-1" style={{ color: item.color }}>{item.label}</p>
            <div className="flex flex-col gap-1">
              {item.emoji.map((e, i) => (
                <button key={i} onClick={() => updateData({ [item.key]: i + 1 })}
                  className={`text-base transition-transform text-left ${dayData[item.key] === i + 1 ? 'scale-125' : 'opacity-40'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="arc-card p-3 bg-white col-span-1">
          <p className="text-[9px] font-black text-[#A855F7] uppercase mb-1">Skin</p>
          <div className="flex flex-col gap-1">
            {['😰','😟','😐','🙂','✨'].map((e, i) => (
              <button key={i} onClick={() => updateData({ skinCondition: i + 1 })}
                className={`text-base transition-transform text-left ${dayData.skinCondition === i + 1 ? 'scale-125' : 'opacity-40'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Journal */}
      <div className="arc-card p-4 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-[#7B61FF]" />
          <p className="text-[10px] font-black text-[#7B61FF] uppercase">Daily Journal</p>
        </div>
        <textarea rows={5}
          placeholder="Write 3 things:&#10;1. What did I do well today?&#10;2. What can I improve tomorrow?&#10;3. One thing I'm grateful for."
          value={dayData.note}
          onChange={e => updateData({ note: e.target.value })}
          className="w-full text-xs text-[#475569] bg-slate-50 rounded-xl p-3 border border-[#E8EEF5] outline-none resize-none focus:border-[#7B61FF] transition-colors placeholder:text-[#CBD5E1]" />
      </div>

      {/* Day summary */}
      {(dayData.note || dayData.weight || dayData.workoutNotes) && (
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[10px] font-black text-emerald-700 uppercase mb-2">✅ Day Documented</p>
          <div className="space-y-1 text-[11px] text-[#475569]">
            {dayData.weight && <p>⚖️ Weight logged: <strong>{dayData.weight} kg</strong></p>}
            {dayData.workoutNotes && <p>💪 Workout notes saved</p>}
            {dayData.skinNotes && <p>✨ Skin notes saved</p>}
            {dayData.note && <p>📔 Journal entry written</p>}
            {dayData.photos.length > 0 && <p>📸 {dayData.photos.length} photos captured</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function ArcDayPage() {
  const currentArcDay = getCurrentArcDay();
  const totalArcDays = 457;

  const [viewDay, setViewDay] = useState(currentArcDay);
  const [dayData, setDayData] = useState<DayData>(defaultData());
  const [section, setSection] = useState<'workout' | 'meals' | 'skin' | 'photos' | 'diary' | 'matrix'>('workout');

  useEffect(() => { setDayData(loadDayData(viewDay)); }, [viewDay]);

  const updateData = useCallback((updates: Partial<DayData>) => {
    setDayData(prev => {
      const next = { ...prev, ...updates };
      saveDayData(viewDay, next);
      return next;
    });
  }, [viewDay]);

  const weekday = getWeekdayForArcDay(viewDay);
  const workout = WORKOUTS_BY_DAY[weekday];
  const meals = NK_MEALS_BY_DAY[weekday];

  // Overall day score
  const exDone = workout.exercises.filter((_, i) => dayData.completedExercises[`ex_${i}`]).length;
  const skinDone = [...AM_SKIN_STEPS, ...PM_SKIN_STEPS].filter(s => dayData.completedSkinSteps[s.id]).length;
  const mealDone = meals.filter((_, i) => dayData.completedMeals[`meal_${i}`]).length;
  const totalItems = workout.exercises.length + AM_SKIN_STEPS.length + PM_SKIN_STEPS.length + meals.length;
  const totalDone = exDone + skinDone + mealDone;
  const score = Math.round((totalDone / totalItems) * 100);

  const isToday = viewDay === currentArcDay;
  const isFuture = viewDay > currentArcDay;

  const SECTIONS = [
    { key: 'workout', label: '💪 Workout', count: `${exDone}/${workout.exercises.length}` },
    { key: 'meals',   label: '🌾 Meals',   count: `${mealDone}/${meals.length}` },
    { key: 'skin',    label: '✨ Skin',    count: `${skinDone}/${AM_SKIN_STEPS.length + PM_SKIN_STEPS.length}` },
    { key: 'photos',  label: '📸 Photos',  count: dayData.photos.length > 0 ? `${dayData.photos.length}` : '' },
    { key: 'diary',   label: '📔 Diary',   count: '' },
    { key: 'matrix',  label: '📅 Matrix',  count: '' },
  ] as const;

  return (
    <ResponsiveShell>
      <div className="w-full max-w-2xl mx-auto py-4 px-4 pb-36">

        {/* ── DAY NAVIGATOR ── */}
        <div className="rounded-3xl overflow-hidden mb-4" style={{ background: 'linear-gradient(135deg, #0A192F, #1E3A5F, #2D1B4E)' }}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-[#FF7A00] tracking-widest">
                WINTER ARC 2026 → 2027
              </span>
              <button
                onClick={exportAllDataBackup}
                title="Download JSON backup of all logged days & photos"
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black transition border border-white/10 active:scale-95"
              >
                <Download className="w-3 h-3 text-[#FF7A00]" />
                <span>Backup Data</span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setViewDay(d => Math.max(1, d - 1))} disabled={viewDay <= 1}
                className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/25">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                  <span className="text-2xl font-black text-white">Day {viewDay}</span>
                  {isToday && <span className="text-[9px] font-black bg-[#FF7A00] text-white px-2 py-0.5 rounded-full animate-pulse">TODAY</span>}
                  {isFuture && <span className="text-[9px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full">FUTURE</span>}
                </div>
                <p className="text-xs font-bold text-white/60">{getDateForDay(viewDay)}</p>
                <p className="text-[11px] font-bold mt-1" style={{ color: INTENSITY_COLORS[workout.intensity] }}>
                  {workout.name}
                </p>
              </div>
              <button onClick={() => setViewDay(d => Math.min(totalArcDays, d + 1))} disabled={viewDay >= totalArcDays}
                className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/25">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day score */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold text-white/60 mb-1">
                  <span>Day Score: {totalDone}/{totalItems}</span>
                  <span className="font-black text-white">{score}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${score}%`,
                    background: 'linear-gradient(90deg, #0085FF, #7B61FF, #FF7A00)',
                  }} />
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[
                { label: 'Workout', val: `${exDone}/${workout.exercises.length}`, color: '#FF7A00' },
                { label: 'Meals', val: `${mealDone}/${meals.length}`, color: '#10B981' },
                { label: 'Skin', val: `${skinDone}/${AM_SKIN_STEPS.length + PM_SKIN_STEPS.length}`, color: '#A855F7' },
                { label: 'Photos', val: dayData.photos.length, color: '#0085FF' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="text-sm font-black text-white">{s.val}</div>
                  <div className="text-[8px] font-bold" style={{ color: s.color }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION TABS ── */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {SECTIONS.map(tab => (
            <button key={tab.key} onClick={() => setSection(tab.key)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 ${section === tab.key ? 'text-white shadow-md' : 'bg-slate-100 text-[#64748B]'}`}
              style={section === tab.key ? { background: 'linear-gradient(135deg, #0085FF, #7B61FF)' } : {}}>
              {tab.label}
              {tab.count && (
                <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black ${section === tab.key ? 'bg-white/20 text-white' : 'bg-white text-[#0085FF]'}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        {section === 'workout' && <WorkoutSection workout={workout} dayData={dayData} updateData={updateData} />}
        {section === 'meals'   && <MealSection meals={meals} dayData={dayData} updateData={updateData} />}
        {section === 'skin'    && <SkinSection dayData={dayData} updateData={updateData} />}
        {section === 'photos'  && <PhotoSection dayData={dayData} updateData={updateData} />}
        {section === 'diary'   && <DiarySection dayData={dayData} updateData={updateData} />}

        {section === 'matrix' && (
          <div className="space-y-4">
            <div className="arc-card p-5 bg-white">
              <h3 className="text-sm font-black text-[#0A192F] mb-1">Arc Progress Matrix</h3>
              <p className="text-[10px] text-[#64748B] mb-4">Day 1 → Day {currentArcDay} · Tap any day to open it</p>
              <div className="grid grid-cols-7 gap-1">
                {['S','M','T','W','T','F','S'].map((d,i) => (
                  <div key={i} className="text-center text-[9px] font-black text-[#94A3B8] pb-1">{d}</div>
                ))}
                {Array.from({ length: 4 }).map((_,i) => <div key={`e${i}`} />)}
                {Array.from({ length: Math.min(currentArcDay, 90) }, (_, i) => {
                  const d = i + 1;
                  const dd = loadDayData(d);
                  const exD = Object.values(dd.completedExercises).filter(Boolean).length;
                  const skinD = Object.values(dd.completedSkinSteps).filter(Boolean).length;
                  const mealD = Object.values(dd.completedMeals).filter(Boolean).length;
                  const wk = getWeekdayForArcDay(d);
                  const totalI = WORKOUTS_BY_DAY[wk].exercises.length + AM_SKIN_STEPS.length + PM_SKIN_STEPS.length + NK_MEALS_BY_DAY[wk].length;
                  const pct = Math.round(((exD + skinD + mealD) / totalI) * 100);
                  const isSelected = d === viewDay;
                  const bg = pct >= 80 ? '#10B981' : pct >= 40 ? '#FF9500' : pct > 0 ? '#94A3B8' : d === currentArcDay ? 'linear-gradient(135deg,#0085FF,#7B61FF)' : '#F1F5F9';
                  return (
                    <button key={d} onClick={() => { setViewDay(d); setSection('workout'); }}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 ${isSelected ? 'ring-2 ring-[#0085FF] ring-offset-1 scale-110' : ''}`}
                      style={{ background: bg }}>
                      <span className="text-[9px] font-black text-white">{d}</span>
                      {dd.photos.length > 0 && <div className="w-1 h-1 rounded-full bg-white/80 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-3 text-[9px] font-bold text-[#64748B]">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500"/><span>80%+</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-400"/><span>40-79%</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-slate-300"/><span>Started</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#0085FF]"/><span>Has photos</span></div>
              </div>
            </div>
          </div>
        )}

      </div>
    </ResponsiveShell>
  );
}
