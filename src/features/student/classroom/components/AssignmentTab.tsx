import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomStore } from "../store/classroomStore";

type AssignmentFilter = "all" | "pending" | "submitted";

export default function AssignmentTab() {
	const navigate = useNavigate();
	const [activeFilter, setActiveFilter] = useState<AssignmentFilter>("all");
	const { assignments } = useClassroomStore();

	const filteredAssignments = useMemo(() => {
		if (activeFilter === "all") return assignments;
		return assignments.filter((a) => a.status === activeFilter);
	}, [assignments, activeFilter]);

	const stats = useMemo(() => ({
		total: assignments.length,
		pending: assignments.filter((a) => a.status === "pending").length,
		submitted: assignments.filter((a) => a.status === "submitted" || a.status === "graded").length,
	}), [assignments]);

	const filters: { id: AssignmentFilter; label: string }[] = [
		{ id: "all", label: "All" },
		{ id: "pending", label: "Pending" },
		{ id: "submitted", label: "Submitted" },
	];

	const circumference = 2 * Math.PI * 40;
	const progress = stats.total > 0 ? (stats.submitted / stats.total) * circumference : 0;

	return (
		<div className="space-y-6">
			{/* Summary Card */}
			<div className="bg-[#fffde7] rounded-2xl p-6 flex items-center gap-6">
				<div className="relative flex-shrink-0">
					<svg className="w-24 h-24 -rotate-90">
						<circle cx="48" cy="48" r="40" stroke="#ffe082" strokeWidth="8" fill="none" />
						<circle
							cx="48" cy="48" r="40"
							stroke="#fd5d26" strokeWidth="8" fill="none"
							strokeDasharray={`${progress} ${circumference}`}
							strokeLinecap="round"
						/>
					</svg>
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-2xl font-bold text-[#2b2b2b]">{stats.submitted}</span>
						<span className="text-base text-[#6b6b6b]">/{stats.total}</span>
					</div>
				</div>

				<div className="flex-1">
					<h3 className="font-bold text-[#2b2b2b] text-lg mb-3">Assignment</h3>
					<div className="space-y-1 text-sm">
						<p className="text-[#2b2b2b]">Total: <span className="font-semibold">{stats.total > 0 ? stats.total : "--"}</span></p>
						<p className="text-[#2b2b2b]">Pending: <span className="font-semibold">{stats.total > 0 ? stats.pending : "--"}</span></p>
						<p className="text-[#2b2b2b]">Submitted: <span className="font-semibold">{stats.total > 0 ? stats.submitted : "--"}</span></p>
					</div>
				</div>

				<div className="hidden md:block w-20 h-20 flex-shrink-0 opacity-70">
					<img src="/images/student/assignmentbg.svg" alt="" className="w-full h-full object-contain" />
				</div>
			</div>

			{/* Filter tabs */}
			<div className="flex gap-6 border-b border-[#eeeeee]">
				{filters.map((f) => (
					<div key={f.id} className="flex flex-col">
						<button
							onClick={() => setActiveFilter(f.id)}
							className={`pb-3 text-base font-medium transition-colors ${
								activeFilter === f.id ? "text-[#2b2b2b] font-semibold" : "text-[#838383]"
							}`}
						>
							{f.label}
						</button>
						{activeFilter === f.id && <div className="h-0.5 bg-[#fd5d26] rounded-full" />}
					</div>
				))}
			</div>

			{/* Assignment list */}
			{filteredAssignments.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 gap-3">
					<img src="/images/onboarding/student-2.svg" alt="" className="w-28 h-28 opacity-70" />
					<p className="text-[#838383] text-base">No assignment yet</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{filteredAssignments.map((assignment) => (
						<div
							key={assignment.id}
							onClick={() =>
								assignment.status === "pending"
									? navigate(`/student/classroom/assignment/${assignment.id}`)
									: navigate(`/student/classroom/assignment/${assignment.id}/submitted`)
							}
							className="border border-[#d6d6d6] rounded-xl p-4 bg-white hover:shadow-sm transition-shadow cursor-pointer flex items-center justify-between gap-3"
						>
							<div className="flex-1 min-w-0">
								<h4 className="font-semibold text-[#2b2b2b] truncate">{assignment.title}</h4>
								<p className="text-sm text-[#838383] mt-0.5">
									Due {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
								</p>
							</div>
							<span className="bg-[#fd5d26] text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex-shrink-0">
								{assignment.status === "pending" ? "Go" : "View"}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
