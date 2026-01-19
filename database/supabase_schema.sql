-- Supabase Database Schema for E-Education Platform
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#667eea',
    icon TEXT,
    enabled BOOLEAN DEFAULT true,
    chapters TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id TEXT PRIMARY KEY DEFAULT 'video_' || uuid_generate_v4()::text,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    topic TEXT,
    "order" INTEGER DEFAULT 1,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id TEXT PRIMARY KEY DEFAULT 'quiz_' || uuid_generate_v4()::text,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'practice' CHECK (type IN ('practice', 'chapter_end', 'final_exam')),
    time_limit INTEGER DEFAULT 600, -- in seconds
    passing_score INTEGER DEFAULT 70, -- percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY DEFAULT 'q_' || uuid_generate_v4()::text,
    quiz_id TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    points INTEGER DEFAULT 1,
    "order" INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY DEFAULT 'sub_' || uuid_generate_v4()::text,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY DEFAULT 'pay_' || uuid_generate_v4()::text,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subscription_id TEXT REFERENCES public.subscriptions(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal', 'razorpay')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    payment_id TEXT, -- External payment gateway ID
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Progress table (tracks video watching progress)
CREATE TABLE IF NOT EXISTS public.progress (
    id TEXT PRIMARY KEY DEFAULT 'prog_' || uuid_generate_v4()::text,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    video_id TEXT REFERENCES public.videos(id) ON DELETE CASCADE,
    watched BOOLEAN DEFAULT false,
    progress_percentage INTEGER DEFAULT 0,
    last_watched_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, subject_id, video_id)
);

-- Quiz Results table
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id TEXT PRIMARY KEY DEFAULT 'result_' || uuid_generate_v4()::text,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    passed BOOLEAN DEFAULT false,
    time_spent INTEGER, -- in seconds
    answers JSONB DEFAULT '{}', -- Store user's answers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_subject_id ON public.videos(subject_id);
CREATE INDEX IF NOT EXISTS idx_videos_order ON public.videos("order");
CREATE INDEX IF NOT EXISTS idx_quizzes_subject_id ON public.quizzes(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_subject_id ON public.progress(subject_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_id ON public.quiz_results(quiz_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can read their own data, admins can read all
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Subjects: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view subjects" ON public.subjects
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert subjects" ON public.subjects
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Only admins can update subjects" ON public.subjects
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Only admins can delete subjects" ON public.subjects
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Videos: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view videos" ON public.videos
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage videos" ON public.videos
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Quizzes: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view quizzes" ON public.quizzes
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage quizzes" ON public.quizzes
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Questions: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view questions" ON public.questions
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage questions" ON public.questions
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Subscriptions: Users can view their own, admins can view all
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can create own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update subscriptions" ON public.subscriptions
    FOR UPDATE USING (true);

-- Payments: Users can view their own, admins can view all
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can create own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress: Users can manage their own progress
CREATE POLICY "Users can manage own progress" ON public.progress
    FOR ALL USING (auth.uid() = user_id);

-- Quiz Results: Users can view their own, admins can view all
CREATE POLICY "Users can view own quiz results" ON public.quiz_results
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can create own quiz results" ON public.quiz_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert default subjects
INSERT INTO public.subjects (id, name, description, color, icon, enabled, chapters) VALUES
    ('math', 'Mathematics', 'Algebra, Calculus, Geometry, Statistics', '#4CAF50', '🧮', true, ARRAY['Algebra', 'Calculus', 'Geometry', 'Statistics']),
    ('chemistry', 'Chemistry', 'Organic, Inorganic, Physical Chemistry', '#2196F3', '🧪', true, ARRAY['Basics', 'Organic', 'Inorganic', 'Physical']),
    ('physics', 'Physics', 'Mechanics, Thermodynamics, Electromagnetism', '#FF9800', '⚛️', true, ARRAY['Mechanics', 'Thermodynamics', 'Waves', 'Modern Physics'])
ON CONFLICT (id) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON public.progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

