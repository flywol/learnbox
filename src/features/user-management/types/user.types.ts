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

// Detailed User Types (API response from user-by-id)
export interface DetailedUser {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  fullName: string;
  phoneNumber?: string;
  email: string;
  profilePicture: string | null;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  password?: string;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  // Student specific fields
  admissionNumber?: string;
  classArm?: string;
  classLevel?: string;
  gender?: string;
  dateOfBirth?: string;
  parentName?: string;
  // Teacher specific fields
  employmentStatus?: string;
  assignedClasses?: string[];
  assignedClassArms?: string[];
  assignedSubjects?: string[];
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

export const SUBJECTS: Subject[] = [
  { id: 'agricultural-science', name: 'Agricultural Science' },
  { id: 'basic-science', name: 'Basic Science' },
  { id: 'basic-technology', name: 'Basic Technology' },
  { id: 'biology', name: 'Biology' },
  { id: 'business-studies', name: 'Business Studies' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'christian-religious-studies', name: 'Christian Religious Studies' },
  { id: 'civic-education', name: 'Civic Education' },
  { id: 'commerce', name: 'Commerce' },
  { id: 'computer-studies', name: 'Computer Studies' },
  { id: 'economics', name: 'Economics' },
  { id: 'english-language', name: 'English Language' },
  { id: 'financial-accounting', name: 'Financial Accounting' },
  { id: 'french-language', name: 'French Language' },
  { id: 'further-mathematics', name: 'Further Mathematics' },
  { id: 'geography', name: 'Geography' },
  { id: 'government', name: 'Government' },
  { id: 'health-science', name: 'Health Science' },
  { id: 'history', name: 'History' },
  { id: 'home-economics', name: 'Home Economics' },
  { id: 'hausa-language', name: 'Hausa Language' },
  { id: 'ict', name: 'Information and Communication Technology (ICT)' },
  { id: 'islamic-religious-studies', name: 'Islamic Religious Studies' },
  { id: 'igbo-language', name: 'Igbo Language' },
  { id: 'literature-in-english', name: 'Literature in English' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'music', name: 'Music' },
  { id: 'physical-and-health-education', name: 'Physical and Health Education' },
  { id: 'physics', name: 'Physics' },
  { id: 'social-studies', name: 'Social Studies' },
  { id: 'technical-drawing', name: 'Technical Drawing' },
  { id: 'visual-arts', name: 'Visual Arts' },
  { id: 'yoruba-language', name: 'Yoruba Language' },
];