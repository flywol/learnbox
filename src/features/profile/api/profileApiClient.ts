import BaseApiClient from "@/common/api/baseApiClient";
import type { 
  AdminProfile, 
  SchoolInformation, 
  UpdatePersonalInfoDto, 
  UpdateSchoolInfoDto,
  SessionConfiguration,
  UpdateSessionConfigDto,
  ClassLevel,
  ClassLevelsAndArmsResponse
} from "../types/profile.types";

class ProfileApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  // Get admin profile (uses token to identify logged-in admin)
  async getAdminProfile(): Promise<AdminProfile> {
    try {
      const response = await this.get<{ data: { admin: AdminProfile } }>('/admin/admin-by-id');
      return response.data.admin;
    } catch (error) {
      throw error;
    }
  }

  // Update personal information
  async updatePersonalInfo(data: UpdatePersonalInfoDto): Promise<{ message: string }> {
    try {
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
      if (data.gender) formData.append('gender', data.gender);
      if (data.position) formData.append('position', data.position);
      if (data.profilePicture) formData.append('profilePicture', data.profilePicture);

      const response = await this.put<{ message: string }>("/admin/update-admin-personal-information", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get school information
  async getSchoolInformation(): Promise<SchoolInformation> {
    try {
      const response = await this.get<{ data: SchoolInformation }>("/admin/school-information");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update school information
  async updateSchoolInformation(data: UpdateSchoolInfoDto): Promise<{ message: string }> {
    try {
      
      const response = await this.put<{ message: string }>("/admin/update-admin-school-information", data);
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get session configuration
  async getSessionConfiguration(): Promise<SessionConfiguration> {
    try {
      const response = await this.get<{ data: SessionConfiguration }>("/admin/session-configuration");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update session configuration
  async updateSessionConfiguration(data: UpdateSessionConfigDto): Promise<{ message: string }> {
    try {
      const response = await this.put<{ message: string }>("/admin/update-session-term-configuration", data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get class levels overview
  async getClassLevels(): Promise<ClassLevel[]> {
    try {
      const response = await this.get<{ data: any[] }>("/admin/class-levels-overview");
      const classLevels = response.data;
      
      // Transform _id to id for frontend consistency
      return classLevels.map((level: any) => ({
        ...level,
        id: level._id,
        arms: level.arms?.map((arm: any) => ({
          ...arm,
          id: arm._id
        })) || []
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get class levels and arms (Admin only)
  async getClassLevelsAndArms(): Promise<ClassLevelsAndArmsResponse> {
    try {
      const response = await this.get<{ data: { classLevels: any[], classArms: any[] } }>("/admin/class-levels-and-arms");
      
      // Transform _id to id for frontend consistency
      const transformedData = {
        data: {
          classLevels: response.data.classLevels.map((level: any) => ({
            ...level,
            id: level._id,
            arms: level.arms?.map((arm: any) => ({
              ...arm,
              id: arm._id
            })) || []
          })),
          classArms: response.data.classArms.map((arm: any) => ({
            ...arm,
            id: arm._id
          }))
        }
      };
      
      return transformedData;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const profileApiClient = new ProfileApiClient();