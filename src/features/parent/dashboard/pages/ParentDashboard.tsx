import { mockParentDashboardData } from "../config/parentDashboardConfig";
import WelcomeBanner from "../components/WelcomeBanner";
import OverviewStats from "../components/OverviewStats";
import RecentClassesSection from "../components/RecentClassesSection";
import EventsSection from "../components/EventsSection";
import PaymentSection from "../components/PaymentSection";

export default function ParentDashboard() {
	// Using mock data - NO API CALLS until endpoints provided
	const dashboardData = mockParentDashboardData;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Left Column - Welcome, Overview and Payment */}
			<div className="lg:col-span-2 space-y-6">
				{/* Welcome Banner */}
				<WelcomeBanner upcomingDeadline={dashboardData.upcomingDeadline} />

				{/* Overview Stats */}
				<OverviewStats stats={dashboardData.overview} />

				{/* Payment Section */}
				<PaymentSection />
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
