import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Mock timetable data matching student structure
const mockTimetableData = {
	"Monday-08:00am": { subjectName: "Further M...", duration: "1hr", color: "bg-blue-100 text-blue-700", icon: "📐" },
	"Tuesday-08:00am": { subjectName: "English", duration: "1hr 30mins", color: "bg-green-100 text-green-700", icon: "📚" },
	"Wednesday-08:00am": { subjectName: "Biology", duration: "50mins", color: "bg-orange-100 text-orange-700", icon: "🧬" },
	"Friday-08:00am": { subjectName: "Chemistry", duration: "50mins", color: "bg-yellow-100 text-yellow-700", icon: "⚗️" },
	"Tuesday-09:00am": { subjectName: "Biology", duration: "50mins", color: "bg-orange-100 text-orange-700", icon: "🧬" },
	"Thursday-09:00am": { subjectName: "Further M...", duration: "1hr", color: "bg-blue-100 text-blue-700", icon: "📐" },
	"Monday-10:00am": { subjectName: "English", duration: "1hr 30mins", color: "bg-green-100 text-green-700", icon: "📚" },
	"Wednesday-10:00am": { subjectName: "Chemistry", duration: "50mins", color: "bg-yellow-100 text-yellow-700", icon: "⚗️" },
	"Friday-10:00am": { subjectName: "Further M...", duration: "1hr", color: "bg-blue-100 text-blue-700", icon: "📐" },
	"Tuesday-11:00am": { subjectName: "Further M...", duration: "1hr", color: "bg-blue-100 text-blue-700", icon: "📐" },
	"Monday-12:00pm": { subjectName: "Chemistry", duration: "50mins", color: "bg-yellow-100 text-yellow-700", icon: "⚗️" },
	"Wednesday-12:00pm": { subjectName: "Further M...", duration: "1hr", color: "bg-blue-100 text-blue-700", icon: "📐" },
	"Thursday-12:00pm": { subjectName: "Biology", duration: "50mins", color: "bg-orange-100 text-orange-700", icon: "🧬" },
	"Tuesday-01:00pm": { subjectName: "English", duration: "1hr 30mins", color: "bg-green-100 text-green-700", icon: "📚" },
	"Thursday-01:00pm": { subjectName: "English", duration: "1hr 30mins", color: "bg-green-100 text-green-700", icon: "📚" },
	"Monday-02:00pm": { subjectName: "Biology", duration: "50mins", color: "bg-orange-100 text-orange-700", icon: "🧬" },
	"Wednesday-02:00pm": { subjectName: "Biology", duration: "50mins", color: "bg-orange-100 text-orange-700", icon: "⚗️" },
	"Tuesday-03:00pm": { subjectName: "Chemistry", duration: "50mins", color: "bg-yellow-100 text-yellow-700", icon: "⚗️" },
	"Thursday-03:00pm": { subjectName: "Further M...", duration: "1hr", color: "bg-blue-100 text-blue-700", icon: "📐" },
};

// Mock events data
const mockEvents = [
	{ id: "1", date: "2025-10-03", description: "Assignment deadline is today", color: "bg-orange-100 text-orange-700" },
	{ id: "2", date: "2025-10-08", description: "Physics live class", color: "bg-blue-100 text-blue-700" },
	{ id: "3", date: "2025-10-11", description: "Class trip", color: "bg-purple-100 text-purple-700" },
	{ id: "4", date: "2025-10-10", description: "Biology quiz due", color: "bg-orange-100 text-orange-700" },
	{ id: "5", date: "2025-10-21", description: "Physics live class", color: "bg-blue-100 text-blue-700" },
	{ id: "6", date: "2025-10-27", description: "Children's day", color: "bg-purple-100 text-purple-700" },
	{ id: "7", date: "2025-10-31", description: "Biology quiz due", color: "bg-orange-100 text-orange-700" },
];

export default function ScheduleContent() {
	const [activeSubTab, setActiveSubTab] = useState<"timetable" | "calendar">("timetable");
	const [currentDate, setCurrentDate] = useState(new Date());

	const timeSlots = ["08:00am", "09:00am", "10:00am", "11:00am", "12:00pm", "01:00pm", "02:00pm", "03:00pm"];
	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	const navigateMonth = (direction: "prev" | "next") => {
		setCurrentDate((prevDate) => {
			const newDate = new Date(prevDate);
			if (direction === "prev") {
				newDate.setMonth(newDate.getMonth() - 1);
			} else {
				newDate.setMonth(newDate.getMonth() + 1);
			}
			return newDate;
		});
	};

	const goToToday = () => {
		setCurrentDate(new Date());
	};

	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
	const calendarDays = [];

	for (let i = 0; i < firstDayOfMonth; i++) {
		calendarDays.push(null);
	}
	for (let day = 1; day <= daysInMonth; day++) {
		calendarDays.push(day);
	}

	const isToday = (day: number) => {
		const today = new Date();
		return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
	};

	const getEventsForDay = (day: number) => {
		const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		return mockEvents.filter((event) => event.date === dateStr);
	};

	return (
		<div className="space-y-6">
			{/* Tabs */}
			<div className="border-b border-gray-200">
				<div className="flex space-x-1">
					<button
						onClick={() => setActiveSubTab("timetable")}
						className={`px-6 py-3 font-medium transition-colors ${
							activeSubTab === "timetable"
								? "border-b-2 border-orange-500 text-orange-500"
								: "text-gray-700 hover:text-orange-500"
						}`}>
						Timetable
					</button>
					<button
						onClick={() => setActiveSubTab("calendar")}
						className={`px-6 py-3 font-medium transition-colors ${
							activeSubTab === "calendar"
								? "border-b-2 border-orange-500 text-orange-500"
								: "text-gray-700 hover:text-orange-500"
						}`}>
						Calendar
					</button>
				</div>
			</div>

			{/* Timetable View */}
			{activeSubTab === "timetable" && (
				<div className="space-y-4">
					{/* Info Banner */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
						<Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
						<div>
							<h4 className="font-medium text-blue-900 text-sm">Your Child's Weekly Timetable</h4>
							<p className="text-blue-700 text-sm mt-1">
								View your child's class schedule for the week.
							</p>
						</div>
					</div>

					{/* Timetable Grid */}
					<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
						{/* Header */}
						<div className="grid grid-cols-6 gap-0 border-b border-gray-200">
							<div className="p-4 bg-gray-50 font-medium text-gray-700">Time</div>
							{days.map((day) => (
								<div key={day} className="p-4 bg-gray-50 font-medium text-gray-700 text-center">
									{day}
								</div>
							))}
						</div>

						{/* Time Slots */}
						{timeSlots.map((time) => (
							<div key={time} className="grid grid-cols-6 gap-0 border-b border-gray-200 last:border-b-0">
								<div className="p-4 bg-gray-50 font-medium text-gray-600 text-sm flex items-center">
									<span className="flex items-center">
										<span className="mr-1">⏰</span>
										{time}
									</span>
								</div>
								{days.map((day) => {
									const key = `${day}-${time}`;
									const subject = mockTimetableData[key as keyof typeof mockTimetableData];

									return (
										<div key={key} className="p-2 h-24 flex items-center justify-center">
											{subject ? (
												<div
													className={`w-full h-full rounded-lg ${subject.color} p-3 flex flex-col justify-center items-center text-center transition-all hover:shadow-md hover:scale-105 cursor-pointer`}
													title={`${subject.subjectName} - ${subject.duration}`}>
													<div className="text-lg mb-1">{subject.icon}</div>
													<div className="text-xs font-semibold mb-1 leading-tight">
														{subject.subjectName}
													</div>
													<div className="text-xs opacity-75 leading-tight">
														{subject.duration}
													</div>
												</div>
											) : (
												<div className="w-full h-full flex items-center justify-center text-gray-300">
													—
												</div>
											)}
										</div>
									);
								})}
							</div>
						))}
					</div>

					{/* Legend */}
					<div className="flex items-center space-x-6 flex-wrap text-sm text-gray-600">
						<span className="font-medium">Subjects:</span>
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 rounded bg-blue-100" />
							<span>Further Mathematics</span>
						</div>
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 rounded bg-green-100" />
							<span>English</span>
						</div>
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 rounded bg-orange-100" />
							<span>Biology</span>
						</div>
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 rounded bg-yellow-100" />
							<span>Chemistry</span>
						</div>
					</div>
				</div>
			)}

			{/* Calendar View */}
			{activeSubTab === "calendar" && (
				<div className="space-y-6">
					{/* Info Banner */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
						<Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
						<div>
							<h4 className="font-medium text-blue-900 text-sm">Your Child's Academic Calendar</h4>
							<p className="text-blue-700 text-sm mt-1">
								Stay on top of assignments, live classes, and school events.
							</p>
						</div>
					</div>

					{/* Calendar Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<button
									onClick={() => navigateMonth("prev")}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
									title="Previous month">
									<ChevronLeft className="w-5 h-5 text-gray-600" />
								</button>

								<h3 className="text-xl font-semibold min-w-[200px] text-center">
									{monthNames[currentMonth]} {currentYear}
								</h3>

								<button
									onClick={() => navigateMonth("next")}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
									title="Next month">
									<ChevronRight className="w-5 h-5 text-gray-600" />
								</button>
							</div>

							<button
								onClick={goToToday}
								className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
								Today
							</button>
						</div>
					</div>

					{/* Calendar Grid */}
					<div className="space-y-2">
						{/* Day Headers */}
						<div className="grid grid-cols-7 gap-2">
							{dayNames.map((day) => (
								<div key={day} className="p-3 text-center font-medium text-gray-600 text-sm">
									{day}
								</div>
							))}
						</div>

						{/* Calendar Days */}
						<div className="grid grid-cols-7 gap-2">
							{calendarDays.map((day, index) => {
								if (!day) {
									return <div key={index} className="h-24 rounded-lg" style={{ backgroundColor: '#FFF5F0' }} />;
								}

								const dayEvents = getEventsForDay(day);
								const isCurrentDay = isToday(day);

								return (
									<div
										key={index}
										className="p-3 h-24 rounded-lg hover:opacity-90 cursor-pointer transition-all"
										style={{ backgroundColor: '#FFEFE9' }}>
										<div
											className={`text-sm mb-2 ${
												isCurrentDay
													? "text-orange-600 font-bold"
													: dayEvents.length > 0
													? "font-bold text-gray-900"
													: "font-normal text-gray-600"
											}`}>
											{day}
										</div>
										<div className="space-y-1">
											{dayEvents.slice(0, 2).map((event) => (
												<div
													key={event.id}
													className={`text-xs px-2 py-1 rounded truncate ${event.color}`}
													title={event.description}>
													{event.description}
												</div>
											))}
											{dayEvents.length > 2 && (
												<div className="text-xs text-gray-500 px-2">+{dayEvents.length - 2} more</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Events Legend */}
					<div className="flex items-center space-x-6 flex-wrap">
						<span className="text-sm font-medium text-gray-600">Event types:</span>
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 rounded bg-orange-100" />
							<span className="text-sm text-gray-600">Assignments</span>
						</div>
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 rounded bg-blue-100" />
							<span className="text-sm text-gray-600">Live Classes</span>
						</div>
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 rounded bg-purple-100" />
							<span className="text-sm text-gray-600">School Events</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
