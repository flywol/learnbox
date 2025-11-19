import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, BookOpen, FileText, ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParentContext } from "../../context/ParentContext";
import { parentApiClient } from "../../api/parentApiClient";

export default function GradeBreakdownPage() {
	const navigate = useNavigate();
	const { assessmentId } = useParams<{ assessmentId: string }>();
	const { selectedChild } = useParentContext();

	// Fetch grade breakdown
	const { data: breakdownData, isLoading } = useQuery({
		queryKey: ["grade-breakdown", selectedChild?._id, assessmentId],
		queryFn: async () => {
			if (!selectedChild || !assessmentId) return null;
			const response = await parentApiClient.getGradeBreakdown(
				selectedChild._id,
				assessmentId
			);
			return response.data;
		},
		enabled: !!selectedChild && !!assessmentId,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
			</div>
		);
	}

	if (!breakdownData) {
		return (
			<div className="bg-white rounded-lg p-8">
				<p>Grade breakdown not found</p>
			</div>
		);
	}

	const breakdown = (breakdownData as any).breakdown || breakdownData;
	const assessments = (breakdown as any).assessments || [];

	return (
		<div>
			{/* Header */}
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate("/parent/academic-record")}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
					<ChevronLeft className="w-5 h-5 text-gray-700" />
				</button>
				<h1 className="text-xl font-semibold text-gray-900">Grade Breakdown</h1>
			</div>

			{/* Subject Header */}
			<div className="bg-blue-100 rounded-lg p-4 flex items-center gap-4 mb-6">
				<div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center text-3xl font-bold">
					{((breakdown as any).subjectName || 'S')[0]}
				</div>
				<div className="flex-1">
					<h2 className="text-lg font-bold text-gray-900">{(breakdown as any).subjectName || 'Subject'}</h2>
					<p className="text-sm text-gray-600">{(breakdown as any).session || ''} - {(breakdown as any).term || ''}</p>
				</div>
				<div className="text-right">
					<p className="text-3xl font-bold text-gray-900">{(breakdown as any).totalScore || 0}%</p>
				</div>
			</div>

			{/* Assessments */}
			<div className="space-y-3 mb-6">
				{assessments.map((assessment: any, index: number) => {
					// Determine icon based on assessment type
					const getIcon = (type: string) => {
						switch (type.toLowerCase()) {
							case 'assignment':
								return FileText;
							case 'exam':
								return ClipboardList;
							case 'ca test':
							case 'test':
								return BookOpen;
							default:
								return FileText;
						}
					};
					const Icon = getIcon(assessment.type);

					return (
						<div
							key={assessment._id || index}
							className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
									<Icon className="w-5 h-5 text-gray-600" />
								</div>
								<div>
									<p className="text-sm font-semibold text-gray-900">
										{assessment.type}
									</p>
									<p className="text-xs text-gray-600">{assessment.title}</p>
								</div>
							</div>
							<div className="relative w-12 h-12">
								<svg className="w-12 h-12 transform -rotate-90">
									<circle
										cx="24"
										cy="24"
										r="20"
										stroke="#F97316"
										strokeWidth="4"
										fill="none"
										strokeDasharray={`${
											(assessment.score / 100) * 125.6
										} 125.6`}
										strokeLinecap="round"
									/>
								</svg>
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="text-xs font-bold text-gray-900">
										{assessment.score}%
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Overview */}
			<div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
				<h3 className="text-base font-semibold text-gray-900 mb-4">Overview</h3>
				<div className="grid grid-cols-2 gap-6">
					<div>
						<p className="text-sm text-gray-600 mb-1">Total Score</p>
						<p className="text-2xl font-bold text-gray-900">{(breakdown as any).totalScore || 0}%</p>
					</div>
					<div>
						<p className="text-sm text-gray-600 mb-1">Assessments</p>
						<p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
					</div>
				</div>
			</div>

			{/* Teacher's Remark */}
			<div className="bg-white rounded-lg p-6 border border-gray-200">
				<h3 className="text-base font-semibold text-gray-900 mb-2">
					Teacher's remark
				</h3>
				<p className="text-sm text-gray-900">
					{(breakdown as any).remark || "No remarks available"}
				</p>
			</div>
		</div>
	);
}
