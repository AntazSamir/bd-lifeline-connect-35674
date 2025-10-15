// Simple test script to verify Supabase connection
fetch('https://fjhtbrdnjhlxrwarcfrr.supabase.co/rest/v1/blood_requests?select=id&limit=1', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqaHRicmRuamhseHJ3YXJjZnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzcxNjgsImV4cCI6MjA3NTA1MzE2OH0.Ox85u9pb2-SwvXQatJ9Qauc22tEVawynOHYXwle57pI',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqaHRicmRuamhseHJ3YXJjZnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzcxNjgsImV4cCI6MjA3NTA1MzE2OH0.Ox85u9pb2-SwvXQatJ9Qauc22tEVawynOHYXwle57pI'
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));