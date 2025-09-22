// src/features/teacher/classroom/pages/MyClassesPage.tsx
export default function MyClassesPage() {

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
				<p className="text-gray-600 mt-1">Manage your assigned classes and students</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Sample class cards */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">Mathematics</h3>
						<span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
							Grade 10
						</span>
					</div>
					<div className="space-y-2 text-sm text-gray-600">
						<p>📅 MWF 9:00 AM - 10:00 AM</p>
						<p>🏫 Room 101</p>
						<p>👥 25 students</p>
					</div>
					<div className="mt-4 pt-4 border-t border-gray-200">
						<button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
							View Details →
						</button>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">Physics</h3>
						<span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
							Grade 11
						</span>
					</div>
					<div className="space-y-2 text-sm text-gray-600">
						<p>📅 TTh 2:00 PM - 3:30 PM</p>
						<p>🏫 Lab 203</p>
						<p>👥 18 students</p>
					</div>
					<div className="mt-4 pt-4 border-t border-gray-200">
						<button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
							View Details →
						</button>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">Chemistry</h3>
						<span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
							Grade 12
						</span>
					</div>
					<div className="space-y-2 text-sm text-gray-600">
						<p>📅 MW 11:00 AM - 12:30 PM</p>
						<p>🏫 Lab 205</p>
						<p>👥 22 students</p>
					</div>
					<div className="mt-4 pt-4 border-t border-gray-200">
						<button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
							View Details →
						</button>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
						<span className="text-2xl mb-2 block">📝</span>
						<span className="text-sm text-gray-700">Create Assignment</span>
					</button>
					<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
						<span className="text-2xl mb-2 block">✅</span>
						<span className="text-sm text-gray-700">Mark Attendance</span>
					</button>
					<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
						<span className="text-2xl mb-2 block">📊</span>
						<span className="text-sm text-gray-700">Grade Assignments</span>
					</button>
					<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
						<span className="text-2xl mb-2 block">📋</span>
						<span className="text-sm text-gray-700">View Reports</span>
					</button>
				</div>
			</div>
		</div>
	);
}