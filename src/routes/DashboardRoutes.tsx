import { Route } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "../features/auth/components/guards/FirstTimeLoginGuard";
import DashboardLayout from "../common/layout/DashboardLayout";

const AdminDashboard = lazy(() => import("../features/dashboard/pages/AdminDashboard"));
const CompleteSetupPage = lazy(() => import("../features/dashboard/school-setup/pages/CompleteSetupPage"));
const NotificationsPage = lazy(() => import("../features/notifications/pages/NotificationsPage"));

export function DashboardRoutes() {
  return (
    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard/complete-school-setup" element={<CompleteSetupPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Route>
  );
}