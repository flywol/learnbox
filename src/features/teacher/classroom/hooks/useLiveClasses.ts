import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { liveClassApiClient } from '../api/liveClassApiClient';
import type { CreateLiveClassRequest, UpdateLiveClassRequest } from '../types/liveClass.types';
import { useToast } from '@/hooks/use-toast';

// Query Keys
export const liveClassKeys = {
  all: ['liveClasses'] as const,
  list: () => [...liveClassKeys.all, 'list'] as const,
  upcoming: () => [...liveClassKeys.all, 'upcoming'] as const,
  happeningNow: () => [...liveClassKeys.all, 'happening-now'] as const,
  bySubject: (subjectId: string) => [...liveClassKeys.all, 'subject', subjectId] as const,
  detail: (id: string) => [...liveClassKeys.all, 'detail', id] as const,
};

/**
 * Get all live classes for authenticated teacher
 */
export const useAllLiveClasses = () => {
  return useQuery({
    queryKey: liveClassKeys.list(),
    queryFn: () => liveClassApiClient.getAllLiveClasses(),
  });
};

/**
 * Get upcoming live classes
 */
export const useUpcomingLiveClasses = () => {
  return useQuery({
    queryKey: liveClassKeys.upcoming(),
    queryFn: () => liveClassApiClient.getUpcomingLiveClasses(),
  });
};

/**
 * Get live classes happening now
 */
export const useHappeningNowLiveClasses = () => {
  return useQuery({
    queryKey: liveClassKeys.happeningNow(),
    queryFn: () => liveClassApiClient.getHappeningNowLiveClasses(),
  });
};

/**
 * Get live classes by subject
 */
export const useLiveClassesBySubject = (params: {
  classId: string;
  subjectId: string;
  classArmId?: string;
}) => {
  return useQuery({
    queryKey: liveClassKeys.bySubject(params.subjectId),
    queryFn: async () => {
      // Get from localStorage first
      const stored = localStorage.getItem(`liveClasses_${params.subjectId}`);
      const localClasses = stored ? JSON.parse(stored) : [];
      
      // Mock data for demo
      const mockClasses = [
        {
          _id: 'mock-1',
          subject: 'Live Class',
          description: 'Sample live class session',
          scheduleTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          duration: '1 hour',
          classLink: 'https://meet.google.com/abc-defg-hij',
          status: 'scheduled',
          meetingId: 'DEMO-001'
        }
      ];
      
      return [...localClasses, ...mockClasses];
    },
    enabled: !!params.subjectId && !!params.classId,
  });
};

/**
 * Get live class by ID
 */
export const useLiveClassById = (id: string) => {
  return useQuery({
    queryKey: liveClassKeys.detail(id),
    queryFn: () => liveClassApiClient.getLiveClassById(id),
    enabled: !!id,
  });
};

/**
 * Create live class mutation
 */
export const useCreateLiveClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ subjectId, data }: { subjectId: string; data: CreateLiveClassRequest }) => {
      // Save to localStorage for now
      const stored = localStorage.getItem(`liveClasses_${subjectId}`);
      const existing = stored ? JSON.parse(stored) : [];
      
      const newClass = {
        _id: `local-${Date.now()}`,
        subject: data.subject,
        description: data.description,
        scheduleTime: data.scheduleTime,
        duration: data.duration,
        classLink: data.classLink,
        status: 'scheduled',
        meetingId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        createdAt: new Date().toISOString()
      };
      
      const updated = [...existing, newClass];
      localStorage.setItem(`liveClasses_${subjectId}`, JSON.stringify(updated));
      
      return newClass;
    },
    onSuccess: () => {
      // Invalidate all live class queries
      queryClient.invalidateQueries({ queryKey: liveClassKeys.all });

      toast({
        title: 'Success',
        description: 'Live class created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create live class',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Update live class mutation
 */
export const useUpdateLiveClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLiveClassRequest }) =>
      liveClassApiClient.updateLiveClass(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: liveClassKeys.all });
      queryClient.invalidateQueries({ queryKey: liveClassKeys.detail(variables.id) });

      toast({
        title: 'Success',
        description: 'Live class updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update live class',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Delete live class mutation
 */
export const useDeleteLiveClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Handle localStorage deletion
      if (id.startsWith('local-')) {
        // Find which subject this belongs to by checking all localStorage keys
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('liveClasses_')) {
            const stored = localStorage.getItem(key);
            if (stored) {
              const classes = JSON.parse(stored);
              const filtered = classes.filter((c: any) => c._id !== id);
              if (filtered.length !== classes.length) {
                localStorage.setItem(key, JSON.stringify(filtered));
                return;
              }
            }
          }
        }
      } else {
        // Try API call for non-local items
        return liveClassApiClient.deleteLiveClass(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: liveClassKeys.all });

      toast({
        title: 'Success',
        description: 'Live class deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete live class',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Upload recording mutation
 */
export const useUploadRecording = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, recordingUrl }: { id: string; recordingUrl: string }) =>
      liveClassApiClient.uploadRecording(id, recordingUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: liveClassKeys.all });
      queryClient.invalidateQueries({ queryKey: liveClassKeys.detail(variables.id) });

      toast({
        title: 'Success',
        description: 'Recording uploaded successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload recording',
        variant: 'destructive',
      });
    },
  });
};
