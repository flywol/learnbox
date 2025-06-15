// src/features/auth/hooks/useAuth.ts
import { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { mockAuthApi } from "../api/mockAuthApi";
import { Role } from "../types/user.types";

interface UseAuthOptions {
	redirectTo?: string;
	requireAuth?: boolean;
	allowedRoles?: Role[];
}

/**
 * useAuth - Main authentication hook
 *
 * Provides:
 * - Authentication state and user info
 * - Login/logout functions with proper flow handling
 * - Role-based access control
 * - Automatic redirects based on auth state
 * - First-time login detection
 */
export const useAuth = (options: UseAuthOptions = {}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const {
		redirectTo = "/login",
		requireAuth = false,
		allowedRoles = [],
	} = options;

	// Get all auth state
	const authState = useAuthStore();
	const {
		user,
		isAuthenticated,
		selectedRole,
		schoolDomain,
		loginContext,
		authError,
		loadingState,
		login: storeLogin,
		logout: storeLogout,
		setFirstTimeLogin,
		setAuthError,
		setLoadingState,
		setIntendedDestination,
	} = authState;

	// Check access permissions
	const hasAccess = useCallback(() => {
		if (!requireAuth) return true;
		if (!isAuthenticated) return false;
		if (allowedRoles.length > 0 && user?.role) {
			return allowedRoles.includes(user.role);
		}
		return true;
	}, [requireAuth, isAuthenticated, allowedRoles, user]);

	// Enhanced login function
	const login = useCallback(
		async (email: string, password: string, role?: Role, school?: string) => {
			setLoadingState("submitting");
			setAuthError(null);

			try {
				// Use provided role/school or fall back to store values
				const loginRole = role || selectedRole;
				const loginSchool = school || schoolDomain;

				if (!loginRole || !loginSchool) {
					throw new Error("Role and school must be selected before login");
				}

				const response = await mockAuthApi.login(
					email,
					password,
					loginRole,
					loginSchool
				);

				if (response.success && response.data) {
					const { user, isFirstTimeLogin, resetToken } = response.data;

					// Set first-time login context if needed
					if (isFirstTimeLogin && resetToken) {
						setFirstTimeLogin(true, resetToken);
					}

					// Log the user in
					storeLogin(user);
					setLoadingState("success");

					return {
						success: true,
						user,
						isFirstTimeLogin,
						resetToken,
					};
				} else {
					setAuthError(
						response.error || {
							code: "INVALID_CREDENTIALS",
							message: "Login failed",
						}
					);
					setLoadingState("error");
					return {
						success: false,
						error: response.error,
					};
				}
			} catch (error) {
				const authError = {
					code: "NETWORK_ERROR" as const,
					message:
						error instanceof Error
							? error.message
							: "An unexpected error occurred",
				};
				setAuthError(authError);
				setLoadingState("error");
				return {
					success: false,
					error: authError,
				};
			}
		},
		[
			selectedRole,
			schoolDomain,
			setLoadingState,
			setAuthError,
			setFirstTimeLogin,
			storeLogin,
		]
	);

	// Enhanced logout function
	const logout = useCallback(async () => {
		try {
			// Call API to invalidate session
			await mockAuthApi.logout();

			// Clear local state
			storeLogout();

			// Redirect to login
			navigate(redirectTo);
		} catch (error) {
			console.error("Logout error:", error);
			// Still clear local state even if API fails
			storeLogout();
			navigate(redirectTo);
		}
	}, [storeLogout, navigate, redirectTo]);

	// Redirect logic based on auth state
	useEffect(() => {
		if (requireAuth && !isAuthenticated) {
			// Save intended destination
			setIntendedDestination(location.pathname);
			navigate(redirectTo, { state: { from: location } });
		} else if (requireAuth && !hasAccess()) {
			// User is authenticated but doesn't have the right role
			navigate("/unauthorized");
		}
	}, [
		requireAuth,
		isAuthenticated,
		hasAccess,
		navigate,
		redirectTo,
		location,
		setIntendedDestination,
	]);

	// Handle first-time login redirects
	useEffect(() => {
		if (isAuthenticated && loginContext.requiresPasswordReset) {
			// Don't redirect if already on password reset page
			if (!location.pathname.includes("/reset-password")) {
				navigate("/reset-password", {
					state: {
						resetToken: loginContext.resetToken,
						email: user?.email,
					},
				});
			}
		}
	}, [isAuthenticated, loginContext, navigate, location, user]);

	return {
		// State
		user,
		isAuthenticated,
		isFirstTimeLogin: loginContext.isFirstTimeLogin,
		requiresPasswordReset: loginContext.requiresPasswordReset,
		selectedRole,
		schoolDomain,
		authError,
		isLoading: loadingState === "submitting" || loadingState === "validating",
		loadingState,

		// Functions
		login,
		logout,
		hasAccess,
		clearError: () => setAuthError(null),

		// Utilities
		isAdmin: user?.role === "ADMIN",
		isTeacher: user?.role === "TEACHER",
		isStudent: user?.role === "STUDENT",
		isParent: user?.role === "PARENT",
	};
};
