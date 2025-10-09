import { useQuery } from '@tanstack/react-query';
import { profileApiClient } from '../api/profileApiClient';
import { subjectsClassesApiClient } from '../../classroom/api/subjectsClassesApiClient';

export function useTeacherProfile() {
  return useQuery({
    queryKey: ['teacher', 'profile'],
    queryFn: () => profileApiClient.getAdminProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTeacherSubjects() {
  return useQuery({
    queryKey: ['teacher', 'subjects-classes'],
    queryFn: () => subjectsClassesApiClient.getTeacherSubjectsAndClasses(),
    staleTime: 5 * 60 * 1000,
  });
}

// Combined hook for profile page that returns all needed data
export function useTeacherProfileData() {
  const profileQuery = useTeacherProfile();
  const subjectsQuery = useTeacherSubjects();

  return {
    profile: profileQuery.data,
    subjects: subjectsQuery.data?.assignedSubjects || [],
    classes: subjectsQuery.data?.classes || [],
    isLoading: profileQuery.isLoading || subjectsQuery.isLoading,
    error: profileQuery.error || subjectsQuery.error,
  };
}
