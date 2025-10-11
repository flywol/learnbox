import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock, Upload, X } from "lucide-react";
import { useCreateAssignment } from "../hooks/useAssignments";
import { subjectsClassesApiClient } from "../../classroom/api/subjectsClassesApiClient";

const assignmentSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	subject: z.string().min(1, "Subject is required"),
	class: z.string().min(1, "Class is required"),
	classArm: z.string().optional(),
	dueDate: z.string().min(1, "Due date is required"),
	dueTime: z.string().min(1, "Due time is required"),
	acceptLateSubmissions: z.boolean().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

export default function CreateAssignmentPage() {
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [acceptLateSubmissions, setAcceptLateSubmissions] = useState(false);
	const createAssignment = useCreateAssignment();

	// Fetch teacher's subjects and classes
	const { data: subjectsClassesData, isLoading: loadingSubjects } = useQuery({
		queryKey: ['teacher-subjects-classes'],
		queryFn: () => subjectsClassesApiClient.getTeacherSubjectsAndClasses(),
		staleTime: 5 * 60 * 1000,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AssignmentFormData>({
		resolver: zodResolver(assignmentSchema),
	});

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const onSubmit = async (data: AssignmentFormData) => {
		// Combine date and time into ISO datetime for dueTime
		const dueDateTimeString = `${data.dueDate}T${data.dueTime}:00Z`;

		const assignmentData = {
			title: data.title,
			description: data.description,
			dueDate: data.dueDate,
			dueTime: dueDateTimeString,
			acceptLateSubmissions,
			class: data.class,
			classArm: data.classArm,
			subject: data.subject,
			file: file || undefined,
		};

		try {
			await createAssignment.mutateAsync(assignmentData);
			navigate("/teacher/assignments");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/teacher/assignments");
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Create Assignment</h1>
				<p className="text-gray-600 mt-1">Create a new assignment for your students</p>
			</div>

			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Title */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Assignment Title *
						</label>
						<input
							{...register("title")}
							type="text"
							className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
								errors.title ? "border-red-300" : "border-gray-300"
							}`}
							placeholder="Enter assignment title"
						/>
						{errors.title && (
							<p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
						)}
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description *
						</label>
						<textarea
							{...register("description")}
							rows={4}
							className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
								errors.description ? "border-red-300" : "border-gray-300"
							}`}
							placeholder="Enter assignment description and instructions"
						/>
						{errors.description && (
							<p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
						)}
					</div>

					{/* Subject and Class */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Subject *
							</label>
							<select
								{...register("subject")}
								className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
									errors.subject ? "border-red-300" : "border-gray-300"
								}`}
								disabled={loadingSubjects}
							>
								<option value="">Select Subject</option>
								{subjectsClassesData?.assignedSubjects?.map((subject: any) => (
									<option key={subject._id} value={subject._id}>
										{subject.name}
									</option>
								))}
							</select>
							{errors.subject && (
								<p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Class *
							</label>
							<select
								{...register("class")}
								className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
									errors.class ? "border-red-300" : "border-gray-300"
								}`}
								disabled={loadingSubjects}
							>
								<option value="">Select Class</option>
								{subjectsClassesData?.classes?.map((cls: any) => (
									<option key={cls.id} value={cls.id}>
										{cls.name}
									</option>
								))}
							</select>
							{errors.class && (
								<p className="mt-1 text-sm text-red-600">{errors.class.message}</p>
							)}
						</div>
					</div>

					{/* Class Arm (Optional) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Class Arm (Optional)
						</label>
						<input
							{...register("classArm")}
							type="text"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="e.g., A, B, Alpha"
						/>
					</div>

					{/* Due Date and Time */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Due Date *
							</label>
							<div className="relative">
								<input
									{...register("dueDate")}
									type="date"
									className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
										errors.dueDate ? "border-red-300" : "border-gray-300"
									}`}
								/>
								<Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
							</div>
							{errors.dueDate && (
								<p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Due Time *
							</label>
							<div className="relative">
								<input
									{...register("dueTime")}
									type="time"
									className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
										errors.dueTime ? "border-red-300" : "border-gray-300"
									}`}
								/>
								<Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
							</div>
							{errors.dueTime && (
								<p className="mt-1 text-sm text-red-600">{errors.dueTime.message}</p>
							)}
						</div>
					</div>

					{/* Accept Late Submissions Toggle */}
					<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
						<span className="text-sm font-medium text-gray-700">
							Accept submission after due date
						</span>
						<button
							type="button"
							onClick={() => setAcceptLateSubmissions(!acceptLateSubmissions)}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								acceptLateSubmissions ? "bg-blue-600" : "bg-gray-200"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									acceptLateSubmissions ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					{/* File Upload */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Attachment (Optional)
						</label>
						<div className="mt-1">
							{!file ? (
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<Upload className="mx-auto h-12 w-12 text-gray-400" />
									<p className="mt-2 text-sm text-gray-600">
										Click to upload or drag and drop
									</p>
									<p className="text-xs text-gray-500">PDF, DOC, DOCX, PNG, JPG (max 10MB)</p>
								</button>
							) : (
								<div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
									<div className="flex items-center space-x-3">
										<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
											<span className="text-green-600">📎</span>
										</div>
										<div>
											<p className="text-sm font-medium text-green-900">{file.name}</p>
											<p className="text-xs text-green-600">
												{(file.size / 1024 / 1024).toFixed(2)} MB
											</p>
										</div>
									</div>
									<button
										type="button"
										onClick={handleRemoveFile}
										className="text-green-600 hover:text-green-800"
									>
										<X className="w-5 h-5" />
									</button>
								</div>
							)}
							<input
								ref={fileInputRef}
								type="file"
								className="hidden"
								onChange={handleFileSelect}
								accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
							/>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center gap-4 pt-4">
						<button
							type="submit"
							disabled={createAssignment.isPending}
							className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{createAssignment.isPending ? "Creating..." : "Create Assignment"}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							disabled={createAssignment.isPending}
							className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
