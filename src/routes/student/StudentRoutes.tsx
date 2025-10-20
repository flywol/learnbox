import { Route } from "react-router-dom";
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

// Live Class
const LiveClassPage = lazy(
	() => import("../../features/student/live-class/pages/LiveClassPage")
);

export function StudentRoutes() {
	return (
		<Route
			path="/student"
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

			{/* Chat */}
			<Route path="chat" element={<ChatPage />} />

			{/* Live Class */}
			<Route path="live-class" element={<LiveClassPage />} />

			{/* Fallback */}
			<Route path="*" element={<LayoutNotFoundPage />} />
		</Route>
	);
}
