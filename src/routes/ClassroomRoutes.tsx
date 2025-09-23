import { Route } from "react-router-dom";
import { lazy } from "react";

const ClassroomOverviewPage = lazy(() => import("../features/admin/classroom/pages/ClassroomOverviewPage"));
const ClassDetailPage = lazy(() => import("../features/admin/classroom/pages/ClassDetailPage"));
const SubjectDetailPage = lazy(() => import("../features/admin/classroom/pages/SubjectDetailPage"));
const AssignmentDetailPage = lazy(() => import("../features/admin/classroom/pages/AssignmentDetailPage"));
const QuizDetailPage = lazy(() => import("../features/admin/classroom/pages/QuizDetailPage"));
const AddEventPage = lazy(() => import("../features/admin/classroom/pages/AddEventPage"));
const AddTimetablePage = lazy(() => import("../features/admin/classroom/pages/AddTimetablePage"));

export function ClassroomRoutes() {
  return (
    <>
      <Route path="/classroom" element={<ClassroomOverviewPage />} />
      <Route path="/classroom/add-event" element={<AddEventPage />} />
      <Route path="/classroom/add-timetable" element={<AddTimetablePage />} />
      <Route path="/classroom/:classId/:armId" element={<ClassDetailPage />} />
      <Route path="/classroom/:classId/:armId/subject/:subjectId" element={<SubjectDetailPage />} />
      <Route path="/classroom/:classId/:armId/subject/:subjectId/assignment/:assignmentId" element={<AssignmentDetailPage />} />
      <Route path="/classroom/:classId/:armId/subject/:subjectId/quiz/:quizId" element={<QuizDetailPage />} />
    </>
  );
}