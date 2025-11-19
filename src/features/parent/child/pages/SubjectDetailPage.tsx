import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Lock, User, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParentContext } from "../../context/ParentContext";
import { parentApiClient } from "../../api/parentApiClient";

export default function SubjectDetailPage() {
	const navigate = useNavigate();
	const { subjectId } = useParams<{ subjectId: string }>();
	const { selectedChild } = useParentContext();

	// Fetch subject lessons
	const { data: lessonsData, isLoading } = useQuery({
		queryKey: ["subject-lessons", selectedChild?._id, subjectId],
		queryFn: async () => {
			if (!selectedChild || !subjectId) return null;
			const response = await parentApiClient.getSubjectLessons(
				selectedChild._id,
				subjectId
			);
			return response.data;
		},
		enabled: !!selectedChild && !!subjectId,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
			</div>
		);
	}

	if (!lessonsData) {
		return (
			<div className="bg-white rounded-lg p-8">
				<p>Subject not found</p>
			</div>
		);
	}

	const subject = lessonsData.subject;
	const lessons = lessonsData.lessons;

	const handleLessonClick = (lessonId: string, isCompleted: boolean) => {
		// Allow navigation to completed lessons
		if (isCompleted) {
			navigate(`/parent/child/subject/${subjectId}/lesson/${lessonId}`);
		}
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
					{(subject as any).description || "No description available"}
				</p>

				{/* Progress Bar */}
				<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
					<div
						className="bg-orange-500 h-2 rounded-full transition-all duration-300"
						style={{ width: `${subject.overallProgress || 0}%` }}
					/>
				</div>

				{/* Teacher Info */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm text-gray-700">
						<User className="w-4 h-4" />
						<span>Teacher: {subject.teacher?.fullName || "Not assigned"}</span>
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
			{lessons && lessons.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{lessons.map((lesson, index) => {
						const isCompleted = lesson.isCompleted;
						const lessonNumber = index + 1;

						return (
							<div
								key={lesson._id}
								onClick={() => handleLessonClick(lesson._id, isCompleted)}
								className={`rounded-lg p-4 flex items-center justify-between transition-all ${
									!isCompleted
										? "bg-white border border-gray-200 cursor-not-allowed opacity-60"
										: "bg-white border border-gray-200 cursor-pointer hover:shadow-md"
								}`}>
								{/* Number Badge */}
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
										isCompleted
											? "bg-green-500 text-white"
											: "bg-gray-200 text-gray-600"
									}`}>
									{lessonNumber}
								</div>

								{/* Lesson Info */}
								<div className="flex-1 mx-3">
									<p className="text-xs text-gray-600 mb-1">
										Lesson {lessonNumber}
									</p>
									<p className="text-sm font-semibold text-gray-900">
										{lesson.title}
									</p>
								</div>

								{/* Lock Icon */}
								{!isCompleted && <Lock className="w-4 h-4 text-gray-400" />}
							</div>
						);
					})}
				</div>
			) : (
				<div className="bg-white rounded-lg p-8 text-center border border-gray-200">
					<p className="text-gray-500">No lessons available for this subject</p>
				</div>
			)}
		</div>
	);
}
