export interface StudentSubject {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  teacher: string;
  currentLesson: number;
  totalLessons: number;
  progressPercentage: number;
}

export interface StudentLesson {
  id: string;
  number: number;
  title: string;
  description?: string;
  startDate: string; // ISO string
  isLocked: boolean;
  isCompleted: boolean;
  contentItems: LessonContentItem[];
}

export interface LessonContentItem {
  id: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'file';
  title: string;
  description: string;
  isCompleted: boolean;
  url?: string;
  icon?: string;
}

export interface StudentQuiz {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string; // ISO string
  status: 'pending' | 'submitted' | 'graded';
  score?: number; // Out of total points
  totalPoints?: number;
  submittedAt?: string; // ISO string
}

export interface QuizSummary {
  total: number;
  submitted: number;
  pending: number;
  graded: number;
  averageScore?: number;
}

export interface StudentAssignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  dueDate: string; // ISO string
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  totalPoints?: number;
  submittedAt?: string; // ISO string
  description?: string;
}

export interface ClassSchedule {
  id: string;
  subjectId: string;
  subjectName: string;
  teacher: string;
  day: string; // e.g., "Monday"
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  location?: string;
}

export interface ForumMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'STUDENT' | 'TEACHER';
  message: string;
  timestamp: string; // ISO string
  replies?: ForumReply[];
}

export interface ForumReply {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'STUDENT' | 'TEACHER';
  message: string;
  timestamp: string; // ISO string
}

export type ClassroomTab = 'subject' | 'schedule' | 'assignment';
export type SubjectTab = 'lesson' | 'quiz';
