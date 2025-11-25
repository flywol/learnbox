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
} from "lucide-react";
import SchoolSetupPromptModal from "../../school-setup/components/SchoolSetupPromptModal";
import { useSchoolSetupStore } from "../../school-setup/store/schoolSetupStore";
import { useAdminDashboardStats } from "../hooks/useAdminDashboardStats";
import AdminWelcomeModal from "../../components/AdminWelcomeModal";
import { StatCard, WelcomeHeader, DashboardLayout, EventsSection } from "@/common/components/dashboard";
import { ASSETS } from "@/common/constants/assets";
import type { ActionConfig } from "@/common/components/dashboard";
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

import { getFirstName } from "@/common/utils/userUtils";

// ... imports

export default function DashboardPage() {
	const navigate = useNavigate();
	const user = useAuthStore((state) => state.user);
	const { isCompleted: isSchoolSetupCompleted } = useSchoolSetupStore();
	const { stats, loading } = useAdminDashboardStats();
	const [showSetupPrompt, setShowSetupPrompt] = useState(false);
	const [showWelcomeModal, setShowWelcomeModal] = useState(false);

	// Events query
	const { 
		data: eventsResponse, 
		isLoading: eventsLoading, 
		error: eventsError 
	} = useQuery({
		queryKey: ['admin-events'],
		queryFn: () => eventsApiClient.getEvents(),
	});

	const events = eventsResponse || [];

	useEffect(() => {
		// Show welcome modal if it's the first login
		// This logic might need adjustment based on actual "first login" flag
		// For now, we'll just leave it initialized to false
	}, []);

	useEffect(() => {
		if (!isSchoolSetupCompleted) {
			// Delay showing the prompt slightly to allow for initial load
			const timer = setTimeout(() => setShowSetupPrompt(true), 1000);
			return () => clearTimeout(timer);
		}
	}, [isSchoolSetupCompleted]);

	const setupPrompt = !isSchoolSetupCompleted ? (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-sm font-medium text-blue-900">Complete your school setup</h3>
					<p className="mt-1 text-sm text-blue-700">
						You need to complete your school setup to access all features.
					</p>
				</div>
				<button
					onClick={() => navigate("/admin/school-setup")}
					className="ml-4 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
				>
					Complete Setup
				</button>
			</div>
		</div>
	) : undefined;

	// Admin action cards configuration
	const adminActions: ActionConfig[] = [
		{
			iconSrc: ASSETS.IMAGES.ADD_NEW,
			title: "Add new user",
			description: "Add students, teachers, or parents to your school",
			onClick: () => navigate("/admin/users/create"),
		},
		{
			iconSrc: ASSETS.IMAGES.ADD_NEW_2,
			title: "Add new subject",
			description: "Add subjects and assign them to classes",
			onClick: () => navigate("/admin/classroom"),
		},
		{
			iconSrc: ASSETS.IMAGES.ADD_NEW,
			title: "School payments", 
			description: "Manage fees, transactions, and payment records",
			onClick: () => navigate("/admin/payments"),
		},
		{
			iconSrc: ASSETS.IMAGES.ADD_NEW_2,
			title: "Session config",
			description: "Set up academic sessions and terms", 
			onClick: () => navigate("/admin/profile/session-config"),
		},
	];
	return (
		<DashboardLayout
			welcomeHeader={
				<WelcomeHeader
					userName={getFirstName(user?.fullName, "Admin")}
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
							<EmptyState title="No recent activities yet" description="" illustration={ASSETS.IMAGES.ACTIVITY_EMPTY} />
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
