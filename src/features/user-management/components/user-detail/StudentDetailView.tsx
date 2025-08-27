import type { DetailedUser } from "../../types/user.types";

interface StudentDetailViewProps {
  user: DetailedUser;
}

const formatDateOfBirth = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function StudentDetailView({ user }: StudentDetailViewProps) {
  return (
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
  );
}