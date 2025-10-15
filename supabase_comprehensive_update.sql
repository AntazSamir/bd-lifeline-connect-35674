-- ========================================
-- COMPREHENSIVE SUPABASE SCHEMA UPDATE
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0. CREATE BASE TABLES IF NOT EXIST
-- ========================================

-- Create enum for roles (only if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, role)
);

-- Create blood_requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id SERIAL PRIMARY KEY,
  blood_group VARCHAR(10) NOT NULL,
  location TEXT NOT NULL,
  units_needed INTEGER NOT NULL DEFAULT 1,
  urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('immediate', 'urgent', 'flexible')),
  patient_info TEXT,
  contact_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  blood_group VARCHAR(10) NOT NULL,
  location TEXT NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  last_donation_date DATE,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

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

-- Enable RLS on all tables
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (needed for RLS policies)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 1. UPDATE USER_PROFILES TABLE
-- ========================================

-- Add new columns to user_profiles
ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS division TEXT,
  ADD COLUMN IF NOT EXISTS district TEXT,
  ADD COLUMN IF NOT EXISTS full_address TEXT,
  ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS height DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS medical_history JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS lifestyle_info JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS recent_activities JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_donor_search 
  ON user_profiles(is_donor, blood_group, division, district) 
  WHERE is_donor = true;

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_division ON user_profiles(division);
CREATE INDEX IF NOT EXISTS idx_user_profiles_district ON user_profiles(district);

-- 2. UPDATE BLOOD_REQUESTS TABLE
-- ========================================

-- Add new columns to blood_requests
ALTER TABLE blood_requests 
  ADD COLUMN IF NOT EXISTS patient_age INTEGER,
  ADD COLUMN IF NOT EXISTS hospital_address TEXT,
  ADD COLUMN IF NOT EXISTS blood_component VARCHAR(50) DEFAULT 'whole_blood',
  ADD COLUMN IF NOT EXISTS date_needed DATE,
  ADD COLUMN IF NOT EXISTS donor_requirements TEXT,
  ADD COLUMN IF NOT EXISTS additional_notes TEXT,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'fulfilled', 'cancelled'));

-- Create indexes for blood_requests
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_date_needed ON blood_requests(date_needed);
CREATE INDEX IF NOT EXISTS idx_blood_requests_filter 
  ON blood_requests(status, urgency, created_at);

-- 3. UPDATE DONORS TABLE
-- ========================================

-- Add profile reference to donors table
ALTER TABLE donors 
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Create index for donors
CREATE INDEX IF NOT EXISTS idx_donors_profile_id ON donors(profile_id);
CREATE INDEX IF NOT EXISTS idx_donors_created_by ON donors(created_by);

-- 4. HELPER FUNCTIONS
-- ========================================

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = _user_id 
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'moderator' THEN 2
      WHEN 'user' THEN 3
    END
  LIMIT 1;
$$;

-- Function to check if user is eligible to donate
CREATE OR REPLACE FUNCTION public.is_donor_eligible(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile RECORD;
  last_donation DATE;
  days_since_donation INTEGER;
BEGIN
  SELECT 
    date_of_birth,
    weight,
    last_donation_date,
    is_donor
  INTO user_profile
  FROM user_profiles
  WHERE id = _user_id;
  
  IF NOT FOUND OR NOT user_profile.is_donor THEN
    RETURN false;
  END IF;
  
  -- Check age (must be 18-65)
  IF user_profile.date_of_birth IS NULL OR 
     EXTRACT(YEAR FROM age(user_profile.date_of_birth)) < 18 OR
     EXTRACT(YEAR FROM age(user_profile.date_of_birth)) > 65 THEN
    RETURN false;
  END IF;
  
  -- Check weight (must be at least 50kg)
  IF user_profile.weight IS NULL OR user_profile.weight < 50 THEN
    RETURN false;
  END IF;
  
  -- Check last donation date (must be at least 90 days ago)
  IF user_profile.last_donation_date IS NOT NULL THEN
    days_since_donation := CURRENT_DATE - user_profile.last_donation_date;
    IF days_since_donation < 90 THEN
      RETURN false;
    END IF;
  END IF;
  
  RETURN true;
END;
$$;

-- 5. AUTO-TRIGGER FOR USER_PROFILES
-- ========================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, email_verified)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.email_confirmed_at IS NOT NULL
  );
  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. UPDATE RLS POLICIES WITH ADMIN OVERRIDE
-- ========================================

-- DROP EXISTING POLICIES
DROP POLICY IF EXISTS "Blood requests are viewable by everyone" ON blood_requests;
DROP POLICY IF EXISTS "Authenticated users can create blood requests" ON blood_requests;
DROP POLICY IF EXISTS "Users can update their own blood requests" ON blood_requests;
DROP POLICY IF EXISTS "Users can delete their own blood requests" ON blood_requests;

DROP POLICY IF EXISTS "Donors are viewable by everyone" ON donors;
DROP POLICY IF EXISTS "Authenticated users can create donors" ON donors;
DROP POLICY IF EXISTS "Users can update their own donor records" ON donors;
DROP POLICY IF EXISTS "Users can delete their own donor records" ON donors;

DROP POLICY IF EXISTS "User profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

-- BLOOD REQUESTS POLICIES
CREATE POLICY "Blood requests viewable by all"
  ON blood_requests FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create blood requests"
  ON blood_requests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own requests or admins can update any"
  ON blood_requests FOR UPDATE
  USING (
    auth.uid() = created_by 
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can delete own requests or admins can delete any"
  ON blood_requests FOR DELETE
  USING (
    auth.uid() = created_by 
    OR public.has_role(auth.uid(), 'admin')
  );

-- DONORS POLICIES
CREATE POLICY "Donors viewable by all"
  ON donors FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create donor records"
  ON donors FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own donor records or admins can update any"
  ON donors FOR UPDATE
  USING (
    auth.uid() = created_by 
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can delete own donor records or admins can delete any"
  ON donors FOR DELETE
  USING (
    auth.uid() = created_by 
    OR public.has_role(auth.uid(), 'admin')
  );

-- USER PROFILES POLICIES
CREATE POLICY "User profiles viewable by all"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile or admins can update any"
  ON user_profiles FOR UPDATE
  USING (
    auth.uid() = id 
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can delete own profile or admins can delete any"
  ON user_profiles FOR DELETE
  USING (
    auth.uid() = id 
    OR public.has_role(auth.uid(), 'admin')
  );

-- 7. GRANT PERMISSIONS
-- ========================================

GRANT ALL ON TABLE user_profiles TO authenticated;
GRANT ALL ON TABLE blood_requests TO authenticated;
GRANT ALL ON TABLE donors TO authenticated;
GRANT USAGE ON SEQUENCE blood_requests_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE donors_id_seq TO authenticated;

-- 8. SAMPLE DATA
-- ========================================

-- Sample data for blood_requests
INSERT INTO blood_requests (blood_group, location, units_needed, urgency, patient_info, contact_number, created_at) VALUES
  ('O-', 'Dhaka Medical College Hospital', 2, 'immediate', 'Emergency surgery patient', '+8801712345678', '2025-10-10 10:30:00'),
  ('B+', 'Chittagong Medical College', 1, 'urgent', 'Accident victim', '+8801987654321', '2025-10-10 09:15:00'),
  ('A+', 'Sylhet MAG Osmani Medical College', 3, 'urgent', 'Cancer treatment patient', '+8801555123456', '2025-10-09 14:20:00'),
  ('AB-', 'Rajshahi Medical College', 2, 'immediate', 'Heart surgery patient', '+8801333444555', '2025-10-10 11:45:00'),
  ('O+', 'Khulna Medical College', 1, 'flexible', 'Child with thalassemia', '+8801888777666', '2025-10-09 16:10:00'),
  ('A-', 'Barisal Medical College', 4, 'urgent', 'Multiple trauma patient', '+8801666555444', '2025-10-10 08:30:00'),
  ('B-', 'Rangpur Medical College', 2, 'immediate', 'Postpartum hemorrhage', '+8801999888777', '2025-10-10 12:15:00'),
  ('AB+', 'Comilla Medical College', 1, 'flexible', 'Sickle cell disease patient', '+8801555666777', '2025-10-08 13:45:00'),
  ('O-', 'Mymensingh Medical College', 3, 'urgent', 'Severe anemia patient', '+8801777888999', '2025-10-10 07:20:00'),
  ('B+', 'Faridpur Medical College', 2, 'immediate', 'Surgical case', '+8801888999000', '2025-10-10 13:10:00'),
  ('A+', 'Cox\'s Bazar Medical College', 1, 'flexible', 'Routine surgery', '+8801999000111', '2025-10-09 15:30:00'),
  ('AB-', 'Jessore Medical College', 2, 'urgent', 'Child with leukemia', '+8801555222333', '2025-10-10 09:45:00'),
  ('O+', 'Dinajpur Medical College', 4, 'immediate', 'Multiple injury patient', '+8801888333444', '2025-10-10 11:20:00'),
  ('A-', 'Bogra Medical College', 1, 'urgent', 'Gastrointestinal bleeding', '+8801777444555', '2025-10-09 17:15:00'),
  ('B-', 'Pabna Medical College', 3, 'flexible', 'Thalassemia patient', '+8801999555666', '2025-10-08 14:30:00'),
  ('AB+', 'Noakhali Medical College', 2, 'urgent', 'Hematology patient', '+8801555666777', '2025-10-10 10:15:00'),
  ('O-', 'Kushtia Medical College', 1, 'immediate', 'Emergency case', '+8801777888999', '2025-10-10 12:30:00'),
  ('B+', 'Tangail Medical College', 3, 'urgent', 'Surgical patient', '+8801888999000', '2025-10-09 18:45:00'),
  ('A+', 'Jamalpur Medical College', 2, 'flexible', 'Routine checkup', '+8801999000111', '2025-10-08 15:20:00'),
  ('AB-', 'Sherpur Medical College', 1, 'urgent', 'Pediatric case', '+8801555222333', '2025-10-10 08:50:00'),
  ('O+', 'Narsingdi Medical College', 2, 'immediate', 'Emergency surgery', '+8801777888999', '2025-10-10 14:20:00'),
  ('A-', 'Gazipur Medical College', 3, 'urgent', 'Cancer treatment', '+8801888999000', '2025-10-09 16:45:00'),
  ('B+', 'Madaripur Medical College', 1, 'flexible', 'Routine case', '+8801999000111', '2025-10-08 17:30:00'),
  ('AB+', 'Rajbari Medical College', 4, 'immediate', 'Multiple trauma', '+8801555222333', '2025-10-10 09:15:00'),
  ('O-', 'Munshiganj Medical College', 2, 'urgent', 'Surgical patient', '+8801777444555', '2025-10-09 18:10:00'),
  ('A+', 'Shariatpur Medical College', 1, 'flexible', 'Checkup', '+8801888333444', '2025-10-08 19:25:00'),
  ('B-', 'Magura Medical College', 3, 'immediate', 'Emergency case', '+8801999555666', '2025-10-10 11:40:00'),
  ('AB-', 'Meherpur Medical College', 2, 'urgent', 'Hematology patient', '+8801555666777', '2025-10-09 15:55:00');

-- Sample data for donors
INSERT INTO donors (name, blood_group, location, contact_number, is_available, last_donation_date, created_at) VALUES
  ('Rahim Ahmed', 'O+', 'Dhaka', '+8801711111111', true, '2025-08-15', '2025-01-15 09:00:00'),
  ('Karim Hasan', 'A-', 'Chittagong', '+8801822222222', true, '2025-09-20', '2025-02-20 10:30:00'),
  ('Fatima Khan', 'B+', 'Sylhet', '+8801933333333', false, '2025-10-01', '2025-03-01 11:15:00'),
  ('Shahidul Islam', 'AB-', 'Rajshahi', '+8801544444444', true, '2025-07-10', '2025-04-10 14:20:00'),
  ('Nasima Begum', 'O-', 'Khulna', '+8801655555555', true, '2025-09-05', '2025-05-05 15:45:00'),
  ('Mahmudur Rahman', 'A+', 'Barisal', '+8801366666666', false, '2025-09-25', '2025-06-25 16:30:00'),
  ('Sharmin Akter', 'B-', 'Rangpur', '+8801477777777', true, '2025-08-30', '2025-07-30 17:15:00'),
  ('Abdul Hamid', 'AB+', 'Comilla', '+8801988888888', true, '2025-07-22', '2025-08-22 18:00:00'),
  ('Taslima Begum', 'O+', 'Dhaka', '+8801799999999', true, '2025-09-18', '2025-09-18 19:30:00'),
  ('Mizanur Rahman', 'A-', 'Chittagong', '+8801811111112', false, '2025-10-05', '2025-10-05 20:15:00'),
  ('Rina Akter', 'B+', 'Sylhet', '+8801922222223', true, '2025-08-25', '2025-08-25 21:00:00'),
  ('Jalal Uddin', 'AB-', 'Rajshahi', '+8801533333334', true, '2025-09-12', '2025-09-12 22:45:00'),
  ('Sultana Begum', 'O-', 'Khulna', '+8801644444445', true, '2025-08-08', '2025-08-08 23:30:00'),
  ('Rezaul Karim', 'A+', 'Barisal', '+8801355555556', false, '2025-09-30', '2025-09-30 12:00:00'),
  ('Nusrat Jahan', 'B-', 'Rangpur', '+8801466666667', true, '2025-07-15', '2025-07-15 13:15:00'),
  ('Habibur Rahman', 'AB+', 'Comilla', '+8801977777778', true, '2025-08-22', '2025-08-22 14:30:00'),
  ('Farida Akter', 'O+', 'Dhaka', '+8801788888889', true, '2025-09-10', '2025-09-10 15:45:00'),
  ('Mamun Hossain', 'A-', 'Chittagong', '+8801899999990', false, '2025-10-08', '2025-10-08 16:30:00'),
  ('Shirin Akter', 'B+', 'Sylhet', '+8801900000001', true, '2025-08-30', '2025-08-30 17:15:00'),
  ('Nazrul Islam', 'AB-', 'Rajshahi', '+8801511111112', true, '2025-07-25', '2025-07-25 18:00:00'),
  ('Rabeya Khatun', 'O-', 'Khulna', '+8801622222223', true, '2025-09-12', '2025-09-12 19:30:00'),
  ('Saiful Islam', 'A+', 'Barisal', '+8801333333334', false, '2025-09-28', '2025-09-28 20:15:00'),
  ('Hasina Begum', 'B-', 'Rangpur', '+8801444444445', true, '2025-08-20', '2025-08-20 21:00:00'),
  ('Kamal Hossain', 'AB+', 'Comilla', '+8801955555556', true, '2025-07-30', '2025-07-30 22:45:00'),
  ('Ayesha Siddiqua', 'O+', 'Dhaka', '+8801766666667', true, '2025-09-05', '2025-09-05 23:30:00'),
  ('Mizan Mia', 'A-', 'Chittagong', '+8801877777778', false, '2025-10-10', '2025-10-10 12:00:00'),
  ('Taslima Rahman', 'B+', 'Sylhet', '+8801988888889', true, '2025-08-18', '2025-08-18 13:15:00'),
  ('Abdul Kader', 'AB-', 'Rajshahi', '+8801522222223', true, '2025-07-30', '2025-07-30 14:30:00');

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

-- Run this query to verify the update:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'user_profiles' 
-- ORDER BY ordinal_position;
