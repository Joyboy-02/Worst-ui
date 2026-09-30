-- ==============================================================================
-- CROP DISASTER & ADVISORY ASSISTANT (WORST UI EDITION)
-- Production PostgreSQL Database Schema with Row Level Security (RLS)
-- Target: Supabase / PostgreSQL 14+
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    chaos_tolerance_score INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Crop Advisory Submissions Table
CREATE TABLE IF NOT EXISTS public.advisories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    crop_name TEXT NOT NULL,
    soil_ph DECIMAL(3,1) NOT NULL,
    npk_status JSONB NOT NULL,
    ai_raw_response TEXT,
    frustration_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Audit Log for UI Rage Clicks
CREATE TABLE IF NOT EXISTS public.rage_clicks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    element_id TEXT NOT NULL,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rage_clicks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own advisories." ON public.advisories;
DROP POLICY IF EXISTS "Users can insert their own advisories." ON public.advisories;

DROP POLICY IF EXISTS "Users can log their own rage clicks." ON public.rage_clicks;
DROP POLICY IF EXISTS "Public can view rage clicks." ON public.rage_clicks;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own profile." 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Advisories Policies
CREATE POLICY "Users can view their own advisories." 
    ON public.advisories FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own advisories." 
    ON public.advisories FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Rage Clicks Policies
CREATE POLICY "Users can log their own rage clicks." 
    ON public.rage_clicks FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Public can view rage clicks." 
    ON public.rage_clicks FOR SELECT 
    USING (true);
