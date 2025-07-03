// src/App.tsx - Updated with HashRouter and Device Restriction
import { Routes, Route, HashRouter } from "react-router-dom";
import { HydrationGate } from "./components/HydrationGate";

// Security Components
import { SecurityWrapper } from "./common/security/SecurityWrapper";
import { DeviceRestrictedPage } from "./common/security/DeviceRestrictedPage";

// Layout

// Guards
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
import AdminDashboard from "./features/dashboard/pages/AdminDashboard";
import CompleteSetupPage from "./features/dashboard/school-setup/pages/CompleteSetupPage";
import DashboardLayout from "./common/layout/DashboardLayout";

const UnauthorizedPage = () => (
	<div className="flex min-h-screen items-center justify-center bg-gray-50">
		<div className="text-center">
			<h1 className="text-3xl font-bold text-gray-900 mb-2">Unauthorized</h1>
			<p className="text-gray-600 mb-4">
				You don't have permission to access this page.
			</p>
			<a
				href="#/"
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
				href="#/dashboard"
				className="text-orange-500 hover:underline">
				Go back to dashboard
			</a>
		</div>
	</div>
);

export default function App() {
	console.log("🚀 App component rendering");

	return (
		<SecurityWrapper>
			<HashRouter>
				<HydrationGate>
					<Routes>
						{/* Device Restriction Route */}
						<Route
							path="/device-restricted"
							element={<DeviceRestrictedPage />}
						/>

						{/* Public Routes - Guest Only */}
						<Route
							path="/"
							element={
								<AuthGuard requiresAuth={false}>
									<RoleSelectionPage />
								</AuthGuard>
							}
						/>

						<Route
							path="/school-setup"
							element={
								<AuthGuard requiresAuth={false}>
									<FlowGuard requiresRole>
										<SchoolSetupPage />
									</FlowGuard>
								</AuthGuard>
							}
						/>

						<Route
							path="/signup"
							element={
								<AuthGuard requiresAuth={false}>
									<FlowGuard
										requiresRole
										allowedRoles={["ADMIN"]}>
										<SignupFlow />
									</FlowGuard>
								</AuthGuard>
							}
						/>

						<Route
							path="/login"
							element={
								<AuthGuard requiresAuth={false}>
									<FlowGuard
										requiresRole
										requiresSchool>
										<LoginPage />
									</FlowGuard>
								</AuthGuard>
							}
						/>

						<Route
							path="/forgot-password"
							element={
								<AuthGuard requiresAuth={false}>
									<ForgotPasswordPage />
								</AuthGuard>
							}
						/>

						{/* Special Routes - Can be accessed by authenticated or unauthenticated */}
						<Route
							path="/verify-email"
							element={<EmailVerificationPage />}
						/>

						<Route
							path="/reset-password"
							element={<ResetPasswordPage />}
						/>

						{/* Protected Routes - Authentication Required */}
						<Route
							path="/onboarding"
							element={
								<ProtectedRoute>
									<OnboardingPage />
								</ProtectedRoute>
							}
						/>

						{/* Dashboard Routes - Wrapped with DashboardLayout */}
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<DashboardLayout />
								</ProtectedRoute>
							}>
							{/* Nested dashboard routes */}
							<Route
								index
								element={<AdminDashboard />}
							/>
							<Route
								path="complete-school-setup"
								element={<CompleteSetupPage />}
							/>
							{/* Add more dashboard routes here as needed */}
							{/* 
							<Route path="students" element={<StudentsPage />} />
							<Route path="teachers" element={<TeachersPage />} />
							<Route path="classes" element={<ClassesPage />} />
							<Route path="settings" element={<SettingsPage />} />
							*/}
						</Route>

						{/* Error Routes */}
						<Route
							path="/unauthorized"
							element={<UnauthorizedPage />}
						/>
						<Route
							path="*"
							element={<NotFoundPage />}
						/>
					</Routes>
				</HydrationGate>
			</HashRouter>
		</SecurityWrapper>
	);
}
