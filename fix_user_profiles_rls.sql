-- Fix RLS policies for user_profiles to protect PII
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "User profiles are viewable by everyone" ON user_profiles;

-- Create a more secure policy: users can only view their own full profile
CREATE POLICY "Users can view their own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

-- Create a public view that only exposes non-sensitive information
CREATE OR REPLACE VIEW public.donor_public_profiles AS
SELECT 
  id,
  full_name,
  blood_group,
  location,
  is_donor,
  last_donation_date
FROM user_profiles
WHERE is_donor = true;

-- Grant access to the public view
GRANT SELECT ON public.donor_public_profiles TO authenticated, anon;

-- Ensure INSERT policy sets created_by correctly for blood_requests
DROP POLICY IF EXISTS "Authenticated users can create blood requests" ON blood_requests;
CREATE POLICY "Authenticated users can create blood requests" 
  ON blood_requests FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

-- Ensure INSERT policy sets created_by correctly for donors
DROP POLICY IF EXISTS "Authenticated users can create donors" ON donors;
CREATE POLICY "Authenticated users can create donors" 
  ON donors FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

-- Add policy for viewing all donor records (non-PII)
-- This is safe because donors table doesn't contain PII
CREATE POLICY "Everyone can view donor records" 
  ON donors FOR SELECT 
  USING (true);
