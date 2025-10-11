import { useNavigate } from "react-router-dom";
import { useAssignments, useDeleteAssignment } from "../hooks/useAssignments";
import { Loader2, Trash2 } from "lucide-react";

export default function AssignmentListPage() {
	const navigate = useNavigate();
	const { data: assignmentsData, isLoading, error } = useAssignments();
	const deleteAssignment = useDeleteAssignment();

	const assignments = assignmentsData?.data.assignments || [];
	const total = assignmentsData?.data.total || 0;

	// Calculate stats
	const publishedCount = assignments.length; // All returned assignments are published
	const totalSubmissions = 0; // Will be calculated when we have submissions endpoint

	// Helper to get subject name
	const getSubjectName = (assignment: any) => {
		if (typeof assignment.subject === 'object' && assignment.subject?.name) {
			return assignment.subject.name;
		}
		return 'N/A';
	};

	// Helper to get class name
	const getClassName = (assignment: any) => {
		if (typeof assignment.class === 'object' && assignment.class?.class) {
			return assignment.class.class;
		}
		return 'N/A';
	};

	// Format due date
	const formatDueDate = (dueDate: string) => {
		try {
			return new Date(dueDate).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return dueDate;
		}
	};

	// Calculate status based on due date
	const getAssignmentStatus = (assignment: any) => {
		const now = new Date();
		const dueDateTime = new Date(assignment.dueTime || assignment.dueDate);

		if (dueDateTime < now) {
			return { label: 'Expired', color: 'bg-gray-100 text-gray-800' };
		}

		const hoursUntilDue = (dueDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
		if (hoursUntilDue <= 24) {
			return { label: 'Due Soon', color: 'bg-red-100 text-red-800' };
		}

		return { label: 'Active', color: 'bg-green-100 text-green-800' };
	};

	const handleDelete = async (id: string) => {
		if (window.confirm('Are you sure you want to delete this assignment?')) {
			await deleteAssignment.mutateAsync(id);
		}
	};

	const handleViewAssignment = (id: string) => {
		navigate(`/teacher/assignments/${id}`);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-lg p-4">
				<p className="text-red-800">Failed to load assignments. Please try again.</p>
			</div>
		);
	}

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
							<p className="text-2xl font-bold text-gray-900">{total}</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center">
						<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
							<span className="text-green-600 text-lg">✅</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Active</p>
							<p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center">
						<div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
							<span className="text-yellow-600 text-lg">⏰</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Overdue</p>
							<p className="text-2xl font-bold text-gray-900">
								{assignments.filter(a => new Date(a.dueTime || a.dueDate) < new Date()).length}
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
							<p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Assignments Table */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<h3 className="text-lg font-medium text-gray-900">All Assignments</h3>
				</div>
				{assignments.length === 0 ? (
					<div className="px-6 py-12 text-center">
						<p className="text-gray-500">No assignments yet. Create your first assignment!</p>
					</div>
				) : (
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
										Class
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Due Date
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
								{assignments.map((assignment) => {
									const status = getAssignmentStatus(assignment);
									return (
										<tr key={assignment._id} className="hover:bg-gray-50">
											<td className="px-6 py-4">
												<div>
													<div className="text-sm font-medium text-gray-900">
														{assignment.title}
													</div>
													<div className="text-sm text-gray-500 line-clamp-1">
														{assignment.description}
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{getSubjectName(assignment)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{getClassName(assignment)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{formatDueDate(assignment.dueDate)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
													{status.label}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<div className="flex items-center space-x-3">
													<button
														onClick={() => handleViewAssignment(assignment._id)}
														className="text-blue-600 hover:text-blue-900"
													>
														View
													</button>
													<button
														onClick={() => navigate(`/teacher/assignments/${assignment._id}/edit`)}
														className="text-gray-600 hover:text-gray-900"
													>
														Edit
													</button>
													<button
														onClick={() => handleDelete(assignment._id)}
														className="text-red-600 hover:text-red-900"
														disabled={deleteAssignment.isPending}
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
