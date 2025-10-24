import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomStore } from "../store/classroomStore";
import SubjectCard from "../components/SubjectCard";
import ScheduleTab from "../components/schedule/ScheduleTab";
import { ClassroomTab } from "../types/classroom.types";

export default function ClassroomPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<ClassroomTab>("subject");
	const { subjects, assignments } = useClassroomStore();

	const tabs: { id: ClassroomTab; label: string }[] = [
		{ id: "subject", label: "Subject" },
		{ id: "schedule", label: "Schedule" },
		{ id: "assignment", label: "Assignment" },
	];

	const handleSubjectClick = (subjectId: string) => {
		navigate(`/student/classroom/subject/${subjectId}`);
	};

	return (
		<div className="space-y-6">
			{/* Tabs */}
			<div className="flex gap-3">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
							activeTab === tab.id
								? "bg-orange-500 text-white shadow-sm"
								: "bg-white text-gray-700 border border-gray-200 hover:border-orange-300"
						}`}>
						{tab.label}
					</button>
				))}
			</div>

			{/* Subject Tab */}
			{activeTab === "subject" && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{subjects.map((subject) => (
						<SubjectCard
							key={subject.id}
							subject={subject}
							onClick={() => handleSubjectClick(subject.id)}
						/>
					))}
				</div>
			)}

			{/* Schedule Tab */}
			{activeTab === "schedule" && <ScheduleTab />}

			{/* Assignment Tab */}
			{activeTab === "assignment" && (
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-lg font-semibold mb-4">Assignments</h2>

					{assignments.length === 0 ? (
						<div className="text-center py-12">
							<div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
								<span className="text-3xl">📝</span>
							</div>
							<p className="text-gray-500">No assignments available</p>
						</div>
					) : (
						<div className="space-y-3">
							{assignments.map((assignment) => (
								<div
									key={assignment.id}
									className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-1">
											<h3 className="font-semibold text-gray-900">
												{assignment.title}
											</h3>
											<span
												className={`px-2 py-1 rounded text-xs font-medium ${
													assignment.status === "pending"
														? "bg-orange-100 text-orange-700"
														: assignment.status === "submitted"
														? "bg-blue-100 text-blue-700"
														: "bg-green-100 text-green-700"
												}`}>
												{assignment.status.charAt(0).toUpperCase() +
													assignment.status.slice(1)}
											</span>
										</div>
										<p className="text-sm text-gray-600">
											{assignment.subjectName}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Due: {new Date(assignment.dueDate).toLocaleDateString()}
										</p>
									</div>

									{assignment.status === "graded" &&
										assignment.score !== undefined && (
											<div className="text-right">
												<p className="text-lg font-semibold text-gray-900">
													{assignment.score}/{assignment.totalPoints}
												</p>
												<p className="text-xs text-gray-500">Score</p>
											</div>
										)}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
