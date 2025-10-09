import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../auth/store/authStore";
import { useTeacherProfileData } from "../hooks/useTeacherProfile";
import SchoolHeader from "../components/profile/SchoolHeader";
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfoSection from "../components/profile/PersonalInfoSection";
import SchoolInfoSection from "../components/profile/SchoolInfoSection";
import ClassLevelsSection from "../components/profile/ClassLevelsSection";
import SettingsSection from "../components/profile/SettingsSection";
import LogoutButton from "../components/profile/LogoutButton";
import LogoutModal from "../components/profile/LogoutModal";

export default function TeacherProfilePage() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuthStore();

  // Fetch teacher profile data from API
  const { profile, subjects, classes, isLoading, error } = useTeacherProfileData();

  // Transform API data for UI components
  const teacherProfile = profile;
  const schoolInfo = profile?.school;

  // Transform subjects-classes data for ClassLevelsSection
  const { classLevels, classArms } = useMemo(() => {
    if (!classes || classes.length === 0) {
      return { classLevels: [], classArms: [] };
    }

    const transformedLevels = classes.map(classItem => ({
      id: classItem.id,
      class: classItem.level,
      arms: (classItem.arms || []).map(arm => ({
        id: arm.id,
        armName: arm.name
      }))
    }));

    const transformedArms = classes.flatMap(classItem =>
      (classItem.arms || []).map(arm => ({
        id: arm.id,
        studentCount: 0, // Not provided by API
        assignedTeachers: [] // Not provided by API
      }))
    );

    return { classLevels: transformedLevels, classArms: transformedArms };
  }, [classes]);

  const profileLoading = isLoading;
  const classLevelsLoading = isLoading;

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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center text-red-600">
            <p>Error loading profile. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <SchoolHeader schoolInfo={schoolInfo} />

      <div className="bg-white rounded-b-lg shadow-sm border border-t-0 relative">
        <ProfileHeader teacherProfile={teacherProfile} />

        <div className="px-6 pb-6 space-y-8">
          <PersonalInfoSection
            teacherProfile={teacherProfile}
            showSubjects={subjects.length > 0}
            subjects={subjects}
          />

          <SchoolInfoSection
            schoolInfo={schoolInfo}
          />

          <ClassLevelsSection
            classLevels={classLevels}
            classArms={classArms}
          />

          <SettingsSection />

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