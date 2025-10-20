export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'STUDENT' | 'TEACHER';
  content: string;
  isRead: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'STUDENT' | 'TEACHER';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  created_at: string;
  updated_at: string;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
}
