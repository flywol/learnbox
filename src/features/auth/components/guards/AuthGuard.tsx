// src/features/auth/components/guards/AuthGuard.tsx
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import { useShallow } from "zustand/react/shallow";

interface AuthGuardProps {
	children: ReactNode;
	requiresAuth?: boolean;
	redirectTo?: string;
}

export const AuthGuard = ({
	children,
	requiresAuth = true,
	redirectTo = "/",
}: AuthGuardProps) => {
	const location = useLocation();
	const {
		isAuthenticated,
		loginContext,
		setIntendedDestination,
		hasHydrated,
		user,
	} = useAuthStore(
		useShallow((state) => ({
			isAuthenticated: state.isAuthenticated,
			loginContext: state.loginContext,
			setIntendedDestination: state.setIntendedDestination,
			hasHydrated: state.hasHydrated,
			user: state.user,
		}))
	);

	useEffect(() => {
		// Save intended destination for protected routes
		if (
			requiresAuth &&
			!isAuthenticated &&
			location.pathname !== "/" &&
			location.pathname !== "/login"
		) {
			setIntendedDestination(location.pathname);
		}
	}, [
		requiresAuth,
		isAuthenticated,
		location.pathname,
		setIntendedDestination,
	]);

	// Don't render anything until hydration is complete
	if (!hasHydrated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
			</div>
		);
	}

	// Handle password reset requirement (highest priority)
	if (isAuthenticated && user && loginContext.requiresPasswordReset) {
		if (location.pathname !== "/reset-password") {
			return (
				<Navigate
					to="/reset-password"
					replace
					state={{ from: location }}
				/>
			);
		}
	}

	// Handle unauthenticated users trying to access protected routes
	if (requiresAuth && (!isAuthenticated || !user)) {
		return (
			<Navigate
				to={redirectTo}
				replace
				state={{ from: location }}
			/>
		);
	}

	// Handle authenticated users trying to access guest-only routes
	if (
		!requiresAuth &&
		isAuthenticated &&
		user &&
		!loginContext.requiresPasswordReset
	) {
		// Allow certain pages even when authenticated
		const allowedGuestPages = ["/reset-password", "/verify-email"];
		if (!allowedGuestPages.includes(location.pathname)) {
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
