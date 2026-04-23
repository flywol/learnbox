import BaseApiClient from '@/common/api/baseApiClient';

// ---------- helpers ----------
function extract<T>(res: any): T {
	return res?.data?.data ?? res?.data ?? res;
}

// ---------- subject colours / icons (API doesn't return these) ----------
const SUBJECT_BG_COLORS: Record<string, string> = {
	biology: 'bg-green-100',
	'further mathematics': 'bg-red-100',
	'further maths': 'bg-red-100',
	english: 'bg-blue-100',
	chemistry: 'bg-purple-100',
	economics: 'bg-teal-100',
	geography: 'bg-lime-100',
	'civic education': 'bg-indigo-100',
	mathematics: 'bg-orange-100',
	'computer science': 'bg-rose-100',
	agriculture: 'bg-green-100',
	history: 'bg-cyan-100',
	'food and nutrition': 'bg-pink-100',
	physics: 'bg-sky-100',
};

const SUBJECT_ICONS: Record<string, string> = {
	biology: '🧬',
	'further mathematics': '📐',
	'further maths': '📐',
	english: '📚',
	chemistry: '⚗️',
	economics: '💰',
	geography: '🌍',
	'civic education': '🏛️',
	mathematics: '🔢',
	'computer science': '💻',
	agriculture: '🌾',
	history: '📜',
	'food and nutrition': '🍎',
	physics: '💡',
};

export function subjectMeta(name: string) {
	const key = name.toLowerCase();
	return {
		icon: SUBJECT_ICONS[key] ?? '📖',
		bgColor: SUBJECT_BG_COLORS[key] ?? 'bg-gray-100',
	};
}

// ---------- response types ----------
export interface ApiSubject {
	_id?: string;
	id?: string;
	name: string;
	teacherName?: string;
	teacher?: { fullName?: string; name?: string };
	totalLessons?: number;
	completedLessons?: number;
	progressPercentage?: number;
	currentLesson?: number;
}

export interface ApiAssessmentItem {
	_id?: string;
	id?: string;
	subjectId?: string;
	subjectName?: string;
	name?: string;
	teacherName?: string;
	grade?: number;
	score?: number;
	session?: string;
	term?: string;
}

export interface ApiAssessmentBreakdown {
	id?: string;
	_id?: string;
	type?: string;
	name?: string;
	title?: string;
	date?: string;
	createdAt?: string;
	score?: number;
	totalPoints?: number;
	maxScore?: number;
}

export interface ApiAssessmentDetail {
	subject?: {
		name?: string;
		teacherName?: string;
		lessonsCompleted?: number;
		totalLessons?: number;
		progress?: number;
	};
	assessments?: ApiAssessmentBreakdown[];
	overview?: { grade?: number; attendance?: string };
}

export interface ApiUpcomingItem {
	_id?: string;
	id?: string;
	type?: string;
	title?: string;
	subject?: string | { name?: string };
	dueDate?: string;
	startTime?: string;
	status?: string;
}

export interface ApiCalendarEvent {
	_id?: string;
	id?: string;
	title?: string;
	description?: string;
	date?: string;
	startDate?: string;
	type?: string;
}

export interface ApiAssignment {
	_id?: string;
	id?: string;
	title?: string;
	subject?: string | { _id?: string; name?: string };
	subjectId?: string;
	subjectName?: string;
	dueDate?: string;
	status?: string;
	score?: number;
	totalPoints?: number;
	submittedAt?: string;
	description?: string;
}

// ---------- client ----------
class StudentApiClient extends BaseApiClient {
	async getClassSubjects(): Promise<ApiSubject[]> {
		const res = await this.get<any>('/student/class-subjects');
		const data = extract<any>(res);
		return Array.isArray(data)
			? data
			: (data?.subjects ?? data?.assignedSubjects ?? []);
	}

	async getAssessments(params?: { session?: string; term?: string }): Promise<ApiAssessmentItem[]> {
		const res = await this.get<any>('/student/assessments', { params } as any);
		const data = extract<any>(res);
		return Array.isArray(data) ? data : (data?.assessments ?? []);
	}

	async getAssessmentById(assessmentId: string): Promise<ApiAssessmentDetail> {
		const res = await this.get<any>(`/student/assessments/${assessmentId}`);
		return extract<ApiAssessmentDetail>(res);
	}

	async getAssignments(filter?: string): Promise<ApiAssignment[]> {
		const res = await this.get<any>('/student/assignments', {
			params: filter ? { filter } : undefined,
		} as any);
		const data = extract<any>(res);
		return Array.isArray(data) ? data : (data?.assignments ?? []);
	}

	async submitAssignment(
		assignmentId: string,
		payload: { textContent?: string; files?: File[] }
	) {
		const formData = new FormData();
		if (payload.textContent) formData.append('textContent', payload.textContent);
		if (payload.files) payload.files.forEach((f) => formData.append('files', f));
		return this.post<any>(`/student/assignments/${assignmentId}/submit`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		} as any);
	}

	async getUpcoming(): Promise<ApiUpcomingItem[]> {
		const res = await this.get<any>('/student/upcoming');
		const data = extract<any>(res);
		return Array.isArray(data) ? data : (data?.items ?? data?.upcoming ?? []);
	}

	async getCalendar(): Promise<ApiCalendarEvent[]> {
		const res = await this.get<any>('/student/calendar');
		const data = extract<any>(res);
		return Array.isArray(data) ? data : (data?.events ?? data?.calendar ?? []);
	}

	async markContentViewed(lessonId: string, contentId: string, viewDuration?: number) {
		return this.post<any>(
			`/student/lessons/${lessonId}/contents/${contentId}/mark-viewed`,
			viewDuration !== undefined ? { viewDuration } : {}
		);
	}

	async getLessonProgress(lessonId: string) {
		return this.get<any>(`/student/lessons/${lessonId}/progress`);
	}

	async getSubjectProgress(subjectId: string) {
		return this.get<any>(`/student/subjects/${subjectId}/progress`);
	}

	async getNotifications() {
		const res = await this.get<any>('/student/notifications');
		const data = extract<any>(res);
		return Array.isArray(data) ? data : (data?.notifications ?? []);
	}

	async markNotificationRead(notificationId: string) {
		return this.post<any>(`/student/notifications/${notificationId}/read`);
	}

	async markAllNotificationsRead() {
		return this.post<any>('/student/notifications/read-all');
	}
}

export const studentApiClient = new StudentApiClient();
