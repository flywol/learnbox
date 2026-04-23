import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const mockEvents: Record<string, string[]> = {
	"2025-10-03": ["Assignment deadline is today"],
	"2025-10-08": ["Physics live class"],
	"2025-10-11": ["Class trip"],
	"2025-10-10": ["Biology quiz due"],
	"2025-10-21": ["Physics live class"],
	"2025-10-27": ["Children's day"],
	"2025-10-31": ["Biology quiz due"],
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

export default function CalendarView() {
	const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));
	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();

	const navigateMonth = (dir: "prev" | "next") => {
		setCurrentDate((d) => {
			const n = new Date(d);
			n.setMonth(n.getMonth() + (dir === "next" ? 1 : -1));
			return n;
		});
	};

	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDay = new Date(year, month, 1).getDay();
	const prevMonthDays = new Date(year, month, 0).getDate();

	const dateKey = (d: number) =>
		`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

	const cells: { day: number; inMonth: boolean }[] = [];
	for (let i = firstDay - 1; i >= 0; i--) {
		cells.push({ day: prevMonthDays - i, inMonth: false });
	}
	for (let d = 1; d <= daysInMonth; d++) {
		cells.push({ day: d, inMonth: true });
	}
	const remaining = 7 - (cells.length % 7);
	if (remaining < 7) {
		for (let d = 1; d <= remaining; d++) {
			cells.push({ day: d, inMonth: false });
		}
	}

	return (
		<div>
			{/* Month navigation */}
			<div className="flex items-center gap-4 mb-4">
				<button
					onClick={() => navigateMonth("prev")}
					className="p-1.5 hover:bg-[#eeeeee] rounded-lg transition-colors"
				>
					<ChevronLeft className="w-5 h-5 text-[#6b6b6b]" />
				</button>
				<span className="text-base font-semibold text-[#2b2b2b] min-w-[160px] text-center">
					{MONTH_NAMES[month]} {year}
				</span>
				<button
					onClick={() => navigateMonth("next")}
					className="p-1.5 hover:bg-[#eeeeee] rounded-lg transition-colors"
				>
					<ChevronRight className="w-5 h-5 text-[#6b6b6b]" />
				</button>
			</div>

			{/* Calendar grid */}
			<div className="grid grid-cols-7">
				{/* Day headers */}
				{DAY_NAMES.map((d) => (
					<div key={d} className="py-2 text-center text-sm text-[#6b6b6b] font-normal border-b border-[#eeeeee]">
						{d}
					</div>
				))}

				{/* Day cells */}
				{cells.map((cell, i) => {
					const key = cell.inMonth ? dateKey(cell.day) : "";
					const events = key ? (mockEvents[key] ?? []) : [];
					const hasEvent = events.length > 0;

					return (
						<div
							key={i}
							className={`min-h-[90px] p-2 border-b border-r border-[#eeeeee] ${
								cell.inMonth ? "bg-[#fff8f5]" : "bg-white"
							}`}
						>
							<span
								className={`text-sm font-medium leading-none ${
									!cell.inMonth
										? "text-[#c4c4c4]"
										: hasEvent
										? "text-[#fd5d26]"
										: "text-[#2b2b2b]"
								}`}
							>
								{cell.day}
							</span>
							<div className="mt-1.5 space-y-1">
								{events.map((evt, ei) => (
									<p key={ei} className="text-xs text-[#6b6b6b] leading-snug">
										{evt}
									</p>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
