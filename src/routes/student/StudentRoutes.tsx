import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import StudentLayout from "../../common/layout/student/StudentLayout";
import { ProtectedRoute } from "../../features/auth/components/guards/FirstTimeLoginGuard";
import { RoleGuard } from "../../common/components/guards/RoleGuard";
import { LayoutNotFoundPage } from "../../components/ErrorPages";

// Dashboard
const StudentDashboard = lazy(
	() => import("../../features/student/dashboard/pages/StudentDashboard")
);

// Profile
const StudentProfilePage = lazy(
	() => import("../../features/student/profile/pages/StudentProfilePage")
);

// Notifications
const NotificationsPage = lazy(
	() => import("../../features/student/notifications/pages/NotificationsPage")
);

// Chat
const ChatPage = lazy(
	() => import("../../features/student/chat/pages/ChatPage")
);

// Schedule
const SchedulePage = lazy(
	() => import("../../features/student/schedule/pages/SchedulePage")
);

// Live Class
const LiveClassPage = lazy(
	() => import("../../features/student/live-class/pages/LiveClassPage")
);

// Classroom
const ClassroomPage = lazy(
	() => import("../../features/student/classroom/pages/ClassroomPage")
);
const SubjectDetailPage = lazy(
	() => import("../../features/student/classroom/pages/SubjectDetailPage")
);
const LessonContentPage = lazy(
	() => import("../../features/student/classroom/pages/LessonContentPage")
);
const ContentItemPage = lazy(
	() => import("../../features/student/classroom/pages/ContentItemPage")
);
const AssignmentDetailPage = lazy(
	() => import("../../features/student/classroom/pages/AssignmentDetailPage")
);
const SubmittedAssignmentPage = lazy(
	() => import("../../features/student/classroom/pages/SubmittedAssignmentPage")
);
const StudentQuizTakingPage = lazy(
	() => import("../../features/student/classroom/pages/StudentQuizTakingPage")
);
const StudentQuizReviewPage = lazy(
	() => import("../../features/student/classroom/pages/StudentQuizReviewPage")
);

// Assessment
const AssessmentPage = lazy(
	() => import("../../features/student/assessment/pages/AssessmentPage")
);
const GradeBreakdownPage = lazy(
	() => import("../../features/student/assessment/pages/GradeBreakdownPage")
);

// LearnBox AI
const LearnBoxAIHomePage = lazy(
	() => import("../../features/student/learnbox-ai/pages/LearnBoxAIHomePage")
);
const LearnBoxAIChatPage = lazy(
	() => import("../../features/student/learnbox-ai/pages/LearnBoxAIChatPage")
);

export function StudentRoutes() {
	return (
		<Routes>
			<Route
				element={
					<ProtectedRoute>
						<RoleGuard allowedRoles={["STUDENT"]}>
							<StudentLayout />
						</RoleGuard>
					</ProtectedRoute>
				}>
				{/* Dashboard */}
				<Route index element={<StudentDashboard />} />
				<Route path="dashboard" element={<StudentDashboard />} />

				{/* Profile */}
				<Route path="profile" element={<StudentProfilePage />} />

				{/* Notifications */}
				<Route path="notifications" element={<NotificationsPage />} />

				{/* Schedule */}
				<Route path="schedule" element={<SchedulePage />} />

				{/* Chat */}
				<Route path="chat" element={<ChatPage />} />

				{/* Live Class */}
				<Route path="live-class" element={<LiveClassPage />} />

				{/* Classroom */}
				<Route path="classroom" element={<ClassroomPage />} />
				<Route path="classroom/subject/:subjectId" element={<SubjectDetailPage />} />
				<Route path="classroom/subject/:subjectId/lesson/:lessonId" element={<LessonContentPage />} />
				<Route path="classroom/subject/:subjectId/lesson/:lessonId/content/:contentId" element={<ContentItemPage />} />
				<Route path="classroom/subject/:subjectId/quiz/:quizId/take" element={<StudentQuizTakingPage />} />
				<Route path="classroom/subject/:subjectId/quiz/:quizId/review" element={<StudentQuizReviewPage />} />
				<Route path="classroom/assignment/:assignmentId" element={<AssignmentDetailPage />} />
				<Route path="classroom/assignment/:assignmentId/submitted" element={<SubmittedAssignmentPage />} />

				{/* Assessment */}
				<Route path="assessment" element={<AssessmentPage />} />
				<Route path="assessment/:subjectId" element={<GradeBreakdownPage />} />

				{/* LearnBox AI */}
				<Route path="learnbox-ai" element={<LearnBoxAIHomePage />} />
				<Route path="learnbox-ai/chat/:subjectId" element={<LearnBoxAIChatPage />} />

				{/* Fallback */}
				<Route path="*" element={<LayoutNotFoundPage />} />
			</Route>
		</Routes>
	);
}
