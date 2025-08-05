import { Calendar, Mail, User as UserIcon } from "lucide-react";
import UserAvatar from "./UserAvatar";
import type { DetailedUser } from "../types/user.types";

interface UserDetailCardProps {
  user: DetailedUser;
}

export default function UserDetailCard({ user }: UserDetailCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateOfBirth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const capitalizeRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const renderStudentFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class level</label>
          <p className="text-gray-900">{user.classLevel || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class arm</label>
          <p className="text-gray-900">{user.classArm || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admission number</label>
          <p className="text-gray-900">{user.admissionNumber || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parent/guardian name</label>
          <p className="text-gray-900">{user.parentName || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <p className="text-gray-900">{user.gender || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
          <p className="text-gray-900">{user.dateOfBirth ? formatDateOfBirth(user.dateOfBirth) : 'N/A'}</p>
        </div>
      </div>
    </>
  );

  const renderTeacherFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <p className="text-gray-900">{user.gender || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
          <p className="text-gray-900">{user.phoneNumber || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment status</label>
          <p className="text-gray-900">{user.employmentStatus || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
          <p className="text-gray-900">{user.dateOfBirth ? formatDateOfBirth(user.dateOfBirth) : 'N/A'}</p>
        </div>
      </div>
      
      {/* Assigned Classes */}
      {user.assignedClasses && user.assignedClasses.length > 0 && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Assigned classes</label>
          <div className="flex flex-wrap gap-2">
            {user.assignedClasses.map((className, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {className}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Assigned Subjects */}
      {user.assignedSubjects && user.assignedSubjects.length > 0 && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Assigned subjects</label>
          <div className="flex flex-wrap gap-2">
            {user.assignedSubjects.map((subject, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderParentFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to student</label>
          <p className="text-gray-900">{user.relationshipToStudent || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <p className="text-gray-900">{user.gender || 'N/A'}</p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
          <p className="text-gray-900">{user.phoneNumber || 'N/A'}</p>
        </div>
      </div>
      
      {/* Linked Children */}
      {user.linkedChildren && user.linkedChildren.length > 0 && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Linked children</label>
          <div className="flex flex-wrap gap-2">
            {user.linkedChildren.map((childId, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
              >
                {childId} {/* This would ideally be the child's name */}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderRoleSpecificFields = () => {
    switch (user.role) {
      case 'student':
        return renderStudentFields();
      case 'teacher':
        return renderTeacherFields();
      case 'parent':
        return renderParentFields();
      default:
        return (
          <div className="text-center py-4 text-gray-500">
            No additional information available for this role.
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header with Avatar */}
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

      {/* Basic Information */}
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

      {/* Role-specific Information */}
      <div className="border-t pt-6">
        {renderRoleSpecificFields()}
      </div>
    </div>
  );
}