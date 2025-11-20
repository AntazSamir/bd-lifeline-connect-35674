import { supabase } from './supabaseClient'

// Types for our application
export interface BloodRequest {
  id?: number
  blood_group: string
  location: string
  units_needed: number
  urgency: 'immediate' | 'urgent' | 'flexible'
  patient_info: string
  contact_number: string
  created_at?: string
  created_by?: string
}

export interface Donor {
  id?: number
  name: string
  blood_group: string
  location: string
  contact_number: string
  last_donation_date?: string
  is_available: boolean
  created_at?: string
  created_by?: string
}

export interface UserProfile {
  id?: string
  full_name: string
  phone: string
  nid: string
  blood_group: string
  location: string
  last_donation_date?: string
  is_donor: boolean
  created_at?: string
  updated_at?: string;
  // Additional fields from the actual database schema
  email?: string;
  date_of_birth?: string;
  division?: string;
  district?: string;
  full_address?: string;
  weight?: number;
  height?: number;
  medical_history?: Record<string, any>;
  lifestyle_info?: Record<string, any>;
  recent_activities?: Record<string, any>;
  email_verified?: boolean;
  phone_verified?: boolean;
  profile_photo_url?: string;
}

// Blood Request Functions
export const getAllBloodRequests = async () => {
  const { data, error } = await supabase
    .from('blood_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getBloodRequestById = async (id: number) => {
  const { data, error } = await supabase
    .from('blood_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const createBloodRequest = async (request: Omit<BloodRequest, 'id' | 'created_at'>) => {
  // Get the current user ID if available
  const { data: { user } } = await supabase.auth.getUser()

  const requestData = {
    ...request,
    created_by: user?.id
  }

  const { data, error } = await supabase
    .from('blood_requests')
    .insert([requestData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateBloodRequest = async (id: number, updates: Partial<BloodRequest>) => {
  const { data, error } = await supabase
    .from('blood_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteBloodRequest = async (id: number) => {
  const { error } = await supabase
    .from('blood_requests')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// Donor Functions
export const getAllDonors = async () => {
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getDonorById = async (id: number) => {
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const createDonor = async (donor: Omit<Donor, 'id' | 'created_at'>) => {
  // Get the current user ID if available
  const { data: { user } } = await supabase.auth.getUser()

  const donorData = {
    ...donor,
    created_by: user?.id
  }

  const { data, error } = await supabase
    .from('donors')
    .insert([donorData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateDonor = async (id: number, updates: Partial<Donor>) => {
  const { data, error } = await supabase
    .from('donors')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteDonor = async (id: number) => {
  const { error } = await supabase
    .from('donors')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// User Profile Functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows found"
  return data
}

export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => {
  // Get the current user ID if available
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('User not authenticated');

  const profileData = {
    id: user.id,
    ...profile,
    email: user.email, // Add email from auth user
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('user_profiles')
    .insert([profileData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const updateUserProfile = async (updates: Partial<UserProfile>) => {
  // Get the current user ID if available
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('User not authenticated')

  const profileData = {
    ...updates,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .update(profileData)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteUserProfile = async () => {
  // Get the current user ID if available
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', user.id)

  if (error) throw error
  return true
}

// Authentication Functions
export const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })

  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/complete-profile`,
    },
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return true
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}