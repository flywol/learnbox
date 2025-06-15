// src/features/auth/components/guards/AuthGuard.tsx
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface AuthGuardProps {
	children: ReactNode;
	requiresAuth?: boolean;
	redirectTo?: string;
}

/**
 * AuthGuard - Protects routes that require authentication
 *
 * Features:
 * - Redirects unauthenticated users to login
 * - Handles first-time login redirects to password reset
 * - Preserves intended destination for post-login redirect
 * - Supports inverse logic for auth-only pages (login, signup)
 */
export const AuthGuard = ({
	children,
	requiresAuth = true,
	redirectTo = "/",
}: AuthGuardProps) => {
	const location = useLocation();
	const { isAuthenticated, loginContext, setIntendedDestination } =
		useAuthStore();

	useEffect(() => {
		// Save the intended destination if user is trying to access protected route
		if (requiresAuth && !isAuthenticated && location.pathname !== "/") {
			setIntendedDestination(location.pathname);
		}
	}, [
		requiresAuth,
		isAuthenticated,
		location.pathname,
		setIntendedDestination,
	]);

	// Check if user needs to reset password (first-time login)
	if (isAuthenticated && loginContext.requiresPasswordReset) {
		// Only redirect to reset password if we're not already there
		if (!location.pathname.includes("/reset-password")) {
			return (
				<Navigate
					to="/reset-password"
					replace
					state={{ from: location }}
				/>
			);
		}
	}

	// For protected routes
	if (requiresAuth && !isAuthenticated) {
		return (
			<Navigate
				to={redirectTo}
				replace
				state={{ from: location }}
			/>
		);
	}

	// For guest-only routes (login, signup, etc.)
	if (!requiresAuth && isAuthenticated) {
		// If user doesn't need password reset, redirect to dashboard
		if (!loginContext.requiresPasswordReset) {
			return (
				<Navigate
					to="/dashboard"
					replace
				/>
			);
		}
	}

	return <>{children}</>;
};
