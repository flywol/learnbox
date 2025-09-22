interface SchoolInfo {
  schoolName?: string | null;
  schoolShortName?: string | null;
  schoolEmail?: string | null;
  schoolPhone?: string | null;
  schoolAddress?: string | null;
  schoolWebsite?: string | null;
}

interface SchoolInfoSectionProps {
  schoolInfo?: SchoolInfo;
  onEdit: () => void;
}

export default function SchoolInfoSection({ schoolInfo, onEdit }: SchoolInfoSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">School Information</h2>
        <button
          onClick={onEdit}
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">School name</label>
          <p className="text-gray-900">{schoolInfo?.schoolName || 'School Name'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">School short name</label>
          <p className="text-gray-900">{schoolInfo?.schoolShortName || 'SSN'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">School email</label>
          <p className="text-gray-900">{schoolInfo?.schoolEmail || 'school@example.com'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">School phone</label>
          <p className="text-gray-900">{schoolInfo?.schoolPhone || '+234-8012345678'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">School address</label>
          <p className="text-gray-900">{schoolInfo?.schoolAddress || 'School Address'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
          <p className="text-gray-900">{schoolInfo?.schoolWebsite || 'www.school.com'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Session</label>
          <p className="text-gray-900">2023/2024</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Term</label>
          <p className="text-gray-900">1st, 2nd & 3rd</p>
        </div>
      </div>
    </div>
  );
}