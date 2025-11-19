-- Template: Delete dependent rows for a given user UUID
-- 1) Replace USER_UUID with the user's UUID
-- 2) Run in Supabase SQL editor as a project owner
-- 3) After dependent rows are removed, delete the auth user via Admin API or Dashboard

BEGIN;

-- Example deletes (customize as needed):
DELETE FROM donors WHERE created_by = 'USER_UUID';
DELETE FROM blood_requests WHERE created_by = 'USER_UUID';
DELETE FROM user_profiles WHERE id = 'USER_UUID';

-- Add additional deletes for other tables that reference auth.users

COMMIT;

-- Note: Supabase does not recommend deleting from auth.users directly via SQL.
-- Use the Admin API (service_role key) or Dashboard to remove the auth user after cleaning dependent rows.
