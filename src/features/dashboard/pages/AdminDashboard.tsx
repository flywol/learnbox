// src/features/dashboard/pages/AdminDashboard.tsx
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
} from "lucide-react";
import SchoolSetupPromptModal from "../school-setup/components/SchoolSetupPromptModal";
import { useSchoolSetupStore } from "../school-setup/store/schoolSetupStore";

// Stat Card Component
const StatCard = ({
	icon: Icon,
	label,
	value,
	subtext,
	iconBg,
}: {
	icon: any;
	label: string;
	value: string;
	subtext?: string;
	iconBg: string;
}) => (
	<div className="bg-white rounded-lg p-6 border border-gray-200">
		<div className="flex items-start justify-between">
			<div className="flex-1">
				<p className="text-sm text-gray-600 mb-1">{label}</p>
				<p className="text-2xl font-bold text-gray-900">{value}</p>
				{subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
			</div>
			<div className={`p-3 rounded-lg ${iconBg}`}>
				<Icon className="w-6 h-6" />
			</div>
		</div>
	</div>
);

// Empty State Component
const EmptyState = ({
	icon: Icon,
	title,
	description,
}: {
	icon: any;
	title: string;
	description: string;
}) => (
	<div className="flex flex-col items-center justify-center py-12">
		<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
			<Icon className="w-10 h-10 text-gray-400" />
		</div>
		<h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
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
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">
					Welcome {user?.fullName?.split(" ")[0]},{" "}
					{!isSchoolSetupCompleted && "complete your school registration."}
				</h1>
				{isSchoolSetupCompleted && (
					<p className="text-gray-600 mt-2">
						Here's an overview of your school
					</p>
				)}
			</div>

			{/* Continue Registration Card */}
			{!isSchoolSetupCompleted && (
				<div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
								<School className="w-6 h-6 text-orange-600" />
							</div>
							<div>
								<h3 className="font-semibold text-gray-900">
									Continue registration
								</h3>
								<p className="text-sm text-gray-600">
									Complete your school setup to access all features
								</p>
							</div>
						</div>
						<button
							onClick={() => setShowSetupPrompt(true)}
							className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
							Continue
						</button>
					</div>
				</div>
			)}

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column - Overview */}
				<div className="lg:col-span-2 space-y-8">
					{/* Overview Section */}
					<div>
						<h2 className="text-xl font-semibold mb-4">Overview</h2>

						{/* School Stats */}
						<div className="mb-6">
							<h3 className="text-sm font-medium text-gray-700 mb-3">School</h3>
							<div className="grid grid-cols-3 gap-4">
								<StatCard
									icon={School}
									label="Current session"
									value="--"
									iconBg="bg-red-50 text-red-600"
								/>
								<StatCard
									icon={Calendar}
									label="Current term"
									value="--"
									iconBg="bg-orange-50 text-orange-600"
								/>
								<StatCard
									icon={TrendingUp}
									label="Progress"
									value="--"
									iconBg="bg-yellow-50 text-yellow-600"
								/>
							</div>
						</div>

						{/* Users Stats */}
						<div className="mb-6">
							<h3 className="text-sm font-medium text-gray-700 mb-3">Users</h3>
							<div className="grid grid-cols-3 gap-4">
								<StatCard
									icon={Users}
									label="Total users"
									value="--"
									iconBg="bg-red-50 text-red-600"
								/>
								<StatCard
									icon={UserCheck}
									label="Active users"
									value="--"
									subtext="(last 7 days)"
									iconBg="bg-green-50 text-green-600"
								/>
								<StatCard
									icon={GraduationCap}
									label="Total students"
									value="--"
									iconBg="bg-red-50 text-red-600"
								/>
							</div>
							<div className="grid grid-cols-3 gap-4 mt-4">
								<StatCard
									icon={Users}
									label="Total teachers"
									value="--"
									iconBg="bg-red-50 text-red-600"
								/>
								<StatCard
									icon={Users}
									label="Total parents"
									value="--"
									iconBg="bg-red-50 text-red-600"
								/>
								<StatCard
									icon={UserPlus}
									label="New registration"
									value="--"
									subtext="(last 30 days)"
									iconBg="bg-red-50 text-red-600"
								/>
							</div>
						</div>

						{/* Classroom Stats */}
						<div>
							<h3 className="text-sm font-medium text-gray-700 mb-3">
								Classroom
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<StatCard
									icon={School}
									label="Total classes"
									value="--"
									iconBg="bg-red-50 text-red-600"
								/>
								<StatCard
									icon={Users}
									label="Active learners"
									value="--"
									subtext="(last 7 days)"
									iconBg="bg-green-50 text-green-600"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Activity */}
				<div className="space-y-8">
					{/* Recent Activities */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-lg font-semibold mb-4">Recent activities</h2>
						<EmptyState
							icon={Calendar}
							title="No recent activities yet"
							description="Activities will appear here once your school is fully set up"
						/>
					</div>

					{/* Events */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-lg font-semibold mb-4">Events</h2>
						<EmptyState
							icon={Calendar}
							title="No upcoming event"
							description="School events and important dates will be shown here"
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
