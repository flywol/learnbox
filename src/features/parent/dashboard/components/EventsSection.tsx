import type { Event } from "../types/dashboard.types";

interface Props {
	events: Event[];
}

export default function EventsSection({ events }: Props) {
	if (events.length === 0) {
		return (
			<div className="bg-white rounded-2xl p-6 shadow-sm">
				<h2 className="text-xl font-bold text-gray-900 mb-6">Events</h2>
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
		<div className="bg-white rounded-2xl p-6 shadow-sm">
			<h2 className="text-xl font-bold text-gray-900 mb-6">Events</h2>
			<div className="space-y-3 max-h-[500px] overflow-y-auto">
				{events.map((event) => (
					<div
						key={event.id}
						className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
						<div className="flex-shrink-0 text-center">
							<div className="w-14 h-14 rounded-lg bg-orange-50 flex flex-col items-center justify-center">
								<span className="text-2xl font-bold text-gray-900">
									{event.day}
								</span>
								<span className="text-xs text-gray-600">{event.month}</span>
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
							<p className="text-sm text-gray-600 line-clamp-2">
								{event.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
