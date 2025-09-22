// src/features/dashboard/pages/DashboardPage.tsx - Role-aware dashboard
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
	Users,
	GraduationCap,
	UserCheck,
	UserPlus,
	Calendar,
	TrendingUp,
	BookOpen,
	Heart,
	Award,
	Building2,
} from "lucide-react";
import SchoolSetupPromptModal from "../../school-setup/components/SchoolSetupPromptModal";
import { useSchoolSetupStore } from "../../school-setup/store/schoolSetupStore";
import { useAdminDashboardStats } from "../hooks/useAdminDashboardStats";
import AdminWelcomeModal from "../../components/AdminWelcomeModal";
import { StatCard, WelcomeHeader, DashboardLayout, EventsSection } from "@/common/components/dashboard";
import type { ActionConfig, DashboardEvent } from "@/common/components/dashboard";
import { useQuery } from '@tanstack/react-query';
import { eventsApiClient } from '@/features/admin/events/api/eventsApiClient';


// Empty State Component with illustration style
const EmptyState = ({
	title,
	description,
	illustration,
}: {
	title: string;
	description: string;
	illustration?: string;
}) => (
	<div className="flex flex-col items-center justify-center py-8">
		{illustration && (
			<div className="w-32 h-24 mx-auto mb-4">
				<img 
					src={illustration} 
					alt={title} 
					className="w-full h-full object-contain"
				/>
			</div>
		)}
		<h3 className="text-base font-medium text-gray-900 mb-2">{title}</h3>
		<p className="text-sm text-gray-500 text-center max-w-sm">{description}</p>
	</div>
);

export default function DashboardPage() {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { isCompleted: isSchoolSetupCompleted } = useSchoolSetupStore();
	const [showSetupPrompt, setShowSetupPrompt] = useState(false);
	const [showWelcomeModal, setShowWelcomeModal] = useState(false);
	const { stats, loading } = useAdminDashboardStats();

	// Fetch events for admin dashboard
	const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useQuery({
		queryKey: ['admin-events'],
		queryFn: () => eventsApiClient.getEvents(),
		staleTime: 5 * 60 * 1000,
	});

	// Transform events to shared format
	const events: DashboardEvent[] = eventsData?.map(event => ({
		id: event.id,
		description: event.description,
		date: event.date,
		receivers: event.receivers,
	})) || [];

	// Admin action cards configuration
	const adminActions: ActionConfig[] = [
		{
			iconSrc: "/assets/add-new.svg",
			title: "Add new user",
			description: "Add students, teachers, or parents to your school",
			onClick: () => navigate("/user-management/create"),
		},
		{
			iconSrc: "/assets/add-new2.svg", 
			title: "Add new subject",
			description: "Add subjects and assign them to classes",
			onClick: () => {/* TODO: Implement add subject */},
		},
		{
			iconSrc: "/assets/add-new.svg",
			title: "School payments", 
			description: "Manage fees, transactions, and payment records",
			onClick: () => navigate("/payments"),
		},
		{
			iconSrc: "/assets/add-new2.svg",
			title: "Session config",
			description: "Set up academic sessions and terms", 
			onClick: () => navigate("/profile/session-config"),
		},
	];

	// Setup prompt for admin if school setup not completed
	const setupPrompt = (
		<div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
						<Building2 className="w-6 h-6 text-white" />
					</div>
					<div>
						<h3 className="font-semibold text-gray-900">Complete your school registration</h3>
						<p className="text-sm text-gray-600">Set up your school profile, classes, and academic sessions</p>
					</div>
				</div>
				<button
					onClick={() => setShowSetupPrompt(true)}
					className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
					Continue Setup
				</button>
			</div>
		</div>
	);

	useEffect(() => {
		// Show setup prompt if school setup is not completed
		if (!isSchoolSetupCompleted && user?.role === "ADMIN") {
			setShowSetupPrompt(true);
		}
		// Show welcome modal for admin users who haven't seen it
		else if (user?.role === "ADMIN" && !localStorage.getItem('admin-welcome-seen')) {
			setShowWelcomeModal(true);
		}
	}, [isSchoolSetupCompleted, user]);


	// Default admin dashboard
	return (
		<DashboardLayout
			welcomeHeader={
				<WelcomeHeader
					userName={user?.fullName?.split(" ")[0] || "Admin"}
					actions={adminActions}
					isSetupRequired={!isSchoolSetupCompleted}
					setupPrompt={setupPrompt}
				/>
			}
			mainContent={
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-6">Overview</h2>

					{/* School Stats */}
					<div className="mb-8">
						<h3 className="text-sm font-medium text-gray-700 mb-4">School</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<StatCard icon={Award} label="Current session" value="--" iconColor="text-red-500" />
							<StatCard icon={Calendar} label="Current term" value="--" iconColor="text-orange-500" />
							<StatCard icon={TrendingUp} label="Progress" value="--" iconColor="text-yellow-500" />
						</div>
					</div>

					{/* Users Stats */}
					<div className="mb-8">
						<h3 className="text-sm font-medium text-gray-700 mb-4">Users</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<StatCard icon={Users} label="Total users" value={stats?.totalUsers ?? "--"} iconColor="text-red-500" loading={loading} />
							<StatCard icon={UserCheck} label="Active users" value={stats?.activeUsers ?? "--"} subtext="(last 7 days)" iconColor="text-green-500" loading={loading} />
							<StatCard icon={GraduationCap} label="Total students" value={stats?.totalStudents ?? "--"} iconColor="text-red-500" loading={loading} />
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
							<StatCard icon={Users} label="Total teachers" value={stats?.totalTeachers ?? "--"} iconColor="text-red-500" loading={loading} />
							<StatCard icon={Heart} label="Total parents" value={stats?.totalParents ?? "--"} iconColor="text-red-500" loading={loading} />
							<StatCard icon={UserPlus} label="New registration" value={stats?.newRegistrations ?? "--"} subtext="(last 30 days)" iconColor="text-red-500" loading={loading} />
						</div>
					</div>

					{/* Classroom Stats */}
					<div>
						<h3 className="text-sm font-medium text-gray-700 mb-4">Classroom</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<StatCard icon={BookOpen} label="Total classes" value={stats?.totalClasses ?? "--"} iconColor="text-red-500" loading={loading} />
							<StatCard icon={Users} label="Active learners" value={stats?.activeLearners ?? "--"} subtext="(last 7 days)" iconColor="text-green-500" loading={loading} />
						</div>
					</div>
				</div>
			}
			sidebar={
				<>
					{/* Recent Activities */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[400px] flex flex-col">
						<div className="p-4 border-b border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900">Recent activities</h2>
						</div>
						<div className="p-4 flex-1 flex items-center justify-center">
							<EmptyState title="No recent activities yet" description="" illustration="/assets/activity-empty.svg" />
						</div>
					</div>

					{/* Events */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[400px] flex flex-col">
						<div className="p-4 border-b border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900">Events</h2>
						</div>
						<div className="flex-1 overflow-y-auto">
							<EventsSection events={events} isLoading={eventsLoading} error={eventsError?.message || null} />
						</div>
					</div>
				</>
			}
			modals={
				<>
					<SchoolSetupPromptModal isOpen={showSetupPrompt} onClose={() => setShowSetupPrompt(false)} />
					<AdminWelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
				</>
			}
		/>
	);
}
