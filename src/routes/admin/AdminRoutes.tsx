// src/routes/admin/AdminRoutes.tsx
import { Route } from "react-router-dom";
import { lazy } from "react";
import DashboardLayout from "../../common/layout/DashboardLayout";
import { ProtectedRoute } from "../../features/auth/components/guards/FirstTimeLoginGuard";
import { RoleGuard } from "../../common/components/guards/RoleGuard";
import { LayoutNotFoundPage } from "../../components/ErrorPages";

// Dashboard
const AdminDashboard = lazy(() => import("../../features/admin/dashboard/pages/AdminDashboard"));

// User Management
const UserListPage = lazy(() => import("../../features/admin/user-management/pages/UserListPage"));
const CreateUserPage = lazy(() => import("../../features/admin/user-management/pages/CreateUserPage"));
const EditUserPage = lazy(() => import("../../features/admin/user-management/pages/EditUserPage"));
const UserDetailPage = lazy(() => import("../../features/admin/user-management/pages/UserDetailPage"));

// Classroom Management
const ClassroomOverviewPage = lazy(() => import("../../features/admin/classroom/pages/ClassroomOverviewPage"));
const ClassDetailPage = lazy(() => import("../../features/admin/classroom/pages/ClassDetailPage"));
const SubjectDetailPage = lazy(() => import("../../features/admin/classroom/pages/SubjectDetailPage"));
const AssignmentDetailPage = lazy(() => import("../../features/admin/classroom/pages/AssignmentDetailPage"));
const QuizDetailPage = lazy(() => import("../../features/admin/classroom/pages/QuizDetailPage"));
const AddEventPage = lazy(() => import("../../features/admin/classroom/pages/AddEventPage"));
const AddTimetablePage = lazy(() => import("../../features/admin/classroom/pages/AddTimetablePage"));

// Payments
const SchoolPaymentsPage = lazy(() => import("../../features/admin/payments/pages/SchoolPaymentsPage"));
const ClassPaymentDetailPage = lazy(() => import("../../features/admin/payments/pages/ClassPaymentDetailPage"));

// Profile
const AdminProfilePage = lazy(() => import("../../features/admin/profile/pages/AdminProfilePage"));
const EditPersonalInfoPage = lazy(() => import("../../features/admin/profile/pages/EditPersonalInfoPage"));
const EditSchoolInfoPage = lazy(() => import("../../features/admin/profile/pages/EditSchoolInfoPage"));
const SessionConfigPage = lazy(() => import("../../features/admin/profile/pages/SessionConfigPage"));

// Notifications
const NotificationsPage = lazy(() => import("../../features/admin/notifications/pages/NotificationsPage"));

export function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </RoleGuard>
        </ProtectedRoute>
      }
    >
      {/* Dashboard */}
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      
      {/* User Management */}
      <Route path="users" element={<UserListPage />} />
      <Route path="users/create" element={<CreateUserPage />} />
      <Route path="users/:id" element={<UserDetailPage />} />
      <Route path="users/:id/edit" element={<EditUserPage />} />
      
      {/* Classroom Management */}
      <Route path="classroom" element={<ClassroomOverviewPage />} />
      <Route path="classroom/add-event" element={<AddEventPage />} />
      <Route path="classroom/add-timetable" element={<AddTimetablePage />} />
      <Route path="classroom/:classId/:armId" element={<ClassDetailPage />} />
      <Route path="classroom/:classId/:armId/subject/:subjectId" element={<SubjectDetailPage />} />
      <Route path="classroom/:classId/:armId/subject/:subjectId/assignment/:assignmentId" element={<AssignmentDetailPage />} />
      <Route path="classroom/:classId/:armId/subject/:subjectId/quiz/:quizId" element={<QuizDetailPage />} />
      
      {/* Payments */}
      <Route path="payments" element={<SchoolPaymentsPage />} />
      <Route path="payments/:classId" element={<ClassPaymentDetailPage />} />
      
      {/* Profile */}
      <Route path="profile" element={<AdminProfilePage />} />
      <Route path="profile/personal" element={<EditPersonalInfoPage />} />
      <Route path="profile/school" element={<EditSchoolInfoPage />} />
      <Route path="profile/session" element={<SessionConfigPage />} />
      
      {/* Notifications */}
      <Route path="notifications" element={<NotificationsPage />} />
      
      {/* Fallback */}
      <Route path="*" element={<LayoutNotFoundPage />} />
    </Route>
  );
}