import { Message } from '../types/chat.types';
import { formatTimeAgo } from '../../notifications/utils/formatTime';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isOwnMessage = message.senderId === 'current-student';

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] ${
          isOwnMessage ? 'order-2' : 'order-1'
        }`}
      >
        {/* Sender name (only for received messages) */}
        {!isOwnMessage && (
          <div className="text-xs text-gray-600 mb-1 ml-1">
            {message.senderName}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isOwnMessage
              ? 'bg-[#F5A88E] text-gray-900 rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs text-gray-500 mt-1 ${
            isOwnMessage ? 'text-right mr-1' : 'text-left ml-1'
          }`}
        >
          {formatTimeAgo(message.created_at)}
        </div>
      </div>
    </div>
  );
}
