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
  onEdit?: () => void;
}

export default function SchoolInfoSection({ schoolInfo }: SchoolInfoSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">School Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">School name</label>
          <p className="text-gray-900">{schoolInfo?.schoolName || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">School short name</label>
          <p className="text-gray-900">{schoolInfo?.schoolShortName || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">School email</label>
          <p className="text-gray-900">{schoolInfo?.schoolEmail || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">School phone</label>
          <p className="text-gray-900">{schoolInfo?.schoolPhone || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">School address</label>
          <p className="text-gray-900">{schoolInfo?.schoolAddress || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
          <p className="text-gray-900">{schoolInfo?.schoolWebsite || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}