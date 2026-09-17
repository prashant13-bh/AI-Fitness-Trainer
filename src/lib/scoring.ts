// ============================================================
// WINTER ARC — Scoring & Progression Engine
// ============================================================

export interface HabitScoreItem {
  id: string;
  type: 'binary' | 'quantity' | 'duration';
  status: 'pending' | 'complete' | 'partial' | 'minimum' | 'skipped';
  value?: number;
  targetValue?: number;
  minimumValue?: number;
  difficulty?: number; // 1, 2, or 3
}

export interface DayScoreResult {
  dailyScore: number; // 0 to 1.0 (0% to 100%)
  completedCount: number;
  totalScheduled: number;
  isFullDay: boolean; // >= 0.80
  isPartialDay: boolean; // >= 0.40
  isMinimumDay: boolean; // kept alive via minimum day
  xpEarned: number;
}

export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  250,   // Level 2
  600,   // Level 3
  1000,  // Level 4
  1500,  // Level 5
  2200,  // Level 6
  3000,  // Level 7
  4000,  // Level 8
  5500,  // Level 9
  7500,  // Level 10 (Mastery)
];

/**
 * Calculate the score for an individual habit
 */
export function calculateHabitRatio(habit: HabitScoreItem): number {
  if (habit.status === 'complete') return 1.0;
  if (habit.status === 'skipped') return 0;
  if (habit.status === 'minimum') return 0.5; // Minimum Day counts as 50%
  if (habit.status === 'partial') {
    if (habit.targetValue && habit.targetValue > 0 && habit.value !== undefined) {
      return Math.min(1.0, Math.max(0, habit.value / habit.targetValue));
    }
    return 0.5;
  }
  return 0; // pending
}

/**
 * Calculate the total day score and XP earned for a list of scheduled habits
 */
export function calculateDayScore(habits: HabitScoreItem[], isMilestoneDay: boolean = false): DayScoreResult {
  if (!habits || habits.length === 0) {
    return {
      dailyScore: 0,
      completedCount: 0,
      totalScheduled: 0,
      isFullDay: false,
      isPartialDay: false,
      isMinimumDay: false,
      xpEarned: 0,
    };
  }

  let totalRatio = 0;
  let completedCount = 0;
  let hasMinimum = false;
  let habitXpTotal = 0;

  for (const habit of habits) {
    const ratio = calculateHabitRatio(habit);
    totalRatio += ratio;

    if (habit.status === 'complete') {
      completedCount++;
    } else if (habit.status === 'minimum') {
      hasMinimum = true;
    }

    // XP calculation: 10 XP base * ratio * difficulty multiplier
    const difficultyMultiplier = habit.difficulty ? Math.min(3, Math.max(1, habit.difficulty)) : 1;
    const habitXp = Math.round(10 * ratio * difficultyMultiplier);
    habitXpTotal += habitXp;
  }

  const dailyScore = Math.min(1.0, totalRatio / habits.length);
  const isFullDay = dailyScore >= 0.80;
  const isPartialDay = dailyScore >= 0.40;
  const isMinimumDay = hasMinimum && dailyScore < 0.80;

  // Bonus XP
  let bonusXp = 0;
  if (isFullDay) {
    bonusXp += 25; // Complete day bonus
  }
  if (isMilestoneDay) {
    bonusXp += 100; // Milestone day bonus (Day 7, 14, 30, 60, 90)
  }

  // Daily anti-gaming cap (max 150 regular daily XP, plus milestone bonus)
  const regularXp = Math.min(150, habitXpTotal + (isFullDay ? 25 : 0));
  const finalXp = regularXp + (isMilestoneDay ? 100 : 0);

  return {
    dailyScore: Math.round(dailyScore * 100) / 100,
    completedCount,
    totalScheduled: habits.length,
    isFullDay,
    isPartialDay,
    isMinimumDay,
    xpEarned: finalXp,
  };
}

/**
 * Calculate user level and progress percentage to next level from total XP
 */
export function calculateLevel(xp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? currentThreshold + 1000;
  const xpInCurrentLevel = xp - currentThreshold;
  const xpNeededForNext = nextThreshold - currentThreshold;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNext) * 100)));

  return {
    level,
    currentLevelXp: xp,
    nextLevelXp: nextThreshold,
    progressPercent,
  };
}

/**
 * Calculate overall Arc consistency score across all elapsed days
 */
export function calculateArcConsistency(dailyScores: number[]): number {
  if (!dailyScores || dailyScores.length === 0) return 0;
  const sum = dailyScores.reduce((acc, score) => acc + score, 0);
  const avg = sum / dailyScores.length;
  return Math.round(avg * 100);
}

/**
 * Check if day number is a designated milestone
 */
export function isMilestoneDay(dayNumber: number): boolean {
  return [7, 14, 21, 30, 45, 60, 75, 90].includes(dayNumber);
}
