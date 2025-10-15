-- Fix for the donors table to add the missing created_by column
ALTER TABLE donors ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_donors_created_by ON donors(created_by);