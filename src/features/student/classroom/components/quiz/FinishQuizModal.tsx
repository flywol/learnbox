import Modal from '@/common/components/Modal';

interface FinishQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  answeredCount: number;
  totalCount: number;
  timeRemaining: number; // in seconds
}

export default function FinishQuizModal({
  isOpen,
  onClose,
  onSubmit,
  answeredCount,
  totalCount,
  timeRemaining
}: FinishQuizModalProps) {
  const isTimerExpired = timeRemaining <= 0;
  const allAnswered = answeredCount === totalCount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showCloseButton={false}>
      <div className="text-center p-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Finish Quiz</h2>

        {isTimerExpired ? (
          <>
            <p className="text-gray-600 mb-6">
              The timer has ended. Your quiz will now be submitted automatically.
            </p>

            <button
              onClick={onSubmit}
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Submit
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              {allAnswered
                ? "You've answered all questions. You can submit now or go back to complete the remaining ones."
                : `You've answered ${answeredCount} of ${totalCount} questions. You can submit now or go back to complete the remaining ones.`
              }
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={onSubmit}
                className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
