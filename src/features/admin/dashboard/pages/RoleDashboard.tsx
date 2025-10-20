// src/features/dashboard/pages/RoleDashboard.tsx - Route based on user role
import { useCurrentUser } from "@/features/auth/store/authStore";
import { Navigate } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import TeacherDashboard from "../../../teacher/dashboard/pages/TeacherDashboard";

const RoleDashboard = () => {
	const user = useCurrentUser();

	// If user is a teacher, show simple teacher dashboard
	if (user?.role?.toLowerCase() === 'teacher') {
		return <TeacherDashboard />;
	}

	// If user is a student, redirect to student dashboard
	if (user?.role?.toLowerCase() === 'student') {
		return <Navigate to="/student/dashboard" replace />;
	}

	// Otherwise show admin dashboard
	return <DashboardPage />;
};

export default RoleDashboard;