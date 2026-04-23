import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Download } from "lucide-react";

const mockSubjects = [
	{ id: "subject-1", name: "Further Maths", teacher: "Andrew Jones", grade: 53 },
	{ id: "subject-2", name: "Further Maths", teacher: "Andrew Jones", grade: 53 },
	{ id: "subject-3", name: "Further Maths", teacher: "Andrew Jones", grade: 53 },
	{ id: "subject-4", name: "English",        teacher: "Andrew Jones", grade: 53 },
	{ id: "subject-5", name: "Further Maths", teacher: "Andrew Jones", grade: 53 },
	{ id: "subject-6", name: "English",        teacher: "Andrew Jones", grade: 53 },
	{ id: "subject-7", name: "English",        teacher: "Andrew Jones", grade: 53 },
	{ id: "subject-8", name: "Further Maths", teacher: "Andrew Jones", grade: 53 },
	{ id: "subject-9", name: "English",        teacher: "Andrew Jones", grade: 53 },
];

const SUBJECT_ICONS: Record<string, string> = {
	"Further Maths": "📐",
	English: "📗",
};

export default function AssessmentPage() {
	const navigate = useNavigate();
	const [session, setSession] = useState("2023/2024");
	const [term, setTerm] = useState("1st term");

	return (
		<div className="bg-white rounded-2xl shadow-sm overflow-hidden">
			{/* Top toolbar */}
			<div className="flex items-center gap-6 px-8 py-6 border-b border-[#eeeeee]">
				<button
					onClick={() => navigate("/student/classroom")}
					className="px-6 py-3 border border-[#838383] rounded-lg text-[#838383] text-lg font-normal hover:border-[#fd5d26] hover:text-[#fd5d26] transition-colors"
				>
					Subject
				</button>
				<button
					onClick={() => navigate("/student/schedule")}
					className="px-6 py-3 border border-[#838383] rounded-lg text-[#838383] text-lg font-normal hover:border-[#fd5d26] hover:text-[#fd5d26] transition-colors"
				>
					Schedule
				</button>
				<button className="px-6 py-3 bg-[#fd5d26] rounded-lg text-white text-lg font-semibold">
					Academic Record
				</button>
			</div>

			<div className="p-8 space-y-6">
				{/* Session & Term filters */}
				<div className="flex gap-4">
					<div className="flex-1 relative flex items-center border border-[#d6d6d6] rounded-xl px-6 py-4 gap-4">
						<span className="text-base text-[#6b6b6b] font-normal flex-shrink-0">Session</span>
						<select
							value={session}
							onChange={(e) => setSession(e.target.value)}
							className="flex-1 text-base font-semibold text-[#2b2b2b] bg-transparent focus:outline-none appearance-none cursor-pointer"
						>
							<option>2023/2024</option>
							<option>2022/2023</option>
							<option>2021/2022</option>
						</select>
						<ChevronDown className="w-5 h-5 text-[#6b6b6b] flex-shrink-0 pointer-events-none" />
					</div>
					<div className="flex-1 relative flex items-center border border-[#d6d6d6] rounded-xl px-6 py-4 gap-4">
						<span className="text-base text-[#6b6b6b] font-normal flex-shrink-0">Term</span>
						<select
							value={term}
							onChange={(e) => setTerm(e.target.value)}
							className="flex-1 text-base font-semibold text-[#2b2b2b] bg-transparent focus:outline-none appearance-none cursor-pointer"
						>
							<option>1st term</option>
							<option>2nd term</option>
							<option>3rd term</option>
						</select>
						<ChevronDown className="w-5 h-5 text-[#6b6b6b] flex-shrink-0 pointer-events-none" />
					</div>
				</div>

				{/* Subject grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{mockSubjects.map((subject) => (
						<button
							key={subject.id}
							onClick={() => navigate(`/student/assessment/${subject.id}`)}
							className="flex items-center gap-4 p-5 bg-[#e9eeff] rounded-2xl text-left hover:shadow-md transition-all hover:scale-[1.01]"
						>
							<div className="w-12 h-12 bg-[#a3d4ff] rounded-full flex items-center justify-center text-xl flex-shrink-0">
								{SUBJECT_ICONS[subject.name] ?? "📌"}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-base font-bold text-[#2b2b2b] truncate">{subject.name}</p>
								<p className="text-sm text-[#6b6b6b] truncate">Teacher: {subject.teacher}</p>
							</div>
							<div className="flex-shrink-0 text-right">
								<p className="text-xs text-[#6b6b6b]">Grade</p>
								<p className="text-lg font-bold text-[#2b2b2b]">{subject.grade}%</p>
							</div>
						</button>
					))}
				</div>

				{/* Total Grade */}
				<div>
					<h3 className="text-xl font-bold text-[#2b2b2b] mb-3">Total Grade</h3>
					<div className="border border-[#d6d6d6] rounded-xl p-6 max-w-sm">
						<p className="text-sm text-[#6b6b6b] mb-1">Average Percentage</p>
						<p className="text-4xl font-bold text-[#2b2b2b]">80%</p>
					</div>
				</div>

				{/* Download */}
				<button
					className="flex items-center justify-center gap-2 px-8 py-4 bg-[#fd5d26] text-white text-base font-semibold rounded-2xl hover:bg-[#e84d17] transition-colors"
				>
					<Download className="w-5 h-5" />
					Download result
				</button>
			</div>
		</div>
	);
}
