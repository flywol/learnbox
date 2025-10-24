import { useState } from 'react';
import { X } from 'lucide-react';
import { ForumMessage } from '../types/classroom.types';

interface ClassChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ForumMessage[];
  onSendMessage: (message: string) => void;
}

export default function ClassChatSidebar({
  isOpen,
  onClose,
  messages,
  onSendMessage,
}: ClassChatSidebarProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');
    return `${hours}:${minutesStr}${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          {messages.length > 0 ? 'Classroom Forum' : 'Class Chat'}
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Messages or Empty State */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-48 h-48 mb-4">
            <img
              src="/images/onboarding/student-2.svg"
              alt="No chat"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-gray-600 mb-2">You don't have any chat</p>
          <button
            onClick={() => {
              /* Placeholder for starting a chat */
            }}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Start a chat
          </button>
        </div>
      ) : (
        <>
          {/* Message Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Add your comment"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-gray-900">{message.senderName}</p>
                      <p className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</p>
                    </div>
                    <p className="text-sm text-gray-700">{message.message}</p>
                    <button className="text-xs text-gray-500 hover:text-gray-700 mt-1">
                      Reply this chat
                    </button>
                  </div>
                </div>

                {/* Replies would go here if we implement them */}
                {message.replies && message.replies.length > 0 && (
                  <div className="ml-12 space-y-2">
                    {message.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-xs text-gray-900">{reply.senderName}</p>
                            <p className="text-xs text-gray-500">{formatTimestamp(reply.timestamp)}</p>
                          </div>
                          <p className="text-sm text-gray-700">{reply.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
