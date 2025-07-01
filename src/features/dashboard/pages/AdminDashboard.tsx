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
} from "lucide-react";
import SchoolSetupPromptModal from "../school-setup/components/SchoolSetupPromptModal";
import { useSchoolSetupStore } from "../school-setup/store/schoolSetupStore";

// Updated Stat Card Component to match design
const StatCard = ({
	icon: Icon,
	label,
	value,
	subtext,
	iconColor,
}: {
	icon: any;
	label: string;
	value: string;
	subtext?: string;
	iconColor: string;
}) => (
	<div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
		<div className="flex items-center justify-between">
			<div className="flex-1">
				<div className="flex items-center gap-3 mb-2">
					<Icon className={`w-5 h-5 ${iconColor}`} />
					<p className="text-sm text-gray-600">{label}</p>
				</div>
				<p className="text-2xl font-bold text-gray-900">{value}</p>
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
			<div className="w-24 h-24 mb-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
				<span className="text-2xl">{illustration}</span>
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

	useEffect(() => {
		// Show setup prompt if school setup is not completed
		if (!isSchoolSetupCompleted && user?.role === "ADMIN") {
			setShowSetupPrompt(true);
		}
	}, [isSchoolSetupCompleted, user]);

	return (
		<div className="p-6 bg-gray-50 min-h-full">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-gray-900">
					Welcome {user?.fullName?.split(" ")[0]},{" "}
					{!isSchoolSetupCompleted && "complete your school registration."}
				</h1>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
				{/* Left Column - Main Content (3/4) */}
				<div className="xl:col-span-3 space-y-6">
					{/* Continue Registration Card */}
					{!isSchoolSetupCompleted && (
						<div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
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

					{/* Overview Section */}
					<div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
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
									value="--"
									iconColor="text-red-500"
								/>
								<StatCard
									icon={UserCheck}
									label="Active users"
									value="--"
									subtext="(last 7 days)"
									iconColor="text-green-500"
								/>
								<StatCard
									icon={GraduationCap}
									label="Total students"
									value="--"
									iconColor="text-red-500"
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
								<StatCard
									icon={Users}
									label="Total teachers"
									value="--"
									iconColor="text-red-500"
								/>
								<StatCard
									icon={Heart}
									label="Total parents"
									value="--"
									iconColor="text-red-500"
								/>
								<StatCard
									icon={UserPlus}
									label="New registration"
									value="--"
									subtext="(last 30 days)"
									iconColor="text-red-500"
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
									value="--"
									iconColor="text-red-500"
								/>
								<StatCard
									icon={Users}
									label="Active learners"
									value="--"
									subtext="(last 7 days)"
									iconColor="text-green-500"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Activity Sidebar (1/4) */}
				<div className="space-y-6">
					{/* Recent Activities */}
					<div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Recent activities
						</h2>
						<EmptyState
							title="No recent activities yet"
							description="Activities will appear here once your school is fully set up"
							illustration="⚡"
						/>
					</div>

					{/* Events */}
					<div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Events</h2>
						<EmptyState
							title="No upcoming event"
							description="School events and important dates will be shown here"
							illustration="📅"
						/>
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
