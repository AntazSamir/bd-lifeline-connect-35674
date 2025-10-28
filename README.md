# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c397a5f1-584f-4768-97eb-c6d6ecaf0f8a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c397a5f1-584f-4768-97eb-c6d6ecaf0f8a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (for backend services and database)

## Supabase Integration

This project is now integrated with Supabase for backend services including authentication and database storage.

### Configuration

Environment variables (Vite):

Create a `.env.local` file in the project root with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are read in `src/services/supabaseClient.ts` via `import.meta.env`.

### Database Schema

The application requires the following tables in your Supabase database:

```sql
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
```

### Setting Up the Database

To set up the database tables:

1. Go to your Supabase project dashboard at https://app.supabase.com/project/fjhtbrdnjhlxrwarcfrr
2. Navigate to the SQL editor in the left sidebar
3. Copy and paste the complete SQL schema above
4. Click "Run" to execute the SQL script

This will create all the necessary tables and set up the Row Level Security policies.

### Email Confirmation

The application now includes email confirmation functionality:

1. When users sign up, they receive an email with a confirmation link
2. Clicking the link verifies their email address and redirects them to the sign-in page
3. Users must confirm their email before they can sign in to the application

To configure email confirmation:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Under "Email Templates", customize the confirmation email template if desired
4. Ensure "Enable email confirmations" is checked
5. Set the "Site URL" to your application's URL (e.g., http://localhost:8080 or your production URL)

### User Profile Feature

The application now includes a user profile system with the following features:

1. **Automatic Profile Creation**: When users sign up, a profile is automatically created for them
2. **Profile Management**: Users can view and edit their profile information
3. **Profile Fields**: Full name, phone number, NID, blood group, location, last donation date, and donor status

To access the user profile:
- Navigate to `/profile` after signing in
- Users can edit their profile information from the profile page

### Troubleshooting Registration Issues

If you're experiencing issues with user registration:

1. **Check that all database tables exist**: The application requires `blood_requests`, `donors`, and `user_profiles` tables. The most common issue is the missing `user_profiles` table.
2. **Verify the Supabase connection**: Check that your Supabase credentials are correct in [supabaseClient.ts](file:///c:/Users/rocks/OneDrive/Desktop/HTML/bd-lifeline-connect-39/src/services/supabaseClient.ts)
3. **Enable email confirmations**: In your Supabase dashboard, go to Authentication > Settings and ensure email confirmations are configured properly
4. **Check the browser console**: Look for any JavaScript errors that might indicate issues with the frontend code

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c397a5f1-584f-4768-97eb-c6d6ecaf0f8a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)