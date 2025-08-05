import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApiClient } from '../api/profileApiClient'
import type { 
  UpdatePersonalInfoDto, 
  UpdateSchoolInfoDto,
  UpdateSessionConfigDto
} from '../types/profile.types'

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  admin: () => [...profileKeys.all, 'admin'] as const,
  school: () => [...profileKeys.all, 'school'] as const,
  sessions: () => [...profileKeys.all, 'sessions'] as const,
  classLevels: () => [...profileKeys.all, 'classLevels'] as const,
}

// Hook to fetch admin profile
export function useAdminProfile() {
  return useQuery({
    queryKey: profileKeys.admin(),
    queryFn: () => profileApiClient.getAdminProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to fetch school information
export function useSchoolInformation() {
  return useQuery({
    queryKey: profileKeys.school(),
    queryFn: () => profileApiClient.getSchoolInformation(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook to fetch session configuration
export function useSessionConfiguration() {
  return useQuery({
    queryKey: profileKeys.sessions(),
    queryFn: () => profileApiClient.getSessionConfiguration(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook to fetch class levels
export function useClassLevels() {
  return useQuery({
    queryKey: profileKeys.classLevels(),
    queryFn: () => profileApiClient.getClassLevels(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook to update personal information
export function useUpdatePersonalInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdatePersonalInfoDto) => 
      profileApiClient.updatePersonalInfo(data),
    onSuccess: () => {
      // Invalidate and refetch admin profile
      queryClient.invalidateQueries({ queryKey: profileKeys.admin() })
    },
    onError: (error) => {
      console.error('Failed to update personal info:', error)
    },
  })
}

// Hook to update school information
export function useUpdateSchoolInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSchoolInfoDto) => 
      profileApiClient.updateSchoolInformation(data),
    onSuccess: () => {
      // Invalidate and refetch school information
      queryClient.invalidateQueries({ queryKey: profileKeys.school() })
    },
    onError: (error) => {
      console.error('Failed to update school info:', error)
    },
  })
}

// Hook to update session configuration
export function useUpdateSessionConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSessionConfigDto) => 
      profileApiClient.updateSessionConfiguration(data),
    onSuccess: () => {
      // Invalidate and refetch session configuration
      queryClient.invalidateQueries({ queryKey: profileKeys.sessions() })
    },
    onError: (error) => {
      console.error('Failed to update session configuration:', error)
    },
  })
}