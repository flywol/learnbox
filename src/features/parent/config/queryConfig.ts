/**
 * React Query Configuration for Parent Portal
 * Centralized caching, stale time, and retry logic
 */

export const parentQueryConfig = {
	// Profile data - cache for 10 minutes (rarely changes)
	profile: {
		staleTime: 1000 * 60 * 10, // 10 minutes
		cacheTime: 1000 * 60 * 30, // 30 minutes
		retry: 2,
	},

	// Dashboard data - cache for 5 minutes (updates frequently)
	dashboard: {
		staleTime: 1000 * 60 * 5, // 5 minutes
		cacheTime: 1000 * 60 * 15, // 15 minutes
		retry: 2,
		refetchOnWindowFocus: true,
	},

	// Academic data - cache for 15 minutes (rarely changes)
	academic: {
		staleTime: 1000 * 60 * 15, // 15 minutes
		cacheTime: 1000 * 60 * 60, // 1 hour
		retry: 1,
	},

	// Schedule/Calendar - cache for 1 hour (rarely changes)
	schedule: {
		staleTime: 1000 * 60 * 60, // 1 hour
		cacheTime: 1000 * 60 * 120, // 2 hours
		retry: 1,
	},

	// Notifications - cache for 1 minute (real-time)
	notifications: {
		staleTime: 1000 * 60, // 1 minute
		cacheTime: 1000 * 60 * 5, // 5 minutes
		retry: 3,
		refetchOnWindowFocus: true,
		refetchInterval: 1000 * 60 * 2, // Auto-refetch every 2 minutes
	},

	// Subjects/Lessons - cache for 10 minutes
	subjects: {
		staleTime: 1000 * 60 * 10, // 10 minutes
		cacheTime: 1000 * 60 * 30, // 30 minutes
		retry: 2,
	},

	// Events - cache for 30 minutes
	events: {
		staleTime: 1000 * 60 * 30, // 30 minutes
		cacheTime: 1000 * 60 * 60, // 1 hour
		retry: 1,
	},
};

/**
 * Query key factory for consistent cache keys
 */
export const parentQueryKeys = {
	profile: () => ['parent-profile'] as const,

	childOverview: (childId: string) => ['child-overview', childId] as const,
	recentLessons: (childId: string) => ['recent-lessons', childId] as const,
	events: () => ['parent-events'] as const,

	subjects: (childId: string) => ['child-subjects', childId] as const,
	subjectLessons: (childId: string, subjectId: string) =>
		['subject-lessons', childId, subjectId] as const,
	lessonDetail: (childId: string, lessonId: string) =>
		['lesson-detail', childId, lessonId] as const,

	schedule: (childId: string) => ['child-schedule', childId] as const,
	calendar: (childId: string) => ['child-calendar', childId] as const,

	academicRecord: (childId: string) => ['academic-record', childId] as const,
	academicGrades: (childId: string, sessionId: string, term: string) =>
		['academic-grades', childId, sessionId, term] as const,
	gradeBreakdown: (childId: string, assessmentId: string) =>
		['grade-breakdown', childId, assessmentId] as const,

	notifications: () => ['parent-notifications'] as const,
};
