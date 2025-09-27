// SECURITY FIX: Teacher API client - no admin endpoints
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

  // SECURITY FIX: Mock teacher profile - no endpoints provided yet
  async getAdminProfile(): Promise<AdminProfile> {
    // Mock data for teacher profile
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: 'teacher-123',
          fullName: 'Joe Jameshill',
          email: 'joe@lakeridge.edu',
          phoneNumber: '+234 803 123 4567',
          role: 'admin', // Keep type consistent but use teacher data
          profilePicture: null,
          gender: 'Male',
          position: 'Subject Teacher',
          school: {
            id: 'school-1',
            schoolName: 'Lakeridge Mountain High School',
            schoolShortName: 'LMHS',
            schoolAddress: '123 Education Drive, Lagos, Nigeria',
            schoolPhoneNumber: '+234 1 234 5678',
            schoolEmail: 'info@lakeridge.edu',
            schoolWebsite: 'www.lakeridge.edu',
            schoolLogo: undefined,
            schoolMotto: 'Excellence in Learning'
          },
          classes: []
        });
      }, 1000);
    });
  }

  // SECURITY FIX: Mock teacher profile updates - no endpoints provided yet
  async updatePersonalInfo(data: UpdatePersonalInfoDto): Promise<{ message: string }> {
    console.log('Mock API: Would update teacher personal info', data);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ message: 'Personal information updated successfully' });
      }, 1000);
    });
  }

  // SECURITY FIX: Mock school information - teachers should see read-only school info
  async getSchoolInformation(): Promise<SchoolInformation> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: 'school-1',
          schoolName: 'Lakeridge Mountain High School',
          schoolShortName: 'LMHS',
          schoolAddress: '123 Education Drive, Lagos, Nigeria',
          schoolPhoneNumber: '+234 1 234 5678',
          schoolEmail: 'info@lakeridge.edu',
          schoolWebsite: 'www.lakeridge.edu',
          schoolLogo: undefined,
          schoolMotto: 'Excellence in Learning'
        });
      }, 1000);
    });
  }

  // SECURITY FIX: Teachers cannot update school information
  async updateSchoolInformation(_data: UpdateSchoolInfoDto): Promise<{ message: string }> {
    throw new Error('Teachers are not authorized to update school information');
  }

  // SECURITY FIX: Mock session configuration - read-only for teachers
  async getSessionConfiguration(): Promise<SessionConfiguration> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          currentSession: {
            id: 'session-1',
            name: '2023/2024',
            terms: [
              {
                id: 'term-1',
                name: 'First Term',
                startDate: '2023-09-01',
                endDate: '2023-12-15'
              }
            ],
            isActive: true
          },
          sessions: [{
            id: 'session-1',
            name: '2023/2024',
            terms: [
              {
                id: 'term-1',
                name: 'First Term',
                startDate: '2023-09-01',
                endDate: '2023-12-15'
              }
            ],
            isActive: true
          }]
        });
      }, 1000);
    });
  }

  // SECURITY FIX: Teachers cannot update session configuration
  async updateSessionConfiguration(_data: UpdateSessionConfigDto): Promise<{ message: string }> {
    throw new Error('Teachers are not authorized to update session configuration');
  }

  // SECURITY FIX: Mock class levels for teachers - only their assigned classes
  async getClassLevels(): Promise<ClassLevel[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'level-1',
            levelName: 'Junior Secondary School 1',
            className: 'JSS 1',
            arms: [
              { id: 'arm-1a', armName: 'A' },
              { id: 'arm-1b', armName: 'B' }
            ]
          },
          {
            id: 'level-2',
            levelName: 'Junior Secondary School 2', 
            className: 'JSS 2',
            arms: [
              { id: 'arm-2a', armName: 'A' }
            ]
          }
        ]);
      }, 1000);
    });
  }

  // SECURITY FIX: Mock class levels and arms for teachers
  async getClassLevelsAndArms(): Promise<ClassLevelsAndArmsResponse> {
    return new Promise(resolve => {
      setTimeout(() => {
        const mockData = {
          data: {
            classLevels: [
              {
                id: 'level-1',
                created_at: '2024-01-01T00:00:00.000Z',
                updated_at: '2024-01-01T00:00:00.000Z',
                deleted_at: null,
                levelName: 'Junior Secondary School 1',
                class: 'JSS 1',
                arms: [
                  { id: 'arm-1', armName: 'A' },
                  { id: 'arm-2', armName: 'B' }
                ],
                studentCount: 67,
                teacherCount: 1
              },
              {
                id: 'level-2',
                created_at: '2024-01-01T00:00:00.000Z',
                updated_at: '2024-01-01T00:00:00.000Z',
                deleted_at: null,
                levelName: 'Junior Secondary School 2',
                class: 'JSS 2',
                arms: [
                  { id: 'arm-3', armName: 'A' }
                ],
                studentCount: 28,
                teacherCount: 1
              }
            ],
            classArms: [
              { 
                id: 'arm-1', 
                created_at: '2024-01-01T00:00:00.000Z',
                updated_at: '2024-01-01T00:00:00.000Z',
                deleted_at: null,
                armName: 'A',
                studentCount: 35, 
                assignedTeachers: [{ id: 'teacher-1', name: 'Joe Jameshill' }] 
              },
              { 
                id: 'arm-2', 
                created_at: '2024-01-01T00:00:00.000Z',
                updated_at: '2024-01-01T00:00:00.000Z',
                deleted_at: null,
                armName: 'B',
                studentCount: 32, 
                assignedTeachers: [{ id: 'teacher-1', name: 'Joe Jameshill' }] 
              },
              { 
                id: 'arm-3', 
                created_at: '2024-01-01T00:00:00.000Z',
                updated_at: '2024-01-01T00:00:00.000Z',
                deleted_at: null,
                armName: 'A',
                studentCount: 28, 
                assignedTeachers: [{ id: 'teacher-1', name: 'Joe Jameshill' }] 
              }
            ]
          }
        };
        resolve(mockData);
      }, 1000);
    });
  }
}

// Export singleton instance
export const profileApiClient = new ProfileApiClient();