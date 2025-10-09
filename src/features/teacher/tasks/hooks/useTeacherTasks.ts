import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApiClient } from '../api/tasksApiClient';
import type { CreateTaskRequest, UpdateTaskRequest } from '../types/task.types';

export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  lists: () => [...TASK_QUERY_KEYS.all, 'list'] as const,
  list: (filter: string) => [...TASK_QUERY_KEYS.lists(), filter] as const,
  details: () => [...TASK_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TASK_QUERY_KEYS.details(), id] as const,
} as const;

/**
 * Hook to fetch all tasks
 */
export function useAllTasks() {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list('all'),
    queryFn: () => tasksApiClient.getAllTasks(),
  });
}

/**
 * Hook to fetch today's tasks
 */
export function useTodaysTasks() {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list('today'),
    queryFn: () => tasksApiClient.getTodaysTasks(),
  });
}

/**
 * Hook to fetch upcoming tasks
 */
export function useUpcomingTasks(days: number = 7) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(`upcoming-${days}`),
    queryFn: () => tasksApiClient.getUpcomingTasks(days),
  });
}

/**
 * Hook to fetch overdue tasks
 */
export function useOverdueTasks() {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list('overdue'),
    queryFn: () => tasksApiClient.getOverdueTasks(),
  });
}

/**
 * Hook to fetch completed tasks
 */
export function useCompletedTasks() {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list('completed'),
    queryFn: () => tasksApiClient.getCompletedTasks(),
  });
}

/**
 * Hook to fetch pending tasks
 */
export function usePendingTasks() {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list('pending'),
    queryFn: () => tasksApiClient.getPendingTasks(),
  });
}

/**
 * Hook to fetch a single task by ID
 */
export function useTask(id: string) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(id),
    queryFn: () => tasksApiClient.getTaskById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => tasksApiClient.createTask(data),
    onSuccess: () => {
      // Invalidate all task-related queries
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to update a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      tasksApiClient.updateTask(id, data),
    onSuccess: (updatedTask) => {
      // Invalidate all task lists
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      // Update the specific task in cache
      queryClient.setQueryData(TASK_QUERY_KEYS.detail(updatedTask.id), updatedTask);
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApiClient.deleteTask(id),
    onSuccess: () => {
      // Invalidate all task-related queries
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to toggle task completion
 */
export function useToggleTaskCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApiClient.toggleCompletion(id),
    onSuccess: (updatedTask) => {
      // Invalidate all task lists
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      // Update the specific task in cache
      queryClient.setQueryData(TASK_QUERY_KEYS.detail(updatedTask.id), updatedTask);
    },
  });
}

/**
 * Composed hook with all task operations
 * Use this in components that need full task management
 */
export function useTeacherTasks() {
  const allTasksQuery = useAllTasks();
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();
  const toggleMutation = useToggleTaskCompletion();

  return {
    // Data
    tasks: allTasksQuery.data?.tasks || [],
    total: allTasksQuery.data?.total || 0,

    // Loading states
    isLoading: allTasksQuery.isLoading,
    isFetching: allTasksQuery.isFetching,

    // Error states
    error: allTasksQuery.error,

    // Mutations
    createTask: createMutation.mutate,
    createTaskAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateTask: updateMutation.mutate,
    updateTaskAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteTask: deleteMutation.mutate,
    deleteTaskAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    toggleCompletion: toggleMutation.mutate,
    toggleCompletionAsync: toggleMutation.mutateAsync,
    isToggling: toggleMutation.isPending,
    toggleError: toggleMutation.error,

    // Refetch function
    refetch: allTasksQuery.refetch,
  };
}
