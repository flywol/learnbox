import Modal from './Modal';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "Continue"
}: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-6">
        <div className="mb-6">
          <img 
            src="/assets/check.svg" 
            alt="Success" 
            className="w-16 h-16 mx-auto"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
}