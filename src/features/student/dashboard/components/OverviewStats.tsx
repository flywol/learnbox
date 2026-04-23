import type { StudentOverviewStats } from "../types/dashboard.types";

interface OverviewStatsProps {
	stats: StudentOverviewStats;
}

export default function OverviewStats({ stats }: OverviewStatsProps) {
	const { classAttendance, assignments, testScores } = stats;

	// Function to calculate SVG circle properties for progress ring
	const getCircleProps = (percentage: number) => {
		const radius = 60;
		const circumference = 2 * Math.PI * radius;
		const offset = circumference - (percentage / 100) * circumference;
		return { radius, circumference, offset };
	};

	const attendanceCircle = getCircleProps(classAttendance.percentage);
	const assignmentCircle = getCircleProps(assignments.completionRate);
	const testScoreCircle = getCircleProps(testScores.averageScore);

	return (
		<div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
			<h2 className="text-xl font-semibold text-[#343434] mb-4 md:mb-6">Overview</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
				{/* Class Attendance */}
				<div
					className="bg-[#eaf9e8] rounded-xl p-6 flex flex-col items-center bg-cover bg-center bg-no-repeat overflow-hidden relative"
					style={{ backgroundImage: "url(/images/student/attendancebg.svg)" }}
				>
					<div className="relative w-36 h-36 mb-4">
						<svg className="transform -rotate-90 w-36 h-36">
							<circle
								cx="72"
								cy="72"
								r={attendanceCircle.radius}
								stroke="#E5E7EB"
								strokeWidth="12"
								fill="none"
							/>
							<circle
								cx="72"
								cy="72"
								r={attendanceCircle.radius}
								stroke="#22c55e"
								strokeWidth="12"
								fill="none"
								strokeDasharray={attendanceCircle.circumference}
								strokeDashoffset={attendanceCircle.offset}
								strokeLinecap="round"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-3xl font-bold text-gray-900">
								{classAttendance.percentage}%
							</span>
						</div>
					</div>
					<h3 className="text-lg font-bold text-[#2b2b2b] mb-2 text-center">
						Class Attendance
					</h3>
					<div className="text-sm text-[#2b2b2b] text-center space-y-1">
						<p>
							Total classes:{" "}
							<span className="font-medium">
								{classAttendance.totalClasses === 0
									? "--"
									: classAttendance.totalClasses}
							</span>
						</p>
						<p>
							Attended:{" "}
							<span className="font-medium">
								{classAttendance.attended === 0 ? "--" : classAttendance.attended}
							</span>
						</p>
						<p>
							Missed:{" "}
							<span className="font-medium">
								{classAttendance.missed === 0 ? "--" : classAttendance.missed}
							</span>
						</p>
					</div>
				</div>

				{/* Assignment */}
				<div
					className="bg-[#fff4b1] rounded-xl p-6 flex flex-col items-center bg-cover bg-center bg-no-repeat overflow-hidden relative"
					style={{ backgroundImage: "url(/images/student/assignmentbg.svg)" }}
				>
					<div className="relative w-36 h-36 mb-4">
						<svg className="transform -rotate-90 w-36 h-36">
							<circle
								cx="72"
								cy="72"
								r={assignmentCircle.radius}
								stroke="#E5E7EB"
								strokeWidth="12"
								fill="none"
							/>
							<circle
								cx="72"
								cy="72"
								r={assignmentCircle.radius}
								stroke="#eab308"
								strokeWidth="12"
								fill="none"
								strokeDasharray={assignmentCircle.circumference}
								strokeDashoffset={assignmentCircle.offset}
								strokeLinecap="round"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-3xl font-bold text-gray-900">
								{assignments.completed}/{assignments.total === 0 ? "0" : assignments.total}
							</span>
						</div>
					</div>
					<h3 className="text-lg font-bold text-[#2b2b2b] mb-2 text-center">Assignment</h3>
					<div className="text-sm text-[#2b2b2b] text-center space-y-1">
						<p>
							Total assignments:{" "}
							<span className="font-medium">
								{assignments.total === 0 ? "--" : assignments.total}
							</span>
						</p>
						<p>
							Completed:{" "}
							<span className="font-medium">
								{assignments.completed === 0 ? "--" : assignments.completed}
							</span>
						</p>
						<p>
							Pending:{" "}
							<span className="font-medium">
								{assignments.pending === 0 ? "--" : assignments.pending}
							</span>
						</p>
					</div>
				</div>

				{/* Average Test Score */}
				<div
					className="bg-[#e9eeff] rounded-xl p-6 flex flex-col items-center bg-cover bg-center bg-no-repeat overflow-hidden relative"
					style={{ backgroundImage: "url(/images/student/testbg.svg)" }}
				>
					<div className="relative w-36 h-36 mb-4">
						<svg className="transform -rotate-90 w-36 h-36">
							<circle
								cx="72"
								cy="72"
								r={testScoreCircle.radius}
								stroke="#E5E7EB"
								strokeWidth="12"
								fill="none"
							/>
							<circle
								cx="72"
								cy="72"
								r={testScoreCircle.radius}
								stroke="#6366f1"
								strokeWidth="12"
								fill="none"
								strokeDasharray={testScoreCircle.circumference}
								strokeDashoffset={testScoreCircle.offset}
								strokeLinecap="round"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-3xl font-bold text-gray-900">
								{testScores.averageScore}%
							</span>
						</div>
					</div>
					<h3 className="text-lg font-bold text-[#2b2b2b] mb-2 text-center">
						Average Test Score
					</h3>
					<div className="text-sm text-[#2b2b2b] text-center space-y-1">
						<p>
							Total tests:{" "}
							<span className="font-medium">
								{testScores.totalTests === 0 ? "--" : testScores.totalTests}
							</span>
						</p>
						<p>
							Completed:{" "}
							<span className="font-medium">
								{testScores.completed === 0 ? "--" : testScores.completed}
							</span>
						</p>
						<p>
							Pending:{" "}
							<span className="font-medium">
								{testScores.pending === 0 ? "--" : testScores.pending}
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
