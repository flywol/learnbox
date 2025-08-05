// src/features/dashboard/pages/AdminDashboard.tsx - Redesigned to match target design
import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
	Users,
	GraduationCap,
	UserCheck,
	UserPlus,
	Calendar,
	TrendingUp,
	School,
	BookOpen,
	Heart,
	Award,
	RefreshCw,
} from "lucide-react";
import SchoolSetupPromptModal from "../school-setup/components/SchoolSetupPromptModal";
import { useSchoolSetupStore } from "../school-setup/store/schoolSetupStore";
import { useDashboardStats } from "../hooks/useDashboardStats";

// Updated Stat Card Component to match design
const StatCard = ({
	icon: Icon,
	label,
	value,
	subtext,
	iconColor,
	loading = false,
}: {
	icon: any;
	label: string;
	value: string | number;
	subtext?: string;
	iconColor: string;
	loading?: boolean;
}) => (
	<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
		<div className="flex items-center justify-between">
			<div className="flex-1">
				<div className="flex items-center gap-3 mb-3">
					<div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
						<Icon className={`w-4 h-4 ${iconColor}`} />
					</div>
					<p className="text-sm text-gray-600">{label}</p>
				</div>
				{loading ? (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
						<div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
					</div>
				) : (
					<p className="text-2xl font-bold text-gray-900">{value}</p>
				)}
				{subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
			</div>
		</div>
	</div>
);

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

export default function AdminDashboard() {
	const { user } = useAuthStore();
	const { isCompleted: isSchoolSetupCompleted } = useSchoolSetupStore();
	const [showSetupPrompt, setShowSetupPrompt] = useState(false);
	const { stats, loading, error, refetch } = useDashboardStats();

	useEffect(() => {
		// Show setup prompt if school setup is not completed
		if (!isSchoolSetupCompleted && user?.role === "ADMIN") {
			setShowSetupPrompt(true);
		}
	}, [isSchoolSetupCompleted, user]);

	return (
		<div className="space-y-6">
			{/* Top Welcome/Registration Card */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-xl font-semibold text-gray-900">
						Welcome {user?.fullName?.split(" ")[0]}, complete your school registration.
					</h1>
					<div className="flex items-center gap-3">
						{error && (
							<div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">
								Failed to load statistics
							</div>
						)}
						<button
							onClick={refetch}
							disabled={loading}
							className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
							<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
							Refresh
						</button>
					</div>
				</div>

				{/* Continue Registration Section */}
				{!isSchoolSetupCompleted && (
					<div className="bg-white rounded-lg border border-gray-200 p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
									<School className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">
										Continue registration
									</h3>
									<p className="text-sm text-gray-500">
										Complete your school setup to access all features
									</p>
								</div>
							</div>
							<button
								onClick={() => setShowSetupPrompt(true)}
								className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
								Continue
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
				{/* Left Column - Main Content (7/10) */}
				<div className="lg:col-span-7">

					{/* Overview Section */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-6">
							Overview
						</h2>

						{/* School Stats */}
						<div className="mb-8">
							<h3 className="text-sm font-medium text-gray-700 mb-4">School</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<StatCard
									icon={Award}
									label="Current session"
									value="--"
									iconColor="text-red-500"
								/>
								<StatCard
									icon={Calendar}
									label="Current term"
									value="--"
									iconColor="text-orange-500"
								/>
								<StatCard
									icon={TrendingUp}
									label="Progress"
									value="--"
									iconColor="text-yellow-500"
								/>
							</div>
						</div>

						{/* Users Stats */}
						<div className="mb-8">
							<h3 className="text-sm font-medium text-gray-700 mb-4">Users</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<StatCard
									icon={Users}
									label="Total users"
									value={stats?.totalUsers ?? "--"}
									iconColor="text-red-500"
									loading={loading}
								/>
								<StatCard
									icon={UserCheck}
									label="Active users"
									value={stats?.activeUsers ?? "--"}
									subtext="(last 7 days)"
									iconColor="text-green-500"
									loading={loading}
								/>
								<StatCard
									icon={GraduationCap}
									label="Total students"
									value={stats?.totalStudents ?? "--"}
									iconColor="text-red-500"
									loading={loading}
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
								<StatCard
									icon={Users}
									label="Total teachers"
									value={stats?.totalTeachers ?? "--"}
									iconColor="text-red-500"
									loading={loading}
								/>
								<StatCard
									icon={Heart}
									label="Total parents"
									value={stats?.totalParents ?? "--"}
									iconColor="text-red-500"
									loading={loading}
								/>
								<StatCard
									icon={UserPlus}
									label="New registration"
									value={stats?.newRegistrations ?? "--"}
									subtext="(last 30 days)"
									iconColor="text-red-500"
									loading={loading}
								/>
							</div>
						</div>

						{/* Classroom Stats */}
						<div>
							<h3 className="text-sm font-medium text-gray-700 mb-4">
								Classroom
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<StatCard
									icon={BookOpen}
									label="Total classes"
									value={stats?.totalClasses ?? "--"}
									iconColor="text-red-500"
									loading={loading}
								/>
								<StatCard
									icon={Users}
									label="Active learners"
									value={stats?.activeLearners ?? "--"}
									subtext="(last 7 days)"
									iconColor="text-green-500"
									loading={loading}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Activity Sidebar (3/10) */}
				<div className="lg:col-span-3 space-y-6">
					{/* Recent Activities */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[400px] flex flex-col">
						<div className="p-4 border-b border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900">Recent activities</h2>
						</div>
						<div className="p-4 flex-1 flex items-center justify-center">
							<EmptyState
								title="No recent activities yet"
								description=""
								illustration="/assets/activity-empty.svg"
							/>
						</div>
					</div>

					{/* Events */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[400px] flex flex-col">
						<div className="p-4 border-b border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900">Events</h2>
						</div>
						<div className="p-4 flex-1 flex items-center justify-center">
							<EmptyState
								title="No upcoming event"
								description=""
								illustration="/assets/events-empty.svg"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* School Setup Prompt Modal */}
			<SchoolSetupPromptModal
				isOpen={showSetupPrompt}
				onClose={() => setShowSetupPrompt(false)}
			/>
		</div>
	);
}
