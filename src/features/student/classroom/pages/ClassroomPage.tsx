import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomStore } from "../store/classroomStore";
import SubjectCard from "../components/SubjectCard";
import ScheduleTab from "../components/schedule/ScheduleTab";
import AssignmentTab from "../components/AssignmentTab";
import { ClassroomTab } from "../types/classroom.types";

export default function ClassroomPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<ClassroomTab>("subject");
	const { subjects } = useClassroomStore();

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
			{/* Header & Tabs */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">My Classroom</h1>
					<p className="text-gray-500">Manage your subjects and assignments</p>
				</div>
				<div className="bg-gray-100/80 p-1 rounded-xl inline-flex self-start sm:self-auto">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
								activeTab === tab.id
									? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
									: "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
							}`}>
							{tab.label}
						</button>
					))}
				</div>
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
			{activeTab === "assignment" && <AssignmentTab />}
		</div>
	);
}
