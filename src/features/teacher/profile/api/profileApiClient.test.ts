import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { profileApiClient } from './profileApiClient';

describe('ProfileApiClient', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(profileApiClient['api']);
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('getTeacherProfile', () => {
    it('should fetch teacher profile', async () => {
      const mockResponse = {
        data: {
          teacher: {
            _id: 'teacher-123',
            personalInformation: {
              name: 'John Doe',
              email: 'john@school.com',
              phoneNumber: '+1234567890',
              profilePicture: 'https://example.com/photo.jpg',
              gender: 'Male',
              employmentStatus: 'Full-time',
            },
            school: {
              _id: 'school-123',
              schoolName: 'Example High School',
            },
          },
        },
      };

      mockAxios.onGet('/teacher/profile').reply(200, mockResponse);

      const result = await profileApiClient.getTeacherProfile();

      expect(result).toEqual(mockResponse);
      expect(result.data.teacher.personalInformation.name).toBe('John Doe');
      expect(mockAxios.history.get.length).toBe(1);
    });

    it('should handle errors when fetching profile', async () => {
      mockAxios.onGet('/teacher/profile').reply(500);

      await expect(profileApiClient.getTeacherProfile()).rejects.toThrow();
    });
  });

  describe('getAdminProfile', () => {
    it('should transform teacher profile to admin profile format', async () => {
      const mockResponse = {
        data: {
          teacher: {
            _id: 'teacher-123',
            personalInformation: {
              name: 'John Doe',
              email: 'john@school.com',
              phoneNumber: '+1234567890',
              profilePicture: 'https://example.com/photo.jpg',
              gender: 'Male',
              employmentStatus: 'Full-time',
            },
            school: {
              _id: 'school-123',
              schoolName: 'Example High School',
            },
          },
        },
      };

      mockAxios.onGet('/teacher/profile').reply(200, mockResponse);

      const result = await profileApiClient.getAdminProfile();

      expect(result.id).toBe('school-123');
      expect(result.fullName).toBe('John Doe');
      expect(result.email).toBe('john@school.com');
      expect(result.phoneNumber).toBe('+1234567890');
      expect(result.role).toBe('admin');
      expect(result.profilePicture).toBe('https://example.com/photo.jpg');
      expect(result.gender).toBe('Male');
      expect(result.position).toBe('Full-time');
      expect(result.school.id).toBe('school-123');
      expect(result.school.schoolName).toBe('Example High School');
      expect(result.classes).toEqual([]);
    });

    it('should handle profile without profile picture', async () => {
      const mockResponse = {
        data: {
          teacher: {
            _id: 'teacher-123',
            personalInformation: {
              name: 'Jane Smith',
              email: 'jane@school.com',
              phoneNumber: '+1234567890',
              gender: 'Female',
              employmentStatus: 'Part-time',
            },
            school: {
              _id: 'school-456',
              schoolName: 'Test School',
            },
          },
        },
      };

      mockAxios.onGet('/teacher/profile').reply(200, mockResponse);

      const result = await profileApiClient.getAdminProfile();

      expect(result.profilePicture).toBeNull();
      expect(result.fullName).toBe('Jane Smith');
      expect(result.gender).toBe('Female');
    });
  });

  describe('getSchoolInformation', () => {
    it('should extract school information from teacher profile', async () => {
      const mockResponse = {
        data: {
          teacher: {
            _id: 'teacher-123',
            personalInformation: {
              name: 'John Doe',
              email: 'john@school.com',
              phoneNumber: '+1234567890',
              gender: 'Male',
              employmentStatus: 'Full-time',
            },
            school: {
              _id: 'school-789',
              schoolName: 'School of Excellence',
            },
          },
        },
      };

      mockAxios.onGet('/teacher/profile').reply(200, mockResponse);

      const result = await profileApiClient.getSchoolInformation();

      expect(result.id).toBe('school-789');
      expect(result.schoolName).toBe('School of Excellence');
    });
  });

  describe('Not Implemented Methods', () => {
    it('updatePersonalInfo should throw not implemented error', async () => {
      await expect(
        profileApiClient.updatePersonalInfo({
          fullName: 'Test',
          email: 'test@test.com',
          phoneNumber: '123',
          gender: 'Male',
        })
      ).rejects.toThrow('Teacher profile update endpoint not yet implemented');
    });

    it('updateSchoolInformation should throw unauthorized error', async () => {
      await expect(
        profileApiClient.updateSchoolInformation({
          schoolName: 'Test School',
        })
      ).rejects.toThrow('Teachers are not authorized to update school information');
    });

    it('getSessionConfiguration should throw not implemented error', async () => {
      await expect(profileApiClient.getSessionConfiguration()).rejects.toThrow(
        'Session configuration endpoint not yet implemented for teachers'
      );
    });

    it('updateSessionConfiguration should throw unauthorized error', async () => {
      await expect(
        profileApiClient.updateSessionConfiguration({
          name: '2024/2025',
          firstTermName: 'First Term',
          firstTermStartDate: '2024-09-01',
          firstTermEndDate: '2024-12-20',
          secondTermName: 'Second Term',
          secondTermStartDate: '2025-01-10',
          secondTermEndDate: '2025-04-10',
          thirdTermName: 'Third Term',
          thirdTermStartDate: '2025-04-20',
          thirdTermEndDate: '2025-07-20',
          rollOverData: false,
        })
      ).rejects.toThrow('Teachers are not authorized to update session configuration');
    });

    it('getClassLevels should throw error', async () => {
      await expect(profileApiClient.getClassLevels()).rejects.toThrow(
        'Use /teacher/subjects-classes endpoint instead'
      );
    });

    it('getClassLevelsAndArms should throw error', async () => {
      await expect(profileApiClient.getClassLevelsAndArms()).rejects.toThrow(
        'Use /teacher/subjects-classes endpoint instead'
      );
    });
  });
});
