interface SchoolInfo {
  schoolLogo?: string | null;
  schoolName?: string | null;
  schoolShortName?: string | null;
  schoolMotto?: string | null;
}

interface SchoolHeaderProps {
  schoolInfo?: SchoolInfo;
}

export default function SchoolHeader({ schoolInfo }: SchoolHeaderProps) {
  return (
    <div className="bg-orange-500 text-white px-6 py-8 rounded-t-lg relative">
      {/* School Logo and Name */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {schoolInfo?.schoolLogo ? (
            <img 
              src={`data:image/png;base64,${schoolInfo.schoolLogo}`} 
              alt="School Logo" 
              className="w-10 h-10 object-contain bg-white bg-opacity-20 rounded-full p-1"
            />
          ) : (
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {schoolInfo?.schoolName?.charAt(0) || 'S'}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-white">
              {schoolInfo?.schoolName || 'School Name'}
            </h2>
            {schoolInfo?.schoolShortName && (
              <p className="text-sm text-white text-opacity-80">
                {schoolInfo.schoolShortName}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* School Motto */}
      <div className="text-center">
        <p className="text-lg font-medium">
          School Motto: {schoolInfo?.schoolMotto || "You shine when you work hard"}
        </p>
      </div>
    </div>
  );
}