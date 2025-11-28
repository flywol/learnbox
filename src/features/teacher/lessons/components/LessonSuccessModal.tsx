import { CheckCircle2 } from 'lucide-react';

interface LessonSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  contentType: string;
  onAddMore: () => void;
  onViewLesson: () => void;
}

export default function LessonSuccessModal({
  isOpen,
  onClose,
  lessonTitle,
  contentType,
  onAddMore,
  onViewLesson,
}: LessonSuccessModalProps) {
  if (!isOpen) return null;

  const formatContentType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'video': 'Video',
      'document': 'Notes',
      'file': 'Notes',
      'assignment': 'Assignment',
      'quiz': 'Quiz',
    };
    return typeMap[type.toLowerCase()] || type;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Congratulations! You've successfully added a new lesson content.
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium">Lesson Title:</span>{' '}
              <span className="font-semibold text-gray-900">{lessonTitle}</span>
            </p>
            <p>
              <span className="font-medium">Content Type:</span>{' '}
              <span className="font-semibold text-gray-900">{formatContentType(contentType)}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onAddMore}
            className="flex-1 px-6 py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors font-medium"
          >
            Add more
          </button>
          <button
            onClick={onViewLesson}
            className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
          >
            View lesson
          </button>
        </div>
      </div>
    </div>
  );
}
