import { useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { formatTimeAgo } from '../../notifications/utils/formatTime';
import { MessageCircle } from 'lucide-react';

export default function ChatList() {
  const {
    conversations,
    activeConversationId,
    isLoading,
    fetchConversations,
    setActiveConversation,
  } = useChatStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Empty state when no conversations
  if (!isLoading && conversations.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white">
        <div className="bg-orange-100 rounded-full p-6 mb-4">
          <MessageCircle className="h-12 w-12 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No conversations yet
        </h3>
        <p className="text-sm text-gray-600 max-w-sm">
          Your chat conversations with teachers and classmates will appear here.
          Start a conversation to get help or collaborate!
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading && conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="text-sm text-gray-600 mt-3">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        <p className="text-xs text-gray-600 mt-0.5">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Conversation list */}
      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => {
          const isActive = activeConversationId === conversation.id;
          const hasUnread = conversation.unreadCount > 0;

          return (
            <button
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
                isActive ? 'bg-orange-50' : ''
              } ${hasUnread ? 'bg-orange-50/30' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                      conversation.participantRole === 'TEACHER'
                        ? 'bg-purple-600'
                        : 'bg-blue-600'
                    }`}
                  >
                    {conversation.participantName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        hasUnread ? 'text-gray-900' : 'text-gray-800'
                      }`}
                    >
                      {conversation.participantName}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatTimeAgo(conversation.lastMessageTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm truncate ${
                        hasUnread ? 'font-medium text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {conversation.lastMessage}
                    </p>

                    {/* Unread badge */}
                    {hasUnread && (
                      <span className="flex-shrink-0 bg-orange-600 text-white text-xs rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Role badge */}
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        conversation.participantRole === 'TEACHER'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {conversation.participantRole === 'TEACHER' ? 'Teacher' : 'Classmate'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
