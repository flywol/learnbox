import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParentContext } from "../../context/ParentContext";
import { parentApiClient } from "../../api/parentApiClient";

export default function AcademicRecordContent() {
	const navigate = useNavigate();
	const { selectedChild } = useParentContext();
	const [selectedSession, setSelectedSession] = useState("");
	const [selectedTerm, setSelectedTerm] = useState("");

	// Fetch academic record summary
	const { data: academicData, isLoading: isLoadingAcademic } = useQuery({
		queryKey: ["academic-record", selectedChild?._id],
		queryFn: async () => {
			if (!selectedChild) return null;
			const response = await parentApiClient.getAcademicRecord(selectedChild._id);
			return response.data;
		},
		enabled: !!selectedChild,
	});

	// Set default session and term when data loads
	const sessions = academicData?.sessions || [];
	const currentSession = selectedSession || sessions[0]?._id;
	const currentTerm = selectedTerm || "first";

	// Fetch detailed grades for selected session and term
	const { data: gradesData, isLoading: isLoadingGrades } = useQuery({
		queryKey: ["academic-grades", selectedChild?._id, currentSession, currentTerm],
		queryFn: async () => {
			if (!selectedChild || !currentSession) return null;
			const response = await parentApiClient.getAcademicGrades(
				selectedChild._id,
				currentSession,
				currentTerm
			);
			return response.data;
		},
		enabled: !!selectedChild && !!currentSession,
	});

	// Helper to get color for subject
	const getSubjectColor = (subjectName: string) => {
		const colors = [
			"bg-green-100",
			"bg-blue-100",
			"bg-purple-100",
			"bg-teal-100",
			"bg-lime-100",
			"bg-indigo-100",
			"bg-cyan-100",
			"bg-pink-100",
			"bg-orange-100",
		];
		const colorIndex = subjectName.charCodeAt(0) % colors.length;
		return colors[colorIndex];
	};

	const subjects = gradesData?.grades || [];
	const isLoading = isLoadingAcademic || isLoadingGrades;

	return (
		<div>
			{/* Filters */}
			<div className="flex flex-wrap gap-4 mb-6">
				<div className="flex items-center gap-2">
					<label className="text-sm text-gray-600">Class</label>
					<select className="px-4 py-2 border border-gray-200 rounded-lg bg-white" disabled>
						<option>{selectedChild?.classLevel || "N/A"}</option>
					</select>
				</div>
				<div className="flex items-center gap-2">
					<label className="text-sm text-gray-600">Session:</label>
					<select
						className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
						value={currentSession}
						onChange={(e) => setSelectedSession(e.target.value)}>
						{sessions.map((session: any) => (
							<option key={session._id} value={session._id}>
								{session.name}
							</option>
						))}
					</select>
				</div>
				<div className="flex items-center gap-2">
					<label className="text-sm text-gray-600">Term:</label>
					<select
						className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
						value={currentTerm}
						onChange={(e) => setSelectedTerm(e.target.value)}>
						<option value="first">1st term</option>
						<option value="second">2nd term</option>
						<option value="third">3rd term</option>
					</select>
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
				</div>
			) : subjects.length === 0 ? (
				<div className="text-center py-12 text-gray-500">
					No academic records found for the selected session and term
				</div>
			) : (
				<>
					{/* Subjects Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						{subjects.map((subject: any) => (
							<div
								key={subject._id}
								onClick={() => navigate(`/parent/academic-record/subject/${subject._id}`)}
								className={`${getSubjectColor(subject.subjectName)} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}>
								<div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center text-2xl font-bold mb-3">
									{subject.subjectName[0]}
								</div>
								<h3 className="text-sm font-semibold text-gray-900 mb-2">
									{subject.subjectName}
								</h3>
								<p className="text-xs text-gray-600 mb-1">
									{subject.assessmentCount} assessment{subject.assessmentCount !== 1 ? "s" : ""}
								</p>
								<p className="text-2xl font-bold text-gray-900">{subject.totalScore}%</p>
							</div>
						))}
					</div>

					{/* Summary */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<div className="bg-white rounded-lg p-6 border border-gray-200">
							<h3 className="text-sm font-semibold text-gray-900 mb-3">Average Grade</h3>
							<p className="text-gray-600 text-sm mb-2">Overall performance across all subjects</p>
							<p className="text-4xl font-bold text-gray-900">
								{gradesData?.averageScore ? `${gradesData.averageScore.toFixed(1)}%` : "N/A"}
							</p>
						</div>
						<div className="bg-white rounded-lg p-6 border border-gray-200">
							<h3 className="text-sm font-semibold text-gray-900 mb-3">Remark</h3>
							<p className="text-gray-600 text-sm mb-2">Performance Summary</p>
							<p className="text-sm text-gray-900">
								{gradesData?.remark || "Keep up the good work!"}
							</p>
						</div>
					</div>

					<button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2">
						<Download className="w-5 h-5" />
						Download result
					</button>
				</>
			)}
		</div>
	);
}
