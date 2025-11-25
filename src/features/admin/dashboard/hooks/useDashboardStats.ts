// src/features/dashboard/hooks/useDashboardStats.ts
import { useQuery } from '@tanstack/react-query';
import { dashboardApiClient } from '../api/dashboardApiClient';
import type { DashboardStats } from '../types/dashboard-api.types';

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApiClient.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    stats: data || null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch dashboard statistics') : null,
    refetch,
  };
};