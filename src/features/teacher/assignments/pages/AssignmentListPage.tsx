// src/features/teacher/assignments/pages/AssignmentListPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Assignment {
	id: string;
	title: string;
	subject: string;
	class: string;
	dueDate: string;
	totalMarks: number;
	submissionsCount: number;
	totalStudents: number;
	status: "draft" | "published" | "closed";
}

export default function AssignmentListPage() {
	const navigate = useNavigate();
	const [assignments] = useState<Assignment[]>([
		{
			id: "1",
			title: "Quadratic Equations Practice",
			subject: "Mathematics",
			class: "Grade 10",
			dueDate: "2024-09-25",
			totalMarks: 50,
			submissionsCount: 18,
			totalStudents: 25,
			status: "published"
		},
		{
			id: "2",
			title: "Newton's Laws of Motion",
			subject: "Physics",
			class: "Grade 11",
			dueDate: "2024-09-28",
			totalMarks: 75,
			submissionsCount: 12,
			totalStudents: 18,
			status: "published"
		},
		{
			id: "3",
			title: "Chemical Bonding Assessment",
			subject: "Chemistry",
			class: "Grade 12",
			dueDate: "2024-09-30",
			totalMarks: 100,
			submissionsCount: 0,
			totalStudents: 22,
			status: "draft"
		}
	]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "published":
				return "bg-green-100 text-green-800";
			case "draft":
				return "bg-yellow-100 text-yellow-800";
			case "closed":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
					<p className="text-gray-600 mt-1">Manage your assignments and track submissions</p>
				</div>
				<button
					onClick={() => navigate("/teacher/assignments/create")}
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Create Assignment
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center">
						<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
							<span className="text-blue-600 text-lg">📝</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Total Assignments</p>
							<p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center">
						<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
							<span className="text-green-600 text-lg">✅</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Published</p>
							<p className="text-2xl font-bold text-gray-900">
								{assignments.filter(a => a.status === "published").length}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center">
						<div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
							<span className="text-yellow-600 text-lg">📄</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Drafts</p>
							<p className="text-2xl font-bold text-gray-900">
								{assignments.filter(a => a.status === "draft").length}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center">
						<div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
							<span className="text-purple-600 text-lg">📊</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Total Submissions</p>
							<p className="text-2xl font-bold text-gray-900">
								{assignments.reduce((sum, a) => sum + a.submissionsCount, 0)}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Assignments Table */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<h3 className="text-lg font-medium text-gray-900">Recent Assignments</h3>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Assignment
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Subject
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Due Date
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Submissions
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{assignments.map((assignment) => (
								<tr key={assignment.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">
												{assignment.title}
											</div>
											<div className="text-sm text-gray-500">
												{assignment.class} • {assignment.totalMarks} marks
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{assignment.subject}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{new Date(assignment.dueDate).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{assignment.submissionsCount}/{assignment.totalStudents}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
											{assignment.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex space-x-2">
											<button className="text-blue-600 hover:text-blue-900">
												View
											</button>
											<button className="text-green-600 hover:text-green-900">
												Grade
											</button>
											<button className="text-gray-600 hover:text-gray-900">
												Edit
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}