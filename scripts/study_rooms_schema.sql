-- ============================================================================
-- KURO FANGS — STUDY ROOMS & SYNCHRONIZED FOCUS TIMER SCHEMA
-- Target: Supabase PostgreSQL (api.kurofangs.id.ly)
-- ============================================================================

-- 1. Study Rooms Table (Authoritative Room & Shared Timer State)
CREATE TABLE IF NOT EXISTS public.study_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT,
  linked_sheet_id TEXT,
  session_goal TEXT,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'solo')),
  preset TEXT NOT NULL DEFAULT 'pomodoro' CHECK (preset IN ('quick', 'pomodoro', 'deep_focus', 'custom')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'paused', 'completed', 'closed')),
  phase TEXT NOT NULL DEFAULT 'waiting' CHECK (phase IN ('waiting', 'focus', 'short_break', 'long_break', 'paused', 'completed')),
  current_round INT NOT NULL DEFAULT 0,
  total_rounds INT NOT NULL DEFAULT 3,
  rounds_before_long INT NOT NULL DEFAULT 4,
  focus_duration_seconds INT NOT NULL DEFAULT 1500,
  short_break_seconds INT NOT NULL DEFAULT 300,
  long_break_seconds INT NOT NULL DEFAULT 900,
  total_session_seconds INT NOT NULL DEFAULT 10800,
  scheduled_start_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  paused_remaining_seconds INT,
  participant_count INT NOT NULL DEFAULT 1,
  max_participants INT NOT NULL DEFAULT 50,
  invitation_code TEXT UNIQUE,
  allow_focus_chat BOOLEAN NOT NULL DEFAULT FALSE,
  host_user_id UUID NOT NULL,
  host_name TEXT NOT NULL DEFAULT 'Kuro Student',
  host_avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_rooms_status ON public.study_rooms(status);
CREATE INDEX IF NOT EXISTS idx_study_rooms_invite_code ON public.study_rooms(invitation_code);
CREATE INDEX IF NOT EXISTS idx_study_rooms_host ON public.study_rooms(host_user_id);

-- 2. Room Participants Table (Idempotent Membership & Live Study Time)
CREATE TABLE IF NOT EXISTS public.room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL DEFAULT 'Student',
  user_avatar TEXT,
  status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('ready', 'focusing', 'on_break', 'paused', 'away')),
  personal_goal TEXT,
  personal_subject TEXT,
  skip_break_override BOOLEAN NOT NULL DEFAULT FALSE,
  focus_seconds_earned INT NOT NULL DEFAULT 0,
  last_focus_tick_at TIMESTAMPTZ,
  is_online BOOLEAN NOT NULL DEFAULT TRUE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_room_participants_room ON public.room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user ON public.room_participants(user_id);

-- 3. Room Messages Table (Break Chat)
CREATE TABLE IF NOT EXISTS public.room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  message TEXT NOT NULL CHECK (char_length(message) <= 300),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_room_messages_room ON public.room_messages(room_id, created_at);

-- 4. Student Study Sessions Log (Historical Stats & Leaderboard History)
CREATE TABLE IF NOT EXISTS public.study_session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.study_rooms(id) ON DELETE SET NULL,
  room_name TEXT NOT NULL,
  subject TEXT,
  user_id UUID NOT NULL,
  focus_seconds INT NOT NULL DEFAULT 0,
  total_room_seconds INT NOT NULL DEFAULT 0,
  rounds_completed INT NOT NULL DEFAULT 1,
  rank_achieved INT DEFAULT 1,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_session_logs_user ON public.study_session_logs(user_id, completed_at DESC);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_session_logs ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view active public rooms or rooms they participate in
DROP POLICY IF EXISTS "study_rooms_select" ON public.study_rooms;
CREATE POLICY "study_rooms_select" ON public.study_rooms
  FOR SELECT USING (true);

-- Authenticated users can create rooms where they are the host
DROP POLICY IF EXISTS "study_rooms_insert" ON public.study_rooms;
CREATE POLICY "study_rooms_insert" ON public.study_rooms
  FOR INSERT WITH CHECK (auth.uid() = host_user_id);

-- Only the host can update authoritative room state (or participant count updates)
DROP POLICY IF EXISTS "study_rooms_update" ON public.study_rooms;
CREATE POLICY "study_rooms_update" ON public.study_rooms
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "study_rooms_delete" ON public.study_rooms;
CREATE POLICY "study_rooms_delete" ON public.study_rooms
  FOR DELETE USING (auth.uid() = host_user_id);

-- Participants policies
DROP POLICY IF EXISTS "room_participants_select" ON public.room_participants;
CREATE POLICY "room_participants_select" ON public.room_participants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "room_participants_upsert" ON public.room_participants;
CREATE POLICY "room_participants_upsert" ON public.room_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "room_participants_update" ON public.room_participants;
CREATE POLICY "room_participants_update" ON public.room_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Messages policies
DROP POLICY IF EXISTS "room_messages_select" ON public.room_messages;
CREATE POLICY "room_messages_select" ON public.room_messages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "room_messages_insert" ON public.room_messages;
CREATE POLICY "room_messages_insert" ON public.room_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Session logs policies
DROP POLICY IF EXISTS "study_session_logs_select" ON public.study_session_logs;
CREATE POLICY "study_session_logs_select" ON public.study_session_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "study_session_logs_insert" ON public.study_session_logs;
CREATE POLICY "study_session_logs_insert" ON public.study_session_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable Supabase Realtime on Study Rooms tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_messages;
