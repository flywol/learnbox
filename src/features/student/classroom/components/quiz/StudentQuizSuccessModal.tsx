import Modal from '@/common/components/Modal';
import { CheckCircle } from 'lucide-react';

interface StudentQuizSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoBack: () => void;
}

export default function StudentQuizSuccessModal({
  isOpen,
  onClose,
  onGoBack
}: StudentQuizSuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showCloseButton={false}>
      <div className="text-center p-6 border-4 border-purple-500 rounded-xl">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        {/* Message */}
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Congratulations! You've successfully finished your quiz
        </h3>

        {/* Action Button */}
        <button
          onClick={onGoBack}
          className="w-full max-w-xs mx-auto py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Go Back
        </button>
      </div>
    </Modal>
  );
}
