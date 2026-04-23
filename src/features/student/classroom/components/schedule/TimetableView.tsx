import { useEffect, useState } from 'react';
import { ChevronsRight } from 'lucide-react';
import { studentApiClient, subjectMeta } from '@/features/student/api/studentApiClient';

interface TimetableSlot {
	day: string;
	time: string;
	subjectName: string;
	duration: string;
	icon: string;
}

const TIME_SLOTS = ['08:00am', '09:00am', '10:00am', '11:00am', '12:00pm', '01:00pm', '02:00pm', '03:00pm'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function normalizeTime(t: string): string {
	if (!t) return '';
	// Handles "08:00", "08:00am", "8:00 AM" → "08:00am"
	const m = t.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
	if (!m) return t.toLowerCase();
	const [, h, min, period] = m;
	const hr = h.padStart(2, '0');
	const p = period ? period.toLowerCase() : (parseInt(h) >= 12 ? 'pm' : 'am');
	return `${hr}:${min}${p}`;
}

function normalizeDay(d: string): string {
	return d ? d.charAt(0).toUpperCase() + d.slice(1).toLowerCase() : d;
}

export default function TimetableView() {
	const [slots, setSlots] = useState<Record<string, TimetableSlot>>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		studentApiClient.getTimetable().then((raw) => {
			const map: Record<string, TimetableSlot> = {};
			raw.forEach((item: any) => {
				const day = normalizeDay(item.day ?? item.dayOfWeek ?? '');
				const time = normalizeTime(item.time ?? item.startTime ?? item.period ?? '');
				if (!day || !time) return;
				const name = item.subject?.name ?? item.subjectName ?? item.subject ?? '';
				const meta = subjectMeta(name);
				map[`${day}-${time}`] = {
					day,
					time,
					subjectName: name,
					duration: item.duration ?? item.classDuration ?? '',
					icon: meta.icon,
				};
			});
			setSlots(map);
		}).catch(() => {}).finally(() => setIsLoading(false));
	}, []);

	return (
		<div className="space-y-4">
			<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
				{/* Header */}
				<div className="grid grid-cols-6 gap-px bg-gray-100">
					<div className="p-4 bg-white font-semibold text-gray-900 text-sm">Time</div>
					{DAYS.map((day) => (
						<div key={day} className="p-4 bg-white font-semibold text-gray-900 text-sm text-center">
							{day}
						</div>
					))}
				</div>

				{/* Time Slots */}
				<div className="bg-gray-100 gap-px grid">
					{isLoading
						? Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="grid grid-cols-6 gap-px bg-gray-100">
									{Array.from({ length: 6 }).map((__, j) => (
										<div key={j} className="p-2 bg-white h-28 animate-pulse">
											<div className="w-full h-full bg-gray-100 rounded-xl" />
										</div>
									))}
								</div>
							))
						: TIME_SLOTS.map((time) => (
								<div key={time} className="grid grid-cols-6 gap-px bg-gray-100">
									<div className="p-4 bg-white font-medium text-gray-500 text-xs flex items-center gap-2">
										<span>{time}</span>
										<ChevronsRight className="w-3 h-3 text-gray-300" />
									</div>
									{DAYS.map((day) => {
										const subject = slots[`${day}-${time}`];
										return (
											<div key={`${day}-${time}`} className="p-2 bg-white h-28 flex items-center justify-center relative group">
												{subject ? (
													<div
														className="w-full h-full bg-orange-50/50 border border-orange-100 rounded-xl p-3 flex flex-col gap-2 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer group-hover:bg-orange-50"
														title={`${subject.subjectName}${subject.duration ? ' - ' + subject.duration : ''}`}
													>
														<div className="flex items-start justify-between">
															<div className="text-xl">{subject.icon}</div>
															{subject.duration && (
																<div className="text-[10px] font-semibold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">
																	{subject.duration}
																</div>
															)}
														</div>
														<div className="mt-auto">
															<div className="text-xs font-bold text-gray-900 leading-tight line-clamp-2">
																{subject.subjectName}
															</div>
														</div>
													</div>
												) : (
													<div className="w-full h-full rounded-xl border border-dashed border-gray-100 hover:border-gray-200 transition-colors" />
												)}
											</div>
										);
									})}
								</div>
							))}
				</div>
			</div>
		</div>
	);
}
