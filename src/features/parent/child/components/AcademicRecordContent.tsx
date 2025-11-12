import { useNavigate } from "react-router-dom";
import { ChevronDown, Download } from "lucide-react";

const mockSubjectGrades = [
	{ id: "1", name: "Further Maths", icon: "🧮", score: 52, color: "bg-blue-100" },
	{ id: "2", name: "Legal", icon: "⚖️", score: 52, color: "bg-purple-100" },
	{ id: "3", name: "English", icon: "📚", score: 52, color: "bg-green-100" },
	{ id: "4", name: "Further Maths", icon: "🧮", score: 52, color: "bg-blue-100" },
	{ id: "5", name: "Biology", icon: "🔬", score: 52, color: "bg-green-100" },
	{ id: "6", name: "English", icon: "📚", score: 52, color: "bg-teal-100" },
	{ id: "7", name: "Further Maths", icon: "🧮", score: 52, color: "bg-indigo-100" },
	{ id: "8", name: "Biology", icon: "🔬", score: 52, color: "bg-lime-100" },
	{ id: "9", name: "English", icon: "📚", score: 52, color: "bg-cyan-100" },
];

export default function AcademicRecordContent() {
	const navigate = useNavigate();

	return (
		<div>
			{/* Filters */}
			<div className="flex flex-wrap gap-4 mb-6">
				<div className="flex items-center gap-2">
					<label className="text-sm text-gray-600">Child</label>
					<div className="relative">
						<select className="px-4 py-2 pr-10 border border-gray-200 rounded-lg appearance-none bg-white">
							<option>Select child</option>
						</select>
						<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
					</div>
				</div>
				<div className="flex items-center gap-2">
					<label className="text-sm text-gray-600">Class</label>
					<select className="px-4 py-2 border border-gray-200 rounded-lg bg-white">
						<option>JSS 3</option>
					</select>
				</div>
				<div className="flex items-center gap-2">
					<label className="text-sm text-gray-600">Session:</label>
					<select className="px-4 py-2 border border-gray-200 rounded-lg bg-white">
						<option>2023/2024</option>
					</select>
				</div>
				<div className="flex items-center gap-2">
					<label className="text-sm text-gray-600">Term:</label>
					<select className="px-4 py-2 border border-gray-200 rounded-lg bg-white">
						<option>1st term</option>
					</select>
				</div>
			</div>

			{/* Subjects Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
				{mockSubjectGrades.map((subject) => (
					<div
						key={subject.id}
						onClick={() => navigate(`/parent/academic-record/subject/${subject.id}`)}
						className={`${subject.color} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}>
						<div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center text-2xl mb-3">
							{subject.icon}
						</div>
						<h3 className="text-sm font-semibold text-gray-900 mb-2">{subject.name}</h3>
						<p className="text-xs text-gray-600 mb-1">Learn about how biology began</p>
						<p className="text-2xl font-bold text-gray-900">{subject.score}%</p>
					</div>
				))}
			</div>

			{/* Summary */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div className="bg-white rounded-lg p-6 border border-gray-200">
					<h3 className="text-sm font-semibold text-gray-900 mb-3">Total Grade</h3>
					<p className="text-gray-600 text-sm mb-2">Lorem ipsum dolor sit amet</p>
					<p className="text-4xl font-bold text-gray-900">80%</p>
				</div>
				<div className="bg-white rounded-lg p-6 border border-gray-200">
					<h3 className="text-sm font-semibold text-gray-900 mb-3">Remark</h3>
					<p className="text-gray-600 text-sm mb-2">Title</p>
					<p className="text-sm text-gray-900">Suggestions</p>
				</div>
			</div>

			<button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2">
				<Download className="w-5 h-5" />
				Download result
			</button>
		</div>
	);
}
