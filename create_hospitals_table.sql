-- Create hospitals table
CREATE TABLE IF NOT EXISTS public.hospitals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    district text NOT NULL,
    upazila text,
    address text,
    contact_number text,
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view active hospitals"
ON public.hospitals FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage hospitals"
ON public.hospitals FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert some initial data
INSERT INTO public.hospitals (name, district, address, is_verified) VALUES
('Dhaka Medical College Hospital', 'Dhaka', 'Secretariat Road, Dhaka', true),
('Square Hospital', 'Dhaka', '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka', true),
('Chittagong Medical College Hospital', 'Chittagong', 'KB Fazlul Kader Road, Chittagong', true);
