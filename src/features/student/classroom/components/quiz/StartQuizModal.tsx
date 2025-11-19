import Modal from '@/common/components/Modal';

interface StartQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  duration: number; // in minutes
}

export default function StartQuizModal({
  isOpen,
  onClose,
  onStart
}: StartQuizModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showCloseButton={false}>
      <div className="text-center p-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Start Quiz</h2>

        <p className="text-gray-600 mb-6">
          Starting the quiz will begin the timer. You must finish before it runs out, or your answers will be submitted automatically.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={onStart}
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Start
          </button>
        </div>
      </div>
    </Modal>
  );
}
