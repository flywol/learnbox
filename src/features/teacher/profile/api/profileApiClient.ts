import BaseApiClient from "@/common/api/baseApiClient";
import type {
  TeacherProfileResponse,
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

  // Get teacher profile from /teacher/profile endpoint
  async getTeacherProfile(): Promise<TeacherProfileResponse> {
    return this.get<TeacherProfileResponse>('/teacher/profile');
  }

  // Legacy method kept for compatibility - now uses real endpoint
  async getAdminProfile(): Promise<AdminProfile> {
    const response = await this.getTeacherProfile();
    const teacher = response.data.teacher;

    // Transform API response to AdminProfile format for UI compatibility
    return {
      id: teacher.school._id,
      fullName: teacher.personalInformation.name,
      email: teacher.personalInformation.email,
      phoneNumber: teacher.personalInformation.phoneNumber,
      role: 'admin', // Keep type consistent
      profilePicture: teacher.personalInformation.profilePicture || null,
      gender: teacher.personalInformation.gender as 'Male' | 'Female' | null,
      position: teacher.personalInformation.employmentStatus,
      school: {
        id: teacher.school._id,
        schoolName: teacher.school.schoolName,
      },
      classes: []
    };
  }

  // Update methods - kept for future use when endpoints are ready
  async updatePersonalInfo(data: UpdatePersonalInfoDto): Promise<{ message: string }> {
    console.log('Update endpoint not yet available', data);
    throw new Error('Teacher profile update endpoint not yet implemented');
  }

  async updateSchoolInformation(_data: UpdateSchoolInfoDto): Promise<{ message: string }> {
    throw new Error('Teachers are not authorized to update school information');
  }

  async getSessionConfiguration(): Promise<SessionConfiguration> {
    throw new Error('Session configuration endpoint not yet implemented for teachers');
  }

  async updateSessionConfiguration(_data: UpdateSessionConfigDto): Promise<{ message: string }> {
    throw new Error('Teachers are not authorized to update session configuration');
  }

  async getClassLevels(): Promise<ClassLevel[]> {
    throw new Error('Use /teacher/subjects-classes endpoint instead');
  }

  async getClassLevelsAndArms(): Promise<ClassLevelsAndArmsResponse> {
    throw new Error('Use /teacher/subjects-classes endpoint instead');
  }

  // Legacy method kept for backwards compatibility
  async getSchoolInformation(): Promise<SchoolInformation> {
    const response = await this.getTeacherProfile();
    return {
      id: response.data.teacher.school._id,
      schoolName: response.data.teacher.school.schoolName,
    };
  }
}

// Export singleton instance
export const profileApiClient = new ProfileApiClient();