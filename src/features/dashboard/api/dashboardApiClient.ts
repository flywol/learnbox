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
      console.log("📡 API: getAllUsersStats called");
      const response = await this.get<AllUsersResponse>("/admin/all-users");
      console.log("✅ API: getAllUsersStats success", response.data);
      return response;
    } catch (error) {
      console.error("❌ API: getAllUsersStats failed:", error);
      throw error;
    }
  }

  // Get class information statistics
  async getClassInformation(): Promise<ClassInformationResponse> {
    try {
      console.log("📡 API: getClassInformation called");
      const response = await this.get<ClassInformationResponse>("/admin/class-information");
      console.log("✅ API: getClassInformation success", response.data);
      return response;
    } catch (error) {
      console.error("❌ API: getClassInformation failed:", error);
      throw error;
    }
  }

  // Get combined dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      console.log("📡 API: getDashboardStats called");
      
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

      console.log("✅ API: getDashboardStats combined success", stats);
      return stats;
    } catch (error) {
      console.error("❌ API: getDashboardStats failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const dashboardApiClient = new DashboardApiClient();