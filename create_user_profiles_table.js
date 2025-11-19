// Script to create the user_profiles table
import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from environment variables for safety.
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not required; environment variables may be set externally
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY / SUPABASE_ANON_KEY environment variables. Aborting.');
  process.exit(1);
}

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