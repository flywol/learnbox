import type { RecentClass } from "../types/dashboard.types";

interface Props {
	classes: RecentClass[];
}

// Helper function to convert light bg color to bold progress bar color
const getProgressBarColor = (bgColor: string): string => {
	const colorMap: Record<string, string> = {
		"bg-green-100": "bg-green-600",
		"bg-red-100": "bg-red-600",
		"bg-blue-100": "bg-blue-600",
		"bg-purple-100": "bg-purple-600",
		"bg-teal-100": "bg-teal-600",
		"bg-lime-100": "bg-lime-600",
		"bg-indigo-100": "bg-indigo-600",
		"bg-orange-100": "bg-orange-600",
		"bg-rose-100": "bg-rose-600",
		"bg-cyan-100": "bg-cyan-600",
		"bg-pink-100": "bg-pink-600",
	};
	return colorMap[bgColor] || "bg-orange-500";
};

export default function RecentClassesSection({ classes }: Props) {
	return (
		<div className="bg-white rounded-2xl p-6 shadow-sm">
			<h2 className="text-xl font-bold text-gray-900 mb-6">
				Recent classes
			</h2>

			<div className="space-y-4">
				{classes.map((classItem) => {
					const progressBarColor = getProgressBarColor(classItem.color);

					return (
						<div
							key={classItem.id}
							className={`${classItem.color} rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer`}>
							{/* Icon */}
							<div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
								{classItem.subjectIcon}
							</div>

							{/* Content */}
							<div className="flex-1 min-w-0">
								{/* Subject Name */}
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-semibold text-gray-900 truncate">
										{classItem.subjectName}
									</h3>
									<span className="text-sm font-medium text-gray-700 ml-2">
										{classItem.progress}%
									</span>
								</div>

								{/* Progress Bar */}
								<div className="w-full bg-white/50 rounded-full h-2.5 mb-2">
									<div
										className={`${progressBarColor} h-2.5 rounded-full transition-all duration-300`}
										style={{ width: `${classItem.progress}%` }}
									/>
								</div>

								{/* Lesson Info */}
								<div className="flex items-center justify-between text-xs text-gray-700">
									<span>
										Lesson {classItem.lessonNumber}/{classItem.totalLessons}
									</span>
									<span className="text-gray-600">
										{classItem.lastAccessed}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
