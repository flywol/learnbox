export type UserRole = 'Student' | 'Teacher' | 'Parent';

export type Gender = 'Male' | 'Female';

export type EmploymentStatus = 'Full time' | 'Part time' | 'Contract';

export type ClassLevel = string;

export interface BaseUser {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  profileImage?: File;
}

export interface StudentUser extends BaseUser {
  role: 'Student';
  classLevel: ClassLevel;
  classArm: string;
  admissionNumber: string;
  parentGuardianName: string;
  gender: Gender;
  dateOfBirth: string;
}

export interface TeacherUser extends BaseUser {
  role: 'Teacher';
  gender: Gender;
  phoneNumber: string;
  employmentStatus: EmploymentStatus;
  dateOfBirth: string;
  assignedClasses: string[];
  assignedClassArms: string[];
  assignedSubjects: string[];
}

export interface ParentUser extends BaseUser {
  role: 'Parent';
  linkedChildren: string[];
  relationshipToStudent: string;
  gender: Gender;
  phoneNumber: string;
}

export type CreateUserData = StudentUser | TeacherUser | ParentUser;

export interface Subject {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  classLevel: ClassLevel;
  classArm: string;
}

export interface ClassLevelData {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  levelName: string;
  class: string;
  arms: any;
}

export interface ClassArmData {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  armName: string;
}

// User List Types
export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  dateCreated: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  isActive: boolean;
}

// Detailed User Types (API response from /admin/user-by-id/{userId})
export interface DetailedUser {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  profilePicture: string | null;
  password?: string;
  gender?: string;
  phoneNumber?: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  dateOfBirth?: string;
  school?: string;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  refreshToken?: string;
  __v?: number;

  // Student specific fields
  admissionNumber?: string;
  classArm?: string;
  classLevel?: string;
  parentName?: string;

  // Teacher specific fields
  employmentStatus?: string;
  assignedSubjects?: string[];
  assignedClasses?: string[];
  assignedClassArms?: string[];

  // Parent specific fields
  linkedChildren?: string[];
  relationshipToStudent?: string;
}

// Filter and Search Types
export interface UserFilters {
  search: string;
  role: 'all' | 'student' | 'teacher' | 'parent';
}

// Role-specific detail interfaces
export interface StudentDetails {
  classLevel: string;
  classArm: string;
  admissionNumber: string;
  parentName: string;
  gender: string;
  dateOfBirth: string;
}

export interface TeacherDetails {
  assignedSubjects: string[];
  assignedClasses: string[];
  assignedClassArms: string[];
  employmentStatus: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
}

export interface ParentDetails {
  linkedChildren: string[];
  relationshipToStudent: string;
  phoneNumber: string;
  gender: string;
}

