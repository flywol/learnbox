import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApiClient } from '../api/assignmentsApiClient';
import type { CreateAssignmentRequest, UpdateAssignmentRequest } from '../types/assignment.types';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to get all assignments for the teacher
 */
export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: () => assignmentsApiClient.getAllAssignments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a specific assignment by ID
 */
export function useAssignment(id: string) {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentsApiClient.getAssignment(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get assignments by subject
 */
export function useAssignmentsBySubject(subjectId: string) {
  return useQuery({
    queryKey: ['assignments', 'subject', subjectId],
    queryFn: () => assignmentsApiClient.getAssignmentsBySubject(subjectId),
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get assignments by lesson
 */
export function useAssignmentsByLesson(lessonId: string) {
  return useQuery({
    queryKey: ['assignments', 'lesson', lessonId],
    queryFn: () => assignmentsApiClient.getAssignmentsByLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create an assignment
 */
export function useCreateAssignment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateAssignmentRequest) => assignmentsApiClient.createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: 'Success!',
        description: 'Assignment created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create assignment.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update an assignment
 */
export function useUpdateAssignment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentRequest }) =>
      assignmentsApiClient.updateAssignment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.id] });
      toast({
        title: 'Success!',
        description: 'Assignment updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update assignment.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete an assignment
 */
export function useDeleteAssignment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => assignmentsApiClient.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: 'Success!',
        description: 'Assignment deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete assignment.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to get submissions for an assignment
 */
export function useAssignmentSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: ['assignment-submissions', assignmentId],
    queryFn: () => assignmentsApiClient.getAssignmentSubmissions(assignmentId),
    enabled: !!assignmentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get submission detail
 */
export function useSubmissionDetail(submissionId: string) {
  return useQuery({
    queryKey: ['submission', submissionId],
    queryFn: () => assignmentsApiClient.getSubmissionDetail(submissionId),
    enabled: !!submissionId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to grade a submission
 */
export function useGradeSubmission() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ submissionId, data }: { submissionId: string; data: { grade: number; feedback?: string } }) =>
      assignmentsApiClient.gradeSubmission(submissionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submission', variables.submissionId] });
      toast({
        title: 'Success!',
        description: 'Submission graded successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to grade submission.',
        variant: 'destructive',
      });
    },
  });
}
