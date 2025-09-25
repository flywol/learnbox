import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateUserForm from "../components/CreateUserForm";
import { userApiClient } from "../api/userApiClient";
import type { CreateUserFormData } from "../schemas/userSchema";
import { useToast } from "../../../../hooks/use-toast";

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<{ reset: () => void }>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: CreateUserFormData) => {
    setLoading(true);
    try {
      await userApiClient.createUser(data);
      
      // Clear the form
      formRef.current?.reset();
      
      // Show success toast
      toast({
        variant: "success",
        title: "User Created Successfully!",
        description: `${data.fullName} has been created as a ${data.role.toLowerCase()}. Login credentials sent via email.`
      });
      
    } catch (error) {
      console.error("Failed to create user:", error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
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
    </div>
  );
}