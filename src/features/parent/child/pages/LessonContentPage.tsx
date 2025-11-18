import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Play, FileText, ClipboardList, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParentContext } from "../../context/ParentContext";
import { parentApiClient } from "../../api/parentApiClient";

export default function LessonContentPage() {
	const navigate = useNavigate();
	const { subjectId, lessonId } = useParams<{
		subjectId: string;
		lessonId: string;
	}>();
	const { selectedChild } = useParentContext();

	// Fetch lesson detail
	const { data: lessonData, isLoading } = useQuery({
		queryKey: ["lesson-detail", selectedChild?._id, lessonId],
		queryFn: async () => {
			if (!selectedChild || !lessonId) return null;
			const response = await parentApiClient.getLessonDetail(
				selectedChild._id,
				lessonId
			);
			return response.data;
		},
		enabled: !!selectedChild && !!lessonId,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
			</div>
		);
	}

	if (!lessonData) {
		return (
			<div className="bg-white rounded-lg p-8">
				<p>Lesson not found</p>
			</div>
		);
	}

	const lesson = lessonData.lesson;

	const getIcon = (type: string) => {
		switch (type) {
			case "video":
				return <Play className="w-5 h-5" />;
			case "quiz":
				return <ClipboardList className="w-5 h-5" />;
			default:
				return <FileText className="w-5 h-5" />;
		}
	};

	const getIconColor = (type: string) => {
		switch (type) {
			case "video":
				return "bg-red-50 text-red-600";
			case "quiz":
				return "bg-orange-50 text-orange-600";
			default:
				return "bg-orange-50 text-orange-600";
		}
	};

	// Split content into two columns
	const contents = lesson.content || [];
	const leftColumn = contents.filter((_: any, index: number) => index % 2 === 0);
	const rightColumn = contents.filter((_: any, index: number) => index % 2 === 1);

	return (
		<div>
			{/* Header */}
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate(`/parent/child/subject/${subjectId}`)}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
					<ChevronLeft className="w-5 h-5 text-gray-700" />
				</button>
				<h1 className="text-xl font-semibold text-gray-900">Lesson content</h1>
			</div>

			{/* Lesson Title Card */}
			<div
				className="rounded-lg p-6 mb-6"
				style={{ backgroundColor: "#FFEFE9" }}>
				<h2 className="text-2xl font-bold text-gray-900">
					{lesson.title}
				</h2>
			</div>

			{/* Content Section */}
			<div className="bg-white rounded-lg p-6 border border-gray-200">
				<h3 className="text-base font-semibold text-gray-900 mb-4">Content</h3>

				{contents.length === 0 ? (
					<p className="text-sm text-gray-500 text-center py-8">No content available for this lesson</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Left Column */}
					<div className="space-y-3">
						{leftColumn.map((content: any) => (
							<div
								key={content._id}
								className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
								{/* Icon */}
								<div
									className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(
										content.type
									)}`}>
									{getIcon(content.type)}
								</div>

								{/* Content Info */}
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">
										{content.title}
									</p>
									<p className="text-xs text-gray-600 truncate">
										{content.description || content.type}
									</p>
								</div>

								{/* Completed Check */}
								{content.isCompleted && (
									<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
										<Check className="w-4 h-4 text-white" />
									</div>
								)}
							</div>
						))}
					</div>

					{/* Right Column */}
					<div className="space-y-3">
						{rightColumn.map((content: any) => (
							<div
								key={content._id}
								className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
								{/* Icon */}
								<div
									className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(
										content.type
									)}`}>
									{getIcon(content.type)}
								</div>

								{/* Content Info */}
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">
										{content.title}
									</p>
									<p className="text-xs text-gray-600 truncate">
										{content.description || content.type}
									</p>
								</div>

								{/* Completed Check */}
								{content.isCompleted && (
									<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
										<Check className="w-4 h-4 text-white" />
									</div>
								)}
							</div>
						))}
					</div>
				</div>
				)}
			</div>
		</div>
	);
}
