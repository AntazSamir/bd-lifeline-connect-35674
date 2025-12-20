// Simple test script to check database setup
import { createClient } from '@supabase/supabase-js';

// Supabase credentials are read from environment variables for safety.
// Set SUPABASE_URL and SUPABASE_ANON_KEY in your environment or use a .env file when running locally.
try {
  // Attempt to load .env for local usage (optional)

  await import('dotenv/config');
} catch (e) {
  // ignore if not available
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables. Aborting.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  console.log('Testing database connection and table existence...');

  try {
    // Test 1: Check if blood_requests table exists
    console.log('\n1. Checking blood_requests table...');
    const { data: bloodRequestsData, error: bloodRequestsError } = await supabase
      .from('blood_requests')
      .select('*')
      .limit(1);

    if (bloodRequestsError) {
      console.log('   ❌ blood_requests table error:', bloodRequestsError.message);
    } else {
      console.log('   ✅ blood_requests table exists and is accessible');
    }

    // Test 2: Check if donors table exists
    console.log('\n2. Checking donors table...');
    const { data: donorsData, error: donorsError } = await supabase
      .from('donors')
      .select('*')
      .limit(1);

    if (donorsError) {
      console.log('   ❌ donors table error:', donorsError.message);
    } else {
      console.log('   ✅ donors table exists and is accessible');
    }

    // Test 3: Check if user_profiles table exists
    console.log('\n3. Checking user_profiles table...');
    const { data: userProfilesData, error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (userProfilesError) {
      console.log('   ❌ user_profiles table error:', userProfilesError.message);
      console.log('   💡 Solution: Run the create-user-profiles-table.sql script in your Supabase SQL editor');
    } else {
      console.log('   ✅ user_profiles table exists and is accessible');
    }

    console.log('\n--- Database Test Summary ---');
    if (bloodRequestsError || donorsError || userProfilesError) {
      console.log('Some tables are missing or inaccessible. Please run the SQL scripts to set up your database.');
      if (userProfilesError) {
        console.log('\nTo fix the user_profiles table issue:');
        console.log('1. Go to your Supabase dashboard at https://app.supabase.com/project/fjhtbrdnjhlxrwarcfrr');
        console.log('2. Navigate to the SQL editor');
        console.log('3. Copy and paste the contents of create-user-profiles-table.sql');
        console.log('4. Run the script');
      }
    } else {
      console.log('✅ All tables exist and are accessible. Database setup is complete!');
    }

  } catch (error) {
    console.error('Unexpected error during database test:', error);
  }
}

testDatabase();