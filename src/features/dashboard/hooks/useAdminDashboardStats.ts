// src/features/dashboard/hooks/useAdminDashboardStats.ts
import { useState, useEffect } from 'react';
import { adminDashboardApi } from '../api/adminDashboardApi';
import type { DashboardStats } from '../types/dashboard-api.types';

interface UseAdminDashboardStatsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAdminDashboardStats = (): UseAdminDashboardStatsReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await adminDashboardApi.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to fetch admin dashboard stats:', err);
      setError(err.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};