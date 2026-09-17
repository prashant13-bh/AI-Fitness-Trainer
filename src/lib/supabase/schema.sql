-- ============================================================
-- WINTER ARC — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ── USERS (extends Supabase auth.users) ──────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  identity_statement TEXT,
  selected_areas TEXT[] DEFAULT '{}',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ARCS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.arcs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Arc',
  type TEXT DEFAULT 'custom', -- 'winter', 'fitness', 'study', 'career', 'custom'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER NOT NULL, -- 30, 60, 90
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  identity_statement TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── HABITS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  arc_id UUID REFERENCES public.arcs(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  area TEXT, -- 'body','mind','knowledge','career','money','spirit','relationships'
  type TEXT DEFAULT 'binary', -- 'binary', 'quantity', 'duration'
  target_value NUMERIC,
  target_unit TEXT, -- 'minutes','pages','hours','reps'
  scheduled_days INTEGER[] DEFAULT '{0,1,2,3,4,5,6}', -- 0=Mon…6=Sun
  minimum_value NUMERIC,
  minimum_unit TEXT,
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_time TIME,
  difficulty INTEGER DEFAULT 1, -- 1,2,3 for XP multiplier
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── HABIT LOGS (one per habit per day) ───────────────────────
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  arc_id UUID REFERENCES public.arcs(id) ON DELETE CASCADE NOT NULL,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'complete','partial','skipped','minimum','pending'
  value NUMERIC DEFAULT 0,
  target_value NUMERIC,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(habit_id, date) -- one log per habit per day
);

-- ── GOALS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  arc_id UUID REFERENCES public.arcs(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  area TEXT,
  type TEXT DEFAULT 'numeric', -- 'numeric','percentage','boolean'
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  unit TEXT,
  deadline DATE,
  status TEXT DEFAULT 'active', -- 'active','completed','abandoned'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DAILY CHECK-INS (one per day per arc) ────────────────────
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  arc_id UUID REFERENCES public.arcs(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  completion_percentage NUMERIC DEFAULT 0, -- 0-100
  mood INTEGER, -- 1-5
  energy INTEGER, -- 1-10
  journal TEXT,
  day_score NUMERIC DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, arc_id, date) -- one check-in per day
);

-- ── ACHIEVEMENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── PROGRESS PHOTOS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.progress_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  arc_id UUID REFERENCES public.arcs(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  storage_path TEXT NOT NULL,
  visibility TEXT DEFAULT 'private',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONTRACTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  arc_id UUID REFERENCES public.arcs(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  signed_name TEXT,
  signed_at TIMESTAMPTZ,
  shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (replaces Firestore security rules)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Users: own data only
CREATE POLICY "users_own" ON public.users FOR ALL USING (auth.uid() = id);

-- Arcs: own data only
CREATE POLICY "arcs_own" ON public.arcs FOR ALL USING (auth.uid() = user_id);

-- Habits: own data only
CREATE POLICY "habits_own" ON public.habits FOR ALL USING (auth.uid() = user_id);

-- Habit logs: own data only
CREATE POLICY "habit_logs_own" ON public.habit_logs FOR ALL USING (auth.uid() = user_id);

-- Goals: own data only
CREATE POLICY "goals_own" ON public.goals FOR ALL USING (auth.uid() = user_id);

-- Daily checkins: own data only
CREATE POLICY "daily_checkins_own" ON public.daily_checkins FOR ALL USING (auth.uid() = user_id);

-- Achievements: own data only
CREATE POLICY "achievements_own" ON public.achievements FOR ALL USING (auth.uid() = user_id);

-- Progress photos: own data only
CREATE POLICY "progress_photos_own" ON public.progress_photos FOR ALL USING (auth.uid() = user_id);

-- Contracts: own data only
CREATE POLICY "contracts_own" ON public.contracts FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS (run separately in Supabase dashboard or SQL)
-- ============================================================

-- Create storage bucket for progress photos (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', false)
ON CONFLICT DO NOTHING;

-- Storage RLS: users can only access their own folder
CREATE POLICY "progress_photos_storage_own"
ON storage.objects FOR ALL
USING (
  bucket_id = 'progress-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================
-- TRIGGERS: auto-update updated_at timestamps
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER arcs_updated_at BEFORE UPDATE ON public.arcs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER habits_updated_at BEFORE UPDATE ON public.habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER goals_updated_at BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER daily_checkins_updated_at BEFORE UPDATE ON public.daily_checkins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, photo_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- USEFUL INDEXES for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_arcs_user_id ON public.arcs(user_id);
CREATE INDEX IF NOT EXISTS idx_arcs_status ON public.arcs(status);
CREATE INDEX IF NOT EXISTS idx_habits_arc_id ON public.habits(arc_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON public.habit_logs(habit_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON public.habit_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_arc_date ON public.daily_checkins(user_id, arc_id, date);
CREATE INDEX IF NOT EXISTS idx_goals_arc_id ON public.goals(arc_id);
