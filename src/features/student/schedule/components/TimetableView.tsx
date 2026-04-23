import { useEffect, useState } from "react";
import { studentApiClient, subjectMeta } from "@/features/student/api/studentApiClient";

interface TimetableSlot {
	day: string;
	time: string;
	name: string;
	duration: string;
	borderColor: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const TIME_SLOTS = [
	"08:00am", "09:00am", "10:00am", "11:00am",
	"12:00pm", "01:00pm", "02:00pm", "03:00pm",
] as const;

const SUBJECT_BORDER_COLORS: Record<string, string> = {
	"further mathematics": "#cad6ff",
	"further maths": "#cad6ff",
	"mathematics": "#cad6ff",
	"english": "#a8e59f",
	"biology": "#fea181",
	"chemistry": "#ffe860",
	"physics": "#b2e7f9",
	"economics": "#b2f5ea",
	"history": "#e9d8fd",
	"computer science": "#fed7aa",
	"geography": "#c6f6d5",
	"agriculture": "#c6f6d5",
};

function normalizeTime(t: string): string {
	if (!t) return '';
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
				const border = SUBJECT_BORDER_COLORS[name.toLowerCase()] ?? '#e5e7eb';
				map[`${day}-${time}`] = {
					day, time, name,
					duration: item.duration ?? item.classDuration ?? '',
					borderColor: border,
				};
			});
			setSlots(map);
		}).catch(() => {}).finally(() => setIsLoading(false));
	}, []);

	return (
		<div className="overflow-x-auto">
			<div className="min-w-[700px]">
				{/* Day headers */}
				<div className="grid grid-cols-[160px_repeat(5,1fr)] mb-1">
					<div />
					{DAYS.map((day, i) => (
						<div
							key={day}
							className={`text-sm font-bold text-center pb-2 ${
								i === 0 ? "text-[#2b2b2b]" : "text-[#9f9d9d] font-normal"
							}`}
						>
							{day}
						</div>
					))}
				</div>

				{isLoading
					? Array.from({ length: 8 }).map((_, i) => (
							<div key={i}>
								<div className="h-px bg-[#eeeeee] w-full" />
								<div className="grid grid-cols-[160px_repeat(5,1fr)] py-2 min-h-[72px]">
									<div className="animate-pulse bg-gray-100 rounded h-5 w-20 mt-1" />
									{DAYS.map((d) => (
										<div key={d} className="px-1">
											{i % 2 === 0 && (
												<div className="w-full h-14 bg-gray-100 rounded-xl animate-pulse" />
											)}
										</div>
									))}
								</div>
							</div>
						))
					: TIME_SLOTS.map((time) => (
							<div key={time}>
								<div className="h-px bg-[#eeeeee] w-full" />
								<div className="grid grid-cols-[160px_repeat(5,1fr)] py-2 min-h-[72px]">
									<div className="flex items-start pt-1 gap-1 text-[#6b6b6b] text-base font-medium">
										{time}
									</div>
									{DAYS.map((day) => {
										const entry = slots[`${day}-${time}`];
										return (
											<div key={day} className="flex items-start justify-center px-1">
												{entry ? (
													<div
														className="w-full rounded-xl p-3 flex items-center gap-2 border cursor-pointer hover:shadow-sm transition-shadow"
														style={{ borderColor: entry.borderColor }}
													>
														<span className="text-lg flex-shrink-0">
															{subjectMeta(entry.name).icon}
														</span>
														<div className="min-w-0">
															<p className="text-sm font-bold text-[#343434] truncate leading-snug">
																{entry.name}
															</p>
															{entry.duration && (
																<p className="text-[10px] text-[#6b6b6b] font-medium leading-snug">
																	{entry.duration}
																</p>
															)}
														</div>
													</div>
												) : null}
											</div>
										);
									})}
								</div>
							</div>
						))}
				<div className="h-px bg-[#eeeeee] w-full" />
			</div>
		</div>
	);
}
