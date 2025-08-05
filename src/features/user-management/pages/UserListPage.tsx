import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus } from "lucide-react";
import { useUsers, filterUsers, paginateUsers } from "../hooks/useUsers";
import { useUserUIStore } from "../store/userUIStore";
import UserFilters from "../components/UserFilters";
import UserTable from "../components/UserTable";
import { PaginationSection } from "../components/PaginationSection";

export default function UserListPage() {
  const navigate = useNavigate();
  
  // Fetch users with TanStack Query
  const { data: users = [], isLoading, error, isError } = useUsers();
  
  // UI state from Zustand
  const {
    filters,
    currentPage,
    itemsPerPage,
    setFilters,
    setCurrentPage,
  } = useUserUIStore();

  // Client-side filtering and pagination
  const { paginatedUsers, totalItems, totalPages } = useMemo(() => {
    const filteredUsers = filterUsers(users, filters);
    return paginateUsers(filteredUsers, currentPage, itemsPerPage);
  }, [users, filters, currentPage, itemsPerPage]);

  const handleBulkUpload = () => {
    // Placeholder - no functionality yet
    console.log("Bulk upload clicked - not implemented yet");
  };

  const handleCreateUser = () => {
    navigate("/user-management/create");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
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

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Error Message */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            {error?.message || "Failed to load users. Please try again."}
          </p>
        </div>
      )}

      {/* Users Table */}
      <UserTable
        users={paginatedUsers}
        loading={isLoading}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {/* Pagination */}
      {!isLoading && paginatedUsers.length > 0 && (
        <PaginationSection
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}