import { useEffect, useState } from "react";
import WelcomeBanner from "../components/WelcomeBanner";
import OverviewStats from "../components/OverviewStats";
import TasksSection from "../components/TasksSection";
import RecentClassesSection from "../components/RecentClassesSection";
import EventsSection from "../components/EventsSection";
import { studentApiClient, subjectMeta } from "@/features/student/api/studentApiClient";
import type {
	StudentDashboardData,
	StudentTask,
	StudentEvent,
	RecentClass,
	UpcomingDeadline,
} from "../types/dashboard.types";
import { mockStudentDashboardData } from "../config/studentDashboardConfig";

function buildDashboardData(
	upcoming: any[],
	calendar: any[],
	subjects: any[]
): Partial<StudentDashboardData> {
	const tasks: StudentTask[] = upcoming.map((item: any, i: number) => {
		const subjectRaw = item.subject;
		const subject =
			typeof subjectRaw === "object" ? (subjectRaw?.name ?? "") : (subjectRaw ?? "");
		return {
			id: item._id ?? item.id ?? String(i),
			title: item.title ?? "Upcoming item",
			type: (item.type as StudentTask["type"]) ?? "other",
			subject: subject || undefined,
			dueDate: item.dueDate ?? item.deadline ?? undefined,
			startTime: item.startTime ?? undefined,
			status: (item.status as StudentTask["status"]) ?? "upcoming",
		};
	});

	// Only include events that have a meaningful title
	const events: StudentEvent[] = calendar
		.map((ev: any, i: number) => {
			const rawDate = ev.date ?? ev.startDate ?? new Date().toISOString();
			const d = new Date(rawDate);
			const title = ev.title ?? ev.name ?? (ev.description || null) ?? "";
			if (!title) return null;
			return {
				id: ev._id ?? ev.id ?? String(i),
				title,
				description: ev.description ?? ev.title ?? "",
				date: rawDate,
				day: d.getDate(),
				month: d.toLocaleString("en-US", { month: "short" }),
				type: (ev.type as StudentEvent["type"]) ?? "school",
			};
		})
		.filter(Boolean) as StudentEvent[];

	// Map class subjects to RecentClass with real progress
	const recentClasses: RecentClass[] = subjects.slice(0, 4).map((s: any, i: number) => {
		const name = s.name ?? s.subjectName ?? "Subject";
		const meta = subjectMeta(name);
		const completed = s.completedLessons ?? s.currentLesson ?? 0;
		const total = s.totalLessons ?? 16;
		const progress =
			s.progressPercentage != null
				? Math.round(s.progressPercentage)
				: total > 0
				? Math.round((completed / total) * 100)
				: 0;
		return {
			id: s._id ?? s.id ?? String(i),
			subjectName: name,
			subjectIcon: meta.icon,
			progress,
			lessonNumber: completed,
			totalLessons: total,
			lastAccessed: s.lastAccessed ?? (s.updatedAt ? "Recently" : "—"),
			color: meta.bgColor,
		};
	});

	// Nearest upcoming deadline from tasks
	const deadlineTasks = tasks
		.filter((t) => t.dueDate && t.status === "upcoming")
		.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

	let upcomingDeadline: UpcomingDeadline | null = null;
	if (deadlineTasks.length > 0) {
		const first = deadlineTasks[0];
		const dueMs = new Date(first.dueDate!).getTime() - Date.now();
		const dueInHours = Math.max(0, Math.floor(dueMs / (1000 * 60 * 60)));
		const dueInMins = Math.max(0, Math.floor((dueMs % (1000 * 60 * 60)) / (1000 * 60)));
		upcomingDeadline = {
			subject: first.subject ?? first.title,
			dueIn:
				dueInHours > 0
					? `${dueInHours}hr${dueInHours !== 1 ? "s" : ""} ${dueInMins}mins`
					: `${dueInMins}mins`,
			dueDate: new Date(first.dueDate!),
		};
	}

	return {
		tasks,
		events,
		upcomingDeadline,
		...(recentClasses.length > 0 ? { recentClasses } : {}),
	};
}

export default function StudentDashboard() {
	const [dashboardData, setDashboardData] = useState<StudentDashboardData>(mockStudentDashboardData);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const [upcoming, calendar, subjects] = await Promise.allSettled([
					studentApiClient.getUpcoming(),
					studentApiClient.getCalendar(),
					studentApiClient.getClassSubjects(),
				]);

				const upcomingData = upcoming.status === "fulfilled" ? upcoming.value : [];
				const calendarData = calendar.status === "fulfilled" ? calendar.value : [];
				const subjectsData = subjects.status === "fulfilled" ? subjects.value : [];

				const partial = buildDashboardData(upcomingData, calendarData, subjectsData);
				setDashboardData((prev) => ({ ...prev, ...partial }));
			} catch {
				// Keep mock data on failure
			} finally {
				setIsLoading(false);
			}
		};
		load();
	}, []);

	const completedTasksCount = dashboardData.tasks.filter((t) => t.status === "completed").length;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{/* Left Column */}
			<div className="md:col-span-2 space-y-6">
				<WelcomeBanner upcomingDeadline={dashboardData.upcomingDeadline || undefined} />
				<OverviewStats stats={dashboardData.overview} />
				<TasksSection
					tasks={isLoading ? [] : dashboardData.tasks}
					completedCount={completedTasksCount}
					totalCount={dashboardData.tasks.length}
				/>
			</div>

			{/* Right Column */}
			<div className="space-y-6">
				<RecentClassesSection classes={dashboardData.recentClasses} />
				<EventsSection events={isLoading ? [] : dashboardData.events} />
			</div>
		</div>
	);
}
