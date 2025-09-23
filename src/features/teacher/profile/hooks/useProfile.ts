import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApiClient } from '../api/profileApiClient'
import type { 
  UpdatePersonalInfoDto, 
  UpdateSchoolInfoDto,
  UpdateSessionConfigDto
} from '../types/profile.types'

// Query keys for teacher profile
export const teacherProfileKeys = {
  all: ['teacher-profile'] as const,
  admin: () => [...teacherProfileKeys.all, 'admin'] as const,
  school: () => [...teacherProfileKeys.all, 'school'] as const,
  sessions: () => [...teacherProfileKeys.all, 'sessions'] as const,
  classLevels: () => [...teacherProfileKeys.all, 'classLevels'] as const,
  classLevelsAndArms: () => [...teacherProfileKeys.all, 'classLevelsAndArms'] as const,
}

// Hook to fetch admin profile
export function useAdminProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: teacherProfileKeys.admin(),
    queryFn: () => profileApiClient.getAdminProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3, // Only retry 3 times instead of infinite
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    enabled, // Allow disabling the query
  })
}

// Hook to fetch school information
export function useSchoolInformation() {
  return useQuery({
    queryKey: teacherProfileKeys.school(),
    queryFn: () => profileApiClient.getSchoolInformation(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook to fetch session configuration
export function useSessionConfiguration() {
  return useQuery({
    queryKey: teacherProfileKeys.sessions(),
    queryFn: () => profileApiClient.getSessionConfiguration(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook to fetch class levels
export function useClassLevels() {
  return useQuery({
    queryKey: teacherProfileKeys.classLevels(),
    queryFn: () => profileApiClient.getClassLevels(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook to fetch class levels and arms
export function useClassLevelsAndArms() {
  return useQuery({
    queryKey: teacherProfileKeys.classLevelsAndArms(),
    queryFn: () => profileApiClient.getClassLevelsAndArms(),
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
      queryClient.invalidateQueries({ queryKey: teacherProfileKeys.admin() })
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
      queryClient.invalidateQueries({ queryKey: teacherProfileKeys.school() })
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
      queryClient.invalidateQueries({ queryKey: teacherProfileKeys.sessions() })
    },
    onError: (error) => {
      console.error('Failed to update session configuration:', error)
    },
  })
}