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

			{/* Fallback */}
			<Route path="*" element={<LayoutNotFoundPage />} />
		</Route>
	);
}
