import { Lock } from "lucide-react";
import { StudentLesson } from "../types/classroom.types";

interface StudentLessonsGridProps {
	lessons: StudentLesson[];
	onLessonClick: (lesson: StudentLesson) => void;
}

export default function StudentLessonsGrid({ lessons, onLessonClick }: StudentLessonsGridProps) {
	if (lessons.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 gap-3">
				<img src="/images/onboarding/student-2.svg" alt="" className="w-24 h-24 opacity-60" />
				<p className="text-[#838383]">No lessons yet</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{lessons.map((lesson) => (
				<div
					key={lesson.id}
					onClick={() => onLessonClick(lesson)}
					className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-4 ${
						lesson.isLocked
							? "border-[#eeeeee] bg-white hover:border-[#d6d6d6]"
							: "border-[#d6d6d6] bg-white hover:shadow-sm hover:border-[#fd5d26]/30"
					}`}
				>
					{/* Numbered circle */}
					<div
						className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold ${
							lesson.isLocked
								? "bg-[#f5f5f5] text-[#c4c4c4]"
								: "bg-[#ffc107]/30 text-[#8a6400]"
						}`}
						style={lesson.isLocked ? {} : {
							background: "radial-gradient(circle, #ffe082 0%, #ffc107 60%, #ff9800 100%)",
							color: "#5d3a00",
						}}
					>
						{lesson.number}
					</div>

					{/* Content */}
					<div className="flex-1 min-w-0">
						<p className={`text-xs mb-0.5 ${lesson.isLocked ? "text-[#c4c4c4]" : "text-[#838383]"}`}>
							Lesson {lesson.number}
						</p>
						<h4 className={`font-bold truncate ${lesson.isLocked ? "text-[#c4c4c4]" : "text-[#2b2b2b]"}`}>
							{lesson.title}
						</h4>
					</div>

					{lesson.isLocked && (
						<Lock className="w-5 h-5 text-[#c4c4c4] flex-shrink-0" />
					)}
				</div>
			))}
		</div>
	);
}
