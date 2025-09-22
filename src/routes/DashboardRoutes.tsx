import { Route } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "../features/auth/components/guards/FirstTimeLoginGuard";
import DashboardLayout from "../common/layout/DashboardLayout";
import TeacherLayout from "../common/layout/TeacherLayout";
import { useCurrentUser } from "../features/auth/store/authStore";

const RoleDashboard = lazy(() => import("../features/dashboard/pages/RoleDashboard"));
const CompleteSetupPage = lazy(() => import("../features/admin/school-setup/pages/CompleteSetupPage"));
const NotificationsPage = lazy(() => import("../features/notifications/pages/NotificationsPage"));

// Layout wrapper that chooses the right layout based on role
function RoleBasedLayout() {
  const user = useCurrentUser();
  
  // Teachers get simple layout with no API calls
  if (user?.role?.toLowerCase() === 'teacher') {
    return <TeacherLayout />;
  }
  
  // Admins get full dashboard layout
  return <DashboardLayout />;
}

export function DashboardRoutes() {
  return (
    <Route
      element={
        <ProtectedRoute>
          <RoleBasedLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<RoleDashboard />} />
      <Route path="/dashboard/complete-school-setup" element={<CompleteSetupPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Route>
  );
}