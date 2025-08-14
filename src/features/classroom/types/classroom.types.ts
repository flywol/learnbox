export interface ClassroomStudent {
  id: string;
  name: string;
  admissionNumber: string;
  email: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  profilePicture?: string;
  classLevel: string;
  classArm: string;
  session: string;
  term: string;
  parentName: string;
  parentContact: string;
}

export interface ClassroomTeacher {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface ClassroomClass {
  id: string;
  name: string;
  level: string;
  arm: string;
  teacher: ClassroomTeacher;
  studentCount: number;
  color: string;
}

export interface StudentGrade {
  studentId: string;
  subject: string;
  score: number | null;
}

export interface BroadsheetData {
  classId: string;
  session: string;
  term: string;
  students: ClassroomStudent[];
  grades: StudentGrade[];
  subjects: string[];
}

export type ClassroomTab = 'class' | 'schedule' | 'broadsheet';