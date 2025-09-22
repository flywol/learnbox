import UserAvatar from "../../../user-management/components/UserAvatar";

interface AdminProfile {
  profilePicture?: string | null;
  fullName?: string | null;
}

interface ProfileHeaderProps {
  adminProfile?: AdminProfile;
}

export default function ProfileHeader({ adminProfile }: ProfileHeaderProps) {
  return (
    <div className="flex items-center px-6 pt-6 pb-2">
      <div className="relative -mt-16">
        <UserAvatar
          src={adminProfile?.profilePicture}
          name={adminProfile?.fullName || "Admin"}
          size="xl"
          className="border-4 border-white"
        />
      </div>
      <div className="ml-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {adminProfile?.fullName || "Gabriel Davidson"}
        </h1>
      </div>
    </div>
  );
}