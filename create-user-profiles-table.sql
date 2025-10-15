-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name VARCHAR(100),
  phone VARCHAR(20),
  nid VARCHAR(50),
  blood_group VARCHAR(10),
  location TEXT,
  last_donation_date DATE,
  is_donor BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_blood_group ON user_profiles(blood_group);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles(location);

-- Set up Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User profiles policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'User profiles are viewable by everyone') THEN
    CREATE POLICY "User profiles are viewable by everyone" 
      ON user_profiles FOR SELECT 
      USING (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile') THEN
    CREATE POLICY "Users can insert their own profile" 
      ON user_profiles FOR INSERT 
      WITH CHECK (auth.uid() = id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile') THEN
    CREATE POLICY "Users can update their own profile" 
      ON user_profiles FOR UPDATE 
      USING (auth.uid() = id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own profile') THEN
    CREATE POLICY "Users can delete their own profile" 
      ON user_profiles FOR DELETE 
      USING (auth.uid() = id);
  END IF;
END
$$;

-- Grant permissions
GRANT ALL ON TABLE user_profiles TO authenticated;