// src/features/teacher/assignments/pages/CreateAssignmentPage.tsx
import { useState } from "react";

export default function CreateAssignmentPage() {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		subject: "",
		class: "",
		dueDate: "",
		totalMarks: "",
		assignmentType: "homework"
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement assignment creation
		console.log("Creating assignment:", formData);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Create Assignment</h1>
				<p className="text-gray-600 mt-1">Create a new assignment for your students</p>
			</div>

			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Assignment Title
							</label>
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter assignment title"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Assignment Type
							</label>
							<select
								name="assignmentType"
								value={formData.assignmentType}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="homework">Homework</option>
								<option value="classwork">Classwork</option>
								<option value="project">Project</option>
								<option value="quiz">Quiz</option>
								<option value="exam">Exam</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Subject
							</label>
							<select
								name="subject"
								value={formData.subject}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								required
							>
								<option value="">Select Subject</option>
								<option value="mathematics">Mathematics</option>
								<option value="physics">Physics</option>
								<option value="chemistry">Chemistry</option>
								<option value="biology">Biology</option>
								<option value="english">English</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Class
							</label>
							<select
								name="class"
								value={formData.class}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								required
							>
								<option value="">Select Class</option>
								<option value="grade-10">Grade 10</option>
								<option value="grade-11">Grade 11</option>
								<option value="grade-12">Grade 12</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Due Date
							</label>
							<input
								type="date"
								name="dueDate"
								value={formData.dueDate}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Total Marks
							</label>
							<input
								type="number"
								name="totalMarks"
								value={formData.totalMarks}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter total marks"
								min="1"
								required
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows={4}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter assignment description and instructions"
							required
						/>
					</div>

					<div className="flex items-center gap-4">
						<button
							type="submit"
							className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Create Assignment
						</button>
						<button
							type="button"
							className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
						>
							Save as Draft
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}