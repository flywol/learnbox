import BaseApiClient from '@/common/api/baseApiClient';
import type { DashboardApiResponse } from '../types/dashboard.types';

class DashboardApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  /**
   * GET /api/v1/teacher/dashboard
   * Get teacher dashboard overview with statistics
   */
  async getDashboard(): Promise<DashboardApiResponse> {
    return await this.get<DashboardApiResponse>('/teacher/dashboard');
  }
}

export const dashboardApiClient = new DashboardApiClient();
