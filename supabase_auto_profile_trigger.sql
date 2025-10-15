-- Function to automatically create user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, phone, nid, blood_group, location, is_donor)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'nid',
    COALESCE(NEW.raw_user_meta_data->>'blood_group', ''),
    COALESCE(NEW.raw_user_meta_data->>'location', ''),
    COALESCE((NEW.raw_user_meta_data->>'is_donor')::boolean, false)
  );
  RETURN NEW;
END;
$$;

-- Trigger to run the function after a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
