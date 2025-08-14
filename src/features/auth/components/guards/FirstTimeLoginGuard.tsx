// src/features/auth/components/guards/FirstTimeLoginGuard.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface FirstTimeLoginGuardProps {
	children: ReactNode;
	allowPasswordReset?: boolean;
}

export const FirstTimeLoginGuard = ({
	children,
	allowPasswordReset = false,
}: FirstTimeLoginGuardProps) => {
	const location = useLocation();
	const { isAuthenticated, loginContext, user, hasHydrated } = useAuthStore();


	// Wait for hydration
	if (!hasHydrated) {
		return null;
	}

	// Only apply guard if user is authenticated
	if (!isAuthenticated || !user) {
		return <>{children}</>;
	}

	// Check if user needs password reset
	const needsPasswordReset =
		loginContext.requiresPasswordReset || loginContext.isFirstTimeLogin;
	const hasResetToken = !!loginContext.resetToken;

	if (needsPasswordReset && hasResetToken) {
		// Allow password reset page
		if (allowPasswordReset || location.pathname === "/reset-password") {
			return <>{children}</>;
		}

		// Block all other pages
		return (
			<Navigate
				to="/reset-password"
				replace
				state={{
					from: location,
					resetToken: loginContext.resetToken,
					email: user.email,
				}}
			/>
		);
	}

	return <>{children}</>;
};

/**
 * Main ProtectedRoute component
 */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated, hasHydrated, user } = useAuthStore();
	const location = useLocation();


	// Show loading while hydrating
	if (!hasHydrated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	// Redirect to role selection if not authenticated
	if (!isAuthenticated || !user) {
		return (
			<Navigate
				to="/"
				replace
				state={{ from: location }}
			/>
		);
	}

	// Apply first-time login guard
	return <FirstTimeLoginGuard>{children}</FirstTimeLoginGuard>;
};
