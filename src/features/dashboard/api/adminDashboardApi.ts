// src/features/dashboard/api/adminDashboardApi.ts
import { dashboardApiClient } from "./dashboardApiClient";
import type { DashboardStats } from "../types/dashboard-api.types";

export const adminDashboardApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return await dashboardApiClient.getDashboardStats();
  },
};