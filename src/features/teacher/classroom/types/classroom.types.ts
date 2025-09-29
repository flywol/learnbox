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

// Legacy types from global classroom types - consolidated here
export interface Subject {
  id: string;
  name: string;
  duration: string;
  color: string;
  icon?: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  lessonNumber: string;
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'active' | 'overdue' | 'expired';
}

export interface Quiz {
  id: string;
  title: string;
  dueDate: string;
  status: 'active' | 'expired';
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  attendance?: number;
  assignment?: number;
  quiz?: number;
  caTest?: number;
  exam?: number;
  total?: number;
  grade: string;
}

export interface AssessmentStudent {
  id: string;
  name: string;
  avatar: string;
  attendance: number | null;
  assignment: number | null;
  quiz: number | null;
  caTest: number | null;
  exam: number | null;
  total: number | null;
  grade: string;
}

export interface AssessmentSummary {
  attendance: number;
  assignments: number;
  quizzes: number;
  caTest: number;
  exam: number;
  total: number;
  grades: string;
}

export interface StudentSubmission {
  id: string;
  name: string;
  avatar: string;
  submissionStatus: 'Submitted' | 'Late' | 'No submitted';
  submissionTime: string;
  gradeStatus: 'Graded' | 'Not graded' | '--';
  gradePercent: number | null;
}

export interface LiveClass {
  id: string;
  title: string;
  subject: string;
  status: 'now' | 'upcoming' | 'finished' | 'cancelled';
  time?: string;
  dueDate?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  icon: string;
}

export type TabType = 'lessons' | 'live-class' | 'quiz' | 'assignment' | 'assessment';

// Teacher Subject Types
export interface TeacherSubject {
  id: string;
  name: string;
  classLevel: string;
  studentCount: number;
  icon: string;
  bgColor: string;
  textColor?: string;
  description?: string;
  color?: string;
}

export type TeacherClassroomTab = 'subject' | 'schedule';

export type SubjectDetailTab = 'lessons' | 'live-class' | 'quiz' | 'assignment' | 'assessment' | 'students';

export interface CourseOverview {
  description: string;
  progress: number;
}

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  icon: string;
}

export interface SubjectLesson {
  id: string;
  number: number;
  title: string;
  contents: LessonContent[];
}

export interface SubjectDetail extends TeacherSubject {
  courseOverview: CourseOverview;
  lessons: SubjectLesson[];
}