// Assignment Types for Teacher Feature

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // ISO datetime
  acceptLateSubmissions: boolean;
  class: {
    _id: string;
    levelName: string;
    class: string;
  } | string;
  classArm?: {
    _id: string;
    armName: string;
  } | string;
  subject: {
    _id: string;
    name: string;
  } | string;
  attachmentUrl?: string;
  lesson?: {
    _id: string;
    title: string;
  } | string;
  file?: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // ISO datetime
  acceptLateSubmissions?: boolean;
  class: string;
  classArm?: string;
  subject: string;
  attachmentUrl?: string;
  lesson?: string;
  file?: File; // For multipart upload
}

export interface UpdateAssignmentRequest extends Partial<CreateAssignmentRequest> {}

export interface AssignmentsResponse {
  data: {
    assignments: Assignment[];
    total: number;
  };
}

export interface AssignmentResponse {
  data: {
    assignment: Assignment;
  };
}

export interface DeleteAssignmentResponse {
  message: string;
}

// UI-specific types
export interface AssignmentCardData {
  id: string;
  title: string;
  dueDate: string;
  status: 'overdue' | 'due-soon' | 'expired' | 'upcoming';
  statusText: string;
  subjectName?: string;
  className?: string;
}

// Submission types (for future grading feature)
export interface Submission {
  _id: string;
  student: {
    _id: string;
    fullName: string;
    admissionNumber: string;
  };
  assignment: string;
  submittedAt?: string;
  content: string;
  attachmentUrl?: string;
  status: 'submitted' | 'late' | 'not-submitted';
  grade?: number;
  gradeStatus: 'graded' | 'not-graded';
  feedback?: {
    title: string;
    suggestions: string;
  };
}

export interface SubmissionsResponse {
  data: {
    submissions: Submission[];
    total: number;
  };
}

export interface GradeSubmissionRequest {
  score: number;
  feedback?: {
    title: string;
    suggestions: string;
  };
}
