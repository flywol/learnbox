type SubjectEntry = {
	name: string;
	duration: string;
	borderColor: string;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

const TIME_SLOTS = [
	"08:00am", "09:00am", "10:00am", "11:00am",
	"12:00pm", "01:00pm", "02:00pm", "03:00pm",
] as const;

const TIMETABLE: Record<string, SubjectEntry> = {
	"Monday-08:00am":    { name: "Further M...", duration: "1hr",       borderColor: "#cad6ff" },
	"Tuesday-08:00am":   { name: "English",      duration: "1hr 30mins", borderColor: "#a8e59f" },
	"Wednesday-08:00am": { name: "Biology",       duration: "50mins",    borderColor: "#fea181" },
	"Friday-08:00am":    { name: "Chemistry",     duration: "50mins",    borderColor: "#ffe860" },

	"Tuesday-09:00am":   { name: "Further M...", duration: "1hr",       borderColor: "#cad6ff" },
	"Thursday-09:00am":  { name: "Further M...", duration: "1hr",       borderColor: "#cad6ff" },

	"Monday-10:00am":    { name: "English",      duration: "1hr 30mins", borderColor: "#a8e59f" },
	"Wednesday-10:00am": { name: "Chemistry",    duration: "50mins",    borderColor: "#ffe860" },
	"Friday-10:00am":    { name: "Further M...", duration: "1hr",       borderColor: "#cad6ff" },

	"Tuesday-11:00am":   { name: "Further M...", duration: "1hr",       borderColor: "#cad6ff" },
	"Thursday-11:00am":  { name: "Chemistry",    duration: "50mins",    borderColor: "#ffe860" },

	"Monday-12:00pm":    { name: "Chemistry",    duration: "50mins",    borderColor: "#ffe860" },
	"Wednesday-12:00pm": { name: "Further M...", duration: "1hr",       borderColor: "#cad6ff" },
	"Thursday-12:00pm":  { name: "Biology",      duration: "50mins",    borderColor: "#fea181" },

	"Tuesday-01:00pm":   { name: "English",      duration: "1hr 30mins", borderColor: "#a8e59f" },
	"Thursday-01:00pm":  { name: "English",      duration: "1hr 30mins", borderColor: "#a8e59f" },

	"Monday-02:00pm":    { name: "Biology",      duration: "50mins",    borderColor: "#fea181" },
	"Wednesday-02:00pm": { name: "Biology",      duration: "50mins",    borderColor: "#fea181" },

	"Tuesday-03:00pm":   { name: "Chemistry",    duration: "50mins",    borderColor: "#ffe860" },
	"Thursday-03:00pm":  { name: "Further M...", duration: "1hr",       borderColor: "#cad6ff" },
	"Friday-03:00pm":    { name: "Further M...", duration: "1hr",       borderColor: "#cad6ff" },

	"Monday-03:00pm":    { name: "English",      duration: "1hr 30mins", borderColor: "#a8e59f" },
	"Wednesday-03:00pm": { name: "English",      duration: "1hr 30mins", borderColor: "#a8e59f" },

	"Monday-01:00pm":    { name: "Biology",      duration: "50mins",    borderColor: "#fea181" },
	"Friday-02:00pm":    { name: "Biology",      duration: "50mins",    borderColor: "#fea181" },
};

const SUBJECT_ICONS: Record<string, string> = {
	"Further M...": "📐",
	"English":      "📗",
	"Biology":      "🧬",
	"Chemistry":    "⚗️",
};

export default function TimetableView() {
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

				{/* Time rows */}
				{TIME_SLOTS.map((time) => (
					<div key={time}>
						<div className="h-px bg-[#eeeeee] w-full" />
						<div className="grid grid-cols-[160px_repeat(5,1fr)] py-2 min-h-[72px]">
							{/* Time label */}
							<div className="flex items-start pt-1 gap-1 text-[#6b6b6b] text-base font-medium">
								{time}
							</div>

							{/* Day cells */}
							{DAYS.map((day) => {
								const entry = TIMETABLE[`${day}-${time}`];
								return (
									<div key={day} className="flex items-start justify-center px-1">
										{entry ? (
											<div
												className="w-full rounded-xl p-3 flex items-center gap-2 border cursor-pointer hover:shadow-sm transition-shadow"
												style={{ borderColor: entry.borderColor }}
											>
												<span className="text-lg flex-shrink-0">
													{SUBJECT_ICONS[entry.name] ?? "📌"}
												</span>
												<div className="min-w-0">
													<p className="text-sm font-bold text-[#343434] truncate leading-snug">
														{entry.name}
													</p>
													<p className="text-[10px] text-[#6b6b6b] font-medium leading-snug">
														{entry.duration}
													</p>
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
