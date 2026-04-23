import { useEffect, useState } from "react";
import WelcomeBanner from "../components/WelcomeBanner";
import OverviewStats from "../components/OverviewStats";
import TasksSection from "../components/TasksSection";
import RecentClassesSection from "../components/RecentClassesSection";
import EventsSection from "../components/EventsSection";
import { studentApiClient } from "@/features/student/api/studentApiClient";
import type {
	StudentDashboardData,
	StudentTask,
	StudentEvent,
	RecentClass,
	UpcomingDeadline,
} from "../types/dashboard.types";
import { mockStudentDashboardData } from "../config/studentDashboardConfig";

function buildDashboardData(upcoming: any[], calendar: any[]): Partial<StudentDashboardData> {
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

	const events: StudentEvent[] = calendar.map((ev: any, i: number) => {
		const rawDate = ev.date ?? ev.startDate ?? new Date().toISOString();
		const d = new Date(rawDate);
		return {
			id: ev._id ?? ev.id ?? String(i),
			title: ev.title ?? "Event",
			description: ev.description ?? "",
			date: rawDate,
			day: d.getDate(),
			month: d.toLocaleString("en-US", { month: "short" }),
			type: (ev.type as StudentEvent["type"]) ?? "school",
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
			dueIn: dueInHours > 0 ? `${dueInHours}hr${dueInHours !== 1 ? "s" : ""} ${dueInMins}mins` : `${dueInMins}mins`,
			dueDate: new Date(first.dueDate!),
		};
	}

	return { tasks, events, upcomingDeadline };
}

export default function StudentDashboard() {
	const [dashboardData, setDashboardData] = useState<StudentDashboardData>(mockStudentDashboardData);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const [upcoming, calendar] = await Promise.allSettled([
					studentApiClient.getUpcoming(),
					studentApiClient.getCalendar(),
				]);

				const upcomingData = upcoming.status === "fulfilled" ? upcoming.value : [];
				const calendarData = calendar.status === "fulfilled" ? calendar.value : [];

				const partial = buildDashboardData(upcomingData, calendarData);
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
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Left Column */}
			<div className="lg:col-span-2 space-y-6">
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
