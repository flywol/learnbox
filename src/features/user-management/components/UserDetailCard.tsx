import type { DetailedUser } from "../types/user.types";
import UserDetailHeader from "./user-detail/UserDetailHeader";
import UserBasicInfo from "./user-detail/UserBasicInfo";
import UserRoleDetails from "./user-detail/UserRoleDetails";

interface UserDetailCardProps {
  user: DetailedUser;
}

export default function UserDetailCard({ user }: UserDetailCardProps) {

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <UserDetailHeader user={user} />
      <UserBasicInfo user={user} />
      <UserRoleDetails user={user} />
    </div>
  );
}