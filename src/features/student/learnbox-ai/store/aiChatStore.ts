import { create } from "zustand";

export interface AiMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

export interface AiConversation {
	id: string;
	title: string;
	subject: string;
	messages: AiMessage[];
	lastUpdated: Date;
}

interface AiChatState {
	conversations: AiConversation[];
	activeConversationId: string | null;
	activeSubject: string | null;
	isStreaming: boolean;

	setActiveSubject: (subject: string) => void;
	selectConversation: (id: string) => void;
	startNewConversation: (subject: string) => string;
	addMessage: (conversationId: string, message: Omit<AiMessage, "id">) => void;
	setStreaming: (streaming: boolean) => void;
	updateConversationTitle: (conversationId: string, title: string) => void;
}

export const useAiChatStore = create<AiChatState>((set, get) => ({
	conversations: [],
	activeConversationId: null,
	activeSubject: null,
	isStreaming: false,

	setActiveSubject: (subject) => set({ activeSubject: subject }),

	selectConversation: (id) => set({ activeConversationId: id }),

	startNewConversation: (subject) => {
		const id = crypto.randomUUID();
		const conversation: AiConversation = {
			id,
			title: "New Chat",
			subject,
			messages: [],
			lastUpdated: new Date(),
		};
		set((state) => ({
			conversations: [conversation, ...state.conversations],
			activeConversationId: id,
			activeSubject: subject,
		}));
		return id;
	},

	addMessage: (conversationId, message) => {
		const id = crypto.randomUUID();
		set((state) => ({
			conversations: state.conversations.map((conv) => {
				if (conv.id !== conversationId) return conv;
				const updatedMessages = [...conv.messages, { ...message, id }];
				const title =
					conv.title === "New Chat" && message.role === "user"
						? message.content.slice(0, 40)
						: conv.title;
				return { ...conv, messages: updatedMessages, title, lastUpdated: new Date() };
			}),
		}));
	},

	setStreaming: (streaming) => set({ isStreaming: streaming }),

	updateConversationTitle: (conversationId, title) => {
		set((state) => ({
			conversations: state.conversations.map((conv) =>
				conv.id === conversationId ? { ...conv, title } : conv
			),
		}));
	},
}));
