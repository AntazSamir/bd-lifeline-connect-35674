import { useState, useEffect } from 'react'
import { 
  getAllBloodRequests, 
  getBloodRequestById, 
  createBloodRequest, 
  updateBloodRequest, 
  deleteBloodRequest,
  getAllDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getCurrentUser,
  BloodRequest,
  Donor,
  UserProfile
} from '../services/dbService'

export const useBloodRequests = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const data = await getAllBloodRequests()
      setRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const addRequest = async (request: Omit<BloodRequest, 'id' | 'created_at'>) => {
    try {
      const newRequest = await createBloodRequest(request)
      setRequests(prev => [newRequest, ...prev])
      return newRequest
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      throw err
    }
  }

  const updateRequest = async (id: number, updates: Partial<BloodRequest>) => {
    try {
      const updatedRequest = await updateBloodRequest(id, updates)
      setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      throw err
    }
  }

  const removeRequest = async (id: number) => {
    try {
      await deleteBloodRequest(id)
      setRequests(prev => prev.filter(req => req.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      throw err
    }
  }

  return {
    requests,
    loading,
    error,
    fetchRequests,
    addRequest,
    updateRequest,
    removeRequest
  }
}

export const useDonors = () => {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDonors = async () => {
    try {
      setLoading(true)
      const data = await getAllDonors()
      setDonors(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonors()
  }, [])

  const addDonor = async (donor: Omit<Donor, 'id' | 'created_at'>) => {
    try {
      const newDonor = await createDonor(donor)
      setDonors(prev => [newDonor, ...prev])
      return newDonor
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      throw err
    }
  }

  const updateDonorRecord = async (id: number, updates: Partial<Donor>) => {
    try {
      const updatedDonor = await updateDonor(id, updates)
      setDonors(prev => prev.map(d => d.id === id ? updatedDonor : d))
      return updatedDonor
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      throw err
    }
  }

  const removeDonor = async (id: number) => {
    try {
      await deleteDonor(id)
      setDonors(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      throw err
    }
  }

  return {
    donors,
    loading,
    error,
    fetchDonors,
    addDonor,
    updateDonor: updateDonorRecord,
    removeDonor
  }
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const user = await getCurrentUser()
      if (user) {
        const userProfile = await getUserProfile(user.id)
        setProfile(userProfile || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const createProfile = async (profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProfile = await createUserProfile(profileData)
      setProfile(newProfile)
      return newProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      throw err
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = await updateUserProfile(updates)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      throw err
    }
  }

  const deleteProfile = async () => {
    try {
      await deleteUserProfile()
      setProfile(null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      throw err
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    deleteProfile
  }
}