import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Lock, User, Phone } from "lucide-react";
import { mockSubjectDetails } from "../config/childConfig";

export default function SubjectDetailPage() {
	const navigate = useNavigate();
	const { subjectId } = useParams<{ subjectId: string }>();

	const subject = mockSubjectDetails[subjectId || "1"];

	if (!subject) {
		return (
			<div className="bg-white rounded-lg p-8">
				<p>Subject not found</p>
			</div>
		);
	}

	const handleLessonClick = (lessonId: string, status: string) => {
		if (status === "locked") return;
		navigate(`/parent/child/subject/${subjectId}/lesson/${lessonId}`);
	};

	return (
		<div>
			{/* Header */}
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate("/parent/child")}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
					<ChevronLeft className="w-5 h-5 text-gray-700" />
				</button>
				<h1 className="text-xl font-semibold text-gray-900">
					{subject.name} | Lessons
				</h1>
			</div>

			{/* Description Card */}
			<div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
				<p className="text-sm text-gray-700 leading-relaxed mb-4">
					{subject.description}
				</p>

				{/* Progress Bar */}
				<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
					<div
						className="bg-orange-500 h-2 rounded-full transition-all duration-300"
						style={{ width: `${subject.progress}%` }}
					/>
				</div>

				{/* Teacher Info */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm text-gray-700">
						<User className="w-4 h-4" />
						<span>Teacher: {subject.teacher}</span>
					</div>
					<div className="flex items-center gap-2">
						<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
							<Phone className="w-4 h-4 text-gray-600" />
						</button>
						<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
							<User className="w-4 h-4 text-gray-600" />
						</button>
					</div>
				</div>
			</div>

			{/* Lessons Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{subject.lessons.map((lesson) => {
					const isLocked = lesson.status === "locked";
					const isCompleted = lesson.status === "completed";
					const isInProgress = lesson.status === "in_progress";

					return (
						<div
							key={lesson.id}
							onClick={() => handleLessonClick(lesson.id, lesson.status)}
							className={`rounded-lg p-4 flex items-center justify-between transition-all ${
								isLocked
									? "bg-white border border-gray-200 cursor-not-allowed opacity-60"
									: isInProgress
									? "bg-yellow-100 border border-yellow-200 cursor-pointer hover:shadow-md"
									: "bg-white border border-gray-200 cursor-pointer hover:shadow-md"
							}`}>
							{/* Number Badge */}
							<div
								className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
									isInProgress
										? "bg-yellow-400 text-gray-900"
										: isCompleted
										? "bg-green-500 text-white"
										: "bg-gray-200 text-gray-600"
								}`}>
								{lesson.number}
							</div>

							{/* Lesson Info */}
							<div className="flex-1 mx-3">
								<p className="text-xs text-gray-600 mb-1">
									Lesson {lesson.number}
								</p>
								<p className="text-sm font-semibold text-gray-900">
									{lesson.title}
								</p>
							</div>

							{/* Lock Icon */}
							{isLocked && <Lock className="w-4 h-4 text-gray-400" />}
						</div>
					);
				})}
			</div>
		</div>
	);
}
