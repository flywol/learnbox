import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAdminProfile, useClassLevelsAndArms } from "../hooks/useProfile";
import UserAvatar from "../../user-management/components/UserAvatar";
import { useAuthStore } from "../../auth/store/authStore";
import Modal from "../../../common/components/Modal";

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [accessibilityExpanded, setAccessibilityExpanded] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const { logout } = useAuthStore();

  // Fetch data
  const { data: adminProfile, isLoading: profileLoading } = useAdminProfile();
  const { data: classLevelsData, isLoading: classLevelsLoading } = useClassLevelsAndArms();
  
  // Extract school information from the admin profile
  const schoolInfo = adminProfile?.school;
  
  // Extract class levels and arms from the new API
  const classLevels = classLevelsData?.data.classLevels || [];
  const classArms = classLevelsData?.data.classArms || [];

  const handleEditPersonalInfo = () => {
    navigate("/profile/edit-personal");
  };

  const handleEditSchoolInfo = () => {
    navigate("/profile/edit-school");
  };

  const handleSessionConfig = () => {
    navigate("/profile/session-config");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (profileLoading || classLevelsLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Orange Header Section */}
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

      {/* Content Sections */}
      <div className="bg-white rounded-b-lg shadow-sm border border-t-0 relative">
        {/* Profile Picture and Name - Overlapping sections */}
        <div className="flex items-center px-6 pt-6 pb-2">
          <div className="relative -mt-16">
            <UserAvatar
              src={adminProfile?.profilePicture}
              name={adminProfile?.fullName || "Admin"}
              size="xl"
              className="border-4 border-white"
            />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {adminProfile?.fullName || "Gabriel Davidson"}
            </h1>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-8">
        {/* Personal Information Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            <button
              onClick={handleEditPersonalInfo}
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

        {/* School Information Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">School Information</h2>
            <button
              onClick={handleEditSchoolInfo}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">School name</label>
              <p className="text-gray-900">{schoolInfo?.schoolName || 'Lakeridge Mountain High School'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Logo</label>
              {schoolInfo?.schoolLogo ? (
                <img 
                  src={`data:image/png;base64,${schoolInfo.schoolLogo}`} 
                  alt="School Logo" 
                  className="w-12 h-12 object-contain bg-gray-100 rounded-full p-2"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Logo</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Domain</label>
              <p className="text-gray-900">{schoolInfo?.schoolWebsite || 'https://lakebridgemount.com'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">School head</label>
              <p className="text-gray-900">{schoolInfo?.schoolPrincipal || 'Mrs White'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">School address</label>
              <p className="text-gray-900">{schoolInfo?.schoolAddress || '40, Crescent road, GRA, Kwara'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">School type</label>
              <p className="text-gray-900">{schoolInfo?.schoolType || 'Private school'}</p>
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

        {/* Class levels/arms Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Class levels/arms</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {classLevels && classLevels.length > 0 ? (
              classLevels
                .filter(level => level.arms.length > 0) // Only show classes with arms
                .slice(0, 8)
                .flatMap(level => 
                  level.arms.map(arm => {
                    // Find the detailed arm data from the classArms array
                    const armDetails = classArms.find(armDetail => armDetail.id === arm.id);
                    const assignedTeacher = armDetails?.assignedTeachers?.[0]; // Get first assigned teacher
                    
                    return {
                      id: `${level.id}-${arm.id}`,
                      className: level.class,
                      armName: arm.armName,
                      teacherName: assignedTeacher?.name || null,
                      totalStudents: armDetails?.studentCount || 0
                    }
                  })
                )
                .slice(0, 8) // Limit to 8 cards total
                .map((classArm) => (
                  <div key={classArm.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {classArm.className.includes('Junior Secondary School') 
                        ? classArm.className.replace('Junior Secondary School', 'JSS')
                        : classArm.className.includes('Senior Secondary School')
                        ? classArm.className.replace('Senior Secondary School', 'SSS')  
                        : classArm.className}
                      /{classArm.armName}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Teacher: {classArm.teacherName || 'Not assigned'}</p>
                      <p>Total students: {classArm.totalStudents}</p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No class information available
              </div>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          
          <div className="space-y-4">
            {/* Receive Notifications */}
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-900">Receive Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={receiveNotifications}
                  onChange={(e) => setReceiveNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {/* Accessibility Features */}
            <div className="py-3">
              <button
                onClick={() => setAccessibilityExpanded(!accessibilityExpanded)}
                className="flex items-center justify-between w-full text-left text-gray-900"
              >
                <span>Accessibility Features</span>
                {accessibilityExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5 transform -rotate-90" />
                )}
              </button>
              {accessibilityExpanded && (
                <div className="mt-2 pl-4 space-y-2 text-sm text-gray-600">
                  <p>• High contrast mode</p>
                  <p>• Large text</p>
                  <p>• Screen reader support</p>
                </div>
              )}
            </div>

            {/* Session & Term Configuration */}
            <div className="py-3">
              <button
                onClick={handleSessionConfig}
                className="flex items-center justify-between w-full text-left text-gray-900"
              >
                <span>Session & Term Configuration</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center justify-between w-48 px-6 py-3 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <span>Logout</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logging out?"
        showCloseButton={false}
      >
        <div className="text-center">
          <p className="text-gray-600 mb-8">
            Are you sure you want to log out?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-8 py-3 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}