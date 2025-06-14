import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "./features/auth/store/useAuthStore";
import RoleSelectionPage from "./features/auth/pages/RoleSelectionPage";
import OnboardingPage from "./features/auth/pages/OnboardingPage";
import CombinedSchoolLoginPage from "./features/auth/pages/LoginPage";
import { JSX } from "react";
import SchoolSetupPage from "./features/auth/pages/UrlPage";
import SignupFlow from "./features/auth/pages/adminSignup/AdminSignup";

// --- Helper Components for Routing ---

// 1. A protected route component
// This component checks if a user is authenticated.
// If they are, it shows the page. If not, it redirects them to the role selection.
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	return isAuthenticated ? (
		children
	) : (
		<Navigate
			to="/"
			replace
		/>
	);
};

// 2. Flow-aware route guard
// This ensures users go through the proper flow: role -> school -> login
const FlowGuard = ({
	children,
	requiresRole = false,
	requiresSchool = false,
}: {
	children: JSX.Element;
	requiresRole?: boolean;
	requiresSchool?: boolean;
}) => {
	const { selectedRole, schoolDomain } = useAuthStore();

	// If role is required but not set, redirect to role selection
	if (requiresRole && !selectedRole) {
		return (
			<Navigate
				to="/"
				replace
			/>
		);
	}

	// If school is required but not set, redirect to school setup
	if (requiresSchool && !schoolDomain) {
		return (
			<Navigate
				to="/school-setup"
				replace
			/>
		);
	}

	return children;
};

// 3. A placeholder for your main dashboard
const DashboardPage = () => {
	const { user, logout } = useAuthStore();
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">
				Welcome to the Dashboard, {user?.name}!
			</h1>
			<p>Your role is: {user?.role}</p>
			<button
				onClick={logout}
				className="mt-4 bg-red-500 text-white p-2 rounded">
				Log Out
			</button>
		</div>
	);
};

// 4. A placeholder for onboarding (role-based welcome screens)
const OnboardingPageWrapper = () => {
	return <OnboardingPage />;
};

// 5. A placeholder for a 404 Not Found page
const NotFoundPage = () => (
	<div className="p-8 text-center">
		<h1 className="text-2xl font-bold">404: Page Not Found</h1>
		<p className="mt-2 text-gray-600">
			The page you're looking for doesn't exist.
		</p>
	</div>
);

// --- Main App Component with Route Definitions ---

function App() {
	const navigate = useNavigate();

	return (
		<Routes>
			{/* Step 1: Role Selection (entry point) */}
			<Route
				path="/"
				element={<RoleSelectionPage />}
			/>

			{/* Step 2: School Setup (requires role) */}
			<Route
				path="/school-setup"
				element={
					<FlowGuard requiresRole={true}>
						<SchoolSetupPage />
					</FlowGuard>
				}
			/>

			{/* Step 2.5: Signup Flow for Admin users creating new schools */}
			<Route
				path="/signup"
				element={
					<FlowGuard requiresRole={true}>
						<SignupFlow onComplete={() => navigate("/school-setup")} />
					</FlowGuard>
				}
			/>

			{/* Step 3: Login (requires both role and school) */}
			<Route
				path="/login"
				element={
					<FlowGuard
						requiresRole={true}
						requiresSchool={true}>
						<CombinedSchoolLoginPage />
					</FlowGuard>
				}
			/>

			{/* Step 4: Onboarding (first-time users after login) */}
			<Route
				path="/onboarding"
				element={
					<ProtectedRoute>
						<OnboardingPageWrapper />
					</ProtectedRoute>
				}
			/>

			{/* Step 5: Main Dashboard (protected) */}
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<DashboardPage />
					</ProtectedRoute>
				}
			/>

			{/* Legacy route redirects for old flow */}
			<Route
				path="/select-role"
				element={
					<Navigate
						to="/"
						replace
					/>
				}
			/>

			{/* Catch-all route for any other path */}
			<Route
				path="*"
				element={<NotFoundPage />}
			/>
		</Routes>
	);
}

export default App;
