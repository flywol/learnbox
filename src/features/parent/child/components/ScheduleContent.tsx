import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParentContext } from "../../context/ParentContext";
import { parentApiClient } from "../../api/parentApiClient";

export default function ScheduleContent() {
	const { selectedChild } = useParentContext();
	const [activeSubTab, setActiveSubTab] = useState<"timetable" | "calendar">("timetable");
	const [currentDate, setCurrentDate] = useState(new Date());

	// Fetch schedule (timetable) data
	const { data: scheduleData, isLoading: isLoadingSchedule } = useQuery({
		queryKey: ["child-schedule", selectedChild?._id],
		queryFn: async () => {
			if (!selectedChild) return null;
			const response = await parentApiClient.getSchedule(selectedChild._id);
			return response.data;
		},
		enabled: !!selectedChild,
	});

	// Fetch calendar data
	const { data: calendarData, isLoading: isLoadingCalendar } = useQuery({
		queryKey: ["child-calendar", selectedChild?._id],
		queryFn: async () => {
			if (!selectedChild) return null;
			const response = await parentApiClient.getCalendar(selectedChild._id);
			return response.data;
		},
		enabled: !!selectedChild,
	});

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
		if (!calendarData?.events) return [];
		const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		return calendarData.events.filter((event: any) => event.date?.startsWith(dateStr));
	};

	// Helper function to get color for subject
	const getSubjectColor = (subjectName: string) => {
		const colors = [
			"bg-green-100 text-green-700",
			"bg-blue-100 text-blue-700",
			"bg-purple-100 text-purple-700",
			"bg-teal-100 text-teal-700",
			"bg-pink-100 text-pink-700",
			"bg-orange-100 text-orange-700",
			"bg-yellow-100 text-yellow-700",
		];
		const colorIndex = subjectName.charCodeAt(0) % colors.length;
		return colors[colorIndex];
	};

	// Helper function to format duration from minutes
	const formatDuration = (minutes: number) => {
		if (minutes < 60) return `${minutes}mins`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours}hr ${mins}mins` : `${hours}hr`;
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

					{isLoadingSchedule ? (
						<div className="flex justify-center items-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
						</div>
					) : scheduleData?.schedule && scheduleData.schedule.length > 0 ? (
						<>
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
											// Find the schedule entry for this day and time
											const scheduleEntry = scheduleData.schedule.find(
												(entry: any) => entry.day === day && entry.startTime === time
											);

											return (
												<div key={`${day}-${time}`} className="p-2 h-24 flex items-center justify-center">
													{scheduleEntry ? (
														<div
															className={`w-full h-full rounded-lg ${getSubjectColor(
																scheduleEntry.subjectName
															)} p-3 flex flex-col justify-center items-center text-center transition-all hover:shadow-md hover:scale-105 cursor-pointer`}
															title={`${scheduleEntry.subjectName} - ${formatDuration(scheduleEntry.duration)}`}>
															<div className="text-lg mb-1">{scheduleEntry.subjectName[0]}</div>
															<div className="text-xs font-semibold mb-1 leading-tight">
																{scheduleEntry.subjectName}
															</div>
															<div className="text-xs opacity-75 leading-tight">
																{formatDuration(scheduleEntry.duration)}
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
								{[...new Set(scheduleData.schedule.map((entry: any) => entry.subjectName))].map(
									(subjectName: any) => (
										<div key={subjectName} className="flex items-center space-x-2">
											<div className={`w-3 h-3 rounded ${getSubjectColor(subjectName).split(" ")[0]}`} />
											<span>{subjectName}</span>
										</div>
									)
								)}
							</div>
						</>
					) : (
						<div className="text-center py-12 text-gray-500">
							No schedule found for this child
						</div>
					)}
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

					{isLoadingCalendar ? (
						<div className="flex justify-center items-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
						</div>
					) : (
						<>
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

										// Helper to get event color class
										const getEventColor = (type: string) => {
											switch (type) {
												case 'assignment':
													return 'bg-orange-100 text-orange-700';
												case 'live_class':
													return 'bg-blue-100 text-blue-700';
												case 'school_event':
													return 'bg-purple-100 text-purple-700';
												default:
													return 'bg-gray-100 text-gray-700';
											}
										};

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
													{dayEvents.slice(0, 2).map((event: any) => (
														<div
															key={event._id}
															className={`text-xs px-2 py-1 rounded truncate ${getEventColor(event.type)}`}
															title={event.title}>
															{event.title}
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
						</>
					)}
				</div>
			)}
		</div>
	);
}
