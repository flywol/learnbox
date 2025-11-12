import type { OverviewStats as OverviewStatsType } from "../types/dashboard.types";

interface Props {
	stats: OverviewStatsType;
}

export default function OverviewStats({ stats }: Props) {
	const { classAttendance, assignments, testScores } = stats;

	// Calculate circular progress strokeDasharray values
	const getCircularProgress = (percentage: number) => {
		const radius = 32;
		const circumference = 2 * Math.PI * radius;
		const progress = (percentage / 100) * circumference;
		return { circumference, progress };
	};

	const attendanceCircle = getCircularProgress(classAttendance.percentage);
	const testScoreCircle = getCircularProgress(testScores.averageScore);

	return (
		<div className="bg-white rounded-lg p-6 border border-gray-200">
			<h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Class Attendance - Green */}
				<div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
					{/* Circular Progress */}
					<div className="relative w-24 h-24 mb-3">
						<svg className="w-24 h-24 transform -rotate-90">
							{/* Background circle */}
							<circle
								cx="48"
								cy="48"
								r="32"
								stroke="#D1FAE5"
								strokeWidth="8"
								fill="none"
							/>
							{/* Progress circle */}
							<circle
								cx="48"
								cy="48"
								r="32"
								stroke="#10B981"
								strokeWidth="8"
								fill="none"
								strokeDasharray={`${attendanceCircle.progress} ${attendanceCircle.circumference}`}
								strokeLinecap="round"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-xl font-bold text-gray-900">
								{classAttendance.percentage}
								<span className="text-sm">%</span>
							</span>
						</div>
					</div>

					{/* Label */}
					<h3 className="text-sm font-semibold text-gray-900 mb-2">
						Class Attendance
					</h3>

					{/* Stats */}
					<div className="text-xs text-gray-600 text-center space-y-1">
						<p>Total classes: {classAttendance.totalClasses}</p>
						<p>Attended: {classAttendance.attended}</p>
						<p>Missed: {classAttendance.missed}</p>
					</div>
				</div>

				{/* Assignment - Yellow */}
				<div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center">
					{/* Fraction Display */}
					<div className="relative w-24 h-24 mb-3 flex items-center justify-center">
						<div className="text-center">
							<div className="text-4xl font-bold text-gray-900">
								{assignments.completed}
							</div>
							<div className="w-12 h-0.5 bg-gray-900 mx-auto my-1"></div>
							<div className="text-4xl font-bold text-gray-900">
								{assignments.total}
							</div>
						</div>
					</div>

					{/* Label */}
					<h3 className="text-sm font-semibold text-gray-900 mb-2">
						Assignment
					</h3>

					{/* Stats */}
					<div className="text-xs text-gray-600 text-center space-y-1">
						<p>Total assignments: {assignments.total}</p>
						<p>Completed: {assignments.completed}</p>
						<p>Pending: {assignments.pending}</p>
					</div>
				</div>

				{/* Average Test Score - Blue */}
				<div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
					{/* Circular Progress */}
					<div className="relative w-24 h-24 mb-3">
						<svg className="w-24 h-24 transform -rotate-90">
							{/* Background circle */}
							<circle
								cx="48"
								cy="48"
								r="32"
								stroke="#DBEAFE"
								strokeWidth="8"
								fill="none"
							/>
							{/* Progress circle */}
							<circle
								cx="48"
								cy="48"
								r="32"
								stroke="#3B82F6"
								strokeWidth="8"
								fill="none"
								strokeDasharray={`${testScoreCircle.progress} ${testScoreCircle.circumference}`}
								strokeLinecap="round"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-xl font-bold text-gray-900">
								{testScores.averageScore}
								<span className="text-sm">%</span>
							</span>
						</div>
					</div>

					{/* Label */}
					<h3 className="text-sm font-semibold text-gray-900 mb-2">
						Average Test Score
					</h3>

					{/* Stats */}
					<div className="text-xs text-gray-600 text-center space-y-1">
						<p>Total tests: {testScores.totalTests}</p>
						<p>Completed: {testScores.completed}</p>
						<p>Pending: {testScores.pending}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
