import { StudentSubject } from "../types/classroom.types";

const PROGRESS_COLORS: Record<string, string> = {
	"bg-green-100":   "#22c55e",
	"bg-red-100":     "#ef4444",
	"bg-blue-100":    "#3b82f6",
	"bg-purple-100":  "#a855f7",
	"bg-teal-100":    "#14b8a6",
	"bg-lime-100":    "#84cc16",
	"bg-indigo-100":  "#6366f1",
	"bg-orange-100":  "#f97316",
	"bg-rose-100":    "#f43f5e",
	"bg-cyan-100":    "#06b6d4",
	"bg-pink-100":    "#ec4899",
	"bg-yellow-100":  "#eab308",
};

interface SubjectCardProps {
	subject: StudentSubject;
	onClick: () => void;
}

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
	const progressColor = PROGRESS_COLORS[subject.bgColor] ?? "#fd5d26";

	return (
		<button
			onClick={onClick}
			className={`${subject.bgColor} rounded-2xl p-6 text-left hover:shadow-md transition-all hover:scale-[1.01] duration-200 w-full`}
		>
			{/* Icon + name */}
			<div className="flex items-center gap-4 mb-3">
				<div className="w-14 h-14 rounded-full bg-white/50 flex items-center justify-center text-3xl flex-shrink-0">
					{subject.icon}
				</div>
				<div>
					<h3 className="text-xl font-bold text-[#343434] leading-snug">{subject.name}</h3>
					<p className="text-sm text-[#6b6b6b] mt-0.5">Teacher: {subject.teacher}</p>
				</div>
			</div>

			{/* Progress bar */}
			<div className="w-full bg-white/60 rounded-full h-2 mb-2">
				<div
					className="h-2 rounded-full transition-all"
					style={{ width: `${subject.progressPercentage}%`, backgroundColor: progressColor }}
				/>
			</div>

			{/* Labels */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-[#6b6b6b]">
					Lesson {subject.currentLesson}/{subject.totalLessons}
				</p>
				<p className="text-sm font-semibold text-[#2b2b2b]">
					{subject.progressPercentage}%
				</p>
			</div>
		</button>
	);
}
