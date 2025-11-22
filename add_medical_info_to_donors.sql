ALTER TABLE donors ADD COLUMN IF NOT EXISTS medical_info JSONB DEFAULT '{}'::jsonb;
