import { useNavigate } from "react-router-dom";
import { Upload, Plus } from "lucide-react";
import { UserTableSection } from "../components/UserTableSection";

export default function UserListPage() {
  const navigate = useNavigate();

  const handleBulkUpload = () => {
    // Placeholder - no functionality yet
  };

  const handleCreateUser = () => {
    navigate("/admin/users/create");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkUpload}
            className="flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Bulk upload
          </button>
          <button
            onClick={handleCreateUser}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create user
          </button>
        </div>
      </div>

      {/* Users Table Section */}
      <UserTableSection />
    </div>
  );
}