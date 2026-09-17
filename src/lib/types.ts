// ============================================================
// WINTER ARC — Core Domain TypeScript Types
// ============================================================

export type LifeArea = 'Body' | 'Mind' | 'Career' | 'Knowledge' | 'Discipline' | 'Spirit';

export type HabitType = 'binary' | 'quantity' | 'duration';

export type HabitStatus = 'pending' | 'complete' | 'partial' | 'minimum' | 'skipped';

export interface Arc {
  id: string;
  userId: string;
  name: string;
  type: 'winter' | 'sprint' | 'forge' | 'custom';
  startDate: string;
  endDate: string;
  duration: number; // 30, 60, 90
  status: 'active' | 'completed' | 'abandoned';
  identityStatement: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  arcId: string;
  name: string;
  area: LifeArea;
  type: HabitType;
  targetValue?: number;
  targetUnit?: string;
  minimumValue?: number;
  minimumUnit?: string;
  difficulty?: number; // 1, 2, 3
  active: boolean;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  userId: string;
  arcId: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: HabitStatus;
  value?: number;
  targetValue?: number;
  xpEarned: number;
  completedAt?: string;
}

export interface DailyCheckin {
  id: string;
  userId: string;
  arcId: string;
  date: string; // YYYY-MM-DD
  completionPercentage: number;
  mood?: number; // 1-5
  energy?: number; // 1-10
  journal?: string;
  dayScore: number;
  xpEarned: number;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  arcId: string;
  title: string;
  area: LifeArea;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  status: 'active' | 'completed' | 'abandoned';
}

export interface Achievement {
  id: string;
  userId: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Contract {
  id: string;
  userId: string;
  arcId: string;
  identityStatement: string;
  duration: number;
  signature: string;
  signedAt: string;
}
