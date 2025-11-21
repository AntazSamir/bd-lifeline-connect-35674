-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    key text PRIMARY KEY,
    value text,
    description text,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage settings"
ON public.system_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view public settings"
ON public.system_settings FOR SELECT
USING (key IN ('site_name', 'contact_email', 'maintenance_mode'));

-- Insert initial settings
INSERT INTO public.system_settings (key, value, description) VALUES
('site_name', 'BD LifeLine Connect', 'The name of the website'),
('contact_email', 'support@bloodconnect.bd', 'Main contact email'),
('maintenance_mode', 'false', 'Enable maintenance mode'),
('max_requests_per_day', '3', 'Maximum blood requests a user can make per day'),
('donor_reminder_days', '90', 'Days after which to remind donors to donate again')
ON CONFLICT (key) DO NOTHING;
