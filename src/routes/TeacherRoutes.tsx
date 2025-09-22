// src/routes/TeacherRoutes.tsx
import { Route } from "react-router-dom";
import { lazy } from "react";
import TeacherLayout from "../common/layout/TeacherLayout";
import { LayoutNotFoundPage } from "../components/ErrorPages";

// Teacher feature pages
const TeacherDashboard = lazy(() => import("../features/teacher/dashboard/pages/TeacherDashboard"));
const MyClassesPage = lazy(() => import("../features/teacher/classroom/pages/MyClassesPage"));
const AssignmentListPage = lazy(() => import("../features/teacher/assignments/pages/AssignmentListPage"));
const CreateAssignmentPage = lazy(() => import("../features/teacher/assignments/pages/CreateAssignmentPage"));
const TeacherNotificationsPage = lazy(() => import("../features/teacher/notifications/pages/NotificationsPage"));
const TeacherProfilePage = lazy(() => import("../features/teacher/profile/pages/AdminProfilePage"));

export function TeacherRoutes() {
  return (
    <Route element={<TeacherLayout />}>
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/classes" element={<MyClassesPage />} />
      <Route path="/teacher/assignments" element={<AssignmentListPage />} />
      <Route path="/teacher/assignments/create" element={<CreateAssignmentPage />} />
      <Route path="/teacher/notifications" element={<TeacherNotificationsPage />} />
      <Route path="/teacher/profile" element={<TeacherProfilePage />} />
      <Route path="/teacher/*" element={<LayoutNotFoundPage />} />
    </Route>
  );
}