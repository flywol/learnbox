import BaseApiClient from "@/common/api/baseApiClient";
import type { 
  AdminProfile, 
  SchoolInformation, 
  UpdatePersonalInfoDto, 
  UpdateSchoolInfoDto,
  SessionConfiguration,
  UpdateSessionConfigDto,
  ClassLevel
} from "../types/profile.types";

class ProfileApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // Get admin profile
  async getAdminProfile(): Promise<AdminProfile> {
    try {
      console.log("📡 API: getAdminProfile called");
      const response = await this.get<{ data: { admin: AdminProfile } }>("/admin/admin-by-id");
      console.log("✅ API: getAdminProfile success", response);
      return response.data.admin;
    } catch (error) {
      console.error("❌ API: getAdminProfile failed:", error);
      throw error;
    }
  }

  // Update personal information
  async updatePersonalInfo(data: UpdatePersonalInfoDto): Promise<{ message: string }> {
    try {
      console.log("📡 API: updatePersonalInfo called", data);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
      if (data.gender) formData.append('gender', data.gender);
      if (data.position) formData.append('position', data.position);
      if (data.profilePicture) formData.append('profilePicture', data.profilePicture);

      const response = await this.put<{ message: string }>("/api/v1/admin/update-admin-personal-information", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("✅ API: updatePersonalInfo success", response);
      return response;
    } catch (error) {
      console.error("❌ API: updatePersonalInfo failed:", error);
      throw error;
    }
  }

  // Get school information
  async getSchoolInformation(): Promise<SchoolInformation> {
    try {
      console.log("📡 API: getSchoolInformation called");
      const response = await this.get<{ data: SchoolInformation }>("/api/v1/admin/school-information");
      console.log("✅ API: getSchoolInformation success", response);
      return response.data;
    } catch (error) {
      console.error("❌ API: getSchoolInformation failed:", error);
      throw error;
    }
  }

  // Update school information
  async updateSchoolInformation(data: UpdateSchoolInfoDto): Promise<{ message: string }> {
    try {
      console.log("📡 API: updateSchoolInformation called", data);
      
      const response = await this.put<{ message: string }>("/api/v1/admin/update-admin-school-information", data);
      
      console.log("✅ API: updateSchoolInformation success", response);
      return response;
    } catch (error) {
      console.error("❌ API: updateSchoolInformation failed:", error);
      throw error;
    }
  }

  // Get session configuration
  async getSessionConfiguration(): Promise<SessionConfiguration> {
    try {
      console.log("📡 API: getSessionConfiguration called");
      const response = await this.get<{ data: SessionConfiguration }>("/api/v1/admin/session-configuration");
      console.log("✅ API: getSessionConfiguration success", response);
      return response.data;
    } catch (error) {
      console.error("❌ API: getSessionConfiguration failed:", error);
      throw error;
    }
  }

  // Update session configuration
  async updateSessionConfiguration(data: UpdateSessionConfigDto): Promise<{ message: string }> {
    try {
      console.log("📡 API: updateSessionConfiguration called", data);
      const response = await this.put<{ message: string }>("/api/v1/admin/update-session-term-configuration", data);
      console.log("✅ API: updateSessionConfiguration success", response);
      return response;
    } catch (error) {
      console.error("❌ API: updateSessionConfiguration failed:", error);
      throw error;
    }
  }

  // Get class levels overview
  async getClassLevels(): Promise<ClassLevel[]> {
    try {
      console.log("📡 API: getClassLevels called");
      const response = await this.get<{ data: ClassLevel[] }>("/api/v1/admin/class-levels-overview");
      console.log("✅ API: getClassLevels success", response);
      return response.data;
    } catch (error) {
      console.error("❌ API: getClassLevels failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const profileApiClient = new ProfileApiClient();