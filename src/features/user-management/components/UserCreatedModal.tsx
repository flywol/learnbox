import { CheckCircle, X } from "lucide-react";
import { UserRole } from "../types/user.types";

interface UserCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  userName: string;
}

export default function UserCreatedModal({ isOpen, onClose, userRole, userName }: UserCreatedModalProps) {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {getRoleDisplay(userRole)} Created Successfully!
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
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
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Create Another {getRoleDisplay(userRole)}
          </button>
        </div>
      </div>
    </div>
  );
}