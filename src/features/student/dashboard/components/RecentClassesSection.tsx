import type { RecentClass } from "../types/dashboard.types";

interface RecentClassesSectionProps {
	classes: RecentClass[];
}

// Helper function to convert light bg color to bold progress bar color
const getProgressBarColor = (bgColor: string): string => {
	const colorMap: Record<string, string> = {
		'bg-green-100': 'bg-green-600',
		'bg-red-100': 'bg-red-600',
		'bg-blue-100': 'bg-blue-600',
		'bg-purple-100': 'bg-purple-600',
		'bg-teal-100': 'bg-teal-600',
		'bg-lime-100': 'bg-lime-600',
		'bg-indigo-100': 'bg-indigo-600',
		'bg-orange-100': 'bg-orange-600',
		'bg-rose-100': 'bg-rose-600',
		'bg-cyan-100': 'bg-cyan-600',
		'bg-pink-100': 'bg-pink-600',
	};
	return colorMap[bgColor] || 'bg-orange-500';
};

export default function RecentClassesSection({ classes }: RecentClassesSectionProps) {
	if (classes.length === 0) {
		return (
			<div className="bg-white rounded-2xl p-6 shadow-sm">
				<h2 className="text-xl font-bold text-[#343434] mb-6">Recent classes</h2>
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<div className="w-48 h-48 mb-4 flex items-center justify-center">
						<svg
							className="w-40 h-40 text-gray-300"
							fill="currentColor"
							viewBox="0 0 24 24">
							<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
						</svg>
					</div>
					<p className="text-gray-600 font-medium">No recent class yet</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
			<h2 className="text-lg md:text-xl font-bold text-[#343434] mb-4 md:mb-6">Recent classes</h2>
			<div className="space-y-2 md:space-y-3">
				{classes.map((classItem) => {
					const progressBarColor = getProgressBarColor(classItem.color);

					return (
						<div
							key={classItem.id}
							className={`${classItem.color} rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow cursor-pointer`}>
							<div className="w-10 h-10 md:w-12 md:h-12 bg-white/40 rounded-full flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
								{classItem.subjectIcon}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between mb-1 md:mb-2">
									<h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
										{classItem.subjectName}
									</h3>
									<span className="text-xs md:text-sm font-medium text-gray-700 flex-shrink-0 ml-2">
										{classItem.progress}%
									</span>
								</div>
								<div className="w-full bg-white/50 rounded-full h-1.5 md:h-2 mb-1 md:mb-2">
									<div
										className={`${progressBarColor} h-1.5 md:h-2 rounded-full transition-all`}
										style={{ width: `${classItem.progress}%` }}
									/>
								</div>
								<div className="flex items-center justify-between text-xs text-gray-600">
									<span className="truncate">
										Lesson {classItem.lessonNumber}/{classItem.totalLessons}
									</span>
									<span className="flex-shrink-0 ml-2">{classItem.lastAccessed}</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
