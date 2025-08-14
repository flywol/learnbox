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
    try {
      const response = await this.get<AllUsersResponse>("/admin/all-users");
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get class information statistics
  async getClassInformation(): Promise<ClassInformationResponse> {
    try {
      const response = await this.get<ClassInformationResponse>("/admin/class-information");
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get combined dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      
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
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const dashboardApiClient = new DashboardApiClient();