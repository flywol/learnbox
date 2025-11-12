import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockChildSubjects } from "../config/childConfig";
import ScheduleContent from "../components/ScheduleContent";
import AcademicRecordContent from "../components/AcademicRecordContent";

// Helper function to convert light bg color to bold progress bar color
const getProgressBarColor = (bgColor: string): string => {
	const colorMap: Record<string, string> = {
		"bg-green-100": "bg-green-600",
		"bg-green-50": "bg-green-500",
		"bg-red-100": "bg-red-600",
		"bg-blue-100": "bg-blue-600",
		"bg-purple-100": "bg-purple-600",
		"bg-teal-100": "bg-teal-600",
		"bg-lime-100": "bg-lime-600",
		"bg-amber-100": "bg-amber-600",
		"bg-orange-100": "bg-orange-600",
		"bg-rose-100": "bg-rose-600",
		"bg-pink-100": "bg-pink-600",
		"bg-yellow-100": "bg-yellow-600",
	};
	return colorMap[bgColor] || "bg-orange-500";
};

export default function ChildPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<
		"subject" | "schedule" | "academic-record"
	>("subject");

	const tabs = [
		{ id: "subject" as const, label: "Subject" },
		{ id: "schedule" as const, label: "Schedule" },
		{ id: "academic-record" as const, label: "Academic record" },
	];

	const handleSubjectClick = (subjectId: string) => {
		navigate(`/parent/child/subject/${subjectId}`);
	};

	return (
		<div>
			{/* Tabs */}
			<div className="flex gap-4 mb-6">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-6 py-2 rounded-lg font-medium transition-colors ${
							activeTab === tab.id
								? "bg-orange-500 text-white"
								: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
						}`}>
						{tab.label}
					</button>
				))}
			</div>

			{/* Subject Grid */}
			{activeTab === "subject" && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{mockChildSubjects.map((subject) => {
						const progressBarColor = getProgressBarColor(subject.color);

						return (
							<div
								key={subject.id}
								onClick={() => handleSubjectClick(subject.id)}
								className={`${subject.color} rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow`}>
								{/* Icon */}
								<div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center text-3xl mb-4">
									{subject.icon}
								</div>

								{/* Subject Name */}
								<h3 className="text-lg font-semibold text-gray-900 mb-1">
									{subject.name}
								</h3>

								{/* Teacher */}
								<p className="text-xs text-gray-600 mb-3">{subject.teacher}</p>

								{/* Lesson Progress */}
								<p className="text-xs text-gray-700 mb-2">
									Lesson {subject.lessonNumber}/{subject.totalLessons}
								</p>

								{/* Progress Bar */}
								<div className="w-full bg-white/50 rounded-full h-2.5 mb-2">
									<div
										className={`${progressBarColor} h-2.5 rounded-full transition-all duration-300`}
										style={{ width: `${subject.progress}%` }}
									/>
								</div>

								{/* Progress Percentage */}
								<p className="text-sm font-semibold text-gray-900 text-right">
									{subject.progress}%
								</p>
							</div>
						);
					})}
				</div>
			)}

			{/* Schedule Tab */}
			{activeTab === "schedule" && <ScheduleContent />}

			{/* Academic Record Tab */}
			{activeTab === "academic-record" && <AcademicRecordContent />}
		</div>
	);
}
