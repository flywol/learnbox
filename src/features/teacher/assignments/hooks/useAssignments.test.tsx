import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { assignmentsApiClient } from '../api/assignmentsApiClient';
import {
  useAssignments,
  useAssignment,
  useAssignmentsBySubject,
  useAssignmentsByLesson,
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
  useAssignmentSubmissions,
  useSubmissionDetail,
  useGradeSubmission,
} from './useAssignments';
import type { CreateAssignmentRequest, UpdateAssignmentRequest } from '../types/assignment.types';

// Mock the API client
vi.mock('../api/assignmentsApiClient', () => ({
  assignmentsApiClient: {
    getAllAssignments: vi.fn(),
    getAssignment: vi.fn(),
    getAssignmentsBySubject: vi.fn(),
    getAssignmentsByLesson: vi.fn(),
    createAssignment: vi.fn(),
    updateAssignment: vi.fn(),
    deleteAssignment: vi.fn(),
    getAssignmentSubmissions: vi.fn(),
    getSubmissionDetail: vi.fn(),
    gradeSubmission: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Helper to create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('Assignment Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAssignments', () => {
    it('should fetch all assignments', async () => {
      const mockAssignments = {
        data: {
          assignments: [
            {
              _id: 'assignment-1',
              title: 'Math Assignment',
              description: 'Complete problems 1-10',
              dueDate: '2025-01-15',
              dueTime: '23:59',
              class: 'class-123',
              subject: 'subject-456',
              teacher: 'teacher-123',
              status: 'active',
              createdAt: '2025-01-10T00:00:00Z',
              updatedAt: '2025-01-10T00:00:00Z',
            },
          ],
        },
      };

      vi.mocked(assignmentsApiClient.getAllAssignments).mockResolvedValue(mockAssignments);

      const { result } = renderHook(() => useAssignments(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockAssignments);
      expect(assignmentsApiClient.getAllAssignments).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when fetching assignments', async () => {
      vi.mocked(assignmentsApiClient.getAllAssignments).mockRejectedValue(
        new Error('Failed to fetch assignments')
      );

      const { result } = renderHook(() => useAssignments(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useAssignment', () => {
    it('should fetch a specific assignment by ID', async () => {
      const mockAssignment = {
        _id: 'assignment-1',
        title: 'Math Assignment',
        description: 'Complete problems 1-10',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
        teacher: 'teacher-123',
        status: 'active',
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      };

      vi.mocked(assignmentsApiClient.getAssignment).mockResolvedValue(mockAssignment);

      const { result } = renderHook(() => useAssignment('assignment-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockAssignment);
      expect(assignmentsApiClient.getAssignment).toHaveBeenCalledWith('assignment-1');
    });

    it('should not fetch when ID is empty', async () => {
      const { result } = renderHook(() => useAssignment(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      expect(assignmentsApiClient.getAssignment).not.toHaveBeenCalled();
    });
  });

  describe('useAssignmentsBySubject', () => {
    it('should fetch assignments by subject ID', async () => {
      const mockAssignments = {
        data: {
          assignments: [
            {
              _id: 'assignment-1',
              title: 'Math Assignment',
              subject: 'subject-456',
              description: 'Complete math problems',
              dueDate: '2025-01-15',
              dueTime: '23:59',
              class: 'class-123',
              teacher: 'teacher-123',
              status: 'active',
              createdAt: '2025-01-10T00:00:00Z',
              updatedAt: '2025-01-10T00:00:00Z',
            },
          ],
        },
      };

      vi.mocked(assignmentsApiClient.getAssignmentsBySubject).mockResolvedValue(mockAssignments);

      const { result } = renderHook(() => useAssignmentsBySubject('subject-456'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockAssignments);
      expect(assignmentsApiClient.getAssignmentsBySubject).toHaveBeenCalledWith('subject-456');
    });
  });

  describe('useAssignmentsByLesson', () => {
    it('should fetch assignments by lesson ID', async () => {
      const mockAssignments = {
        data: {
          assignments: [
            {
              _id: 'assignment-1',
              title: 'Lesson 1 Assignment',
              lesson: 'lesson-123',
              description: 'Complete lesson exercises',
              dueDate: '2025-01-15',
              dueTime: '23:59',
              class: 'class-123',
              subject: 'subject-456',
              teacher: 'teacher-123',
              status: 'active',
              createdAt: '2025-01-10T00:00:00Z',
              updatedAt: '2025-01-10T00:00:00Z',
            },
          ],
        },
      };

      vi.mocked(assignmentsApiClient.getAssignmentsByLesson).mockResolvedValue(mockAssignments);

      const { result } = renderHook(() => useAssignmentsByLesson('lesson-123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockAssignments);
      expect(assignmentsApiClient.getAssignmentsByLesson).toHaveBeenCalledWith('lesson-123');
    });
  });

  describe('useCreateAssignment', () => {
    it('should create an assignment successfully', async () => {
      const newAssignment: CreateAssignmentRequest = {
        title: 'New Assignment',
        description: 'Test description',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
      };

      const mockCreatedAssignment = {
        _id: 'assignment-new',
        ...newAssignment,
        teacher: 'teacher-123',
        status: 'active',
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      };

      vi.mocked(assignmentsApiClient.createAssignment).mockResolvedValue(mockCreatedAssignment);

      const { result } = renderHook(() => useCreateAssignment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newAssignment);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(assignmentsApiClient.createAssignment).toHaveBeenCalledWith(newAssignment);
    });

    it('should handle creation errors', async () => {
      const newAssignment: CreateAssignmentRequest = {
        title: 'New Assignment',
        description: 'Test description',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
      };

      vi.mocked(assignmentsApiClient.createAssignment).mockRejectedValue(
        new Error('Failed to create assignment')
      );

      const { result } = renderHook(() => useCreateAssignment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newAssignment);

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe('useUpdateAssignment', () => {
    it('should update an assignment successfully', async () => {
      const updateData: UpdateAssignmentRequest = {
        title: 'Updated Assignment',
      };

      const mockUpdatedAssignment = {
        _id: 'assignment-1',
        title: 'Updated Assignment',
        description: 'Original description',
        dueDate: '2025-01-15',
        dueTime: '23:59',
        class: 'class-123',
        subject: 'subject-456',
        teacher: 'teacher-123',
        status: 'active',
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-11T00:00:00Z',
      };

      vi.mocked(assignmentsApiClient.updateAssignment).mockResolvedValue(mockUpdatedAssignment);

      const { result } = renderHook(() => useUpdateAssignment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: 'assignment-1', data: updateData });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(assignmentsApiClient.updateAssignment).toHaveBeenCalledWith('assignment-1', updateData);
    });
  });

  describe('useDeleteAssignment', () => {
    it('should delete an assignment successfully', async () => {
      vi.mocked(assignmentsApiClient.deleteAssignment).mockResolvedValue();

      const { result } = renderHook(() => useDeleteAssignment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('assignment-1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(assignmentsApiClient.deleteAssignment).toHaveBeenCalledWith('assignment-1');
    });
  });

  describe('useAssignmentSubmissions', () => {
    it('should fetch submissions for an assignment', async () => {
      const mockSubmissions = {
        data: {
          submissions: [
            {
              _id: 'submission-1',
              assignmentId: 'assignment-1',
              studentId: 'student-123',
              submittedAt: '2025-01-14T10:00:00Z',
              status: 'submitted',
            },
          ],
        },
      };

      vi.mocked(assignmentsApiClient.getAssignmentSubmissions).mockResolvedValue(mockSubmissions);

      const { result } = renderHook(() => useAssignmentSubmissions('assignment-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSubmissions);
      expect(assignmentsApiClient.getAssignmentSubmissions).toHaveBeenCalledWith('assignment-1');
    });
  });

  describe('useSubmissionDetail', () => {
    it('should fetch submission details', async () => {
      const mockSubmission = {
        data: {
          submission: {
            _id: 'submission-1',
            assignmentId: 'assignment-1',
            studentId: 'student-123',
            submittedAt: '2025-01-14T10:00:00Z',
            status: 'submitted',
            content: 'Student submission content',
          },
        },
      };

      vi.mocked(assignmentsApiClient.getSubmissionDetail).mockResolvedValue(mockSubmission);

      const { result } = renderHook(() => useSubmissionDetail('submission-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSubmission);
      expect(assignmentsApiClient.getSubmissionDetail).toHaveBeenCalledWith('submission-1');
    });
  });

  describe('useGradeSubmission', () => {
    it('should grade a submission successfully', async () => {
      const gradeData = {
        grade: 85,
        feedback: 'Good work!',
      };

      const mockGradedSubmission = {
        data: {
          submission: {
            _id: 'submission-1',
            grade: 85,
            feedback: 'Good work!',
            gradedAt: '2025-01-15T10:00:00Z',
          },
        },
      };

      vi.mocked(assignmentsApiClient.gradeSubmission).mockResolvedValue(mockGradedSubmission);

      const { result } = renderHook(() => useGradeSubmission(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ submissionId: 'submission-1', data: gradeData });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(assignmentsApiClient.gradeSubmission).toHaveBeenCalledWith('submission-1', gradeData);
    });

    it('should grade without feedback', async () => {
      const gradeData = {
        grade: 90,
      };

      const mockGradedSubmission = {
        data: {
          submission: {
            _id: 'submission-1',
            grade: 90,
            gradedAt: '2025-01-15T10:00:00Z',
          },
        },
      };

      vi.mocked(assignmentsApiClient.gradeSubmission).mockResolvedValue(mockGradedSubmission);

      const { result } = renderHook(() => useGradeSubmission(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ submissionId: 'submission-1', data: gradeData });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(assignmentsApiClient.gradeSubmission).toHaveBeenCalledWith('submission-1', gradeData);
    });
  });
});
