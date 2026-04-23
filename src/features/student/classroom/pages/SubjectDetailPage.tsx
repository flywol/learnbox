import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Phone } from "lucide-react";
import { useClassroomStore } from "../store/classroomStore";
import StudentLessonsGrid from "../components/StudentLessonsGrid";
import QuizTab from "../components/QuizTab";
import AssignmentTab from "../components/AssignmentTab";
import LockedLessonModal from "../components/LockedLessonModal";
import CourseOverviewCard from "../../../../common/components/CourseOverviewCard";
import { SubjectTab, StudentLesson } from "../types/classroom.types";

const SUBJECT_DESCRIPTIONS: Record<string, string> = {
	Biology: "Explore the fascinating world of living organisms, from microscopic cells to complex ecosystems. Dive into the science of life, evolution, and the interconnectedness of all living things.",
};

const DEFAULT_DESCRIPTION =
	"Explore this subject in depth. Build a strong understanding of core concepts through structured lessons and assessments.";

export default function SubjectDetailPage() {
	const { subjectId } = useParams<{ subjectId: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<SubjectTab>("lesson");
	const [lockedLesson, setLockedLesson] = useState<StudentLesson | null>(null);

	const { getSubjectById, getLessonsBySubject, getQuizzesBySubject } = useClassroomStore();

	const subject = subjectId ? getSubjectById(subjectId) : undefined;
	const lessons = subjectId ? getLessonsBySubject(subjectId) : [];
	const quizzes = subjectId ? getQuizzesBySubject(subjectId) : [];

	if (!subject) {
		return (
			<div className="bg-white rounded-2xl shadow-sm p-12 text-center text-[#838383]">
				Subject not found
			</div>
		);
	}

	const handleLessonClick = (lesson: StudentLesson) => {
		if (lesson.isLocked) {
			setLockedLesson(lesson);
		} else {
			navigate(`/student/classroom/subject/${subjectId}/lesson/${lesson.id}`);
		}
	};

	const tabs: { id: SubjectTab; label: string }[] = [
		{ id: "lesson", label: "Lesson" },
		{ id: "live-class", label: "Live class" },
		{ id: "quiz", label: "Quiz" },
		{ id: "assignment", label: "Assignment" },
	];

	const description = SUBJECT_DESCRIPTIONS[subject.name] ?? DEFAULT_DESCRIPTION;

	return (
		<div className="bg-white rounded-2xl shadow-sm overflow-hidden">
			{/* Header */}
			<div className="flex items-center gap-3 px-8 py-5 border-b border-[#eeeeee]">
				<button
					onClick={() => navigate("/student/classroom")}
					className="p-1.5 hover:bg-[#eeeeee] rounded-lg transition-colors flex-shrink-0"
				>
					<ChevronLeft className="w-5 h-5 text-[#2b2b2b]" />
				</button>
				<h1 className="text-2xl font-bold text-[#2b2b2b]">{subject.name}</h1>
			</div>

			{/* Sub-tabs */}
			<div className="flex gap-8 px-8 border-b border-[#eeeeee]">
				{tabs.map((tab) => (
					<div key={tab.id} className="flex flex-col">
						<button
							onClick={() => setActiveTab(tab.id)}
							className={`py-3 text-base font-medium transition-colors ${
								activeTab === tab.id
									? "text-[#2b2b2b] font-semibold"
									: "text-[#838383]"
							}`}
						>
							{tab.label}
						</button>
						{activeTab === tab.id && (
							<div className="h-0.5 bg-[#fd5d26] rounded-full" />
						)}
					</div>
				))}
			</div>

			{/* Content */}
			<div className="p-8 space-y-6">
				{/* Lesson Tab */}
				{activeTab === "lesson" && (
					<div className="space-y-6">
						<CourseOverviewCard
							description={description}
							progress={subject.progressPercentage || 0}
							showProgress={true}
						/>

						{/* Teacher row */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-[#d6e4f0] rounded-full flex-shrink-0" />
								<div>
									<p className="text-xs text-[#6b6b6b]">Teacher:</p>
									<p className="text-base font-bold text-[#2b2b2b]">{subject.teacher}</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<button className="p-2 hover:bg-[#eeeeee] rounded-lg transition-colors">
									<MessageCircle className="w-5 h-5 text-[#6b6b6b]" />
								</button>
								<button className="p-2 hover:bg-[#eeeeee] rounded-lg transition-colors">
									<Phone className="w-5 h-5 text-[#6b6b6b]" />
								</button>
							</div>
						</div>

						<StudentLessonsGrid lessons={lessons} onLessonClick={handleLessonClick} />
					</div>
				)}

				{/* Live Class Tab */}
				{activeTab === "live-class" && (
					<div className="flex flex-col items-center justify-center py-16 gap-4">
						<p className="text-[#838383] text-base">No live classes scheduled yet.</p>
						<button
							onClick={() => navigate("/student/live-class")}
							className="px-6 py-3 bg-[#fd5d26] text-white rounded-xl font-semibold hover:bg-[#e84d17] transition-colors"
						>
							View All Live Classes
						</button>
					</div>
				)}

				{/* Quiz Tab */}
				{activeTab === "quiz" && <QuizTab quizzes={quizzes} />}

				{/* Assignment Tab */}
				{activeTab === "assignment" && <AssignmentTab />}
			</div>

			{lockedLesson && (
				<LockedLessonModal
					isOpen={!!lockedLesson}
					onClose={() => setLockedLesson(null)}
					lesson={lockedLesson}
				/>
			)}
		</div>
	);
}
