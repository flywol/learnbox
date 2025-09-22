interface AdminProfile {
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  gender?: string | null;
  role?: string | null;
}

interface PersonalInfoSectionProps {
  adminProfile?: AdminProfile;
  onEdit: () => void;
}

export default function PersonalInfoSection({ adminProfile, onEdit }: PersonalInfoSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        <button
          onClick={onEdit}
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
          <p className="text-gray-900">{adminProfile?.fullName || 'Gabriel Davidson'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
          <p className="text-gray-900">{adminProfile?.email || 'gabrieldavidson@gmail.com'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Phone number</label>
          <p className="text-gray-900">{adminProfile?.phoneNumber || '+234-9070678475'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
          <p className="text-gray-900">{adminProfile?.gender || 'Male'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
          <p className="text-gray-900">{adminProfile?.role || 'Admin'}</p>
        </div>
      </div>
    </div>
  );
}