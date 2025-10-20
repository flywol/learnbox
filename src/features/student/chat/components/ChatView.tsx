import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { MessageSquare } from 'lucide-react';

export default function ChatView() {
  const {
    conversations,
    messages,
    activeConversationId,
    isLoading,
    sendMessage,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const currentMessages = activeConversationId
    ? messages[activeConversationId] || []
    : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = async (content: string) => {
    if (activeConversationId) {
      await sendMessage(activeConversationId, content);
    }
  };

  // Empty state when no conversation is selected
  if (!activeConversationId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#FEF6F3]">
        <div className="bg-orange-100 rounded-full p-6 mb-4">
          <MessageSquare className="h-12 w-12 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select a conversation
        </h3>
        <p className="text-sm text-gray-600 max-w-sm">
          Choose a conversation from the list to view messages and start chatting.
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading && currentMessages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FEF6F3]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="text-sm text-gray-600 mt-3">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      {activeConversation && (
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                activeConversation.participantRole === 'TEACHER'
                  ? 'bg-purple-600'
                  : 'bg-blue-600'
              }`}
            >
              {activeConversation.participantName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>

            {/* Name and role */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {activeConversation.participantName}
              </h2>
              <p className="text-xs text-gray-600">
                {activeConversation.participantRole === 'TEACHER' ? 'Teacher' : 'Classmate'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#FEF6F3]">
        {currentMessages.length === 0 ? (
          // Empty state when conversation has no messages
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="bg-orange-100 rounded-full p-4 mb-3">
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No messages yet
            </h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          // Message list
          <div>
            {currentMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="flex-shrink-0">
        <MessageInput onSend={handleSendMessage} disabled={!activeConversationId} />
      </div>
    </div>
  );
}
