import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateUserForm from "../components/CreateUserForm";
import UserCreatedModal from "../components/UserCreatedModal";
import { userApiClient } from "../api/userApiClient";
import type { CreateUserFormData } from "../schemas/userSchema";

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdUser, setCreatedUser] = useState<{ name: string; role: CreateUserFormData["role"] } | null>(null);
  const formRef = useRef<{ reset: () => void }>(null);

  const handleSubmit = async (data: CreateUserFormData) => {
    setLoading(true);
    try {
      await userApiClient.createUser(data);
      
      // Store user info for modal
      setCreatedUser({
        name: data.fullName,
        role: data.role
      });
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Clear the form
      formRef.current?.reset();
      
    } catch (error) {
      console.error("Failed to create user:", error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setCreatedUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg font-medium">Create User</span>
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <CreateUserForm ref={formRef} onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Success Modal */}
      {createdUser && (
        <UserCreatedModal
          isOpen={showSuccessModal}
          onClose={handleCloseModal}
          userRole={createdUser.role}
          userName={createdUser.name}
        />
      )}
    </div>
  );
}