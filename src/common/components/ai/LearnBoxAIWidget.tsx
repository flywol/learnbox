import { useState, useRef, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

const ROLE_PROMPTS: Record<string, string[]> = {
	STUDENT: [
		"Do I have any classes or events coming up?",
		"Are any assignments or quizzes due soon?",
		"Give me an overview of my subject performance.",
		"Help me understand how to use the platform.",
		"Help me understand the school's policies.",
	],
	PARENT: [
		"What was my child's attendance rate this week?",
		"Does my child have any quiz or assignment due soon?",
		"Give me an overview of my child's subject performance.",
		"Are any school events coming up?",
		"Help me understand how to use the platform.",
		"Help me understand the school's policies.",
	],
	TEACHER: [
		"Do I have any classes or events coming up?",
		"Are any assignments or quizzes due soon?",
		"Help me understand how to use the platform.",
		"Help me understand the school's policies.",
	],
	ADMIN: [
		"Which teachers have the highest student results?",
		"What percentage of parents have paid fees in full?",
		"How many students are currently enrolled?",
		"Show me attendance trends across all classes.",
		"Compare academic performance across different classes.",
	],
};

const ROLE_AI_PATHS: Record<string, string> = {
	STUDENT: "/student/learnbox-ai",
	TEACHER: "/teacher/learnbox-ai",
	ADMIN: "/admin/learnbox-ai",
	PARENT: "/parent/learnbox-ai",
};

export default function LearnBoxAIWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const user = useAuthStore((s) => s.user);
	const selectedRole = useAuthStore((s) => s.selectedRole);

	const firstName = user?.fullName?.split(" ")[0] || "there";
	const role = (selectedRole as string) || "STUDENT";
	const prompts = ROLE_PROMPTS[role] ?? ROLE_PROMPTS.STUDENT;
	const aiPath = ROLE_AI_PATHS[role] ?? "/student/learnbox-ai";

	// Close panel when clicking outside
	useEffect(() => {
		if (!isOpen) return;
		function handleClickOutside(e: MouseEvent) {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	const handleOpenAssistant = () => {
		setIsOpen(false);
		navigate(aiPath);
	};

	return (
		<div ref={panelRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
			{/* Expanded panel */}
			{isOpen && (
				<div className="w-[320px] rounded-2xl shadow-2xl overflow-hidden">
					{/* Orange header */}
					<div className="bg-[#FF6B35] px-5 pt-5 pb-6 relative">
						<button
							onClick={() => setIsOpen(false)}
							className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-white/80 hover:text-white transition-colors"
						>
							<X className="w-4 h-4" />
						</button>
						<div className="flex items-start justify-between gap-3 pr-6">
							<div>
								<p className="text-white font-bold text-[22px] leading-tight">
									Hello {firstName},
								</p>
								<p className="text-white font-bold text-[22px] leading-tight">
									How can I help you today?
								</p>
							</div>
							<div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0 mt-1">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="white"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="5" y1="12" x2="19" y2="12" />
									<polyline points="12 5 19 12 12 19" />
								</svg>
							</div>
						</div>
					</div>

					{/* Prompt suggestions */}
					<div className="bg-white px-4 py-4 space-y-3">
						{prompts.map((prompt) => (
							<button
								key={prompt}
								onClick={handleOpenAssistant}
								className="w-full text-left text-sm text-[#444] flex items-start gap-2 hover:text-[#FF6B35] transition-colors group"
							>
								<Sparkles className="w-4 h-4 text-[#FF6B35] mt-0.5 flex-shrink-0 opacity-70 group-hover:opacity-100" />
								<span>{prompt}</span>
							</button>
						))}
					</div>

					{/* Footer */}
					<div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between">
						<span className="text-sm text-gray-500">Open AI Learning Assistant</span>
						<button
							onClick={handleOpenAssistant}
							className="bg-[#FF6B35] text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-600 transition-colors"
						>
							Go
						</button>
					</div>
				</div>
			)}

			{/* Floating trigger button */}
			<button
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex items-center gap-2 bg-[#FF6B35] text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:shadow-xl active:scale-95"
				aria-label="Open LearnBox AI"
			>
				<Sparkles className="w-5 h-5" />
				<span className="text-sm">LearnBox AI</span>
			</button>
		</div>
	);
}
