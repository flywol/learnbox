// Admin Profile Types
export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender?: 'Male' | 'Female' | null;
  role: 'admin';
  profilePicture?: string | null;
  position?: string;
  school: SchoolInformation;
  classes: ClassLevel[];
  createdAt?: string;
  updatedAt?: string;
}

// School Information Types
export interface SchoolInformation {
  id: string;
  schoolName: string;
  schoolShortName?: string;
  schoolWebsite?: string;
  schoolPhoneNumber?: string;
  schoolEmail?: string;
  schoolAddress?: string;
  learnboxUrl?: string;
  schoolLogo?: string;
  country?: string;
  state?: string;
  principalSignature?: string;
  schoolPrincipal?: string | null;
  schoolMotto?: string | null;
  schoolType?: string | null;
  classes?: ClassLevel[];
}

// Session & Term Configuration Types
export interface Term {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Session {
  id?: string;
  name: string;
  terms: Term[];
  isActive: boolean;
}

export interface SessionConfiguration {
  currentSession: Session;
  sessions: Session[];
}

// New type for API update request (flat structure)
export interface UpdateSessionConfigDto {
  name: string;
  firstTermName: string;
  firstTermStartDate: string;
  firstTermEndDate: string;
  secondTermName: string;
  secondTermStartDate: string;
  secondTermEndDate: string;
  thirdTermName: string;
  thirdTermStartDate: string;
  thirdTermEndDate: string;
  rollOverData: boolean;
}

// Class Level Information
export interface ClassLevel {
  id: string;
  levelName: string;
  className: string;
  arms: ClassArm[];
  teacherName?: string;
  totalStudents?: number;
}

export interface ClassArm {
  id: string;
  armName: string;
  teacherName?: string;
  totalStudents?: number;
}

// Update DTOs
export interface UpdatePersonalInfoDto {
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender?: 'Male' | 'Female';
  position?: string;
  profilePicture?: File;
}

export interface UpdateSchoolInfoDto {
  schoolName: string;
  schoolShortName?: string;
  schoolWebsite?: string;
  schoolPhoneNumber?: string;
  schoolEmail?: string;
  schoolAddress?: string;
  learnboxUrl?: string;
  schoolLogo?: string;
  country?: string;
  state?: string;
  principalSignature?: string;
  schoolPrincipal?: string;
  schoolMotto?: string;
  schoolType?: string;
}

// Settings Types
export interface ProfileSettings {
  receiveNotifications: boolean;
  accessibilityFeatures: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
}