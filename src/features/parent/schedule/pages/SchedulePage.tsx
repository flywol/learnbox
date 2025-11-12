import { useState } from "react";

export default function SchedulePage() {
	const [activeMainTab, setActiveMainTab] = useState<
		"class" | "schedule" | "academic-record"
	>("schedule");
	const [activeSubTab, setActiveSubTab] = useState<"timetable" | "calendar">(
		"timetable"
	);

	const mainTabs = [
		{ id: "class" as const, label: "Class" },
		{ id: "schedule" as const, label: "Schedule" },
		{ id: "academic-record" as const, label: "Academic record" },
	];

	const subTabs = [
		{ id: "timetable" as const, label: "Timetable" },
		{ id: "calendar" as const, label: "Calendar" },
	];

	// Mock timetable data
	const timeSlots = [
		{ time: "08:00am", subject: "Further M.", color: "bg-blue-100", icon: "🧮" },
		{ time: "09:00am", subject: "English", color: "bg-teal-100", icon: "📚" },
		{ time: "10:00am", subject: "Biology", color: "bg-green-100", icon: "🔬" },
		{ time: "11:00am", subject: "Further M.", color: "bg-blue-100", icon: "🧮" },
		{ time: "12:00pm", subject: "Chemistry", color: "bg-yellow-100", icon: "🧪" },
		{ time: "01:00pm", subject: "English", color: "bg-teal-100", icon: "📚" },
		{ time: "02:00pm", subject: "Biology", color: "bg-green-100", icon: "🔬" },
		{ time: "03:00pm", subject: "Chemistry", color: "bg-yellow-100", icon: "🧪" },
	];

	// Mock calendar data
	const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
	const events: Record<number, string[]> = {
		7: ["Physics live class"],
		10: ["Assignment due"],
		11: ["Live class"],
		22: ["Physics live class"],
		28: ["Biology test due"],
		30: ["Children's day"],
	};

	return (
		<div>
			{/* Main Tabs */}
			<div className="flex gap-4 mb-6">
				{mainTabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveMainTab(tab.id)}
						className={`px-6 py-2 rounded-lg font-medium transition-colors ${
							activeMainTab === tab.id
								? "bg-orange-500 text-white"
								: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
						}`}>
						{tab.label}
					</button>
				))}
			</div>

			{/* Schedule Content */}
			{activeMainTab === "schedule" && (
				<div>
					{/* Sub Tabs */}
					<div className="flex gap-4 mb-6">
						{subTabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveSubTab(tab.id)}
								className={`px-5 py-2 rounded-lg font-medium transition-colors ${
									activeSubTab === tab.id
										? "bg-white text-gray-900 border-2 border-gray-900"
										: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
								}`}>
								{tab.label}
							</button>
						))}
					</div>

					{/* Timetable View */}
					{activeSubTab === "timetable" && (
						<div className="bg-white rounded-lg p-6 border border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Monday
							</h3>
							<div className="space-y-3">
								{timeSlots.map((slot, index) => (
									<div key={index} className="flex items-center gap-4">
										<div className="w-20 text-sm text-gray-600 flex-shrink-0">
											{slot.time}
										</div>
										<div
											className={`flex-1 ${slot.color} rounded-lg p-3 flex items-center gap-3`}>
											<span className="text-2xl">{slot.icon}</span>
											<span className="text-sm font-semibold text-gray-900">
												{slot.subject}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Calendar View */}
					{activeSubTab === "calendar" && (
						<div className="bg-white rounded-lg p-6 border border-gray-200">
							{/* Days of week header */}
							<div className="grid grid-cols-7 gap-2 mb-2">
								{daysOfWeek.map((day) => (
									<div
										key={day}
										className="text-center font-medium text-gray-600 text-sm p-2">
										{day}
									</div>
								))}
							</div>

							{/* Calendar grid */}
							<div className="grid grid-cols-7 gap-2">
								{calendarDays.map((day) => {
									const dayEvents = events[day] || [];
									const hasEvent = dayEvents.length > 0;

									return (
										<div
											key={day}
											className={`p-3 rounded-lg min-h-[80px] ${
												hasEvent ? "bg-orange-50/50" : "bg-gray-50/50"
											}`}>
											<div
												className={`text-sm mb-2 ${
													hasEvent
														? "font-bold text-gray-900"
														: "text-gray-600"
												}`}>
												{day}
											</div>
											{dayEvents.map((event, idx) => (
												<div
													key={idx}
													className="text-xs text-gray-700 mb-1">
													{event}
												</div>
											))}
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Other tabs - placeholders */}
			{activeMainTab === "class" && (
				<div className="bg-white rounded-lg p-8 border border-gray-200">
					<p className="text-gray-600">Class view placeholder</p>
				</div>
			)}

			{activeMainTab === "academic-record" && (
				<div className="bg-white rounded-lg p-8 border border-gray-200">
					<p className="text-gray-600">Academic record view placeholder</p>
				</div>
			)}
		</div>
	);
}
