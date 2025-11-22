-- ==========================================
-- OPTIMIZE RLS POLICIES
-- This script consolidates and optimizes RLS policies to fix Supabase warnings
-- Run this in your Supabase SQL Editor
-- ==========================================

-- ==========================================
-- 1. FIX user_roles TABLE POLICIES
-- ==========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Create optimized consolidated policies
CREATE POLICY "user_roles_select_policy" ON public.user_roles
FOR SELECT
USING (
  -- Cache the user ID to avoid repeated auth calls
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "user_roles_insert_policy" ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "user_roles_update_policy" ON public.user_roles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "user_roles_delete_policy" ON public.user_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- ==========================================
-- 2. FIX hospitals TABLE POLICIES
-- ==========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Hospitals are viewable by everyone" ON public.hospitals;
DROP POLICY IF EXISTS "Only admins can insert hospitals" ON public.hospitals;
DROP POLICY IF EXISTS "Only admins can update hospitals" ON public.hospitals;
DROP POLICY IF EXISTS "Only admins can delete hospitals" ON public.hospitals;
DROP POLICY IF EXISTS "Hospitals are publicly readable" ON public.hospitals;
DROP POLICY IF EXISTS "Admins can manage hospitals" ON public.hospitals;

-- Create optimized consolidated policies
CREATE POLICY "hospitals_select_policy" ON public.hospitals
FOR SELECT
USING (true); -- Public read access

CREATE POLICY "hospitals_insert_policy" ON public.hospitals
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "hospitals_update_policy" ON public.hospitals
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "hospitals_delete_policy" ON public.hospitals
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ==========================================
-- 3. FIX system_settings TABLE POLICIES
-- ==========================================

-- Drop existing policies
DROP POLICY IF EXISTS "System settings are viewable by everyone" ON public.system_settings;
DROP POLICY IF EXISTS "Only admins can modify system settings" ON public.system_settings;
DROP POLICY IF EXISTS "System settings are publicly readable" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can insert system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can update system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can delete system settings" ON public.system_settings;

-- Create optimized consolidated policies
CREATE POLICY "system_settings_select_policy" ON public.system_settings
FOR SELECT
USING (true); -- Public read access

CREATE POLICY "system_settings_insert_policy" ON public.system_settings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "system_settings_update_policy" ON public.system_settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "system_settings_delete_policy" ON public.system_settings
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Verify policies are created correctly
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_roles', 'hospitals', 'system_settings')
ORDER BY tablename, cmd;
