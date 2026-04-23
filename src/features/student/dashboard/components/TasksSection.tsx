import type { StudentTask } from "../types/dashboard.types";

interface TasksSectionProps {
	tasks: StudentTask[];
	completedCount: number;
	totalCount: number;
}

export default function TasksSection({
	tasks,
	completedCount,
	totalCount,
}: TasksSectionProps) {
	// Calculate progress for completed tasks circle
	const getCircleProps = (completed: number, total: number) => {
		const percentage = total > 0 ? (completed / total) * 100 : 0;
		const radius = 80;
		const circumference = 2 * Math.PI * radius;
		const offset = circumference - (percentage / 100) * circumference;
		return { radius, circumference, offset, percentage };
	};

	const circleProps = getCircleProps(completedCount, totalCount);

	const getTaskIcon = (type: string) => {
		switch (type) {
			case "live_class":
				return "🎥";
			case "assignment":
				return "📝";
			case "quiz":
				return "📊";
			case "exam":
				return "📖";
			default:
				return "📌";
		}
	};

	const getActionButton = (task: StudentTask) => {
		if (task.type === "live_class" && task.status === "in_progress") {
			return (
				<button className="px-4 py-2 bg-[#fd5d26] text-white rounded-lg text-sm font-semibold hover:bg-[#e84d17] transition-colors">
					Go
				</button>
			);
		}
		if (task.type === "assignment" || task.type === "quiz") {
			return (
				<button className="px-4 py-2 bg-[#fd5d26] text-white rounded-lg text-sm font-semibold hover:bg-[#e84d17] transition-colors">
					Go
				</button>
			);
		}
		return null;
	};

	return (
		<div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
			<h2 className="text-xl font-semibold text-[#4c4747] mb-4 md:mb-6">Tasks</h2>

			<div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 md:gap-6">
				{/* Left side - Completed tasks circle (60% width = 3/5 on desktop, full width on mobile) */}
				<div className="lg:col-span-2 bg-[#ffefe9] rounded-xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
					<div className="relative w-32 h-32 md:w-44 md:h-44 mb-4 md:mb-6">
						<svg className="transform -rotate-90 w-32 h-32 md:w-44 md:h-44">
							<circle
								cx="64"
								cy="64"
								r={circleProps.radius}
								stroke="#ffcfb5"
								strokeWidth="12"
								fill="none"
								className="md:hidden"
							/>
							<circle
								cx="64"
								cy="64"
								r={circleProps.radius}
								stroke="#fd5d26"
								strokeWidth="12"
								fill="none"
								strokeDasharray={circleProps.circumference}
								strokeDashoffset={circleProps.offset}
								strokeLinecap="round"
								className="md:hidden"
							/>
							<circle
								cx="88"
								cy="88"
								r={circleProps.radius}
								stroke="#ffcfb5"
								strokeWidth="14"
								fill="none"
								className="hidden md:block"
							/>
							<circle
								cx="88"
								cy="88"
								r={circleProps.radius}
								stroke="#fd5d26"
								strokeWidth="14"
								fill="none"
								strokeDasharray={circleProps.circumference}
								strokeDashoffset={circleProps.offset}
								strokeLinecap="round"
								className="hidden md:block"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-2xl md:text-4xl font-bold text-gray-900">
								{completedCount}/{totalCount}
							</span>
						</div>
					</div>
					<h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
						Completed Tasks
					</h3>
					<button className="px-4 md:px-6 py-2 bg-[#fd5d26] text-white rounded-lg text-sm font-semibold hover:bg-[#e84d17] transition-colors">
						Add a task
					</button>
				</div>

				{/* Right side - Task list (40% width = 2/5 on desktop, full width on mobile) */}
				<div className="lg:col-span-3 space-y-3">
					{tasks.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
							<div className="w-32 h-32 md:w-40 md:h-40 mb-3 md:mb-4 flex items-center justify-center">
								<svg
									className="w-24 h-24 md:w-32 md:h-32 text-gray-300"
									fill="currentColor"
									viewBox="0 0 24 24">
									<path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
								</svg>
							</div>
							<p className="text-sm md:text-base text-gray-600 font-medium">Nothing to do yet</p>
						</div>
					) : (
						<div className="space-y-2 md:space-y-3">
							{tasks.map((task) => (
								<div
									key={task.id}
									className="flex items-center justify-between p-3 md:p-4 border border-[#d6d6d6] rounded-xl hover:border-[#fd5d26]/40 transition-colors gap-2">
									<div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
										<span className="text-xl md:text-2xl flex-shrink-0">{getTaskIcon(task.type)}</span>
										<div className="min-w-0">
											<h4 className="text-sm md:text-base font-semibold text-gray-900 truncate">{task.title}</h4>
											<p className="text-xs md:text-sm text-gray-600 truncate">
												{task.subject}
												{task.dueDate && ` - Due in ${task.dueDate}`}
												{task.startTime && ` - ${task.startTime}`}
											</p>
										</div>
									</div>
									{getActionButton(task)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
