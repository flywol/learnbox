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
			{activeTab === "assignment" && <AssignmentTab />}
		</div>
	);
}
