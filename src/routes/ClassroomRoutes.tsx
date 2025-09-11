import { Route } from "react-router-dom";
import { lazy } from "react";

const ClassroomOverviewPage = lazy(() => import("../features/classroom/pages/ClassroomOverviewPage"));
const ClassDetailPage = lazy(() => import("../features/classroom/pages/ClassDetailPage"));
const SubjectDetailPage = lazy(() => import("../features/classroom/pages/SubjectDetailPage"));
const AssignmentDetailPage = lazy(() => import("../features/classroom/pages/AssignmentDetailPage"));
const QuizDetailPage = lazy(() => import("../features/classroom/pages/QuizDetailPage"));
const AddEventPage = lazy(() => import("../features/classroom/pages/AddEventPage"));
const AddTimetablePage = lazy(() => import("../features/classroom/pages/AddTimetablePage"));

export function ClassroomRoutes() {
  return (
    <>
      <Route path="/classroom" element={<ClassroomOverviewPage />} />
      <Route path="/classroom/add-event" element={<AddEventPage />} />
      <Route path="/classroom/add-timetable" element={<AddTimetablePage />} />
      <Route path="/classroom/:classId" element={<ClassDetailPage />} />
      <Route path="/classroom/:classId/subject/:subjectId" element={<SubjectDetailPage />} />
      <Route path="/classroom/:classId/subject/:subjectId/assignment/:assignmentId" element={<AssignmentDetailPage />} />
      <Route path="/classroom/:classId/subject/:subjectId/quiz/:quizId" element={<QuizDetailPage />} />
    </>
  );
}