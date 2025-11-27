import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import ParentLayout from "../../common/layout/parent/ParentLayout";
import { LayoutNotFoundPage } from "../../components/ErrorPages";

// Dashboard
const ParentDashboard = lazy(
	() => import("../../features/parent/dashboard/pages/ParentDashboard")
);

// Child
const ChildPage = lazy(
	() => import("../../features/parent/child/pages/ChildPage")
);
const SubjectDetailPage = lazy(
	() => import("../../features/parent/child/pages/SubjectDetailPage")
);
const LessonContentPage = lazy(
	() => import("../../features/parent/child/pages/LessonContentPage")
);

// Schedule
const SchedulePage = lazy(
	() => import("../../features/parent/schedule/pages/SchedulePage")
);

// Payments
const PaymentsPage = lazy(
	() => import("../../features/parent/payments/pages/PaymentsPage")
);

// Academic Record
const GradeBreakdownPage = lazy(
	() => import("../../features/parent/academic-record/pages/GradeBreakdownPage")
);
const AcademicRecordPage = lazy(
	() => import("../../features/parent/academic-record/pages/AcademicRecordPage")
);

// Profile
const ParentProfilePage = lazy(
	() => import("../../features/parent/profile/pages/ParentProfilePage")
);

// Chat
const ChatPage = lazy(
	() => import("../../features/parent/chat/pages/ChatPage")
);

// Notifications
const NotificationsPage = lazy(
	() => import("../../features/parent/notifications/pages/NotificationsPage")
);

export function ParentRoutes() {
	return (
		<Routes>
			<Route
				element={
					// NO AUTH for now - just layout
					<ParentLayout />
				}>
				{/* Dashboard */}
				<Route index element={<ParentDashboard />} />
				<Route path="dashboard" element={<ParentDashboard />} />

				{/* Child */}
				<Route path="child" element={<ChildPage />} />
				<Route path="child/subject/:subjectId" element={<SubjectDetailPage />} />
				<Route
					path="child/subject/:subjectId/lesson/:lessonId"
					element={<LessonContentPage />}
				/>

				{/* Schedule */}
				<Route path="schedule" element={<SchedulePage />} />

				{/* Payments */}
				<Route path="payments" element={<PaymentsPage />} />

				{/* Chat */}
				<Route path="chat" element={<ChatPage />} />

				{/* Notifications */}
				<Route path="notifications" element={<NotificationsPage />} />

				{/* Academic Record */}
				<Route path="academic-record" element={<AcademicRecordPage />} />
				<Route path="academic-record/subject/:subjectId" element={<GradeBreakdownPage />} />

				{/* Profile */}
				<Route path="profile" element={<ParentProfilePage />} />

				{/* Fallback */}
				<Route path="*" element={<LayoutNotFoundPage />} />
			</Route>
		</Routes>
	);
}
