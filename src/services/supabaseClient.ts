import { createClient } from '@supabase/supabase-js'

// Using the provided Supabase credentials
const supabaseUrl = 'https://fjhtbrdnjhlxrwarcfrr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqaHRicmRuamhseHJ3YXJjZnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzcxNjgsImV4cCI6MjA3NTA1MzE2OH0.Ox85u9pb2-SwvXQatJ9Qauc22tEVawynOHYXwle57pI'

// Ensure the credentials are defined
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)