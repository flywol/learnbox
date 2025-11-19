import Modal from './Modal';
import { CheckCircle } from 'lucide-react';

interface QuizSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
  onAddMore: () => void;
  onViewLesson: () => void;
}

export default function QuizSuccessModal({
  isOpen,
  onClose,
  quizTitle,
  onAddMore,
  onViewLesson
}: QuizSuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-6">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        {/* Message */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          You've successfully added a new lesson content.
        </h3>

        {/* Details */}
        <div className="mb-6 text-left bg-gray-50 rounded-lg p-4">
          <div className="mb-2">
            <span className="text-sm text-gray-600">Title: </span>
            <span className="text-sm font-medium text-gray-900">{quizTitle}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Content Type: </span>
            <span className="text-sm font-medium text-gray-900">Quiz</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onAddMore}
            className="flex-1 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium"
          >
            Add more
          </button>
          <button
            onClick={onViewLesson}
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            View lesson
          </button>
        </div>
      </div>
    </Modal>
  );
}
