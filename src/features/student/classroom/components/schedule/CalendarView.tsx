import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { studentApiClient } from '@/features/student/api/studentApiClient';

interface CalEvent {
	id: string;
	date: string; // YYYY-MM-DD
	description: string;
	type: string;
}

function toYMD(raw: string): string {
	if (!raw) return '';
	// Handle "DD/MM/YYYY"
	if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
		const [d, m, y] = raw.split('/');
		return `${y}-${m}-${d}`;
	}
	// Handle ISO or other parseable dates
	try {
		const d = new Date(raw);
		if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
	} catch {}
	return '';
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarView() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [events, setEvents] = useState<CalEvent[]>([]);

	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	useEffect(() => {
		studentApiClient.getCalendar().then((raw) => {
			const mapped: CalEvent[] = raw.map((ev: any, i: number) => ({
				id: ev._id ?? ev.id ?? String(i),
				date: toYMD(ev.date ?? ev.startDate ?? ev.eventDate ?? ''),
				description: ev.title ?? ev.description ?? ev.name ?? 'Event',
				type: ev.type ?? 'event',
			})).filter((e: CalEvent) => e.date);
			setEvents(mapped);
		}).catch(() => {});
	}, []);

	const navigateMonth = (dir: 'prev' | 'next') => {
		setCurrentDate((prev) => {
			const d = new Date(prev);
			d.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1));
			return d;
		});
	};

	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

	const calendarDays: (number | null)[] = [
		...Array.from({ length: firstDayOfMonth }, () => null),
		...Array.from({ length: daysInMonth }, (_, i) => i + 1),
	];

	const getEventsForDay = (day: number) => {
		const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return events.filter((e) => e.date === dateStr);
	};

	const today = new Date();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<button
							onClick={() => navigateMonth('prev')}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<ChevronLeft className="w-5 h-5 text-gray-600" />
						</button>
						<h3 className="text-xl font-semibold min-w-[200px] text-center">
							{MONTH_NAMES[currentMonth]} {currentYear}
						</h3>
						<button
							onClick={() => navigateMonth('next')}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<ChevronRight className="w-5 h-5 text-gray-600" />
						</button>
					</div>
					<button
						onClick={() => setCurrentDate(new Date())}
						className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
					>
						Today
					</button>
				</div>
			</div>

			<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
				<div className="grid grid-cols-7 mb-2">
					{DAY_NAMES.map((day) => (
						<div key={day} className="p-2 text-center font-semibold text-gray-400 text-xs uppercase tracking-wider">
							{day.slice(0, 3)}
						</div>
					))}
				</div>

				<div className="grid grid-cols-7 gap-2">
					{calendarDays.map((day, index) => {
						if (!day) return <div key={index} className="h-32 bg-gray-50/50 rounded-xl" />;

						const dayEvents = getEventsForDay(day);
						const isToday =
							day === today.getDate() &&
							currentMonth === today.getMonth() &&
							currentYear === today.getFullYear();

						return (
							<div
								key={index}
								className={`p-2 h-32 rounded-xl border transition-all cursor-pointer flex flex-col group ${
									isToday
										? 'bg-orange-50/30 border-orange-200'
										: 'bg-white border-gray-100 hover:border-orange-200 hover:shadow-md'
								}`}
							>
								<div className="flex justify-between items-start mb-2">
									<span
										className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
											isToday ? 'bg-orange-500 text-white' : 'text-gray-700 group-hover:bg-gray-100'
										}`}
									>
										{day}
									</span>
									{dayEvents.length > 0 && (
										<span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">
											{dayEvents.length}
										</span>
									)}
								</div>

								<div className="space-y-1 overflow-y-auto custom-scrollbar">
									{dayEvents.map((event) => (
										<div
											key={event.id}
											className={`text-[10px] px-2 py-1 rounded-md truncate border ${
												event.type === 'assignment'
													? 'bg-blue-50 text-blue-700 border-blue-100'
													: event.type === 'class'
													? 'bg-green-50 text-green-700 border-green-100'
													: 'bg-purple-50 text-purple-700 border-purple-100'
											}`}
											title={event.description}
										>
											{event.description}
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
