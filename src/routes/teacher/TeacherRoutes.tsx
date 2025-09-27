// src/routes/teacher/TeacherRoutes.tsx
import { Route } from "react-router-dom";
import { lazy } from "react";
import TeacherLayout from "../../common/layout/TeacherLayout";
import { ProtectedRoute } from "../../features/auth/components/guards/FirstTimeLoginGuard";
import { RoleGuard } from "../../common/components/guards/RoleGuard";
import { LayoutNotFoundPage } from "../../components/ErrorPages";

// Dashboard
const TeacherDashboard = lazy(() => import("../../features/teacher/dashboard/pages/TeacherDashboard"));

// Classroom Management (Teacher-specific)
const MyClassesPage = lazy(() => import("../../features/teacher/classroom/pages/MyClassesPage"));

// Assignments
const AssignmentListPage = lazy(() => import("../../features/teacher/assignments/pages/AssignmentListPage"));
const CreateAssignmentPage = lazy(() => import("../../features/teacher/assignments/pages/CreateAssignmentPage"));

// Profile (Teacher-specific)
const TeacherProfilePage = lazy(() => import("../../features/teacher/profile/pages/AdminProfilePage"));

// Notifications (Teacher-specific)
const TeacherNotificationsPage = lazy(() => import("../../features/teacher/notifications/pages/NotificationsPage"));

// Tasks
const CreateTaskPage = lazy(() => import("../../features/teacher/tasks/pages/CreateTaskPage"));

// Subject Detail
const SubjectDetailPage = lazy(() => import("../../features/teacher/classroom/pages/SubjectDetailPage"));

export function TeacherRoutes() {
  return (
    <Route
      path="/teacher"
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['TEACHER']}>
            <TeacherLayout />
          </RoleGuard>
        </ProtectedRoute>
      }
    >
      {/* Dashboard */}
      <Route index element={<TeacherDashboard />} />
      <Route path="dashboard" element={<TeacherDashboard />} />
      
      {/* Classroom Management */}
      <Route path="classes" element={<MyClassesPage />} />
      
      {/* Assignments */}
      <Route path="assignments" element={<AssignmentListPage />} />
      <Route path="assignments/create" element={<CreateAssignmentPage />} />
      
      {/* Profile */}
      <Route path="profile" element={<TeacherProfilePage />} />
      
      {/* Notifications */}
      <Route path="notifications" element={<TeacherNotificationsPage />} />
      
      {/* Tasks */}
      <Route path="tasks/create" element={<CreateTaskPage />} />
      
      {/* Subject Detail */}
      <Route path="subject/:subjectId" element={<SubjectDetailPage />} />
      
      {/* Fallback */}
      <Route path="*" element={<LayoutNotFoundPage />} />
    </Route>
  );
}