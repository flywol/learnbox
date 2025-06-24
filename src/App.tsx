// src/App.tsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./features/auth/store/authStore";

// Auth components and guards
import { AuthGuard } from "./features/auth/components/guards/AuthGuard";
import { FlowGuard } from "./features/auth/components/guards/FlowGuard";
import { ProtectedRoute } from "./features/auth/components/guards/FirstTimeLoginGuard";

// Pages
import RoleSelectionPage from "./features/auth/pages/RoleSelectionPage";
import SchoolSetupPage from "./features/auth/pages/SchoolSetupPage";
import SignupFlow from "./features/auth/pages/signup/AdminSignupFlow";
import LoginPage from "./features/auth/pages/login/LoginPage";
import OnboardingPage from "./features/auth/pages/onboarding/OnboardingPage";
import ForgotPasswordPage from "./features/auth/pages/password/ForgotPassword";
import ResetPasswordPage from "./features/auth/pages/password/ResetPassword";
import EmailVerificationPage from "./features/auth/pages/login/EmailVerificationPage";

// Placeholder components
const DashboardPage = () => {
	const { user, logout } = useAuthStore();
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
			<p>Your role is: {user?.role}</p>
			<button
				onClick={logout}
				className="mt-4 bg-red-500 text-white p-2 rounded">
				Log Out
			</button>
		</div>
	);
};

const UnauthorizedPage = () => (
	<div className="flex min-h-screen items-center justify-center bg-gray-50">
		<div className="text-center">
			<h1 className="text-3xl font-bold text-gray-900 mb-2">Unauthorized</h1>
			<p className="text-gray-600 mb-4">
				You don't have permission to access this page.
			</p>
			<a
				href="/"
				className="text-orange-500 hover:underline">
				Go back to home
			</a>
		</div>
	</div>
);

const NotFoundPage = () => (
	<div className="flex min-h-screen items-center justify-center bg-gray-50">
		<div className="text-center">
			<h1 className="text-3xl font-bold text-gray-900 mb-2">
				404: Page Not Found
			</h1>
			<p className="text-gray-600 mb-4">
				The page you're looking for doesn't exist.
			</p>
			<a
				href="/"
				className="text-orange-500 hover:underline">
				Go back to home
			</a>
		</div>
	</div>
);

function App() {
	const { checkAuthStatus } = useAuthStore();

	// Check auth status on app mount
	useEffect(() => {
		checkAuthStatus();
	}, [checkAuthStatus]);

	return (
		<Routes>
			{/* Public Routes - No authentication required */}

			{/* Step 1: Role Selection (entry point) */}
			<Route
				path="/"
				element={
					<AuthGuard requiresAuth={false}>
						<RoleSelectionPage />
					</AuthGuard>
				}
			/>

			{/* Step 2: School Setup (requires role) */}
			<Route
				path="/school-setup"
				element={
					<AuthGuard requiresAuth={false}>
						<FlowGuard requiresRole={true}>
							<SchoolSetupPage />
						</FlowGuard>
					</AuthGuard>
				}
			/>

			{/* Step 2.5: Admin Signup Flow */}
			<Route
				path="/signup"
				element={
					<AuthGuard requiresAuth={false}>
						<FlowGuard
							requiresRole={true}
							allowedRoles={["ADMIN"]}>
							<SignupFlow />
						</FlowGuard>
					</AuthGuard>
				}
			/>

			{/* Step 3: Login (requires both role and school) */}
			<Route
				path="/login"
				element={
					<AuthGuard requiresAuth={false}>
						<FlowGuard
							requiresRole={true}
							requiresSchool={true}>
							<LoginPage />
						</FlowGuard>
					</AuthGuard>
				}
			/>

			<Route
				path="/verify-email"
				element={<EmailVerificationPage />}
			/>

			{/* Password Reset Routes */}
			<Route
				path="/forgot-password"
				element={
					<AuthGuard requiresAuth={false}>
						<ForgotPasswordPage />
					</AuthGuard>
				}
			/>

			<Route
				path="/reset-password"
				element={<ResetPasswordPage />}
			/>

			{/* Protected Routes - Authentication required */}

			{/* Onboarding (first-time users after login) */}
			<Route
				path="/onboarding"
				element={
					<ProtectedRoute>
						<OnboardingPage />
					</ProtectedRoute>
				}
			/>

			{/* Main Dashboard */}
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<DashboardPage />
					</ProtectedRoute>
				}
			/>

			{/* Error Pages */}
			<Route
				path="/unauthorized"
				element={<UnauthorizedPage />}
			/>

			{/* Legacy route redirects */}
			<Route
				path="/select-role"
				element={
					<Navigate
						to="/"
						replace
					/>
				}
			/>

			{/* Catch-all route */}
			<Route
				path="*"
				element={<NotFoundPage />}
			/>
		</Routes>
	);
}

export default App;
