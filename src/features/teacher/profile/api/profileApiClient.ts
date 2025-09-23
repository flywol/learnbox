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
    const response = await this.get<{ data: { admin: AdminProfile } }>('/admin/admin-by-id');
    return response.data.admin;
  }

  // Update personal information
  async updatePersonalInfo(data: UpdatePersonalInfoDto): Promise<{ message: string }> {
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
  }

  // Get school information
  async getSchoolInformation(): Promise<SchoolInformation> {
    const response = await this.get<{ data: SchoolInformation }>("/admin/school-information");
    return response.data;
  }

  // Update school information
  async updateSchoolInformation(data: UpdateSchoolInfoDto): Promise<{ message: string }> {
    const response = await this.put<{ message: string }>("/admin/update-admin-school-information", data);
    
    return response;
  }

  // Get session configuration
  async getSessionConfiguration(): Promise<SessionConfiguration> {
    const response = await this.get<{ data: SessionConfiguration }>("/admin/session-configuration");
    return response.data;
  }

  // Update session configuration
  async updateSessionConfiguration(data: UpdateSessionConfigDto): Promise<{ message: string }> {
    const response = await this.put<{ message: string }>("/admin/update-session-term-configuration", data);
    return response;
  }

  // Get class levels overview
  async getClassLevels(): Promise<ClassLevel[]> {
    const response = await this.get<{ data: Record<string, unknown>[] }>("/admin/class-levels-overview");
    const classLevels = response.data;
    
    // Keep original structure - don't overwrite the id field
    return classLevels.map((level: any) => ({
      ...level,
      id: level._id,
      arms: level.arms?.map((arm: any) => ({
        ...arm,
        // Keep both id and _id fields - don't overwrite the original id
        _id: arm._id
      })) || []
    }));
  }

  // Get class levels and arms (Admin only)
  async getClassLevelsAndArms(): Promise<ClassLevelsAndArmsResponse> {
    const response = await this.get<{ data: { classLevels: Record<string, unknown>[] } }>("/admin/class-levels-and-arms");
    
    // Extract class arms from class levels since API returns nested structure
    const classArmsFromLevels: any[] = [];
    
    // Transform _id to id for frontend consistency
    const transformedClassLevels = response.data.classLevels.map((level: any) => {
      const transformedArms = (level.arms || []).map((arm: any) => {
        const transformedArm = {
          ...arm,
          id: arm._id
        };
        
        // Add to flat classArms array for ClassLevelsSection component
        classArmsFromLevels.push(transformedArm);
        
        return transformedArm;
      });

      return {
        ...level,
        id: level._id,
        arms: transformedArms
      };
    });

    const transformedData = {
      data: {
        classLevels: transformedClassLevels,
        classArms: classArmsFromLevels
      }
    };
    
    return transformedData;
  }
}

// Export singleton instance
export const profileApiClient = new ProfileApiClient();