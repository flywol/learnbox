import { CheckCircle } from "lucide-react";
import { UserRole } from "../types/user.types";
import Modal from "@/common/components/Modal";

interface UserCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  userName: string;
}

export default function UserCreatedModal({ isOpen, onClose, userRole, userName }: UserCreatedModalProps) {

  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case "Student":
        return "Student";
      case "Teacher":
        return "Teacher";
      case "Parent":
        return "Parent";
      default:
        return "User";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${getRoleDisplay(userRole)} Created Successfully!`} maxWidth="md">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-gray-600 mb-6">
          <strong>{userName}</strong> has been successfully created as a {getRoleDisplay(userRole).toLowerCase()}.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            The {getRoleDisplay(userRole).toLowerCase()} will receive login credentials via email and can access the system immediately.
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Create Another {getRoleDisplay(userRole)}
        </button>
      </div>
    </Modal>
  );
}