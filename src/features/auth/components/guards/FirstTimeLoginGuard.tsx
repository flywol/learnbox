// src/features/auth/components/guards/FirstTimeLoginGuard.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { AuthGuard } from "./AuthGuard";

interface FirstTimeLoginGuardProps {
	children: ReactNode;
	allowPasswordReset?: boolean;
}

/**
 * FirstTimeLoginGuard - Enforces password reset for first-time login users
 *
 * This is a HARD BLOCK - users with temporary credentials cannot access
 * any part of the application until they reset their password.
 *
 * Features:
 * - Blocks all routes except password reset for first-time users
 * - Preserves reset token throughout the flow
 * - Clears first-time flag after successful reset
 */
export const FirstTimeLoginGuard = ({
	children,
	allowPasswordReset = false,
}: FirstTimeLoginGuardProps) => {
	const location = useLocation();
	const { isAuthenticated, loginContext, user } = useAuthStore();

	// Only apply guard if user is authenticated
	if (!isAuthenticated) {
		return <>{children}</>;
	}

	// Check if this is a first-time login user
	const isFirstTimeUser =
		loginContext.requiresPasswordReset || loginContext.isFirstTimeLogin;
	const hasResetToken = !!loginContext.resetToken;

	// If user needs password reset and we're not on allowed pages
	if (isFirstTimeUser && hasResetToken) {
		// Allow access to password reset page
		if (allowPasswordReset || location.pathname === "/reset-password") {
			return <>{children}</>;
		}

		// Block access to all other pages - redirect to password reset
		return (
			<Navigate
				to="/reset-password"
				replace
				state={{
					from: location,
					resetToken: loginContext.resetToken,
					email: user?.email,
				}}
			/>
		);
	}

	// User doesn't need password reset or doesn't have a reset token
	return <>{children}</>;
};

/**
 * Composite guard that combines all auth guards
 * Use this in App.tsx for protected routes
 */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	return (
		<AuthGuard requiresAuth={true}>
			<FirstTimeLoginGuard>{children}</FirstTimeLoginGuard>
		</AuthGuard>
	);
};
