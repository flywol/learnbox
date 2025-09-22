// src/features/dashboard/api/dashboardApiClient.ts
import BaseApiClient from "@/common/api/baseApiClient";
import type { 
  AllUsersResponse, 
  ClassInformationResponse,
  DashboardStats 
} from "../types/dashboard-api.types";

class DashboardApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // Get all users statistics
  async getAllUsersStats(): Promise<AllUsersResponse> {
    return await this.get<AllUsersResponse>("/admin/all-users");
  }

  // Get class information statistics
  async getClassInformation(): Promise<ClassInformationResponse> {
    return await this.get<ClassInformationResponse>("/admin/class-information");
  }

  // Get combined dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    // Fetch both endpoints in parallel
    const [usersResponse, classResponse] = await Promise.all([
      this.getAllUsersStats(),
      this.getClassInformation()
    ]);

    // Combine the data
    const stats: DashboardStats = {
      ...usersResponse.data,
      ...classResponse.data
    };

    return stats;
  }
}

// Export singleton instance
export const dashboardApiClient = new DashboardApiClient();