import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { assignmentsApiClient } from './assignmentsApiClient';
import type { CreateAssignmentRequest, UpdateAssignmentRequest, Assignment } from '../types/assignment.types';

describe('AssignmentsApiClient', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(assignmentsApiClient['api']);
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('createAssignment', () => {
    it('should create an assignment with all required fields', async () => {
      const createData: CreateAssignmentRequest = {
        title: 'Math Assignment',
        description: 'Complete problems 1-10',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
      };

      const mockAssignment: Assignment = {
        _id: 'assignment-1',
        title: 'Math Assignment',
        description: 'Complete problems 1-10',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
        teacher: 'teacher-123',
        acceptLateSubmissions: false,
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      };

      mockAxios.onPost('/assignments').reply(200, {
        data: {
          assignment: mockAssignment,
        },
      });

      const result = await assignmentsApiClient.createAssignment(createData);

      expect(result).toEqual(mockAssignment);
      expect(mockAxios.history.post.length).toBe(1);
      expect(mockAxios.history.post[0].url).toBe('/assignments');
    });

    it('should create an assignment with optional fields', async () => {
      const createData: CreateAssignmentRequest = {
        title: 'Math Assignment',
        description: 'Complete problems 1-10',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
        acceptLateSubmissions: true,
        classArm: 'A',
        attachmentUrl: 'https://example.com/attachment.pdf',
        lesson: 'lesson-789',
      };

      const mockAssignment: Assignment = {
        _id: 'assignment-1',
        title: 'Math Assignment',
        description: 'Complete problems 1-10',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
        teacher: 'teacher-123',
        acceptLateSubmissions: true,
        classArm: 'A',
        attachmentUrl: 'https://example.com/attachment.pdf',
        lesson: 'lesson-789',
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      };

      mockAxios.onPost('/assignments').reply(200, {
        data: {
          assignment: mockAssignment,
        },
      });

      const result = await assignmentsApiClient.createAssignment(createData);

      expect(result).toEqual(mockAssignment);
    });

    it('should handle file upload in multipart form', async () => {
      const file = new File(['content'], 'assignment.pdf', { type: 'application/pdf' });

      const createData: CreateAssignmentRequest = {
        title: 'Math Assignment',
        description: 'Complete problems 1-10',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
        file,
      };

      const mockAssignment: Assignment = {
        _id: 'assignment-1',
        title: 'Math Assignment',
        description: 'Complete problems 1-10',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
        teacher: 'teacher-123',
        acceptLateSubmissions: false,
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      };

      mockAxios.onPost('/assignments').reply(200, {
        data: {
          assignment: mockAssignment,
        },
      });

      const result = await assignmentsApiClient.createAssignment(createData);

      expect(result).toEqual(mockAssignment);
      expect(mockAxios.history.post[0].headers?.['Content-Type']).toContain('multipart/form-data');
    });
  });

  describe('getAllAssignments', () => {
    it('should fetch all assignments for teacher', async () => {
      const mockAssignments = [
        {
          _id: 'assignment-1',
          title: 'Math Assignment',
          description: 'Complete problems 1-10',
          dueDate: '2025-01-15',
          dueTime: '23:59',
          class: 'class-123',
          subject: 'subject-456',
          teacher: 'teacher-123',
          acceptLateSubmissions: false,
          createdAt: '2025-01-10T00:00:00Z',
          updatedAt: '2025-01-10T00:00:00Z',
        },
      ];

      mockAxios.onGet('/teacher/assignments').reply(200, {
        data: {
          assignments: mockAssignments,
        },
      });

      const result = await assignmentsApiClient.getAllAssignments();

      expect(result.data.assignments).toEqual(mockAssignments);
      expect(mockAxios.history.get.length).toBe(1);
      expect(mockAxios.history.get[0].url).toBe('/teacher/assignments');
    });
  });

  describe('getAssignment', () => {
    it('should fetch a specific assignment by ID', async () => {
      const mockAssignment: Assignment = {
        _id: 'assignment-1',
        title: 'Math Assignment',
        description: 'Complete problems 1-10',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
        teacher: 'teacher-123',
        acceptLateSubmissions: false,
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      };

      mockAxios.onGet('/assignments/assignment-1').reply(200, {
        data: {
          assignment: mockAssignment,
        },
      });

      const result = await assignmentsApiClient.getAssignment('assignment-1');

      expect(result).toEqual(mockAssignment);
      expect(mockAxios.history.get[0].url).toBe('/assignments/assignment-1');
    });
  });

  describe('updateAssignment', () => {
    it('should update an assignment with partial data', async () => {
      const updateData: UpdateAssignmentRequest = {
        title: 'Updated Math Assignment',
        description: 'Complete problems 1-20',
      };

      const mockAssignment: Assignment = {
        _id: 'assignment-1',
        title: 'Updated Math Assignment',
        description: 'Complete problems 1-20',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
        teacher: 'teacher-123',
        acceptLateSubmissions: false,
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-11T00:00:00Z',
      };

      mockAxios.onPut('/assignments/assignment-1').reply(200, {
        data: {
          assignment: mockAssignment,
        },
      });

      const result = await assignmentsApiClient.updateAssignment('assignment-1', updateData);

      expect(result).toEqual(mockAssignment);
      expect(mockAxios.history.put[0].url).toBe('/assignments/assignment-1');
      expect(mockAxios.history.put[0].headers?.['Content-Type']).toContain('multipart/form-data');
    });

    it('should update acceptLateSubmissions boolean value', async () => {
      const updateData: UpdateAssignmentRequest = {
        acceptLateSubmissions: false,
      };

      const mockAssignment: Assignment = {
        _id: 'assignment-1',
        title: 'Math Assignment',
        description: 'Complete problems 1-10',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
        teacher: 'teacher-123',
        acceptLateSubmissions: false,
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-11T00:00:00Z',
      };

      mockAxios.onPut('/assignments/assignment-1').reply(200, {
        data: {
          assignment: mockAssignment,
        },
      });

      const result = await assignmentsApiClient.updateAssignment('assignment-1', updateData);

      expect(result.acceptLateSubmissions).toBe(false);
    });
  });

  describe('deleteAssignment', () => {
    it('should delete an assignment by ID', async () => {
      mockAxios.onDelete('/assignments/assignment-1').reply(200, {
        data: {
          message: 'Assignment deleted successfully',
        },
      });

      await assignmentsApiClient.deleteAssignment('assignment-1');

      expect(mockAxios.history.delete.length).toBe(1);
      expect(mockAxios.history.delete[0].url).toBe('/assignments/assignment-1');
    });
  });

  describe('getAssignmentsByLesson', () => {
    it('should fetch assignments by lesson ID', async () => {
      const mockAssignments = [
        {
          _id: 'assignment-1',
          title: 'Lesson 1 Assignment',
          lesson: 'lesson-123',
          description: 'Complete lesson 1 exercises',
          dueDate: '2025-01-15',
          dueTime: '23:59',
          class: 'class-123',
          subject: 'subject-456',
          teacher: 'teacher-123',
          acceptLateSubmissions: false,
          createdAt: '2025-01-10T00:00:00Z',
          updatedAt: '2025-01-10T00:00:00Z',
        },
      ];

      mockAxios.onGet('/assignments/lesson/lesson-123').reply(200, {
        data: {
          assignments: mockAssignments,
        },
      });

      const result = await assignmentsApiClient.getAssignmentsByLesson('lesson-123');

      expect(result.data.assignments).toEqual(mockAssignments);
      expect(mockAxios.history.get[0].url).toBe('/assignments/lesson/lesson-123');
    });
  });

  describe('getAssignmentsBySubject', () => {
    it('should fetch assignments by subject ID', async () => {
      const mockAssignments = [
        {
          _id: 'assignment-1',
          title: 'Math Assignment',
          subject: 'subject-456',
          description: 'Complete math problems',
          dueDate: '2025-01-15',
          dueTime: '23:59',
          class: 'class-123',
          teacher: 'teacher-123',
          acceptLateSubmissions: false,
          createdAt: '2025-01-10T00:00:00Z',
          updatedAt: '2025-01-10T00:00:00Z',
        },
      ];

      mockAxios.onGet('/assignments/subject/subject-456').reply(200, {
        data: {
          assignments: mockAssignments,
        },
      });

      const result = await assignmentsApiClient.getAssignmentsBySubject('subject-456');

      expect(result.data.assignments).toEqual(mockAssignments);
      expect(mockAxios.history.get[0].url).toBe('/assignments/subject/subject-456');
    });
  });

  describe('getAssignmentSubmissions', () => {
    it('should fetch submissions for an assignment', async () => {
      const mockSubmissions = [
        {
          _id: 'submission-1',
          assignmentId: 'assignment-1',
          studentId: 'student-123',
          submittedAt: '2025-01-14T10:00:00Z',
          status: 'submitted',
        },
      ];

      mockAxios.onGet('/teacher/assignments/assignment-1/submissions').reply(200, {
        data: {
          submissions: mockSubmissions,
        },
      });

      const result = await assignmentsApiClient.getAssignmentSubmissions('assignment-1');

      expect(result.data.submissions).toEqual(mockSubmissions);
      expect(mockAxios.history.get[0].url).toBe('/teacher/assignments/assignment-1/submissions');
    });
  });

  describe('getSubmissionDetail', () => {
    it('should fetch detailed submission information', async () => {
      const mockSubmission = {
        _id: 'submission-1',
        assignmentId: 'assignment-1',
        studentId: 'student-123',
        submittedAt: '2025-01-14T10:00:00Z',
        status: 'submitted',
        content: 'Student submission content',
      };

      mockAxios.onGet('/teacher/submissions/submission-1').reply(200, {
        data: {
          submission: mockSubmission,
        },
      });

      const result = await assignmentsApiClient.getSubmissionDetail('submission-1');

      expect(result.data.submission).toEqual(mockSubmission);
      expect(mockAxios.history.get[0].url).toBe('/teacher/submissions/submission-1');
    });
  });

  describe('gradeSubmission', () => {
    it('should grade a submission with grade and feedback', async () => {
      const gradeData = {
        grade: 85,
        feedback: 'Good work, but needs improvement in section 3',
      };

      const mockResponse = {
        _id: 'submission-1',
        grade: 85,
        feedback: 'Good work, but needs improvement in section 3',
        gradedAt: '2025-01-15T10:00:00Z',
      };

      mockAxios.onPut('/teacher/submissions/submission-1/grade').reply(200, {
        data: {
          submission: mockResponse,
        },
      });

      const result = await assignmentsApiClient.gradeSubmission('submission-1', gradeData);

      expect(result.data.submission).toEqual(mockResponse);
      expect(mockAxios.history.put[0].url).toBe('/teacher/submissions/submission-1/grade');
    });

    it('should grade a submission with only grade (no feedback)', async () => {
      const gradeData = {
        grade: 90,
      };

      const mockResponse = {
        _id: 'submission-1',
        grade: 90,
        gradedAt: '2025-01-15T10:00:00Z',
      };

      mockAxios.onPut('/teacher/submissions/submission-1/grade').reply(200, {
        data: {
          submission: mockResponse,
        },
      });

      const result = await assignmentsApiClient.gradeSubmission('submission-1', gradeData);

      expect(result.data.submission.grade).toBe(90);
      expect(mockAxios.history.put[0].url).toBe('/teacher/submissions/submission-1/grade');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors when creating assignment', async () => {
      mockAxios.onPost('/assignments').networkError();

      const createData: CreateAssignmentRequest = {
        title: 'Math Assignment',
        description: 'Complete problems 1-10',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
      };

      await expect(assignmentsApiClient.createAssignment(createData)).rejects.toThrow();
    });

    it('should handle 404 errors when fetching non-existent assignment', async () => {
      mockAxios.onGet('/assignments/non-existent').reply(404, {
        message: 'Assignment not found',
      });

      await expect(assignmentsApiClient.getAssignment('non-existent')).rejects.toThrow();
    });

    it('should handle 500 errors when deleting assignment', async () => {
      mockAxios.onDelete('/assignments/assignment-1').reply(500, {
        message: 'Internal server error',
      });

      await expect(assignmentsApiClient.deleteAssignment('assignment-1')).rejects.toThrow();
    });
  });
});
