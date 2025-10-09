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
const TeacherProfilePage = lazy(() => import("../../features/teacher/profile/pages/TeacherProfilePage"));

// Notifications (Teacher-specific)
const TeacherNotificationsPage = lazy(() => import("../../features/teacher/notifications/pages/NotificationsPage"));

// Tasks
const CreateTaskPage = lazy(() => import("../../features/teacher/tasks/pages/CreateTaskPage"));
const EditTaskPage = lazy(() => import("../../features/teacher/tasks/pages/EditTaskPage"));

// Subject Detail
const SubjectDetailPage = lazy(() => import("../../features/teacher/classroom/pages/SubjectDetailPage"));
const LessonContentPage = lazy(() => import("../../features/teacher/classroom/pages/LessonContentPage"));

// Lesson Management
const AddLessonPage = lazy(() => import("../../features/teacher/lessons/pages/AddLessonPage"));
const LessonContentSelectionPage = lazy(() => import("../../features/teacher/lessons/pages/LessonContentSelectionPage"));
const AddLessonContentPage = lazy(() => import("../../features/teacher/lessons/pages/AddLessonContentPage"));
const AddVideoPage = lazy(() => import("../../features/teacher/lessons/pages/AddVideoPage"));
const AddFilesPage = lazy(() => import("../../features/teacher/lessons/pages/AddFilesPage"));
const AddAssignmentPage = lazy(() => import("../../features/teacher/lessons/pages/AddAssignmentPage"));
const AddQuizPage = lazy(() => import("../../features/teacher/lessons/pages/AddQuizPage"));

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
      <Route path="tasks/edit" element={<EditTaskPage />} />
      
      {/* Subject Detail */}
      <Route path="subject/:subjectId" element={<SubjectDetailPage />} />
      <Route path="subject/:subjectId/lesson/:lessonId" element={<LessonContentPage />} />
      
      {/* Lesson Management */}
      <Route path="subject/:subjectId/lesson/add" element={<AddLessonPage />} />
      <Route path="subject/:subjectId/lesson/add/content" element={<LessonContentSelectionPage />} />
      <Route path="subject/:subjectId/lesson/add/video" element={<AddVideoPage />} />
      <Route path="subject/:subjectId/lesson/add/files" element={<AddFilesPage />} />
      <Route path="subject/:subjectId/lesson/add/assignment" element={<AddAssignmentPage />} />
      <Route path="subject/:subjectId/lesson/add/quiz" element={<AddQuizPage />} />
      
      {/* Add Content to Existing Lesson */}
      <Route path="subject/:subjectId/lesson/:lessonId/content/add" element={<AddLessonContentPage />} />
      <Route path="subject/:subjectId/lesson/:lessonId/content/video/add" element={<AddVideoPage />} />
      <Route path="subject/:subjectId/lesson/:lessonId/content/files/add" element={<AddFilesPage />} />
      <Route path="subject/:subjectId/lesson/:lessonId/content/assignment/add" element={<AddAssignmentPage />} />
      <Route path="subject/:subjectId/lesson/:lessonId/content/quiz/add" element={<AddQuizPage />} />
      
      {/* Fallback */}
      <Route path="*" element={<LayoutNotFoundPage />} />
    </Route>
  );
}