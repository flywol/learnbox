import BaseApiClient from '@/common/api/baseApiClient';
import type {
  Assignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  AssignmentsResponse,
  AssignmentResponse,
  DeleteAssignmentResponse,
} from '../types/assignment.types';

class AssignmentsApiClient extends BaseApiClient {
  constructor() {
    super();
  }

  /**
   * POST /api/v1/assignments
   * Create a new assignment
   */
  async createAssignment(data: CreateAssignmentRequest): Promise<Assignment> {
    const formData = new FormData();

    // Add all fields to FormData
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('dueDate', data.dueDate);
    formData.append('dueTime', data.dueTime);
    formData.append('class', data.class);
    formData.append('subject', data.subject);

    if (data.acceptLateSubmissions !== undefined) {
      formData.append('acceptLateSubmissions', String(data.acceptLateSubmissions));
    }

    if (data.classArm) {
      formData.append('classArm', data.classArm);
    }

    if (data.attachmentUrl) {
      formData.append('attachmentUrl', data.attachmentUrl);
    }

    if (data.lesson) {
      formData.append('lesson', data.lesson);
    }

    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await this.post<AssignmentResponse>('/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.assignment;
  }

  /**
   * GET /api/v1/teacher/assignments
   * Get all assignments created by the teacher
   */
  async getAllAssignments(): Promise<AssignmentsResponse> {
    return this.get<AssignmentsResponse>('/teacher/assignments');
  }

  /**
   * GET /api/v1/assignments/{id}
   * Get a specific assignment by ID
   */
  async getAssignment(id: string): Promise<Assignment> {
    const response = await this.get<AssignmentResponse>(`/assignments/${id}`);
    return response.data.assignment;
  }

  /**
   * PUT /api/v1/assignments/{id}
   * Update an assignment (assuming endpoint exists)
   */
  async updateAssignment(id: string, data: UpdateAssignmentRequest): Promise<Assignment> {
    const formData = new FormData();

    // Only add fields that are provided
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.dueDate) formData.append('dueDate', data.dueDate);
    if (data.dueTime) formData.append('dueTime', data.dueTime);
    if (data.class) formData.append('class', data.class);
    if (data.subject) formData.append('subject', data.subject);
    if (data.acceptLateSubmissions !== undefined) {
      formData.append('acceptLateSubmissions', String(data.acceptLateSubmissions));
    }
    if (data.classArm) formData.append('classArm', data.classArm);
    if (data.attachmentUrl) formData.append('attachmentUrl', data.attachmentUrl);
    if (data.lesson) formData.append('lesson', data.lesson);
    if (data.file) formData.append('file', data.file);

    const response = await this.put<AssignmentResponse>(`/assignments/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.assignment;
  }

  /**
   * DELETE /api/v1/assignments/{id}
   * Delete an assignment (soft delete)
   */
  async deleteAssignment(id: string): Promise<void> {
    await this.delete<DeleteAssignmentResponse>(`/assignments/${id}`);
  }

  /**
   * GET /api/v1/assignments/lesson/{lessonId}
   * Get assignments for a specific lesson
   */
  async getAssignmentsByLesson(lessonId: string): Promise<AssignmentsResponse> {
    return this.get<AssignmentsResponse>(`/assignments/lesson/${lessonId}`);
  }

  /**
   * GET /api/v1/assignments/subject/{subjectId}
   * Get assignments by subject
   */
  async getAssignmentsBySubject(subjectId: string): Promise<AssignmentsResponse> {
    return this.get<AssignmentsResponse>(`/assignments/subject/${subjectId}`);
  }

  /**
   * GET /api/v1/teacher/assignments/{assignmentId}/submissions
   * Get all submissions for a specific assignment
   */
  async getAssignmentSubmissions(assignmentId: string): Promise<any> {
    return this.get(`/teacher/assignments/${assignmentId}/submissions`);
  }

  /**
   * GET /api/v1/teacher/submissions/{submissionId}
   * Get detailed view of a specific submission
   */
  async getSubmissionDetail(submissionId: string): Promise<any> {
    return this.get(`/teacher/submissions/${submissionId}`);
  }

  /**
   * PUT /api/v1/teacher/submissions/{submissionId}/grade
   * Grade a student submission
   */
  async gradeSubmission(submissionId: string, data: { grade: number; feedback?: string }): Promise<any> {
    return this.put(`/teacher/submissions/${submissionId}/grade`, data);
  }
}

export const assignmentsApiClient = new AssignmentsApiClient();
