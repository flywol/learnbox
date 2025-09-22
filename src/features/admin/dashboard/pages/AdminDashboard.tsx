// src/features/dashboard/pages/AdminDashboard.tsx - Redesigned to match target design
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
import { useDashboardStats } from "../hooks/useDashboardStats";
import EventsSection from "../components/EventsSection";

// Action Card Component for top suggestions
const ActionCard = ({
	iconSrc,
	title,
	description,
	onClick,
}: {
	iconSrc: string;
	title: string;
	description: string;
	onClick: () => void;
}) => (
	<div 
		className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
		onClick={onClick}
	>
		<div className="flex items-start gap-3 mb-3">
			<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
				<img src={iconSrc} alt={title} className="w-5 h-5" />
			</div>
			<div className="flex-1 min-w-0">
				<h3 className="font-medium text-gray-900 mb-1">{title}</h3>
				<p className="text-sm text-gray-600 leading-relaxed">{description}</p>
			</div>
		</div>
		<button className="w-full py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
			Start
		</button>
	</div>
);

// Updated Stat Card Component to match design
const StatCard = ({
	icon: Icon,
	label,
	value,
	subtext,
	iconColor,
	loading = false,
}: {
	icon: React.ComponentType<{ className?: string }>;
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
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { isCompleted: isSchoolSetupCompleted } = useSchoolSetupStore();
	const [showSetupPrompt, setShowSetupPrompt] = useState(false);
	const { stats, loading } = useDashboardStats();

	useEffect(() => {
		// Show setup prompt if school setup is not completed
		if (!isSchoolSetupCompleted && user?.role === "ADMIN") {
			setShowSetupPrompt(true);
		}
	}, [isSchoolSetupCompleted, user]);

	return (
		<div className="space-y-6">
			{/* Top Welcome Card */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h1 className="text-xl font-semibold text-gray-900 mb-6">
					Welcome {user?.fullName?.split(" ")[0]}, what do you want to do today?
				</h1>

				{/* Action Cards */}
				{isSchoolSetupCompleted ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<ActionCard
							iconSrc="/assets/add-new.svg"
							title="Add new user"
							description="Add students, teachers, or parents to your school"
							onClick={() => navigate("/user-management/create")}
						/>
						<ActionCard
							iconSrc="/assets/add-new2.svg"
							title="Add new subject"
							description="Add subjects and assign them to classes"
							onClick={() => {/* TODO: Implement add subject */}}
						/>
						<ActionCard
							iconSrc="/assets/add-new.svg"
							title="School payments"
							description="Manage fees, transactions, and payment records"
							onClick={() => navigate("/payments")}
						/>
						<ActionCard
							iconSrc="/assets/add-new2.svg"
							title="Session config"
							description="Set up academic sessions and terms"
							onClick={() => navigate("/profile/session-config")}
						/>
					</div>
				) : (
					/* Registration Prompt */
					<div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
									<Building2 className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">
										Complete your school registration
									</h3>
									<p className="text-sm text-gray-600">
										Set up your school profile, classes, and academic sessions
									</p>
								</div>
							</div>
							<button
								onClick={() => setShowSetupPrompt(true)}
								className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
								Continue Setup
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
						<div className="flex-1 overflow-y-auto">
							<EventsSection />
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
