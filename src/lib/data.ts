// ============================================================
// WINTER ARCH — Workout & Exercise Database
// ============================================================

import { Workout, Exercise } from './types';

export const EXERCISES: Exercise[] = [
  // ---- CHEST ----
  {
    id: 'push-up',
    name: 'Push-Up',
    emoji: '💪',
    category: 'strength',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    equipment: [],
    difficulty: 'beginner',
    sets: 3,
    reps: 12,
    restTime: 60,
    instructions: [
      'Start in high plank with hands shoulder-width apart',
      'Lower chest toward floor, keeping elbows at 45°',
      'Push back up to starting position',
      'Keep core tight throughout'
    ],
    cues: ['Squeeze your chest at the top', 'Keep your body in a straight line', 'Breathe out as you push up']
  },
  {
    id: 'diamond-push-up',
    name: 'Diamond Push-Up',
    emoji: '💎',
    category: 'strength',
    muscleGroups: ['chest', 'arms'],
    equipment: [],
    difficulty: 'intermediate',
    sets: 3,
    reps: 10,
    restTime: 60,
    instructions: [
      'Form a diamond shape with thumbs and index fingers',
      'Lower your chest to your hands',
      'Push back up focusing on triceps'
    ],
    cues: ['Keep elbows close to body', 'Feel the tricep burn']
  },
  // ---- BACK ----
  {
    id: 'pull-up',
    name: 'Pull-Up',
    emoji: '🏋️',
    category: 'strength',
    muscleGroups: ['back', 'arms'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    sets: 3,
    reps: 8,
    restTime: 90,
    instructions: [
      'Grip bar shoulder-width, palms facing away',
      'Hang with arms fully extended',
      'Pull chest to bar, squeezing lats',
      'Lower slowly'
    ],
    cues: ['Drive elbows to hips', 'Avoid swinging', 'Full range of motion']
  },
  {
    id: 'superman',
    name: 'Superman',
    emoji: '🦸',
    category: 'strength',
    muscleGroups: ['back', 'core'],
    equipment: [],
    difficulty: 'beginner',
    sets: 3,
    reps: 15,
    restTime: 45,
    instructions: [
      'Lie face down, arms extended overhead',
      'Lift arms, chest and legs simultaneously',
      'Squeeze glutes and back muscles',
      'Hold 2 seconds then lower'
    ],
    cues: ['Squeeze like you are flying', 'Keep neck neutral']
  },
  // ---- LEGS ----
  {
    id: 'squat',
    name: 'Bodyweight Squat',
    emoji: '🍑',
    category: 'strength',
    muscleGroups: ['legs', 'core'],
    equipment: [],
    difficulty: 'beginner',
    sets: 3,
    reps: 15,
    restTime: 60,
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower until thighs are parallel to floor',
      'Keep chest up and knees over toes',
      'Drive through heels to stand'
    ],
    cues: ['Sit back like a chair', 'Keep chest proud', 'Weight in heels']
  },
  {
    id: 'lunge',
    name: 'Reverse Lunge',
    emoji: '🦵',
    category: 'strength',
    muscleGroups: ['legs', 'core'],
    equipment: [],
    difficulty: 'beginner',
    sets: 3,
    reps: 12,
    restTime: 60,
    instructions: [
      'Step one foot back and lower knee toward floor',
      'Keep front knee over ankle',
      'Push front foot to return to standing'
    ],
    cues: ['Tall spine', 'Control the descent']
  },
  {
    id: 'jump-squat',
    name: 'Jump Squat',
    emoji: '⚡',
    category: 'hiit',
    muscleGroups: ['legs', 'core'],
    equipment: [],
    difficulty: 'intermediate',
    sets: 3,
    reps: 10,
    restTime: 90,
    instructions: [
      'Perform a regular squat',
      'Explode upward at full extension',
      'Land softly with bent knees',
      'Immediately load the next squat'
    ],
    cues: ['Explode through heels', 'Soft landing', 'Stay powerful']
  },
  // ---- CORE ----
  {
    id: 'plank',
    name: 'Plank Hold',
    emoji: '🧱',
    category: 'strength',
    muscleGroups: ['core', 'shoulders'],
    equipment: [],
    difficulty: 'beginner',
    sets: 3,
    duration: 45,
    restTime: 45,
    instructions: [
      'Start in forearm plank',
      'Body in straight line from head to heels',
      'Squeeze abs and glutes',
      'Breathe steadily'
    ],
    cues: ['Do not let hips sag', 'Squeeze everything', 'Breathe through it']
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climbers',
    emoji: '⛰️',
    category: 'hiit',
    muscleGroups: ['core', 'legs', 'chest'],
    equipment: [],
    difficulty: 'intermediate',
    sets: 3,
    duration: 30,
    restTime: 60,
    instructions: [
      'Start in high plank position',
      'Drive one knee to chest',
      'Alternate rapidly as if running in place',
      'Keep hips level'
    ],
    cues: ['Keep core tight', 'Drive the knees hard', 'Stay fast']
  },
  {
    id: 'bicycle-crunch',
    name: 'Bicycle Crunches',
    emoji: '🚴',
    category: 'strength',
    muscleGroups: ['core'],
    equipment: [],
    difficulty: 'beginner',
    sets: 3,
    reps: 20,
    restTime: 45,
    instructions: [
      'Lie on back with hands behind head',
      'Bring opposite elbow to opposite knee',
      'Extend other leg simultaneously',
      'Alternate sides in cycling motion'
    ],
    cues: ['Twist from the core', 'Do not pull your neck', 'Control the movement']
  },
  // ---- CARDIO ----
  {
    id: 'burpee',
    name: 'Burpee',
    emoji: '🔥',
    category: 'hiit',
    muscleGroups: ['full-body'],
    equipment: [],
    difficulty: 'intermediate',
    sets: 3,
    reps: 8,
    restTime: 90,
    instructions: [
      'Stand, then squat and place hands on floor',
      'Jump feet back to plank',
      'Perform a push-up',
      'Jump feet forward, then jump up with arms overhead'
    ],
    cues: ['Embrace the burn', 'Stay explosive', 'Every rep counts']
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    emoji: '⭐',
    category: 'cardio',
    muscleGroups: ['full-body'],
    equipment: [],
    difficulty: 'beginner',
    sets: 3,
    duration: 45,
    restTime: 30,
    instructions: [
      'Stand with feet together, arms at sides',
      'Jump feet apart while raising arms overhead',
      'Jump back to starting position',
      'Maintain rhythm'
    ],
    cues: ['Keep the pace', 'Arms fully overhead', 'Soft landing']
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    emoji: '🏃',
    category: 'cardio',
    muscleGroups: ['legs', 'core'],
    equipment: [],
    difficulty: 'beginner',
    sets: 3,
    duration: 30,
    restTime: 45,
    instructions: [
      'Stand with feet hip-width apart',
      'Drive knees to hip height alternately',
      'Pump arms in opposition',
      'Stay on balls of feet'
    ],
    cues: ['Drive those knees up', 'Pump the arms', 'Fast feet']
  },
];

export const WORKOUTS: Workout[] = [
  {
    id: 'winter-arch-day1',
    name: 'Winter Arch Ignition',
    emoji: '❄️',
    description: 'The official Winter Arch kickoff workout. Full body activation to set the tone for your challenge.',
    category: 'hiit',
    difficulty: 'beginner',
    duration: 30,
    exercises: [
      EXERCISES.find(e => e.id === 'jumping-jacks')!,
      EXERCISES.find(e => e.id === 'squat')!,
      EXERCISES.find(e => e.id === 'push-up')!,
      EXERCISES.find(e => e.id === 'mountain-climber')!,
      EXERCISES.find(e => e.id === 'plank')!,
    ],
    caloriesBurn: 250,
    tags: ['challenge', 'full-body', 'winter-arch'],
  },
  {
    id: 'power-push',
    name: 'Power Push Day',
    emoji: '💥',
    description: 'Chest, shoulders, and triceps hypertrophy session for serious upper body gains.',
    category: 'strength',
    difficulty: 'intermediate',
    duration: 45,
    exercises: [
      EXERCISES.find(e => e.id === 'push-up')!,
      EXERCISES.find(e => e.id === 'diamond-push-up')!,
      EXERCISES.find(e => e.id === 'plank')!,
    ],
    caloriesBurn: 220,
    tags: ['upper-body', 'strength', 'push'],
  },
  {
    id: 'leg-blaster',
    name: 'Leg Day Blaster',
    emoji: '🔥',
    description: 'Quads, hamstrings, and glutes — the ultimate lower body burner.',
    category: 'strength',
    difficulty: 'intermediate',
    duration: 40,
    exercises: [
      EXERCISES.find(e => e.id === 'squat')!,
      EXERCISES.find(e => e.id === 'lunge')!,
      EXERCISES.find(e => e.id === 'jump-squat')!,
    ],
    caloriesBurn: 300,
    tags: ['legs', 'strength', 'glutes'],
  },
  {
    id: 'core-crusher',
    name: 'Core Crusher',
    emoji: '🧱',
    description: 'Sculpt your core with this intense abs and stability workout.',
    category: 'strength',
    difficulty: 'beginner',
    duration: 25,
    exercises: [
      EXERCISES.find(e => e.id === 'plank')!,
      EXERCISES.find(e => e.id === 'bicycle-crunch')!,
      EXERCISES.find(e => e.id === 'mountain-climber')!,
      EXERCISES.find(e => e.id === 'superman')!,
    ],
    caloriesBurn: 180,
    tags: ['core', 'abs', 'stability'],
  },
  {
    id: 'hiit-storm',
    name: 'HIIT Storm',
    emoji: '⚡',
    description: 'Maximum calorie burn in minimum time. High intensity intervals that will push your limits.',
    category: 'hiit',
    difficulty: 'advanced',
    duration: 20,
    exercises: [
      EXERCISES.find(e => e.id === 'burpee')!,
      EXERCISES.find(e => e.id === 'jump-squat')!,
      EXERCISES.find(e => e.id === 'mountain-climber')!,
      EXERCISES.find(e => e.id === 'high-knees')!,
    ],
    caloriesBurn: 350,
    tags: ['hiit', 'fat-burn', 'cardio'],
  },
  {
    id: 'back-attack',
    name: 'Back Attack',
    emoji: '🏋️',
    description: 'Build a strong, powerful back with this bodyweight pulling routine.',
    category: 'strength',
    difficulty: 'intermediate',
    duration: 35,
    exercises: [
      EXERCISES.find(e => e.id === 'pull-up')!,
      EXERCISES.find(e => e.id === 'superman')!,
      EXERCISES.find(e => e.id === 'plank')!,
    ],
    caloriesBurn: 200,
    tags: ['back', 'pull', 'posture'],
  },
  {
    id: 'morning-energy',
    name: 'Morning Energy Boost',
    emoji: '🌅',
    description: 'A gentle but effective morning routine to wake up your body and mind.',
    category: 'cardio',
    difficulty: 'beginner',
    duration: 15,
    exercises: [
      EXERCISES.find(e => e.id === 'jumping-jacks')!,
      EXERCISES.find(e => e.id === 'high-knees')!,
      EXERCISES.find(e => e.id === 'squat')!,
    ],
    caloriesBurn: 120,
    tags: ['morning', 'beginner', 'cardio'],
  },
];

// Winter Arch Challenge
export const WINTER_ARCH_CHALLENGE = {
  id: 'winter-arch-2026',
  name: 'Winter Arch',
  subtitle: '30-Day Transformation Challenge',
  description: 'Transform your body and mind in 30 days with AI-powered workouts, habit tracking, and daily challenges.',
  emoji: '❄️',
  duration: 30 as const,
  startDate: '2026-09-01',
  endDate: '2026-09-30',
  xpReward: 2000,
  badge: '🏔️',
  participants: 1247,
};

// Default habits
export const DEFAULT_HABITS = [
  { name: '💧 Drink 2L Water', emoji: '💧', category: 'hydration' as const, color: '#00D4FF' },
  { name: '🏃 30 Min Workout', emoji: '🏃', category: 'workout' as const, color: '#7B2FBE' },
  { name: '😴 8 Hours Sleep', emoji: '😴', category: 'sleep' as const, color: '#6366F1' },
  { name: '🥗 Eat Healthy', emoji: '🥗', category: 'nutrition' as const, color: '#10B981' },
  { name: '🧘 Meditate', emoji: '🧘', category: 'mindfulness' as const, color: '#F59E0B' },
];

// Food database
export const FOOD_DATABASE = [
  { id: 'chicken-breast', name: 'Chicken Breast', emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g', servingSize: 100 },
  { id: 'brown-rice', name: 'Brown Rice', emoji: '🍚', calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup cooked', servingSize: 195 },
  { id: 'egg', name: 'Whole Egg', emoji: '🥚', calories: 78, protein: 6, carbs: 0.6, fat: 5, serving: '1 large egg', servingSize: 50 },
  { id: 'banana', name: 'Banana', emoji: '🍌', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: '1 medium', servingSize: 118 },
  { id: 'greek-yogurt', name: 'Greek Yogurt', emoji: '🥛', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '170g', servingSize: 170 },
  { id: 'oats', name: 'Rolled Oats', emoji: '🌾', calories: 150, protein: 5, carbs: 27, fat: 2.5, serving: '0.5 cup dry', servingSize: 40 },
  { id: 'salmon', name: 'Salmon', emoji: '🐟', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g', servingSize: 100 },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup', servingSize: 91 },
  { id: 'sweet-potato', name: 'Sweet Potato', emoji: '🍠', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, serving: '1 medium', servingSize: 130 },
  { id: 'almonds', name: 'Almonds', emoji: '🥜', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '28g (1 oz)', servingSize: 28 },
  { id: 'tuna', name: 'Canned Tuna', emoji: '🐠', calories: 120, protein: 25, carbs: 0, fat: 2, serving: '100g drained', servingSize: 100 },
  { id: 'whey-protein', name: 'Whey Protein', emoji: '💪', calories: 120, protein: 25, carbs: 2, fat: 1.5, serving: '1 scoop (30g)', servingSize: 30 },
];
