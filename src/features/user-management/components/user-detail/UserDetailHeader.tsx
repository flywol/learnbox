import UserAvatar from "../UserAvatar";
import type { DetailedUser } from "../../types/user.types";

interface UserDetailHeaderProps {
  user: DetailedUser;
}

const capitalizeRole = (role: string) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function UserDetailHeader({ user }: UserDetailHeaderProps) {
  return (
    <div className="flex items-center space-x-6 mb-8">
      <UserAvatar
        src={user.profilePicture}
        name={user.fullName}
        size="xl"
      />
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
        <p className="text-gray-500">{capitalizeRole(user.role)}</p>
      </div>
    </div>
  );
}