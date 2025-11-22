import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/services/supabaseClient'
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
  UserProfile,
  BloodRequestFilters
} from '../services/dbService'
import { logger } from '@/lib/logger'
import { toast } from '@/hooks/use-toast'

export const useBloodRequests = (initialPage = 1, limit = 12, filters: BloodRequestFilters = {}) => {
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [totalCount, setTotalCount] = useState(0)

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      const { data, count } = await getAllBloodRequests(page, limit, filters)
      setRequests(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, JSON.stringify(filters)])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

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
    removeRequest,
    page,
    setPage,
    totalPages: Math.ceil(totalCount / limit),
    totalCount
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

    // Set up real-time subscription for donor updates
    logger.debug('Setting up real-time subscription for donors table')
    const channel = supabase
      .channel('donors-realtime-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'donors'
        },
        (payload) => {
          logger.debug('Real-time update received:', payload)

          // Dispatch custom event for status indicator
          window.dispatchEvent(new CustomEvent('realtime-update'));

          if (payload.eventType === 'INSERT') {
            logger.debug('New donor added:', payload.new)
            setDonors(prev => [payload.new as Donor, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            logger.debug('Donor updated:', payload.new)
            setDonors(prev =>
              prev.map(donor =>
                donor.id === payload.new.id ? payload.new as Donor : donor
              )
            )
          } else if (payload.eventType === 'DELETE') {
            logger.debug('Donor deleted:', payload.old)
            setDonors(prev =>
              prev.filter(donor => donor.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe((status, err) => {
        logger.debug('Subscription status:', status)
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          logger.error('Real-time subscription error:', err)
          toast({
            title: "Connection Issue",
            description: "Unable to receive live updates. Refresh the page.",
            variant: "destructive"
          })
        }
      })

    // Cleanup subscription on unmount
    return () => {
      logger.debug('Cleaning up real-time subscription')
      supabase.removeChannel(channel)
    }
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