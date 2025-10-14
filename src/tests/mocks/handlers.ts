// Mock API handlers for testing
// This file can be extended with MSW handlers if needed

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  fullName: 'Test User',
  role: 'TEACHER' as const,
  phoneNumber: '+1234567890',
  isVerified: true,
  isActive: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: '',
  isDeleted: false,
  otp: '',
  otpExpiration: '',
  resetPasswordToken: '',
  resetPasswordExpires: '',
};

export const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

export const mockAssignment = {
  _id: 'assignment-1',
  title: 'Test Assignment',
  description: 'Test Description',
  dueDate: '2025-12-31',
  dueTime: '2025-12-31T23:59:00Z',
  acceptLateSubmissions: false,
  class: {
    _id: 'class-1',
    levelName: 'JSS 1',
    class: 'JSS1',
  },
  subject: {
    _id: 'subject-1',
    name: 'Mathematics',
  },
  teacher: 'teacher-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
