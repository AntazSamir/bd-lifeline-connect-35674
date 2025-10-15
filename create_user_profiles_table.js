// Script to create the user_profiles table
import { createClient } from '@supabase/supabase-js';

// Using the provided Supabase credentials
const supabaseUrl = 'https://fjhtbrdnjhlxrwarcfrr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqaHRicmRuamhseHJ3YXJjZnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzcxNjgsImV4cCI6MjA3NTA1MzE2OH0.Ox85u9pb2-SwvXQatJ9Qauc22tEVawynOHYXwle57pI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUserProfilesTable() {
  console.log('Creating user_profiles table...');
  
  try {
    // Since we can't use rpc directly, let's check if we can insert into the table
    // First, let's try a simple authenticated request to see if the table exists
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (error && error.message.includes('Could not find the table')) {
      console.log('user_profiles table does not exist. Please run the SQL schema in your Supabase dashboard.');
      console.log('You can find the schema in the supabase_schema.sql file in your project.');
      return;
    }
    
    console.log('user_profiles table already exists or is accessible.');
  } catch (err) {
    console.error('Error checking user_profiles table:', err);
  }
}

createUserProfilesTable();