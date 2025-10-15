// Simple Node.js script to test Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Using the provided Supabase credentials
const supabaseUrl = 'https://fjhtbrdnjhlxrwarcfrr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqaHRicmRuamhseHJ3YXJjZnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzcxNjgsImV4cCI6MjA3NTA1MzE2OH0.Ox85u9pb2-SwvXQatJ9Qauc22tEVawynOHYXwle57pI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test database connection by querying a table (if exists)
    const { data, error } = await supabase
      .from('blood_requests')
      .select('id')
      .limit(1);
    
    if (error && error.message !== 'The resource was not found') {
      console.error('Supabase database error:', error.message);
      return;
    }
    
    console.log('Supabase connection successful!');
    console.log('Sample data query result:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

testConnection();