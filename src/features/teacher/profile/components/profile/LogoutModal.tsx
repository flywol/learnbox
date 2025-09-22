import Modal from "../../../../../common/components/Modal";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Logging out?"
      showCloseButton={false}
    >
      <div className="text-center">
        <p className="text-gray-600 mb-8">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}