interface TeacherProfile {
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  gender?: string | null;
  role?: string | null;
  position?: string | null;
}

interface PersonalInfoSectionProps {
  teacherProfile?: TeacherProfile;
  onEdit?: () => void;
  showSubjects?: boolean;
  subjects?: Array<{ name: string }>;
}

export default function PersonalInfoSection({
  teacherProfile,
  showSubjects = false,
  subjects = []
}: PersonalInfoSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
          <p className="text-gray-900">{teacherProfile?.fullName || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
          <p className="text-gray-900">{teacherProfile?.email || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Phone number</label>
          <p className="text-gray-900">{teacherProfile?.phoneNumber || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
          <p className="text-gray-900">{teacherProfile?.gender || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Employment Status</label>
          <p className="text-gray-900">{teacherProfile?.position || 'N/A'}</p>
        </div>
        {showSubjects && subjects.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Subjects</label>
            <p className="text-gray-900">{subjects.map(s => s.name).join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}