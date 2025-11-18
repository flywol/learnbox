import BaseApiClient from "@/common/api/baseApiClient";
import type {
	ParentProfileResponse,
	UpdateProfileRequest,
	ChildOverviewResponse,
	RecentLessonsResponse,
	SubjectsResponse,
	SubjectLessonsResponse,
	LessonDetailResponse,
	ScheduleResponse,
	CalendarResponse,
	EventsResponse,
	AcademicRecordResponse,
	AcademicGradesResponse,
	GradeBreakdownResponse,
	NotificationsResponse,
	MarkNotificationReadResponse,
} from "../types/parent-api.types";

class ParentApiClient extends BaseApiClient {
	constructor() {
		super();
	}

	// ==================== Profile & Children ====================

	/**
	 * Get parent profile with linked children
	 * GET /parent/profile
	 */
	async getProfile(): Promise<ParentProfileResponse> {
		const response = await this.get<ParentProfileResponse>("/parent/profile");
		return response;
	}

	/**
	 * Update parent profile
	 * PUT /parent/profile
	 */
	async updateProfile(data: UpdateProfileRequest): Promise<{ data: { message: string } }> {
		const formData = new FormData();

		if (data.fullName) formData.append("fullName", data.fullName);
		if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
		if (data.relationshipToStudent) formData.append("relationshipToStudent", data.relationshipToStudent);
		if (data.profilePicture) formData.append("profilePicture", data.profilePicture);

		const response = await this.put<{ data: { message: string } }>(
			"/parent/profile",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response;
	}

	// ==================== Dashboard ====================

	/**
	 * Get child overview/dashboard
	 * GET /parent/child/{childId}/overview
	 */
	async getChildOverview(childId: string): Promise<ChildOverviewResponse> {
		const response = await this.get<ChildOverviewResponse>(`/parent/child/${childId}/overview`);
		return response;
	}

	/**
	 * Get child's recent lessons
	 * GET /parent/child/{childId}/recent-lessons
	 */
	async getRecentLessons(childId: string): Promise<RecentLessonsResponse> {
		const response = await this.get<RecentLessonsResponse>(`/parent/child/${childId}/recent-lessons`);
		return response;
	}

	/**
	 * Get upcoming school events
	 * GET /parent/events
	 */
	async getEvents(): Promise<EventsResponse> {
		const response = await this.get<EventsResponse>("/parent/events");
		return response;
	}

	// ==================== Subjects & Lessons ====================

	/**
	 * Get child's subjects with progress
	 * GET /parent/child/{childId}/subjects
	 */
	async getSubjects(childId: string): Promise<SubjectsResponse> {
		const response = await this.get<SubjectsResponse>(`/parent/child/${childId}/subjects`);
		return response;
	}

	/**
	 * Get all lessons for a subject
	 * GET /parent/child/{childId}/subject/{subjectId}/lessons
	 */
	async getSubjectLessons(childId: string, subjectId: string): Promise<SubjectLessonsResponse> {
		const response = await this.get<SubjectLessonsResponse>(
			`/parent/child/${childId}/subject/${subjectId}/lessons`
		);
		return response;
	}

	/**
	 * Get lesson details with content
	 * GET /parent/child/{childId}/lesson/{lessonId}
	 */
	async getLessonDetail(childId: string, lessonId: string): Promise<LessonDetailResponse> {
		const response = await this.get<LessonDetailResponse>(
			`/parent/child/${childId}/lesson/${lessonId}`
		);
		return response;
	}

	// ==================== Schedule & Calendar ====================

	/**
	 * Get child's class schedule
	 * GET /parent/child/{childId}/schedule
	 */
	async getSchedule(childId: string): Promise<ScheduleResponse> {
		const response = await this.get<ScheduleResponse>(`/parent/child/${childId}/schedule`);
		return response;
	}

	/**
	 * Get child's monthly calendar
	 * GET /parent/child/{childId}/calendar
	 */
	async getCalendar(childId: string): Promise<CalendarResponse> {
		const response = await this.get<CalendarResponse>(`/parent/child/${childId}/calendar`);
		return response;
	}

	// ==================== Academic Records ====================

	/**
	 * Get child's academic record
	 * GET /parent/child/{childId}/academic-record
	 */
	async getAcademicRecord(childId: string): Promise<AcademicRecordResponse> {
		const response = await this.get<AcademicRecordResponse>(
			`/parent/child/${childId}/academic-record`
		);
		return response;
	}

	/**
	 * Get child's academic grades by session and term
	 * GET /parent/child/{childId}/academic-grades
	 */
	async getAcademicGrades(
		childId: string,
		sessionId: string,
		term: string
	): Promise<AcademicGradesResponse> {
		const response = await this.get<AcademicGradesResponse>(
			`/parent/child/${childId}/academic-grades`,
			{
				params: {
					sessionId,
					term,
				},
			}
		);
		return response;
	}

	/**
	 * Get detailed grade breakdown for a subject
	 * GET /parent/child/{childId}/assessment/{assessmentId}/breakdown
	 */
	async getGradeBreakdown(childId: string, assessmentId: string): Promise<GradeBreakdownResponse> {
		const response = await this.get<GradeBreakdownResponse>(
			`/parent/child/${childId}/assessment/${assessmentId}/breakdown`
		);
		return response;
	}

	// ==================== Notifications ====================

	/**
	 * Get all notifications for parent
	 * GET /parent/notifications
	 */
	async getNotifications(): Promise<NotificationsResponse> {
		const response = await this.get<NotificationsResponse>("/parent/notifications");
		return response;
	}

	/**
	 * Mark a notification as read
	 * PUT /parent/notifications/{notificationId}/read
	 */
	async markNotificationAsRead(notificationId: string): Promise<MarkNotificationReadResponse> {
		const response = await this.put<MarkNotificationReadResponse>(
			`/parent/notifications/${notificationId}/read`
		);
		return response;
	}

	/**
	 * Mark all notifications as read
	 * PUT /parent/notifications/read-all
	 */
	async markAllNotificationsAsRead(): Promise<MarkNotificationReadResponse> {
		const response = await this.put<MarkNotificationReadResponse>("/parent/notifications/read-all");
		return response;
	}
}

// Export singleton instance
export const parentApiClient = new ParentApiClient();
export default parentApiClient;
