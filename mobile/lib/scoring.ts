// FitArc — Scoring & Progression Engine

export interface HabitScoreItem {
  id: string;
  type: "binary" | "quantity" | "duration";
  status: "pending" | "complete" | "partial" | "minimum" | "skipped";
  value?: number;
  targetValue?: number;
  minimumValue?: number;
  difficulty?: number;
}

export interface DayScoreResult {
  dailyScore: number;
  completedCount: number;
  totalScheduled: number;
  isFullDay: boolean;
  isPartialDay: boolean;
  isMinimumDay: boolean;
  xpEarned: number;
}

export const LEVEL_THRESHOLDS = [0, 250, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];

export function calculateHabitRatio(habit: HabitScoreItem): number {
  if (habit.status === "complete") return 1.0;
  if (habit.status === "skipped") return 0;
  if (habit.status === "minimum") return 0.5;
  if (habit.status === "partial") {
    if (habit.targetValue && habit.targetValue > 0 && habit.value !== undefined) {
      return Math.min(1.0, Math.max(0, habit.value / habit.targetValue));
    }
    return 0.5;
  }
  return 0;
}

export function calculateDayScore(habits: HabitScoreItem[], isMilestoneDay = false): DayScoreResult {
  if (!habits || habits.length === 0) {
    return { dailyScore: 0, completedCount: 0, totalScheduled: 0, isFullDay: false, isPartialDay: false, isMinimumDay: false, xpEarned: 0 };
  }
  let totalRatio = 0, completedCount = 0, hasMinimum = false, habitXpTotal = 0;
  for (const habit of habits) {
    const ratio = calculateHabitRatio(habit);
    totalRatio += ratio;
    if (habit.status === "complete") completedCount++;
    else if (habit.status === "minimum") hasMinimum = true;
    const d = habit.difficulty ? Math.min(3, Math.max(1, habit.difficulty)) : 1;
    habitXpTotal += Math.round(10 * ratio * d);
  }
  const dailyScore = Math.min(1.0, totalRatio / habits.length);
  const isFullDay = dailyScore >= 0.80;
  const isMinimumDay = hasMinimum && dailyScore < 0.80;
  const regularXp = Math.min(150, habitXpTotal + (isFullDay ? 25 : 0));
  return {
    dailyScore: Math.round(dailyScore * 100) / 100,
    completedCount, totalScheduled: habits.length,
    isFullDay, isPartialDay: dailyScore >= 0.40, isMinimumDay,
    xpEarned: regularXp + (isMilestoneDay ? 100 : 0),
  };
}

export function calculateLevel(xp: number) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  const curr = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level] ?? curr + 1000;
  const xpInLevel = xp - curr;
  const needed = next - curr;
  return { level, currentLevelXp: xp, nextLevelXp: next, progressPercent: Math.min(100, Math.round((xpInLevel / needed) * 100)) };
}

export function calculateArcConsistency(dailyScores: number[]): number {
  if (!dailyScores || dailyScores.length === 0) return 0;
  return Math.round(dailyScores.reduce((a, s) => a + s, 0) / dailyScores.length * 100);
}

export function isMilestoneDay(dayNumber: number): boolean {
  return [7, 14, 21, 30, 45, 60, 75, 90].includes(dayNumber);
}
