import type { DetailedUser } from "../../types/user.types";

interface UserBasicInfoProps {
  user: DetailedUser;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const capitalizeRole = (role: string) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function UserBasicInfo({ user }: UserBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <p className="text-gray-900">{user.fullName}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <p className="text-gray-900">{user.email}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date created</label>
        <p className="text-gray-900">{formatDate(user.created_at)}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <p className="text-gray-900">{capitalizeRole(user.role)}</p>
      </div>
    </div>
  );
}