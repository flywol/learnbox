import type { RecentClass } from "../types/dashboard.types";

interface RecentClassesSectionProps {
	classes: RecentClass[];
}

export default function RecentClassesSection({ classes }: RecentClassesSectionProps) {
	// Helper function to darken a hex color for icon background (medium shade)
	const darkenColor = (hex: string, percent: number = 15): string => {
		hex = hex.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		const darkenValue = (value: number) => Math.floor(value * (1 - percent / 100));
		const newR = darkenValue(r);
		const newG = darkenValue(g);
		const newB = darkenValue(b);

		const toHex = (value: number) => value.toString(16).padStart(2, '0');
		return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
	};

	// Helper function to create deeper color for progress bar filled portion
	const deepenColor = (hex: string, percent: number = 25): string => {
		hex = hex.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		const darkenValue = (value: number) => Math.floor(value * (1 - percent / 100));
		const newR = darkenValue(r);
		const newG = darkenValue(g);
		const newB = darkenValue(b);

		const toHex = (value: number) => value.toString(16).padStart(2, '0');
		return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
	};

	// Helper function to lighten color for progress bar background
	const lightenColor = (hex: string, percent: number = 10): string => {
		hex = hex.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		const lightenValue = (value: number) => Math.min(255, Math.floor(value + (255 - value) * (percent / 100)));
		const newR = lightenValue(r);
		const newG = lightenValue(g);
		const newB = lightenValue(b);

		const toHex = (value: number) => value.toString(16).padStart(2, '0');
		return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
	};

	if (classes.length === 0) {
		return (
			<div className="bg-white rounded-2xl p-6 shadow-sm">
				<h2 className="text-xl font-bold text-gray-900 mb-6">Recent classes</h2>
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
		<div className="bg-white rounded-2xl p-6 shadow-sm">
			<h2 className="text-xl font-bold text-gray-900 mb-6">Recent classes</h2>
			<div className="space-y-3">
				{classes.map((classItem) => {
					const iconBgColor = darkenColor(classItem.color, 30);
					const progressBarFilled = deepenColor(classItem.color, 50);
					const progressBarBg = lightenColor(classItem.color, 20);

					return (
						<div
							key={classItem.id}
							className="rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
							style={{ backgroundColor: classItem.color }}>
							<div
								className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
								style={{ backgroundColor: iconBgColor }}
							>
								{classItem.subjectIcon}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-semibold text-gray-900 truncate">
										{classItem.subjectName}
									</h3>
									<span className="text-sm font-medium text-gray-700">
										{classItem.progress}%
									</span>
								</div>
								<div className="w-full rounded-full h-2 mb-2" style={{ backgroundColor: progressBarBg }}>
									<div
										className="h-2 rounded-full transition-all"
										style={{
											width: `${classItem.progress}%`,
											backgroundColor: progressBarFilled
										}}
									/>
								</div>
								<div className="flex items-center justify-between text-xs text-gray-600">
									<span>
										Lesson {classItem.lessonNumber}/{classItem.totalLessons}
									</span>
									<span>{classItem.lastAccessed}</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
