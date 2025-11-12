import { useNavigate } from "react-router-dom";
import { ChevronLeft, BookOpen, FileText, ClipboardList } from "lucide-react";

export default function GradeBreakdownPage() {
	const navigate = useNavigate();

	const assessments = [
		{ type: "Assignment", name: "Paper 10/20", grade: 80, icon: FileText },
		{ type: "Exam", name: "Paper 10/20", grade: 80, icon: ClipboardList },
		{ type: "CA Test", name: "Paper 10/20", grade: 80, icon: BookOpen },
		{ type: "Exam", name: "Paper 10/20", grade: 80, icon: ClipboardList },
	];

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
				<div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center text-3xl">
					🧮
				</div>
				<div className="flex-1">
					<h2 className="text-lg font-bold text-gray-900">Further Maths</h2>
					<p className="text-sm text-gray-600">Paper 10/20 - 10AM</p>
				</div>
				<div className="text-right">
					<p className="text-3xl font-bold text-gray-900">100%</p>
				</div>
			</div>

			{/* Assessments */}
			<div className="space-y-3 mb-6">
				{assessments.map((assessment, index) => {
					const Icon = assessment.icon;
					return (
						<div
							key={index}
							className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
									<Icon className="w-5 h-5 text-gray-600" />
								</div>
								<div>
									<p className="text-sm font-semibold text-gray-900">
										{assessment.type}
									</p>
									<p className="text-xs text-gray-600">{assessment.name}</p>
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
											(assessment.grade / 100) * 125.6
										} 125.6`}
										strokeLinecap="round"
									/>
								</svg>
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="text-xs font-bold text-gray-900">
										{assessment.grade}%
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
						<p className="text-sm text-gray-600 mb-1">Total Grade</p>
						<p className="text-2xl font-bold text-gray-900">80%</p>
					</div>
					<div>
						<p className="text-sm text-gray-600 mb-1">Session</p>
						<p className="text-2xl font-bold text-gray-900">20/22</p>
					</div>
				</div>
			</div>

			{/* Teacher's Remark */}
			<div className="bg-white rounded-lg p-6 border border-gray-200">
				<h3 className="text-base font-semibold text-gray-900 mb-2">
					Teacher's remark
				</h3>
				<p className="text-sm text-gray-600 mb-1">Title</p>
				<p className="text-sm text-gray-900">Suggestions</p>
			</div>
		</div>
	);
}
