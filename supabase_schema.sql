-- SQL schema for BloodConnect application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blood_requests table
CREATE TABLE blood_requests (
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
CREATE TABLE donors (
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
CREATE TABLE user_profiles (
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
CREATE INDEX idx_blood_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX idx_blood_requests_location ON blood_requests(location);
CREATE INDEX idx_blood_requests_urgency ON blood_requests(urgency);
CREATE INDEX idx_blood_requests_created_at ON blood_requests(created_at);
CREATE INDEX idx_donors_blood_group ON donors(blood_group);
CREATE INDEX idx_donors_location ON donors(location);
CREATE INDEX idx_donors_availability ON donors(is_available);
CREATE INDEX idx_donors_created_at ON donors(created_at);
CREATE INDEX idx_user_profiles_blood_group ON user_profiles(blood_group);
CREATE INDEX idx_user_profiles_location ON user_profiles(location);

-- Set up Row Level Security (RLS)
-- Allow read access for all users
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Blood requests policies
CREATE POLICY "Blood requests are viewable by everyone" 
  ON blood_requests FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create blood requests" 
  ON blood_requests FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own blood requests" 
  ON blood_requests FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own blood requests" 
  ON blood_requests FOR DELETE 
  USING (auth.uid() = created_by);

-- Donors policies
CREATE POLICY "Donors are viewable by everyone" 
  ON donors FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create donors" 
  ON donors FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own donor records" 
  ON donors FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own donor records" 
  ON donors FOR DELETE 
  USING (auth.uid() = created_by);

-- User profiles policies
CREATE POLICY "User profiles are viewable by everyone" 
  ON user_profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" 
  ON user_profiles FOR DELETE 
  USING (auth.uid() = id);

-- Grant permissions
GRANT ALL ON TABLE blood_requests TO authenticated;
GRANT ALL ON TABLE donors TO authenticated;
GRANT ALL ON TABLE user_profiles TO authenticated;
GRANT USAGE ON SEQUENCE blood_requests_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE donors_id_seq TO authenticated;

-- Sample data for testing
INSERT INTO blood_requests (blood_group, location, units_needed, urgency, patient_info, contact_number) VALUES
  ('O-', 'Dhaka Medical College Hospital', 2, 'immediate', 'Emergency surgery patient', '+8801712345678'),
  ('B+', 'Chittagong Medical College', 1, 'urgent', 'Accident victim', '+8801987654321'),
  ('A+', 'Sylhet MAG Osmani Medical College', 3, 'urgent', 'Cancer treatment patient', '+8801555123456'),
  ('AB-', 'Rajshahi Medical College', 2, 'immediate', 'Heart surgery patient', '+8801333444555'),
  ('O+', 'Khulna Medical College', 1, 'flexible', 'Child with thalassemia', '+8801888777666'),
  ('A-', 'Barisal Medical College', 4, 'urgent', 'Multiple trauma patient', '+8801666555444'),
  ('B-', 'Rangpur Medical College', 2, 'immediate', 'Postpartum hemorrhage', '+8801999888777'),
  ('AB+', 'Comilla Medical College', 1, 'flexible', 'Sickle cell disease patient', '+8801555666777'),
  ('O-', 'Mymensingh Medical College', 3, 'urgent', 'Severe anemia patient', '+8801777888999'),
  ('B+', 'Faridpur Medical College', 2, 'immediate', 'Surgical case', '+8801888999000'),
  ('A+', 'Cox\'s Bazar Medical College', 1, 'flexible', 'Routine surgery', '+8801999000111'),
  ('AB-', 'Jessore Medical College', 2, 'urgent', 'Child with leukemia', '+8801555222333'),
  ('O+', 'Dinajpur Medical College', 4, 'immediate', 'Multiple injury patient', '+8801888333444'),
  ('A-', 'Bogra Medical College', 1, 'urgent', 'Gastrointestinal bleeding', '+8801777444555'),
  ('B-', 'Pabna Medical College', 3, 'flexible', 'Thalassemia patient', '+8801999555666'),
  ('AB+', 'Noakhali Medical College', 2, 'urgent', 'Hematology patient', '+8801555666777'),
  ('O+', 'Kushtia Medical College', 3, 'immediate', 'Emergency surgery', '+8801777888999'),
  ('A-', 'Tangail Medical College', 2, 'urgent', 'Accident case', '+8801888999000'),
  ('B+', 'Jamalpur Medical College', 1, 'flexible', 'Routine checkup', '+8801999000111'),
  ('AB-', 'Sherpur Medical College', 4, 'immediate', 'Multiple trauma', '+8801555222333'),
  ('O-', 'Narsingdi Medical College', 2, 'urgent', 'Surgical patient', '+8801777444555'),
  ('A+', 'Gazipur Medical College', 3, 'flexible', 'Cancer treatment', '+8801888333444'),
  ('B-', 'Madaripur Medical College', 1, 'immediate', 'Emergency case', '+8801999555666'),
  ('AB+', 'Rajbari Medical College', 2, 'urgent', 'Hematology patient', '+8801555666777'),
  ('AB+', 'Rajshahi Medical College', 1, 'flexible', 'Thalassemia patient', '+8801666777888'),
  ('O+', 'Khulna Medical College Hospital', 2, 'urgent', 'Dengue patient', '+8801777888999'),
  ('A-', 'Mymensingh Medical College', 1, 'immediate', 'Post-operative care', '+8801888999000'),
  ('B-', 'Comilla Medical College', 2, 'urgent', 'Road accident victim', '+8801999000111'),
  ('AB-', 'Rangpur Medical College', 1, 'flexible', 'Scheduled surgery', '+8801000111222'),
  ('O+', 'Barisal Sher-e-Bangla Medical College', 3, 'immediate', 'Maternity emergency', '+8801111222333'),
  ('A+', 'Faridpur Medical College', 1, 'urgent', 'Trauma patient', '+8801222333444'),
  ('B+', 'Jessore Medical College', 2, 'flexible', 'Anemia treatment', '+8801333444555'),
  ('O-', 'Bogra Mohammad Ali Hospital', 1, 'immediate', 'Critical emergency', '+8801444555666'),
  ('AB+', 'Pabna Medical College', 2, 'urgent', 'Chronic illness', '+8801555666777'),
  ('A-', 'Dinajpur Medical College', 1, 'flexible', 'Blood disorder patient', '+8801666777999');

INSERT INTO donors (name, blood_group, location, contact_number, is_available, last_donation_date) VALUES
  ('Rahim Ahmed', 'O+', 'Dhaka', '+8801711111111', true, '2025-08-15'),
  ('Karim Hasan', 'A-', 'Chittagong', '+8801822222222', true, '2025-09-20'),
  ('Fatima Khan', 'B+', 'Sylhet', '+8801933333333', false, '2025-10-01'),
  ('Shahidul Islam', 'AB-', 'Rajshahi', '+8801544444444', true, '2025-07-10'),
  ('Nasima Begum', 'O-', 'Khulna', '+8801655555555', true, '2025-09-05'),
  ('Mahmudur Rahman', 'A+', 'Barisal', '+8801366666666', false, '2025-09-25'),
  ('Sharmin Akter', 'B-', 'Rangpur', '+8801477777777', true, '2025-08-30'),
  ('Abdul Hamid', 'AB+', 'Comilla', '+8801988888888', true, '2025-07-22'),
  ('Taslima Begum', 'O+', 'Dhaka', '+8801799999999', true, '2025-09-18'),
  ('Mizanur Rahman', 'A-', 'Chittagong', '+8801811111112', false, '2025-10-05'),
  ('Rina Akter', 'B+', 'Sylhet', '+8801922222223', true, '2025-08-25'),
  ('Jalal Uddin', 'AB-', 'Rajshahi', '+8801533333334', true, '2025-09-12'),
  ('Sultana Begum', 'O-', 'Khulna', '+8801644444445', true, '2025-08-08'),
  ('Rezaul Karim', 'A+', 'Barisal', '+8801355555556', false, '2025-09-30'),
  ('Nusrat Jahan', 'B-', 'Rangpur', '+8801466666667', true, '2025-07-15'),
  ('Habibur Rahman', 'AB+', 'Comilla', '+8801977777778', true, '2025-08-22'),
  ('Farida Akter', 'O+', 'Dhaka', '+8801788888889', true, '2025-09-10'),
  ('Mamun Hossain', 'A-', 'Chittagong', '+8801899999990', false, '2025-10-08'),
  ('Shirin Akter', 'B+', 'Sylhet', '+8801900000001', true, '2025-08-30'),
  ('Nazrul Islam', 'AB-', 'Rajshahi', '+8801511111112', true, '2025-07-25'),
  ('Rabeya Khatun', 'O-', 'Khulna', '+8801622222223', true, '2025-09-12'),
  ('Saiful Islam', 'A+', 'Barisal', '+8801333333334', false, '2025-09-28'),
  ('Hasina Begum', 'B-', 'Rangpur', '+8801444444445', true, '2025-08-20'),
  ('Kamal Hossain', 'AB+', 'Comilla', '+8801955555556', true, '2025-07-30'),
  ('Nasir Uddin', 'O-', 'Dhaka', '+8801744444444', true),
  ('Sakib Rahman', 'AB+', 'Rajshahi', '+8801855555555', true),
  ('Ayesha Begum', 'A+', 'Khulna', '+8801966666666', true),
  ('Hasan Ali', 'B-', 'Mymensingh', '+8801777777777', false),
  ('Ruhul Amin', 'AB-', 'Rangpur', '+8801888888888', true),
  ('Sharmin Akter', 'O+', 'Barisal', '+8801999999999', true),
  ('Jahangir Alam', 'A-', 'Comilla', '+8801600000000', true),
  ('Nusrat Jahan', 'B+', 'Jessore', '+8801711111112', false),
  ('Kamrul Islam', 'O-', 'Bogra', '+8801822222223', true),
  ('Sumaiya Rahman', 'AB+', 'Pabna', '+8801933333334', true),
  ('Mizanur Rahman', 'A+', 'Dinajpur', '+8801744444445', true),
  ('Tasnim Ahmed', 'B-', 'Faridpur', '+8801855555556', true),
  ('Shakil Khan', 'O+', 'Chittagong', '+8801966666667', true),
  ('Farhana Islam', 'A-', 'Sylhet', '+8801777777778', true),
  ('Masud Rana', 'AB-', 'Dhaka', '+8801888888889', false),
  ('Sultana Begum', 'B+', 'Rajshahi', '+8801999999990', true),
  ('Imran Hossain', 'O-', 'Khulna', '+8801600000001', true);