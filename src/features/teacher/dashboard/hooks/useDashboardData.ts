import { useQuery } from '@tanstack/react-query';
import { dashboardApiClient } from '../api/dashboardApiClient';
import type { DashboardData } from '../types/dashboard.types';

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ['teacher', 'dashboard'],
    queryFn: async () => {
      const response = await dashboardApiClient.getDashboard();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
