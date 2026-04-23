import type { StudentEvent } from "../types/dashboard.types";

interface EventsSectionProps {
	events: StudentEvent[];
}

export default function EventsSection({ events }: EventsSectionProps) {
	if (events.length === 0) {
		return (
			<div className="bg-white rounded-2xl p-6 shadow-sm">
				<h2 className="text-xl font-bold text-[#343434] mb-6">Events</h2>
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<div className="w-48 h-48 mb-4 flex items-center justify-center">
						<svg
							className="w-40 h-40 text-gray-300"
							fill="currentColor"
							viewBox="0 0 24 24">
							<path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
						</svg>
					</div>
					<p className="text-gray-600 font-medium">No upcoming event</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
			<h2 className="text-lg md:text-xl font-bold text-[#343434] mb-4 md:mb-6">Events</h2>
			<div className="space-y-2 md:space-y-3 max-h-[400px] md:max-h-[500px] overflow-y-auto">
				{events.map((event) => (
					<div
						key={event.id}
						className="flex gap-3 md:gap-4 p-3 md:p-4 border border-[#eeeeee] rounded-xl hover:border-[#d6d6d6] transition-colors cursor-pointer">
						<div className="flex-shrink-0 text-center">
							<div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#fff8f5] flex flex-col items-center justify-center">
								<span className="text-xl md:text-2xl font-bold text-gray-900">
									{event.day}
								</span>
								<span className="text-xs text-gray-600">{event.month}</span>
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">{event.title}</h3>
							<p className="text-xs md:text-sm text-gray-600 line-clamp-2">
								{event.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
