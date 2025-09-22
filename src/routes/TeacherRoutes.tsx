// src/routes/TeacherRoutes.tsx
import { Route } from "react-router-dom";
import { lazy } from "react";

// Teacher feature pages
const TeacherDashboard = lazy(() => import("../features/teacher/dashboard/pages/TeacherDashboard"));
const MyClassesPage = lazy(() => import("../features/teacher/classroom/pages/MyClassesPage"));
const AssignmentListPage = lazy(() => import("../features/teacher/assignments/pages/AssignmentListPage"));
const CreateAssignmentPage = lazy(() => import("../features/teacher/assignments/pages/CreateAssignmentPage"));

export function TeacherRoutes() {
  return (
    <>
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/classes" element={<MyClassesPage />} />
      <Route path="/teacher/assignments" element={<AssignmentListPage />} />
      <Route path="/teacher/assignments/create" element={<CreateAssignmentPage />} />
    </>
  );
}