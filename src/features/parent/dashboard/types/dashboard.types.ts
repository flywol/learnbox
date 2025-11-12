// Parent Dashboard Types

export interface Child {
	id: string;
	name: string;
	avatar: string;
	class: string;
	classArm: string;
}

export interface ClassAttendance {
	percentage: number;
	totalClasses: number;
	attended: number;
	missed: number;
}

export interface Assignments {
	total: number;
	completed: number;
	pending: number;
	completionRate: number;
}

export interface TestScores {
	averageScore: number;
	totalTests: number;
	completed: number;
	pending: number;
}

export interface OverviewStats {
	classAttendance: ClassAttendance;
	assignments: Assignments;
	testScores: TestScores;
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
