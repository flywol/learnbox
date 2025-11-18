// Parent Dashboard Types

export interface Child {
	id: string;
	name: string;
	avatar: string;
	class: string;
	classArm: string;
}

export interface Attendance {
	percentage: number;
	totalClasses: number;
	attended: number;
	missed: number;
}

export interface Assignments {
	total: number;
	completed: number;
	pending: number;
}

export interface Tests {
	averageScore: number;
	totalTests: number;
	completedTests: number;
	pendingTests: number;
}

export interface OverviewStats {
	attendance: Attendance;
	assignments: Assignments;
	tests: Tests;
}

export interface RecentClass {
	id: string;
	subjectName: string;
	subjectIcon: string;
	progress: number;
	lessonNumber: number;
	totalLessons: number;
	lastAccessed: string;
	color: string; // Tailwind class like 'bg-green-100'
}

export interface Event {
	id: string;
	title: string;
	description: string;
	date: string; // ISO date string
	day: number;
	month: string;
	type: "school" | "class" | "personal";
}

export interface UpcomingDeadline {
	subject: string;
	dueIn: string;
	dueDate: Date;
}

export interface ParentDashboardData {
	selectedChild: Child;
	children: Child[];
	overview: OverviewStats;
	recentClasses: RecentClass[];
	events: Event[];
	upcomingDeadline: UpcomingDeadline | null;
}
