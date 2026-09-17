// ============================================================
// SUPABASE — Auto-generated TypeScript types for the database
// Run: npx supabase gen types typescript --project-id YOUR_ID > src/lib/supabase/types.ts
// to regenerate after schema changes
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          photo_url: string | null;
          timezone: string;
          identity_statement: string | null;
          selected_areas: string[];
          level: number;
          xp: number;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string;
          photo_url?: string | null;
          timezone?: string;
          identity_statement?: string | null;
          selected_areas?: string[];
          level?: number;
          xp?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
          photo_url?: string | null;
          timezone?: string;
          identity_statement?: string | null;
          selected_areas?: string[];
          level?: number;
          xp?: number;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
      };
      arcs: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          start_date: string;
          end_date: string;
          duration: number;
          status: 'active' | 'completed' | 'abandoned';
          identity_statement: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string;
          type?: string;
          start_date: string;
          end_date: string;
          duration: number;
          status?: 'active' | 'completed' | 'abandoned';
          identity_statement?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          type?: string;
          start_date?: string;
          end_date?: string;
          duration?: number;
          status?: 'active' | 'completed' | 'abandoned';
          identity_statement?: string | null;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          arc_id: string;
          name: string;
          area: string | null;
          type: 'binary' | 'quantity' | 'duration';
          target_value: number | null;
          target_unit: string | null;
          scheduled_days: number[];
          minimum_value: number | null;
          minimum_unit: string | null;
          reminder_enabled: boolean;
          reminder_time: string | null;
          difficulty: number;
          sort_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          arc_id: string;
          name: string;
          area?: string | null;
          type?: 'binary' | 'quantity' | 'duration';
          target_value?: number | null;
          target_unit?: string | null;
          scheduled_days?: number[];
          minimum_value?: number | null;
          minimum_unit?: string | null;
          reminder_enabled?: boolean;
          reminder_time?: string | null;
          difficulty?: number;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          area?: string | null;
          type?: 'binary' | 'quantity' | 'duration';
          target_value?: number | null;
          target_unit?: string | null;
          scheduled_days?: number[];
          minimum_value?: number | null;
          minimum_unit?: string | null;
          reminder_enabled?: boolean;
          reminder_time?: string | null;
          difficulty?: number;
          sort_order?: number;
          active?: boolean;
          updated_at?: string;
        };
      };
      habit_logs: {
        Row: {
          id: string;
          user_id: string;
          arc_id: string;
          habit_id: string;
          date: string;
          status: 'complete' | 'partial' | 'skipped' | 'minimum' | 'pending';
          value: number;
          target_value: number | null;
          xp_earned: number;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          arc_id: string;
          habit_id: string;
          date: string;
          status: 'complete' | 'partial' | 'skipped' | 'minimum' | 'pending';
          value?: number;
          target_value?: number | null;
          xp_earned?: number;
          completed_at?: string | null;
        };
        Update: {
          status?: 'complete' | 'partial' | 'skipped' | 'minimum' | 'pending';
          value?: number;
          target_value?: number | null;
          xp_earned?: number;
          completed_at?: string | null;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          arc_id: string;
          title: string;
          area: string | null;
          type: 'numeric' | 'percentage' | 'boolean';
          target_value: number | null;
          current_value: number;
          unit: string | null;
          deadline: string | null;
          status: 'active' | 'completed' | 'abandoned';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          arc_id: string;
          title: string;
          area?: string | null;
          type?: 'numeric' | 'percentage' | 'boolean';
          target_value?: number | null;
          current_value?: number;
          unit?: string | null;
          deadline?: string | null;
          status?: 'active' | 'completed' | 'abandoned';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          area?: string | null;
          type?: 'numeric' | 'percentage' | 'boolean';
          target_value?: number | null;
          current_value?: number;
          unit?: string | null;
          deadline?: string | null;
          status?: 'active' | 'completed' | 'abandoned';
          updated_at?: string;
        };
      };
      daily_checkins: {
        Row: {
          id: string;
          user_id: string;
          arc_id: string;
          date: string;
          completion_percentage: number;
          mood: number | null;
          energy: number | null;
          journal: string | null;
          day_score: number;
          xp_earned: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          arc_id: string;
          date: string;
          completion_percentage?: number;
          mood?: number | null;
          energy?: number | null;
          journal?: string | null;
          day_score?: number;
          xp_earned?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          completion_percentage?: number;
          mood?: number | null;
          energy?: number | null;
          journal?: string | null;
          day_score?: number;
          xp_earned?: number;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          name: string;
          description: string | null;
          icon: string | null;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          unlocked_at?: string;
        };
        Update: never;
      };
      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          arc_id: string;
          date: string;
          storage_path: string;
          visibility: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          arc_id: string;
          date: string;
          storage_path: string;
          visibility?: string;
          created_at?: string;
        };
        Update: {
          visibility?: string;
        };
      };
      contracts: {
        Row: {
          id: string;
          user_id: string;
          arc_id: string;
          text: string;
          signed_name: string | null;
          signed_at: string | null;
          shared: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          arc_id: string;
          text: string;
          signed_name?: string | null;
          signed_at?: string | null;
          shared?: boolean;
          created_at?: string;
        };
        Update: {
          text?: string;
          signed_name?: string | null;
          signed_at?: string | null;
          shared?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ── Convenience row types ─────────────────────────────────────
export type UserRow = Database['public']['Tables']['users']['Row'];
export type ArcRow = Database['public']['Tables']['arcs']['Row'];
export type HabitRow = Database['public']['Tables']['habits']['Row'];
export type HabitLogRow = Database['public']['Tables']['habit_logs']['Row'];
export type GoalRow = Database['public']['Tables']['goals']['Row'];
export type DailyCheckinRow = Database['public']['Tables']['daily_checkins']['Row'];
export type AchievementRow = Database['public']['Tables']['achievements']['Row'];
export type ProgressPhotoRow = Database['public']['Tables']['progress_photos']['Row'];
export type ContractRow = Database['public']['Tables']['contracts']['Row'];

// ── Insert types ───────────────────────────────────────────────
export type InsertArc = Database['public']['Tables']['arcs']['Insert'];
export type InsertHabit = Database['public']['Tables']['habits']['Insert'];
export type InsertHabitLog = Database['public']['Tables']['habit_logs']['Insert'];
export type InsertGoal = Database['public']['Tables']['goals']['Insert'];
export type InsertDailyCheckin = Database['public']['Tables']['daily_checkins']['Insert'];

// ── Habit with today's log ─────────────────────────────────────
export interface HabitWithLog extends HabitRow {
  todayLog?: HabitLogRow | null;
}

// ── Arc status type ────────────────────────────────────────────
export type ArcStatus = 'active' | 'completed' | 'abandoned';
export type HabitType = 'binary' | 'quantity' | 'duration';
export type LogStatus = 'complete' | 'partial' | 'skipped' | 'minimum' | 'pending';
