// Supabase Configuration
// Uses environment variables for security

import { createClient } from '@supabase/supabase-js';

// Supabase credentials from environment variables
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://roqkcsuwyhbficcasggt.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcWtjc3V3eWhiZmljY2FzZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDEzNzEsImV4cCI6MjA4NDExNzM3MX0.2hf-nKvalz5ZoHE9dx_zYMXQFlgJRd5s-GvQiurEphU';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database Tables Reference
export const TABLES = {
  USERS: 'users',
  SUBJECTS: 'subjects',
  VIDEOS: 'videos',
  QUIZZES: 'quizzes',
  QUESTIONS: 'questions',
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENTS: 'payments',
  PROGRESS: 'progress',
  QUIZ_RESULTS: 'quiz_results'
};

export default supabase;

