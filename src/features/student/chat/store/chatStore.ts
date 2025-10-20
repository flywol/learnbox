import { create } from 'zustand';
import { ChatState, Conversation, Message } from '../types/chat.types';

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'teacher-1',
    participantName: 'Mr. Johnson',
    participantRole: 'TEACHER',
    lastMessage: 'Great work on the assignment!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    unreadCount: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'conv-2',
    participantId: 'teacher-2',
    participantName: 'Ms. Williams',
    participantRole: 'TEACHER',
    lastMessage: 'Your essay shows excellent critical thinking.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    unreadCount: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'conv-3',
    participantId: 'student-1',
    participantName: 'Sarah Chen',
    participantRole: 'STUDENT',
    lastMessage: 'See you at the library!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    unreadCount: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'conv-4',
    participantId: 'student-2',
    participantName: 'David Miller',
    participantRole: 'STUDENT',
    lastMessage: 'I uploaded the presentation to the drive',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    unreadCount: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

// Mock messages for each conversation
const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1-1',
      conversationId: 'conv-1',
      senderId: 'current-student',
      senderName: 'You',
      senderRole: 'STUDENT',
      content: 'Good morning Mr. Johnson. I had a question about problem 5 on the homework.',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'teacher-1',
      senderName: 'Mr. Johnson',
      senderRole: 'TEACHER',
      content: 'Good morning! Of course, what part are you stuck on?',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'current-student',
      senderName: 'You',
      senderRole: 'STUDENT',
      content: "I'm not sure how to apply the quadratic formula when there's a fraction involved.",
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    },
    {
      id: 'msg-1-4',
      conversationId: 'conv-1',
      senderId: 'teacher-1',
      senderName: 'Mr. Johnson',
      senderRole: 'TEACHER',
      content: 'Ah, I see. First, you want to multiply both sides by the denominator to clear the fraction. Then you can proceed with the standard quadratic formula.',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'msg-1-5',
      conversationId: 'conv-1',
      senderId: 'current-student',
      senderName: 'You',
      senderRole: 'STUDENT',
      content: 'That makes sense! Thank you so much.',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'msg-1-6',
      conversationId: 'conv-1',
      senderId: 'teacher-1',
      senderName: 'Mr. Johnson',
      senderRole: 'TEACHER',
      content: 'Great work on the assignment!',
      isRead: false,
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: 'teacher-2',
      senderName: 'Ms. Williams',
      senderRole: 'TEACHER',
      content: 'Hi! I wanted to give you some feedback on your recent essay.',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'current-student',
      senderName: 'You',
      senderRole: 'STUDENT',
      content: 'Thank you! I would love to hear your thoughts.',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: 'msg-2-3',
      conversationId: 'conv-2',
      senderId: 'teacher-2',
      senderName: 'Ms. Williams',
      senderRole: 'TEACHER',
      content: 'Your essay shows excellent critical thinking.',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: 'student-1',
      senderName: 'Sarah Chen',
      senderRole: 'STUDENT',
      content: 'Hey! Are we still on for the study group tomorrow?',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'msg-3-2',
      conversationId: 'conv-3',
      senderId: 'current-student',
      senderName: 'You',
      senderRole: 'STUDENT',
      content: 'Yes! What time works for you?',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: 'msg-3-3',
      conversationId: 'conv-3',
      senderId: 'student-1',
      senderName: 'Sarah Chen',
      senderRole: 'STUDENT',
      content: 'How about 3 PM at the library?',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    },
    {
      id: 'msg-3-4',
      conversationId: 'conv-3',
      senderId: 'current-student',
      senderName: 'You',
      senderRole: 'STUDENT',
      content: 'Perfect! See you then.',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    },
    {
      id: 'msg-3-5',
      conversationId: 'conv-3',
      senderId: 'student-1',
      senderName: 'Sarah Chen',
      senderRole: 'STUDENT',
      content: 'See you at the library!',
      isRead: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ],
  'conv-4': [
    {
      id: 'msg-4-1',
      conversationId: 'conv-4',
      senderId: 'current-student',
      senderName: 'You',
      senderRole: 'STUDENT',
      content: 'Hi David! Did you finish your part of the presentation?',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: 'msg-4-2',
      conversationId: 'conv-4',
      senderId: 'student-2',
      senderName: 'David Miller',
      senderRole: 'STUDENT',
      content: 'Yes! Just finished it this morning.',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    },
    {
      id: 'msg-4-3',
      conversationId: 'conv-4',
      senderId: 'student-2',
      senderName: 'David Miller',
      senderRole: 'STUDENT',
      content: 'I uploaded the presentation to the drive',
      isRead: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    set({
      conversations: mockConversations,
      isLoading: false,
    });
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true, error: null });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const conversationMessages = mockMessages[conversationId] || [];

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: conversationMessages,
      },
      isLoading: false,
    }));
  },

  setActiveConversation: (conversationId: string | null) => {
    set({ activeConversationId: conversationId });

    if (conversationId) {
      // Auto-fetch messages when conversation is selected
      get().fetchMessages(conversationId);

      // Mark conversation as read
      get().markConversationAsRead(conversationId);
    }
  },

  sendMessage: async (conversationId: string, content: string) => {
    if (!content.trim()) return;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'current-student',
      senderName: 'You',
      senderRole: 'STUDENT',
      content: content.trim(),
      isRead: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set((state) => {
      const conversationMessages = state.messages[conversationId] || [];

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...conversationMessages, newMessage],
        },
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: content.trim(),
                lastMessageTime: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : conv
        ),
      };
    });
  },

  markConversationAsRead: async (conversationId: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((msg) => ({
          ...msg,
          isRead: true,
        })),
      },
    }));
  },
}));
