import UserAvatar from "../../../../../common/components/UserAvatar";

interface TeacherProfile {
  profilePicture?: string | null;
  fullName?: string | null;
}

interface ProfileHeaderProps {
  teacherProfile?: TeacherProfile;
}

export default function ProfileHeader({ teacherProfile }: ProfileHeaderProps) {
  return (
    <div className="flex items-center px-6 pt-6 pb-2">
      <div className="relative -mt-16">
        <UserAvatar
          src={teacherProfile?.profilePicture}
          name={teacherProfile?.fullName || "Teacher"}
          size="xl"
          className="border-4 border-white"
        />
      </div>
      <div className="ml-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {teacherProfile?.fullName || "Teacher"}
        </h1>
      </div>
    </div>
  );
}