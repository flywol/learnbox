import type { StudentDashboardData } from "../types/dashboard.types";

// Mock data for student dashboard - NO API CALLS until endpoints provided
export const mockStudentDashboardData: StudentDashboardData = {
	overview: {
		classAttendance: {
			percentage: 54,
			totalClasses: 20,
			attended: 11,
			missed: 9,
		},
		assignments: {
			total: 5,
			completed: 2,
			pending: 3,
			completionRate: 40, // 2/5 = 0.4 = 40%
		},
		testScores: {
			averageScore: 54,
			totalTests: 2,
			completed: 2,
			pending: 0,
		},
	},
	recentClasses: [
		{
			id: "1",
			subjectName: "Biology",
			subjectIcon: "🔬",
			progress: 58,
			lessonNumber: 9,
			totalLessons: 16,
			lastAccessed: "10 mins ago",
			color: "bg-green-100", // Light green
		},
		{
			id: "2",
			subjectName: "Further Maths",
			subjectIcon: "🧮",
			progress: 58,
			lessonNumber: 9,
			totalLessons: 16,
			lastAccessed: "10 mins ago",
			color: "bg-orange-100", // Light orange
		},
		{
			id: "3",
			subjectName: "Physics",
			subjectIcon: "💡",
			progress: 58,
			lessonNumber: 9,
			totalLessons: 16,
			lastAccessed: "45 mins ago",
			color: "bg-cyan-100", // Light cyan
		},
		{
			id: "4",
			subjectName: "Chemistry",
			subjectIcon: "⚗️",
			progress: 58,
			lessonNumber: 9,
			totalLessons: 16,
			lastAccessed: "45 mins ago",
			color: "bg-purple-100", // Light purple
		},
	],
	tasks: [
		{
			id: "1",
			title: "Attend Live Class",
			type: "live_class",
			subject: "Physics",
			startTime: "Now",
			status: "in_progress",
		},
		{
			id: "2",
			title: "Assignment Deadline",
			type: "assignment",
			subject: "Physics",
			dueDate: "2hrs 30mins",
			status: "upcoming",
		},
		{
			id: "3",
			title: "Upcoming Quiz",
			type: "quiz",
			subject: "Further Maths",
			dueDate: "2hrs 30mins",
			status: "upcoming",
		},
		{
			id: "4",
			title: "Upcoming Quiz",
			type: "quiz",
			subject: "Further Maths",
			dueDate: "2hrs 30mins",
			status: "upcoming",
		},
		{
			id: "5",
			title: "Assignment Deadline",
			type: "assignment",
			subject: "Biology",
			status: "upcoming",
		},
	],
	events: [
		{
			id: "1",
			title: "Open Day",
			description:
				"Further details would be announced soon as we get more information. Trust us.",
			date: "2025-05-30",
			day: 30,
			month: "May",
			type: "school",
		},
		{
			id: "2",
			title: "Open Day",
			description: "Further details would be announced soon",
			date: "2025-05-30",
			day: 30,
			month: "May",
			type: "school",
		},
		{
			id: "3",
			title: "Open Day",
			description: "Further details would be announced soon",
			date: "2025-05-30",
			day: 30,
			month: "May",
			type: "school",
		},
		{
			id: "4",
			title: "Open Day",
			description:
				"Further details would be announced soon as we get more information. Trust us.",
			date: "2025-05-30",
			day: 30,
			month: "May",
			type: "school",
		},
		{
			id: "5",
			title: "Open Day",
			description: "Further details would be announced soon",
			date: "2025-05-30",
			day: 30,
			month: "May",
			type: "school",
		},
	],
	upcomingDeadline: {
		subject: "Physics",
		dueIn: "2hrs 30mins",
		dueDate: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
	},
};

// Empty state mock data
export const mockEmptyStudentDashboardData: StudentDashboardData = {
	overview: {
		classAttendance: {
			percentage: 0,
			totalClasses: 0,
			attended: 0,
			missed: 0,
		},
		assignments: {
			total: 0,
			completed: 0,
			pending: 0,
			completionRate: 0,
		},
		testScores: {
			averageScore: 0,
			totalTests: 0,
			completed: 0,
			pending: 0,
		},
	},
	recentClasses: [],
	tasks: [],
	events: [],
	upcomingDeadline: null,
};
