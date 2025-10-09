import { useQuery } from '@tanstack/react-query';
import { timetableApiClient } from '../api/timetableApiClient';

/**
 * Hook to fetch today's classes for the teacher
 */
export function useTodayClasses() {
  return useQuery({
    queryKey: ['teacher', 'timetable', 'today'],
    queryFn: () => timetableApiClient.getTodayClasses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch weekly schedule for the teacher
 */
export function useWeeklySchedule() {
  return useQuery({
    queryKey: ['teacher', 'timetable', 'weekly'],
    queryFn: () => timetableApiClient.getWeeklySchedule(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
