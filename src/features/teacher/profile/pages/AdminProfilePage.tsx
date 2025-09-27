import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../auth/store/authStore";
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
  const { logout, user } = useAuthStore();

  // MOCK DATA - No API calls for teachers until endpoints provided
  const mockTeacherProfile = {
    id: 'teacher-123',
    fullName: user?.fullName || 'Joe Jameshill',
    email: user?.email || 'joe@lakeridge.edu',
    phone: '+234 803 123 4567',
    role: 'TEACHER',
    subjects: ['English Language', 'Literature'],
    employeeId: 'TCH001',
    school: {
      id: 'school-1',
      schoolName: 'Lakeridge Mountain High School',
      schoolShortName: 'LMHS',
      schoolAddress: '123 Education Drive, Lagos, Nigeria',
      schoolPhone: '+234 1 234 5678',
      schoolEmail: 'info@lakeridge.edu',
      schoolWebsite: 'www.lakeridge.edu',
      schoolLogo: null,
      schoolMotto: 'Excellence in Learning'
    }
  };

  const mockClassLevels = [
    {
      id: 'level-1',
      class: 'Junior Secondary School 1',
      arms: [{ id: 'arm-1', armName: 'A' }, { id: 'arm-2', armName: 'B' }]
    },
    {
      id: 'level-2', 
      class: 'Junior Secondary School 2',
      arms: [{ id: 'arm-3', armName: 'A' }, { id: 'arm-4', armName: 'B' }]
    }
  ];

  const mockClassArms = [
    { id: 'arm-1', studentCount: 35, assignedTeachers: [{ name: 'Joe Jameshill' }] },
    { id: 'arm-2', studentCount: 32, assignedTeachers: [{ name: 'Joe Jameshill' }] },
    { id: 'arm-3', studentCount: 38, assignedTeachers: [{ name: 'Another Teacher' }] },
    { id: 'arm-4', studentCount: 34, assignedTeachers: [{ name: 'Another Teacher' }] }
  ];
  
  const adminProfile = mockTeacherProfile; // Use mock data instead of API
  const schoolInfo = mockTeacherProfile.school;
  const classLevels = mockClassLevels;
  const classArms = mockClassArms;
  const profileLoading = false;
  const classLevelsLoading = false;

  const handleEditPersonalInfo = () => {
    navigate("/teacher/profile/personal");
  };

  const handleEditSchoolInfo = () => {
    navigate("/teacher/profile/school");
  };

  const handleSessionConfig = () => {
    navigate("/teacher/profile/session");
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