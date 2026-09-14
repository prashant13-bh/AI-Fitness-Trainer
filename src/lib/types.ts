// ============================================================
// WINTER ARCH — Core TypeScript Types
// ============================================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  level: UserLevel;
  xp: number;
  streak: number;
  longestStreak: number;
  joinedAt: string;
  profile: UserProfile;
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  goal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  daysPerWeek: number;
  dietPreference: DietPreference;
}

export type UserLevel = 'rookie' | 'iron' | 'steel' | 'diamond' | 'legend';
export type FitnessGoal = 'lose-weight' | 'build-muscle' | 'get-fit' | 'increase-strength' | 'improve-endurance';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type DietPreference = 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';

// ============================================================
// WORKOUTS
// ============================================================

export interface Exercise {
  id: string;
  name: string;
  emoji: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  equipment: string[];
  difficulty: FitnessLevel;
  sets?: number;
  reps?: number;
  duration?: number; // seconds
  restTime?: number; // seconds
  instructions: string[];
  cues?: string[]; // AI coaching cues
}

export type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'yoga';
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'full-body';

export interface Workout {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: ExerciseCategory;
  difficulty: FitnessLevel;
  duration: number; // minutes
  exercises: Exercise[];
  caloriesBurn: number;
  tags: string[];
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutName: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  duration: number; // minutes
  caloriesBurned: number;
  exercisesCompleted: number;
  totalExercises: number;
  notes?: string;
  mood?: 1 | 2 | 3 | 4 | 5;
}

// ============================================================
// HABITS
// ============================================================

export interface Habit {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  category: HabitCategory;
  frequency: 'daily' | 'weekly';
  targetDays: number; // per week
  color: string;
  createdAt: string;
  completions: HabitCompletion[];
  streak: number;
  longestStreak: number;
}

export type HabitCategory = 'workout' | 'nutrition' | 'mindfulness' | 'sleep' | 'hydration' | 'custom';

export interface HabitCompletion {
  date: string; // YYYY-MM-DD
  completedAt: string;
  note?: string;
}

// ============================================================
// CHALLENGES
// ============================================================

export interface Challenge {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  emoji: string;
  duration: 30 | 60 | 90;
  startDate: string;
  endDate: string;
  tasks: ChallengeTask[];
  xpReward: number;
  badge: string;
  participants?: number;
}

export interface ChallengeTask {
  day: number;
  title: string;
  description: string;
  xp: number;
  workoutId?: string;
  habitIds?: string[];
  completed: boolean;
  completedAt?: string;
}

export interface UserChallenge {
  userId: string;
  challengeId: string;
  startedAt: string;
  currentDay: number;
  completedDays: number[];
  xpEarned: number;
  isCompleted: boolean;
}

// ============================================================
// NUTRITION
// ============================================================

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber?: number; // g
  serving: string;
  servingSize: number; // g
}

export interface MealLog {
  id: string;
  userId: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: MealLogItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  loggedAt: string;
}

export interface MealLogItem {
  foodId: string;
  foodName: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WaterLog {
  userId: string;
  date: string;
  intake: number; // ml
  goal: number; // ml
  logs: { time: string; amount: number }[];
}

// ============================================================
// AI PLANNER
// ============================================================

export interface WeeklyPlan {
  id: string;
  userId: string;
  weekOf: string; // Start of week ISO
  days: DayPlan[];
  generatedAt: string;
  aiModel: string;
}

export interface DayPlan {
  dayOfWeek: number; // 0-6
  workout?: Workout;
  isRestDay: boolean;
  meals: AIMeal[];
  habits: string[]; // habit ids
  aiTip: string;
}

export interface AIMeal {
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  recipe?: string;
}

// ============================================================
// PROGRESS / ANALYTICS
// ============================================================

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  note?: string;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  date: string;
  url: string;
  view: 'front' | 'side' | 'back';
}

// ============================================================
// AI CHAT
// ============================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ============================================================
// LEVELS & XP
// ============================================================

export const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  rookie: 0,
  iron: 500,
  steel: 1500,
  diamond: 3500,
  legend: 7000,
};

export const XP_REWARDS = {
  completedWorkout: 50,
  completedHabit: 10,
  completedChallenge: 200,
  logged7DayStreak: 100,
  logged30DayStreak: 500,
  loggedMeal: 5,
  loggedWater: 2,
};

export function getUserLevel(xp: number): UserLevel {
  if (xp >= LEVEL_THRESHOLDS.legend) return 'legend';
  if (xp >= LEVEL_THRESHOLDS.diamond) return 'diamond';
  if (xp >= LEVEL_THRESHOLDS.steel) return 'steel';
  if (xp >= LEVEL_THRESHOLDS.iron) return 'iron';
  return 'rookie';
}

export function getNextLevelXP(level: UserLevel): number {
  const levels: UserLevel[] = ['rookie', 'iron', 'steel', 'diamond', 'legend'];
  const idx = levels.indexOf(level);
  if (idx === levels.length - 1) return LEVEL_THRESHOLDS.legend;
  return LEVEL_THRESHOLDS[levels[idx + 1]];
}
