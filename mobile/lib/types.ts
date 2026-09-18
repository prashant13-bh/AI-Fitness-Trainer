export type LifeArea = 'Body' | 'Mind' | 'Career' | 'Knowledge' | 'Discipline';
export type HabitType = 'binary' | 'quantity' | 'duration';
export type HabitStatus = 'pending' | 'complete' | 'partial' | 'minimum' | 'skipped';
export type ArcStatus = 'active' | 'complete' | 'abandoned';

export interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  identity_archetype?: string;
  identity_statement: string;
  selected_life_areas: LifeArea[];
  xp: number;
  level: number;
  streak: number;
  longest_streak: number;
  total_days_complete: number;
  total_days_minimum: number;
  total_days_missed: number;
  onboarded: boolean;
  active_arc_id?: string;
  notifications_enabled: boolean;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface Arc {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
  current_day: number;
  status: ArcStatus;
  goals: ArcGoal[];
  consistency_rate: number;
  days_complete: number;
  days_minimum: number;
  days_missed: number;
}

export interface Habit {
  id: string;
  arc_id: string;
  user_id: string;
  name: string;
  area: LifeArea;
  icon: string;
  type: HabitType;
  difficulty: 1 | 2 | 3;
  target_value?: number;
  target_unit?: string;
  minimum_value?: number;
  minimum_unit?: string;
  xp_complete: number;
  xp_minimum: number;
  sort_order: number;
  is_active: boolean;
}

export interface HabitLog {
  id: string;
  user_id: string;
  arc_id: string;
  habit_id: string;
  date: string;
  status: HabitStatus;
  value: number;
  xp_earned: number;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  arc_id: string;
  date: string;
  mood?: number;
  energy?: number;
  journal: string;
  day_score?: number;
  xp_earned: number;
  habits_complete: number;
  habits_minimum: number;
  habits_total: number;
  day_type: 'standard' | 'minimum_day' | 'perfect';
  checked_in_at: string;
}

export interface ArcGoal {
  id: string;
  title: string;
  area: LifeArea;
  currentValue: number;
  targetValue: number;
  unit: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

// For local habit state (Today screen)
export interface LocalHabit extends Habit {
  status: HabitStatus;
  value?: number;
}
