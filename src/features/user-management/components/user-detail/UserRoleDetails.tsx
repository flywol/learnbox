import type { DetailedUser } from "../../types/user.types";
import StudentDetailView from "./StudentDetailView";
import TeacherDetailView from "./TeacherDetailView";
import ParentDetailView from "./ParentDetailView";

interface UserRoleDetailsProps {
  user: DetailedUser;
}

export default function UserRoleDetails({ user }: UserRoleDetailsProps) {
  const renderRoleSpecificFields = () => {
    switch (user.role) {
      case 'student':
        return <StudentDetailView user={user} />;
      case 'teacher':
        return <TeacherDetailView user={user} />;
      case 'parent':
        return <ParentDetailView user={user} />;
      default:
        return (
          <div className="text-center py-4 text-gray-500">
            No additional information available for this role.
          </div>
        );
    }
  };

  return (
    <div className="border-t pt-6">
      {renderRoleSpecificFields()}
    </div>
  );
}