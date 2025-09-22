// src/features/dashboard/pages/TeacherDashboard.tsx - Simple static teacher page
import { useCurrentUser } from "@/features/auth/store/authStore";

const TeacherDashboard = () => {
	const user = useCurrentUser();

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						Welcome back, {user?.fullName || 'Teacher'}!
					</h1>
					<p className="text-gray-600">
						Here's your teaching dashboard with everything you need.
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">My Students</p>
								<p className="text-2xl font-bold text-gray-900">45</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
								<span className="text-blue-600 text-xl">👥</span>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">My Classes</p>
								<p className="text-2xl font-bold text-gray-900">3</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
								<span className="text-green-600 text-xl">📚</span>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Assignments</p>
								<p className="text-2xl font-bold text-gray-900">12</p>
							</div>
							<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
								<span className="text-purple-600 text-xl">📝</span>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
							<span className="text-2xl mb-2 block">📊</span>
							<span className="text-sm text-gray-700">View Grades</span>
						</button>
						<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
							<span className="text-2xl mb-2 block">📅</span>
							<span className="text-sm text-gray-700">Schedule</span>
						</button>
						<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
							<span className="text-2xl mb-2 block">💬</span>
							<span className="text-sm text-gray-700">Messages</span>
						</button>
						<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
							<span className="text-2xl mb-2 block">📋</span>
							<span className="text-sm text-gray-700">Reports</span>
						</button>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
					<div className="space-y-3">
						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
							<span className="text-blue-600 text-lg">📚</span>
							<div>
								<p className="text-sm font-medium text-gray-900">Mathematics Quiz Submitted</p>
								<p className="text-xs text-gray-600">23 students submitted - 2 hours ago</p>
							</div>
						</div>
						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
							<span className="text-green-600 text-lg">✅</span>
							<div>
								<p className="text-sm font-medium text-gray-900">Assignment Graded</p>
								<p className="text-xs text-gray-600">Science homework - 5 hours ago</p>
							</div>
						</div>
						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
							<span className="text-purple-600 text-lg">👋</span>
							<div>
								<p className="text-sm font-medium text-gray-900">New Student Enrolled</p>
								<p className="text-xs text-gray-600">John Doe joined your class - Yesterday</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeacherDashboard;