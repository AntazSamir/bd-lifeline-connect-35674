-- Fix foreign key constraints to allow deleting auth users safely
-- User profiles: cascade delete when auth user is removed
ALTER TABLE IF EXISTS public.user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_id_fkey,
  ADD CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Donors: preserve records by nullifying creator on user deletion
ALTER TABLE IF EXISTS public.donors
  DROP CONSTRAINT IF EXISTS donors_created_by_fkey,
  ADD CONSTRAINT donors_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Blood requests: preserve records by nullifying creator on user deletion
ALTER TABLE IF EXISTS public.blood_requests
  DROP CONSTRAINT IF EXISTS blood_requests_created_by_fkey,
  ADD CONSTRAINT blood_requests_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
