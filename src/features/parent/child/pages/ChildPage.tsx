import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useParentContext } from "../../context/ParentContext";
import { parentApiClient } from "../../api/parentApiClient";
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
	const { selectedChild } = useParentContext();
	const [activeTab, setActiveTab] = useState<
		"subject" | "schedule" | "academic-record"
	>("subject");

	// Fetch subjects for selected child
	const { data: subjectsData, isLoading } = useQuery({
		queryKey: ["child-subjects", selectedChild?._id],
		queryFn: async () => {
			if (!selectedChild) return null;
			const response = await parentApiClient.getSubjects(selectedChild._id);
			return response.data;
		},
		enabled: !!selectedChild,
	});

	const subjects = subjectsData?.subjects || [];

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
				<div>
					{isLoading ? (
						<div className="flex justify-center items-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
						</div>
					) : subjects.length === 0 ? (
						<div className="text-center py-12 text-gray-500">
							No subjects found for this child
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{subjects.map((subject) => {
								// Generate color based on subject name hash
								const colors = [
									"bg-green-100",
									"bg-blue-100",
									"bg-purple-100",
									"bg-teal-100",
									"bg-lime-100",
									"bg-amber-100",
									"bg-orange-100",
									"bg-rose-100",
									"bg-pink-100",
									"bg-yellow-100",
								];
								const colorIndex = subject.name.charCodeAt(0) % colors.length;
								const bgColor = colors[colorIndex];
								const progressBarColor = getProgressBarColor(bgColor);

								return (
									<div
										key={subject._id}
										onClick={() => handleSubjectClick(subject._id)}
										className={`${bgColor} rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow`}>
										{/* Icon - using first letter of subject */}
										<div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
											{subject.name[0]}
										</div>

										{/* Subject Name */}
										<h3 className="text-lg font-semibold text-gray-900 mb-1">
											{subject.name}
										</h3>

										{/* Teacher */}
										<p className="text-xs text-gray-600 mb-3">
											{subject.teacher || "No teacher assigned"}
										</p>

										{/* Lesson Progress */}
										<p className="text-xs text-gray-700 mb-2">
											Lesson {subject.currentLesson}
										</p>

										{/* Progress Bar */}
										<div className="w-full bg-white/50 rounded-full h-2.5 mb-2">
											<div
												className={`${progressBarColor} h-2.5 rounded-full transition-all duration-300`}
												style={{ width: `${subject.progressPercentage}%` }}
											/>
										</div>

										{/* Progress Percentage */}
										<p className="text-sm font-semibold text-gray-900 text-right">
											{subject.progressPercentage}%
										</p>
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}

			{/* Schedule Tab */}
			{activeTab === "schedule" && <ScheduleContent />}

			{/* Academic Record Tab */}
			{activeTab === "academic-record" && <AcademicRecordContent />}
		</div>
	);
}
