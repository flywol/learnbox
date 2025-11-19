import { useParentContext } from "../../context/ParentContext";
import { useQuery } from "@tanstack/react-query";
import { parentApiClient } from "../../api/parentApiClient";
import { parentQueryConfig, parentQueryKeys } from "../../config/queryConfig";
import ErrorState, { getErrorMessage } from "../../components/ErrorState";
import { DashboardSkeleton, ListSkeleton } from "../../components/LoadingState";
import WelcomeBanner from "../components/WelcomeBanner";
import OverviewStats from "../components/OverviewStats";
import RecentClassesSection from "../components/RecentClassesSection";
import EventsSection from "../components/EventsSection";
import PaymentSection from "../components/PaymentSection";

export default function ParentDashboard() {
	const { selectedChild } = useParentContext();

	// Fetch child overview data
	const {
		data: overviewData,
		isLoading: isLoadingOverview,
		error: overviewError,
		refetch: refetchOverview,
	} = useQuery({
		queryKey: parentQueryKeys.childOverview(selectedChild?._id || ""),
		queryFn: async () => {
			if (!selectedChild) return null;
			const response = await parentApiClient.getChildOverview(selectedChild._id);
			return response.data;
		},
		enabled: !!selectedChild,
		...parentQueryConfig.dashboard,
	});

	// Fetch recent lessons
	const {
		data: recentLessonsData,
		isLoading: isLoadingLessons,
		error: lessonsError,
		refetch: refetchLessons,
	} = useQuery({
		queryKey: parentQueryKeys.recentLessons(selectedChild?._id || ""),
		queryFn: async () => {
			if (!selectedChild) return null;
			const response = await parentApiClient.getRecentLessons(selectedChild._id);
			return response.data;
		},
		enabled: !!selectedChild,
		...parentQueryConfig.dashboard,
	});

	// Fetch events
	const {
		data: eventsData,
		isLoading: isLoadingEvents,
		error: eventsError,
		refetch: refetchEvents,
	} = useQuery({
		queryKey: parentQueryKeys.events(),
		queryFn: async () => {
			const response = await parentApiClient.getEvents();
			return response.data;
		},
		...parentQueryConfig.events,
	});

	// TODO: Upcoming deadline - might need separate endpoint or derive from calendar/assignments
	const upcomingDeadline = {
		title: "Mathematics assignment",
		subject: "Mathematics",
		date: "Jan 15, 2024",
		time: "11:59 PM",
		dueIn: "2 days",
	};

	if (!selectedChild) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-gray-500">Please select a child to view dashboard</p>
			</div>
		);
	}

	// Show full dashboard skeleton while initial data loads
	if (isLoadingOverview && isLoadingLessons && isLoadingEvents) {
		return <DashboardSkeleton />;
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Left Column - Welcome, Overview and Payment */}
			<div className="lg:col-span-2 space-y-6">
				{/* Welcome Banner */}
				<WelcomeBanner upcomingDeadline={upcomingDeadline} />

				{/* Overview Stats */}
				{overviewError ? (
					<ErrorState
						title="Failed to load overview"
						message={getErrorMessage(overviewError)}
						onRetry={refetchOverview}
					/>
				) : isLoadingOverview ? (
					<div className="bg-white rounded-lg p-6 border border-gray-200">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="animate-pulse">
									<div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
									<div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
									<div className="h-3 bg-gray-200 rounded w-2/3" />
								</div>
							))}
						</div>
					</div>
				) : overviewData?.overview ? (
					<OverviewStats stats={overviewData.overview} />
				) : (
					<div className="bg-white rounded-lg p-6 border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
						<p className="text-sm text-gray-500 text-center py-8">No overview data available</p>
					</div>
				)}

				{/* Payment Section - UI only, no endpoint */}
				<PaymentSection />
			</div>

			{/* Right Column - Recent Classes and Events */}
			<div className="space-y-6">
				{/* Recent Classes */}
				{lessonsError ? (
					<div className="bg-white rounded-lg p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent classes</h3>
						<ErrorState
							title="Failed to load lessons"
							message={getErrorMessage(lessonsError)}
							onRetry={refetchLessons}
						/>
					</div>
				) : isLoadingLessons ? (
					<div className="bg-white rounded-lg p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent classes</h3>
						<ListSkeleton count={3} />
					</div>
				) : recentLessonsData?.recentLessons && recentLessonsData.recentLessons.length > 0 ? (
					<RecentClassesSection classes={recentLessonsData.recentLessons} />
				) : (
					<div className="bg-white rounded-lg p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent classes</h3>
						<p className="text-sm text-gray-500 text-center py-8">No recent lessons available</p>
					</div>
				)}

				{/* Events */}
				{eventsError ? (
					<div className="bg-white rounded-lg p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Events</h3>
						<ErrorState
							title="Failed to load events"
							message={getErrorMessage(eventsError)}
							onRetry={refetchEvents}
						/>
					</div>
				) : isLoadingEvents ? (
					<div className="bg-white rounded-lg p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Events</h3>
						<ListSkeleton count={4} />
					</div>
				) : (
					<EventsSection events={eventsData?.events || []} />
				)}
			</div>
		</div>
	);
}
