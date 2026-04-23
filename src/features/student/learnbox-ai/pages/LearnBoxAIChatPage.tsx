import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Send, Search, Plus, ChevronLeft } from "lucide-react";
import { useAiChatStore, type AiConversation } from "../store/aiChatStore";

const WELCOME_MESSAGE = `How can I help you today?

• Explain any lesson from your curriculum
• Answer questions about what you're studying
• Generate practice questions
• Show you how you're doing in this subject and suggest ways to improve`;

const SUBJECT_COLORS: Record<string, string> = {
	biology:          "#e8fed3",
	"further-maths":  "#ffefea",
	english:          "#e5f0fe",
	chemistry:        "#f6e9fe",
	economics:        "#e2fff9",
	geography:        "#e8fed3",
	civic:            "#d5e5f8",
	mathematics:      "#ffdcc5",
	"computer-science":"#ffefea",
	agriculture:      "#e8fed3",
	history:          "#e2fff9",
	"food-nutrition":  "#fbddeb",
};

const SUBJECT_LABELS: Record<string, string> = {
	biology:          "Biology",
	"further-maths":  "Further Maths",
	english:          "English",
	chemistry:        "Chemistry",
	economics:        "Economics",
	geography:        "Geography",
	civic:            "Civic Education",
	mathematics:      "Mathematics",
	"computer-science":"Computer Science",
	agriculture:      "Agriculture",
	history:          "History",
	"food-nutrition":  "Food & Nutrition",
};

function formatTime(date: Date): string {
	return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });
}

export default function LearnBoxAIChatPage() {
	const navigate = useNavigate();
	const { subjectId = "biology" } = useParams<{ subjectId: string }>();
	const [searchParams] = useSearchParams();
	const convIdFromUrl = searchParams.get("conv");

	const [query, setQuery] = useState("");
	const [search, setSearch] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const {
		conversations,
		activeConversationId,
		isStreaming,
		startNewConversation,
		selectConversation,
		addMessage,
		setStreaming,
	} = useAiChatStore();

	const subjectLabel = SUBJECT_LABELS[subjectId] ?? subjectId;
	const bgColor = SUBJECT_COLORS[subjectId] ?? "#e8fed3";

	// On mount, select the conversation from URL or start a fresh one
	useEffect(() => {
		if (convIdFromUrl && conversations.find((c) => c.id === convIdFromUrl)) {
			selectConversation(convIdFromUrl);
		} else if (!activeConversationId) {
			startNewConversation(subjectLabel);
		}
	}, []);

	const activeConversation: AiConversation | undefined = conversations.find(
		(c) => c.id === activeConversationId
	);

	const filteredConversations = conversations
		.filter((c) => c.subject === subjectLabel || search === "")
		.filter(
			(c) =>
				!search ||
				c.title.toLowerCase().includes(search.toLowerCase()) ||
				c.subject.toLowerCase().includes(search.toLowerCase())
		);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [activeConversation?.messages]);

	const handleSend = async () => {
		const text = query.trim();
		if (!text || isStreaming || !activeConversationId) return;

		setQuery("");
		addMessage(activeConversationId, { role: "user", content: text, timestamp: new Date() });

		setStreaming(true);
		// Simulate AI response
		const simulatedReply = `I understand your question about "${text.slice(0, 60)}${text.length > 60 ? "..." : ""}". In ${subjectLabel}, this is an important topic. Let me explain step by step:\n\n1. First, consider the foundational concepts\n2. Then apply them to the specific scenario\n3. Finally, review the key points\n\nWould you like me to go deeper on any specific aspect?`;

		setTimeout(() => {
			if (activeConversationId) {
				addMessage(activeConversationId, {
					role: "assistant",
					content: simulatedReply,
					timestamp: new Date(),
				});
			}
			setStreaming(false);
		}, 1200);
	};

	const handleNewChat = () => {
		const id = startNewConversation(subjectLabel);
		navigate(`/student/learnbox-ai/chat/${subjectId}?conv=${id}`, { replace: true });
	};

	return (
		<div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col" style={{ height: "calc(100vh - 7rem)" }}>
			{/* Top bar with Back + subject tabs */}
			<div className="flex items-center h-[72px] border-b border-[#eeeeee] px-8">
				<button
					onClick={() => navigate("/student/learnbox-ai")}
					className="flex items-center gap-1 text-[#4c4747] font-bold text-xl hover:text-[#fd5d26] transition-colors mr-6"
				>
					<ChevronLeft className="w-5 h-5" />
					Back
				</button>
			</div>

			{/* Main content: left panel + right chat */}
			<div className="flex flex-1 overflow-hidden bg-[#eeeeee] gap-1">
				{/* Left panel - chat history */}
				<div className="w-[380px] bg-white flex flex-col flex-shrink-0">
					{/* Search + new chat */}
					<div className="p-4 border-b border-[#eeeeee] flex items-center gap-3">
						<div className="flex-1 flex items-center gap-2 border border-[#ddd] rounded-xl px-4 py-2">
							<Search className="w-5 h-5 text-[#969696] flex-shrink-0" />
							<input
								type="text"
								placeholder="Search"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="flex-1 text-base text-[#2b2b2b] placeholder:text-[#969696] focus:outline-none bg-transparent"
							/>
						</div>
						<button
							onClick={handleNewChat}
							className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-[#2b2b2b] hover:text-[#fd5d26] transition-colors"
						>
							<Plus className="w-5 h-5" />
						</button>
					</div>

					{/* Conversation list */}
					<div className="flex-1 overflow-y-auto">
						{filteredConversations.length === 0 ? (
							<div className="p-6 text-center text-[#838383] text-sm">
								No conversations yet. Start a new chat!
							</div>
						) : (
							filteredConversations.map((conv) => (
								<button
									key={conv.id}
									onClick={() => {
										selectConversation(conv.id);
										navigate(`/student/learnbox-ai/chat/${subjectId}?conv=${conv.id}`, { replace: true });
									}}
									className={`w-full text-left px-6 py-5 flex justify-between items-start gap-4 border-b border-[#eeeeee] hover:bg-[#eeeeee]/60 transition-colors ${
										conv.id === activeConversationId ? "bg-[#eeeeee]" : ""
									}`}
								>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-[#2b2b2b] text-base truncate">
											{conv.title}
										</p>
										<p className="text-sm text-[#838383] truncate mt-0.5">
											{conv.messages[conv.messages.length - 1]?.content?.slice(0, 40) ?? ""}
										</p>
									</div>
									<span className="text-xs text-[#838383] whitespace-nowrap flex-shrink-0 mt-0.5">
										{formatTime(conv.lastUpdated)}
									</span>
								</button>
							))
						)}
					</div>
				</div>

				{/* Right panel - chat */}
				<div className="flex-1 bg-white flex flex-col overflow-hidden">
					{/* Chat header */}
					<div
						className="flex items-center gap-4 px-6 py-4 flex-shrink-0"
						style={{ backgroundColor: "#fd5d26" }}
					>
						<div
							className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
							style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
						>
							<span className="text-white font-bold text-xl">AI</span>
						</div>
						<div>
							<p className="text-white font-bold text-xl leading-[1.5]">LearnBox AI</p>
							<p className="text-white/80 text-sm">{activeConversation?.subject ?? subjectLabel}</p>
						</div>
					</div>

					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-6 space-y-4">
						{/* Welcome message if no messages */}
						{(!activeConversation || activeConversation.messages.length === 0) && (
							<div className="flex items-start gap-3">
								<div
									className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
									style={{ backgroundColor: "#fd5d26" }}
								>
									AI
								</div>
								<div className="flex flex-col gap-1 max-w-lg">
									<div className="border border-[#ddd] rounded-xl px-4 py-4 text-base text-[#2b2b2b] whitespace-pre-line">
										{WELCOME_MESSAGE}
									</div>
									<span className="text-xs text-[#838383]">
										{new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
									</span>
								</div>
							</div>
						)}

						{activeConversation?.messages.map((msg) => (
							<div
								key={msg.id}
								className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
							>
								<div
									className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
									style={{ backgroundColor: msg.role === "user" ? "#2b2b2b" : "#fd5d26" }}
								>
									{msg.role === "user" ? "You" : "AI"}
								</div>
								<div className={`flex flex-col gap-1 max-w-lg ${msg.role === "user" ? "items-end" : ""}`}>
									<div
										className={`rounded-xl px-4 py-3 text-sm leading-[1.5] whitespace-pre-line ${
											msg.role === "user"
												? "bg-[#fd5d26] text-white"
												: "border border-[#ddd] text-[#2b2b2b]"
										}`}
									>
										{msg.content}
									</div>
									<span className="text-xs text-[#838383]">
										{msg.timestamp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
									</span>
								</div>
							</div>
						))}

						{isStreaming && (
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 rounded-full bg-[#fd5d26] flex items-center justify-center text-white text-xs font-bold">
									AI
								</div>
								<div className="border border-[#ddd] rounded-xl px-4 py-3">
									<div className="flex gap-1">
										<span className="w-2 h-2 bg-[#fd5d26] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
										<span className="w-2 h-2 bg-[#fd5d26] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
										<span className="w-2 h-2 bg-[#fd5d26] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input */}
					<div className="flex-shrink-0 p-5 border-t border-[#eeeeee]">
						<div className="flex items-center gap-3 border border-[#838383] rounded-full px-6 py-3">
							<input
								type="text"
								placeholder="Ask anything"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
								disabled={isStreaming}
								className="flex-1 text-base text-[#2b2b2b] placeholder:text-[#667085] focus:outline-none bg-transparent"
							/>
							<button
								onClick={handleSend}
								disabled={isStreaming || !query.trim()}
								className="w-9 h-9 bg-[#fd5d26] text-white rounded-full flex items-center justify-center hover:bg-[#e84d17] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
							>
								<Send className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
