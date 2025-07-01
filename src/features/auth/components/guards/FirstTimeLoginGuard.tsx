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

	console.log("🔐 FirstTimeLoginGuard check:", {
		pathname: location.pathname,
		isAuthenticated,
		hasUser: !!user,
		isFirstTimeLogin: loginContext.isFirstTimeLogin,
		requiresPasswordReset: loginContext.requiresPasswordReset,
		hasResetToken: !!loginContext.resetToken,
		allowPasswordReset,
	});

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
			console.log("✅ Allowing access to password reset page");
			return <>{children}</>;
		}

		// Block all other pages
		console.log("🚫 Blocking access, redirecting to password reset");
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

	console.log("✅ FirstTimeLoginGuard passed");
	return <>{children}</>;
};

/**
 * Main ProtectedRoute component
 */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated, hasHydrated, user } = useAuthStore();
	const location = useLocation();

	console.log("🛡️ ProtectedRoute check:", {
		pathname: location.pathname,
		isAuthenticated,
		hasUser: !!user,
		hasHydrated,
	});

	// Show loading while hydrating
	if (!hasHydrated) {
		console.log("⏳ ProtectedRoute waiting for hydration");
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
		console.log("🚫 Not authenticated, redirecting to role selection");
		return (
			<Navigate
				to="/"
				replace
				state={{ from: location }}
			/>
		);
	}

	console.log("✅ ProtectedRoute authenticated, applying FirstTimeLoginGuard");
	// Apply first-time login guard
	return <FirstTimeLoginGuard>{children}</FirstTimeLoginGuard>;
};
