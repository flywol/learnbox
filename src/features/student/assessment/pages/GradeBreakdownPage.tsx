import { useNavigate } from "react-router-dom";
import { ChevronLeft, PenLine, SlidersHorizontal } from "lucide-react";

const mockData = {
	subject: {
		name: "Further Maths",
		teacher: "Andrew Jones",
		lessonsCompleted: 16,
		totalLessons: 16,
		progress: 100,
	},
	assessments: [
		{ id: "1", type: "Assignment", name: "Week 3 Assignment", date: "11/05/25", score: 60,  isAssignment: true },
		{ id: "2", type: "Assignment", name: "Week 2 Assignment", date: "11/05/25", score: 0,   isAssignment: true },
		{ id: "3", type: "Quiz",       name: "Week 3 Quiz",       date: "11/05/25", score: 0,   isAssignment: false },
		{ id: "4", type: "Quiz",       name: "Week 2 Quiz",       date: "11/05/25", score: 100, isAssignment: false },
		{ id: "5", type: "Quiz",       name: "Week 1 Quiz",       date: "11/05/25", score: 100, isAssignment: false },
		{ id: "6", type: "Quiz",       name: "Introductory Quiz", date: "11/05/25", score: 60,  isAssignment: false },
	],
	overview: { grade: 80, attendance: "20/22" },
};

function ScoreBadge({ score }: { score: number }) {
	const circumference = 2 * Math.PI * 18;
	const offset = circumference - (score / 100) * circumference;
	return (
		<div className="relative w-12 h-12 flex-shrink-0">
			<svg className="w-12 h-12 -rotate-90">
				<circle cx="24" cy="24" r="18" stroke="#eeeeee" strokeWidth="3" fill="white" />
				<circle
					cx="24" cy="24" r="18"
					stroke="#fd5d26" strokeWidth="3" fill="none"
					strokeDasharray={`${circumference}`}
					strokeDashoffset={offset}
					strokeLinecap="round"
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-[10px] font-bold text-[#2b2b2b]">{score}%</span>
			</div>
		</div>
	);
}

export default function GradeBreakdownPage() {
	const navigate = useNavigate();
	const { subject, assessments, overview } = mockData;
	const progressPct = (subject.lessonsCompleted / subject.totalLessons) * 100;

	return (
		<div className="bg-white rounded-2xl shadow-sm p-8 space-y-6 max-w-5xl">
			{/* Header */}
			<div className="flex items-center gap-3">
				<button
					onClick={() => navigate("/student/assessment")}
					className="p-1.5 hover:bg-[#eeeeee] rounded-lg transition-colors"
				>
					<ChevronLeft className="w-5 h-5 text-[#2b2b2b]" />
				</button>
				<h1 className="text-2xl font-bold text-[#2b2b2b]">Grade Breakdown</h1>
			</div>

			{/* Subject card */}
			<div className="bg-[#e9eeff] rounded-2xl p-6 flex items-start gap-4">
				<div className="w-14 h-14 bg-[#a3d4ff] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
					📐
				</div>
				<div className="flex-1 min-w-0">
					<h2 className="text-xl font-bold text-[#2b2b2b]">{subject.name}</h2>
					<p className="text-sm text-[#6b6b6b] mb-3">Teacher: {subject.teacher}</p>
					<div className="space-y-1">
						<div className="w-full bg-white/60 rounded-full h-2">
							<div
								className="bg-[#2b2b2b] h-2 rounded-full transition-all"
								style={{ width: `${progressPct}%` }}
							/>
						</div>
						<div className="flex items-center justify-between text-xs text-[#6b6b6b]">
							<span>Lesson {subject.lessonsCompleted}/{subject.totalLessons}</span>
							<span className="font-semibold text-[#2b2b2b]">{subject.progress}%</span>
						</div>
					</div>
				</div>
			</div>

			{/* Assessments grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{assessments.map((item) => (
					<div
						key={item.id}
						className="flex items-center justify-between p-4 border border-[#d6d6d6] rounded-xl bg-white"
					>
						<div className="flex items-center gap-3 min-w-0">
							<div className="w-9 h-9 bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0">
								{item.isAssignment
									? <PenLine className="w-4 h-4 text-[#6b6b6b]" />
									: <SlidersHorizontal className="w-4 h-4 text-[#6b6b6b]" />
								}
							</div>
							<div className="min-w-0">
								<p className="text-sm font-semibold text-[#2b2b2b] truncate">{item.name}</p>
								<p className="text-xs text-[#6b6b6b]">Submitted on {item.date}</p>
							</div>
						</div>
						<ScoreBadge score={item.score} />
					</div>
				))}
			</div>

			{/* Overview */}
			<div>
				<h3 className="text-xl font-bold text-[#2b2b2b] mb-3">Overview</h3>
				<div className="flex gap-4">
					<div className="border border-[#d6d6d6] rounded-xl p-5 flex-1">
						<p className="text-sm text-[#6b6b6b] mb-1">Grade</p>
						<p className="text-3xl font-bold text-[#2b2b2b]">{overview.grade}%</p>
					</div>
					<div className="border border-[#d6d6d6] rounded-xl p-5 flex-1">
						<p className="text-sm text-[#6b6b6b] mb-1">Attendance</p>
						<p className="text-3xl font-bold text-[#2b2b2b]">{overview.attendance}</p>
					</div>
				</div>
			</div>

			{/* Teacher's remark */}
			<div>
				<h3 className="text-xl font-bold text-[#2b2b2b] mb-3">Teacher's remark</h3>
				<div className="border border-[#d6d6d6] rounded-xl p-6 space-y-4">
					<div>
						<p className="text-sm text-[#6b6b6b] mb-2">Title</p>
						<div className="border-b border-dashed border-[#d6d6d6] pb-2" />
					</div>
					<div>
						<p className="text-sm text-[#6b6b6b] mb-2">Suggestions</p>
						<div className="border-b border-dashed border-[#d6d6d6] pb-2" />
					</div>
				</div>
			</div>
		</div>
	);
}
