-- Enable realtime updates for the donors table
-- This allows clients to receive instant updates when donor data changes

-- Step 1: Set REPLICA IDENTITY to FULL to capture complete row data during updates
ALTER TABLE public.donors REPLICA IDENTITY FULL;

-- Step 2: Add the donors table to the supabase_realtime publication
-- This activates real-time functionality for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.donors;

-- Verify the setup
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'donors';
