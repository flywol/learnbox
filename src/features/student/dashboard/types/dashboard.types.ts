// Student Dashboard Types

export interface StudentOverviewStats {
	classAttendance: {
		percentage: number;
		totalClasses: number;
		attended: number;
		missed: number;
	};
	assignments: {
		total: number;
		completed: number;
		pending: number;
		completionRate: number;
	};
	testScores: {
		averageScore: number;
		totalTests: number;
		completed: number;
		pending: number;
	};
}

export interface RecentClass {
	id: string;
	subjectName: string;
	subjectIcon: string;
	progress: number;
	lessonNumber: number;
	totalLessons: number;
	lastAccessed: string;
	color: string; // Background color for the card
}

export interface StudentTask {
	id: string;
	title: string;
	type: "live_class" | "assignment" | "quiz" | "exam" | "other";
	subject?: string;
	dueDate?: string;
	startTime?: string;
	status: "upcoming" | "in_progress" | "completed" | "overdue";
	description?: string;
}

export interface StudentEvent {
	id: string;
	title: string;
	description: string;
	date: string;
	day: number;
	month: string;
	type: "school" | "class" | "personal";
}

export interface UpcomingDeadline {
	subject: string;
	dueIn: string; // e.g., "2hrs 30mins"
	dueDate: Date;
}

export interface StudentDashboardData {
	overview: StudentOverviewStats;
	recentClasses: RecentClass[];
	tasks: StudentTask[];
	events: StudentEvent[];
	upcomingDeadline: UpcomingDeadline | null;
}
