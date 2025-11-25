import { mockStudentDashboardData } from "../config/studentDashboardConfig";
import WelcomeBanner from "../components/WelcomeBanner";
import OverviewStats from "../components/OverviewStats";
import TasksSection from "../components/TasksSection";
import RecentClassesSection from "../components/RecentClassesSection";
import EventsSection from "../components/EventsSection";

export default function StudentDashboard() {
	// Using mock data - NO API CALLS until endpoints provided
	const dashboardData = mockStudentDashboardData;

	const completedTasksCount = dashboardData.tasks.filter(
		(task) => task.status === "completed"
	).length;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Left Column - Welcome, Overview and Tasks */}
			<div className="lg:col-span-2 space-y-6">
				{/* Welcome Banner */}
				<WelcomeBanner upcomingDeadline={dashboardData.upcomingDeadline || undefined} />

				{/* Overview Stats */}
				<OverviewStats stats={dashboardData.overview} />

				{/* Tasks Section */}
				<TasksSection
					tasks={dashboardData.tasks}
					completedCount={completedTasksCount}
					totalCount={dashboardData.tasks.length}
				/>
			</div>

			{/* Right Column - Recent Classes and Events */}
			<div className="space-y-6">
				{/* Recent Classes */}
				<RecentClassesSection classes={dashboardData.recentClasses} />

				{/* Events */}
				<EventsSection events={dashboardData.events} />
			</div>
		</div>
	);
}
