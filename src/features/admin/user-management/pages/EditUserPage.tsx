import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useUser, useUpdateUser } from "../hooks/useUsers";
import EditUserForm from "../components/EditUserForm";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch user with TanStack Query
  const { 
    data: currentUser, 
    isLoading: userDetailLoading, 
    error: userDetailError,
    isError
  } = useUser(id);

  // Update user mutation
  const updateUserMutation = useUpdateUser();

  // Redirect if no ID
  if (!id) {
    navigate("/admin/users");
    return null;
  }

  const handleSubmit = async (data: any) => {
    if (!currentUser) return;
    
    try {
      // Transform data for API
      const { profileImage, ...updateData } = data;
      
      // Handle date format conversion
      if (updateData.dateOfBirth) {
        updateData.dateOfBirth = new Date(updateData.dateOfBirth).toISOString();
      }

      await updateUserMutation.mutateAsync({
        userId: currentUser.id,
        data: updateData,
        role: currentUser.role
      });
      
      // Navigate back to detail view
      navigate(`/admin/users/${currentUser.id}`);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      navigate(`/admin/users/${currentUser.id}`);
    } else {
      navigate("/admin/users");
    }
  };

  const handleBack = () => {
    if (currentUser) {
      navigate(`/admin/users/${currentUser.id}`);
    } else {
      navigate("/admin/users");
    }
  };

  if (userDetailLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-lg font-medium">Edit User</span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !currentUser) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-lg font-medium">Edit User</span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <p className="text-red-600">{userDetailError?.message || "User not found"}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-lg font-medium">Edit</span>
        </button>
      </div>

      {/* Error Message */}
      {updateUserMutation.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            {updateUserMutation.error?.message || "Failed to update user. Please try again."}
          </p>
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <EditUserForm
          user={currentUser}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updateUserMutation.isPending}
        />
      </div>
    </div>
  );
}