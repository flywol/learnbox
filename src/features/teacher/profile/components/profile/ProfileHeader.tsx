// SECURITY FIX: Using shared component instead of admin-specific import
import UserAvatar from "../../../../../common/components/UserAvatar";

interface TeacherProfile {
  profilePicture?: string | null;
  fullName?: string | null;
}

interface ProfileHeaderProps {
  adminProfile?: TeacherProfile; // Keep same prop name for compatibility
}

export default function ProfileHeader({ adminProfile }: ProfileHeaderProps) {
  return (
    <div className="flex items-center px-6 pt-6 pb-2">
      <div className="relative -mt-16">
        <UserAvatar
          src={adminProfile?.profilePicture}
          name={adminProfile?.fullName || "Teacher"}
          size="xl"
          className="border-4 border-white"
        />
      </div>
      <div className="ml-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {adminProfile?.fullName || "Joe Jameshill"}
        </h1>
      </div>
    </div>
  );
}