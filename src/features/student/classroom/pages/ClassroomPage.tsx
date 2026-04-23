import { useNavigate } from "react-router-dom";
import { useClassroomStore } from "../store/classroomStore";
import SubjectCard from "../components/SubjectCard";

export default function ClassroomPage() {
	const navigate = useNavigate();
	const { subjects } = useClassroomStore();

	return (
		<div className="bg-white rounded-2xl shadow-sm overflow-hidden">
			{/* Top toolbar */}
			<div className="flex items-center gap-6 px-8 py-6 border-b border-[#eeeeee]">
				<button className="px-6 py-3 bg-[#fd5d26] rounded-lg text-white text-lg font-semibold">
					Subject
				</button>
				<button
					onClick={() => navigate("/student/schedule")}
					className="px-6 py-3 border border-[#838383] rounded-lg text-[#838383] text-lg font-normal hover:border-[#fd5d26] hover:text-[#fd5d26] transition-colors"
				>
					Schedule
				</button>
				<button
					onClick={() => navigate("/student/assessment")}
					className="px-6 py-3 border border-[#838383] rounded-lg text-[#838383] text-lg font-normal hover:border-[#fd5d26] hover:text-[#fd5d26] transition-colors"
				>
					Academic Record
				</button>
			</div>

			{/* Subject grid */}
			<div className="p-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{subjects.map((subject) => (
						<SubjectCard
							key={subject.id}
							subject={subject}
							onClick={() => navigate(`/student/classroom/subject/${subject.id}`)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
