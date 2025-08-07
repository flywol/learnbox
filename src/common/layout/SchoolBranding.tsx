import { useAdminProfile } from "@/features/profile/hooks/useProfile";

export default function SchoolBranding() {
  const { data: adminProfile } = useAdminProfile();
  const schoolInfo = adminProfile?.school;

  // Get first letter of school name for fallback
  const getSchoolInitial = () => {
    if (schoolInfo?.schoolName) {
      return schoolInfo.schoolName.charAt(0).toUpperCase();
    }
    return "S"; // Default fallback
  };

  // Get display name (full name preferred, fallback to short name)
  const getDisplayName = () => {
    return schoolInfo?.schoolName || schoolInfo?.schoolShortName || "School";
  };

  return (
    <div className="flex items-center gap-3">
      {/* School Logo or Initial Circle */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-orange-100">
        {schoolInfo?.schoolLogo ? (
          <img 
            src={`data:image/png;base64,${schoolInfo.schoolLogo}`} 
            alt="School Logo" 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-orange-600 font-semibold text-lg">
            {getSchoolInitial()}
          </span>
        )}
      </div>

      {/* School Name */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {getDisplayName()}
        </h2>
      </div>
    </div>
  );
}