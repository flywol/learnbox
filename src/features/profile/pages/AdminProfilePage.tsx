import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminProfile, useClassLevelsAndArms } from "../hooks/useProfile";
import { useAuthStore } from "../../auth/store/authStore";
import SchoolHeader from "../components/profile/SchoolHeader";
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfoSection from "../components/profile/PersonalInfoSection";
import SchoolInfoSection from "../components/profile/SchoolInfoSection";
import ClassLevelsSection from "../components/profile/ClassLevelsSection";
import SettingsSection from "../components/profile/SettingsSection";
import LogoutButton from "../components/profile/LogoutButton";
import LogoutModal from "../components/profile/LogoutModal";

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuthStore();

  const { data: adminProfile, isLoading: profileLoading } = useAdminProfile();
  const { data: classLevelsData, isLoading: classLevelsLoading } = useClassLevelsAndArms();
  
  const schoolInfo = adminProfile?.school;
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
      <SchoolHeader schoolInfo={schoolInfo} />
      
      <div className="bg-white rounded-b-lg shadow-sm border border-t-0 relative">
        <ProfileHeader adminProfile={adminProfile} />
        
        <div className="px-6 pb-6 space-y-8">
          <PersonalInfoSection 
            adminProfile={adminProfile} 
            onEdit={handleEditPersonalInfo} 
          />
          
          <SchoolInfoSection 
            schoolInfo={schoolInfo} 
            onEdit={handleEditSchoolInfo} 
          />
          
          <ClassLevelsSection 
            classLevels={classLevels} 
            classArms={classArms} 
          />
          
          <SettingsSection onSessionConfig={handleSessionConfig} />
          
          <LogoutButton onLogout={() => setShowLogoutModal(true)} />
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}