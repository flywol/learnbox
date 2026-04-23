import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TimetableView from "../components/TimetableView";
import CalendarView from "../components/CalendarView";

type SubTab = "timetable" | "calendar";

export default function SchedulePage() {
	const navigate = useNavigate();
	const [subTab, setSubTab] = useState<SubTab>("timetable");

	const handleTopTab = (tab: "class" | "academic-record") => {
		if (tab === "class") navigate("/student/classroom");
		if (tab === "academic-record") navigate("/student/assessment");
	};

	return (
		<div className="bg-white rounded-2xl overflow-hidden shadow-sm">
			{/* Top toolbar */}
			<div className="flex items-center gap-6 px-8 py-6 border-b border-[#eeeeee]">
				<button
					onClick={() => handleTopTab("class" as const)}
					className="px-6 py-3 border border-[#838383] rounded-lg text-[#838383] text-lg font-normal hover:border-[#fd5d26] hover:text-[#fd5d26] transition-colors"
				>
					Class
				</button>
				<button
					className="px-6 py-3 bg-[#fd5d26] rounded-lg text-white text-lg font-semibold"
				>
					Schedule
				</button>
				<button
					onClick={() => handleTopTab("academic-record" as const)}
					className="px-6 py-3 border border-[#838383] rounded-lg text-[#838383] text-lg font-normal hover:border-[#fd5d26] hover:text-[#fd5d26] transition-colors"
				>
					Academic Record
				</button>
			</div>

			{/* Sub-tabs */}
			<div className="flex items-center gap-1 px-8 pt-4 border-b border-[#eeeeee]">
				<div className="flex flex-col items-center">
					<button
						onClick={() => setSubTab("timetable")}
						className={`px-4 py-1.5 text-base font-semibold transition-colors ${
							subTab === "timetable" ? "text-[#2b2b2b]" : "text-[#838383] font-normal"
						}`}
					>
						Timetable
					</button>
					{subTab === "timetable" && (
						<div className="h-0.5 w-full bg-[#2b2b2b] rounded-full" />
					)}
				</div>
				<div className="flex flex-col items-center">
					<button
						onClick={() => setSubTab("calendar")}
						className={`px-4 py-1.5 text-base transition-colors ${
							subTab === "calendar" ? "text-[#2b2b2b] font-semibold" : "text-[#838383] font-normal"
						}`}
					>
						Calendar
					</button>
					{subTab === "calendar" && (
						<div className="h-0.5 w-full bg-[#2b2b2b] rounded-full" />
					)}
				</div>
			</div>

			{/* Content */}
			<div className="p-8">
				{subTab === "timetable" && <TimetableView />}
				{subTab === "calendar" && <CalendarView />}
			</div>
		</div>
	);
}
