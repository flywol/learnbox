import Modal from './Modal';

interface FailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onRetry?: () => void;
  retryText?: string;
}

export default function FailureModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "Close",
  onRetry,
  retryText = "Try Again"
}: FailureModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-6">
        <div className="mb-6">
          <img 
            src="/assets/failed.svg" 
            alt="Error" 
            className="w-16 h-16 mx-auto"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              {retryText}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}