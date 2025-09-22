import type { DetailedUser } from "../../types/user.types";

interface TeacherDetailViewProps {
  user: DetailedUser;
}

const formatDateOfBirth = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function TeacherDetailView({ user }: TeacherDetailViewProps) {
  return (
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
}