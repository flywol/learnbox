import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, PenLine, SlidersHorizontal } from "lucide-react";
import { studentApiClient, subjectMeta, type ApiAssessmentDetail } from "@/features/student/api/studentApiClient";

function ScoreBadge({ score }: { score: number }) {
	const circumference = 2 * Math.PI * 18;
	const offset = circumference - (score / 100) * circumference;
	return (
		<div className="relative w-12 h-12 flex-shrink-0">
			<svg className="w-12 h-12 -rotate-90">
				<circle cx="24" cy="24" r="18" stroke="#eeeeee" strokeWidth="3" fill="white" />
				<circle
					cx="24" cy="24" r="18"
					stroke="#fd5d26" strokeWidth="3" fill="none"
					strokeDasharray={`${circumference}`}
					strokeDashoffset={offset}
					strokeLinecap="round"
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-[10px] font-bold text-[#2b2b2b]">{score}%</span>
			</div>
		</div>
	);
}

export default function GradeBreakdownPage() {
	const navigate = useNavigate();
	const { subjectId } = useParams<{ subjectId: string }>();
	const [detail, setDetail] = useState<ApiAssessmentDetail | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!subjectId) return;
		const load = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const data = await studentApiClient.getAssessmentById(subjectId);
				setDetail(data);
			} catch (err: any) {
				setError(err.message || "Failed to load grade breakdown");
			} finally {
				setIsLoading(false);
			}
		};
		load();
	}, [subjectId]);

	if (isLoading) {
		return (
			<div className="bg-white rounded-2xl shadow-sm p-8 space-y-4 max-w-5xl">
				<div className="h-8 bg-gray-100 rounded animate-pulse w-48" />
				<div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
				<div className="grid grid-cols-3 gap-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white rounded-2xl shadow-sm p-8 max-w-5xl">
				<button onClick={() => navigate("/student/assessment")} className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-4">
					<ChevronLeft className="w-4 h-4" /> Back
				</button>
				<p className="text-sm text-red-500">{error}</p>
			</div>
		);
	}

	const subject = detail?.subject;
	const assessments = detail?.assessments ?? [];
	const overview = detail?.overview;
	const progressPct = subject
		? ((subject.lessonsCompleted ?? 0) / (subject.totalLessons || 1)) * 100
		: 0;
	const { icon } = subjectMeta(subject?.name ?? "");

	return (
		<div className="bg-white rounded-2xl shadow-sm p-8 space-y-6 max-w-5xl">
			{/* Header */}
			<div className="flex items-center gap-3">
				<button
					onClick={() => navigate("/student/assessment")}
					className="p-1.5 hover:bg-[#eeeeee] rounded-lg transition-colors"
				>
					<ChevronLeft className="w-5 h-5 text-[#2b2b2b]" />
				</button>
				<h1 className="text-2xl font-bold text-[#2b2b2b]">Grade Breakdown</h1>
			</div>

			{/* Subject card */}
			{subject && (
				<div className="bg-[#e9eeff] rounded-2xl p-6 flex items-start gap-4">
					<div className="w-14 h-14 bg-[#a3d4ff] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
						{icon}
					</div>
					<div className="flex-1 min-w-0">
						<h2 className="text-xl font-bold text-[#2b2b2b]">{subject.name}</h2>
						{subject.teacherName && (
							<p className="text-sm text-[#6b6b6b] mb-3">Teacher: {subject.teacherName}</p>
						)}
						<div className="space-y-1">
							<div className="w-full bg-white/60 rounded-full h-2">
								<div
									className="bg-[#2b2b2b] h-2 rounded-full transition-all"
									style={{ width: `${progressPct}%` }}
								/>
							</div>
							<div className="flex items-center justify-between text-xs text-[#6b6b6b]">
								<span>Lesson {subject.lessonsCompleted ?? 0}/{subject.totalLessons ?? 0}</span>
								<span className="font-semibold text-[#2b2b2b]">{subject.progress ?? Math.round(progressPct)}%</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Assessments grid */}
			{assessments.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{assessments.map((item) => {
						const id = item.id ?? item._id ?? Math.random().toString();
						const name = item.name ?? item.title ?? "Assessment";
						const type = item.type ?? "Quiz";
						const isAssignment = type.toLowerCase().includes("assignment");
						const score = item.score ?? 0;
						const date = item.date ?? item.createdAt
							? new Date(item.date ?? item.createdAt!).toLocaleDateString("en-GB", {
									day: "2-digit", month: "2-digit", year: "2-digit",
							  })
							: "";
						return (
							<div
								key={id}
								className="flex items-center justify-between p-4 border border-[#d6d6d6] rounded-xl bg-white"
							>
								<div className="flex items-center gap-3 min-w-0">
									<div className="w-9 h-9 bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0">
										{isAssignment
											? <PenLine className="w-4 h-4 text-[#6b6b6b]" />
											: <SlidersHorizontal className="w-4 h-4 text-[#6b6b6b]" />
										}
									</div>
									<div className="min-w-0">
										<p className="text-sm font-semibold text-[#2b2b2b] truncate">{name}</p>
										{date && <p className="text-xs text-[#6b6b6b]">Submitted on {date}</p>}
									</div>
								</div>
								<ScoreBadge score={score} />
							</div>
						);
					})}
				</div>
			)}

			{/* Overview */}
			{overview && (
				<div>
					<h3 className="text-xl font-bold text-[#2b2b2b] mb-3">Overview</h3>
					<div className="flex gap-4">
						<div className="border border-[#d6d6d6] rounded-xl p-5 flex-1">
							<p className="text-sm text-[#6b6b6b] mb-1">Grade</p>
							<p className="text-3xl font-bold text-[#2b2b2b]">{overview.grade ?? 0}%</p>
						</div>
						{overview.attendance && (
							<div className="border border-[#d6d6d6] rounded-xl p-5 flex-1">
								<p className="text-sm text-[#6b6b6b] mb-1">Attendance</p>
								<p className="text-3xl font-bold text-[#2b2b2b]">{overview.attendance}</p>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Teacher's remark */}
			<div>
				<h3 className="text-xl font-bold text-[#2b2b2b] mb-3">Teacher's remark</h3>
				<div className="border border-[#d6d6d6] rounded-xl p-6 space-y-4">
					<div>
						<p className="text-sm text-[#6b6b6b] mb-2">Title</p>
						<div className="border-b border-dashed border-[#d6d6d6] pb-2" />
					</div>
					<div>
						<p className="text-sm text-[#6b6b6b] mb-2">Suggestions</p>
						<div className="border-b border-dashed border-[#d6d6d6] pb-2" />
					</div>
				</div>
			</div>
		</div>
	);
}
