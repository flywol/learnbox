import { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Role, User, UserData } from "../types/auth.types";
import { authApiClient } from "../api/authApiClient";

interface UseAuthOptions {
	redirectTo?: string;
	requireAuth?: boolean;
	allowedRoles?: Role[];
}

// Helper function to transform API user data to internal User type
const transformUserData = (apiUser: UserData): User => {
	return {
		id: apiUser.id || "",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		deleted_at: "",
		fullName:
			apiUser.firstName && apiUser.lastName
				? `${apiUser.firstName} ${apiUser.lastName}`
				: apiUser.fullName || "",
		phoneNumber: apiUser.phone || apiUser.phoneNumber || "",
		email: apiUser.email,
		role: apiUser.role,
		isVerified: apiUser.isVerified ?? true,
		isActive: apiUser.isActive ?? true,
		isDeleted: false,
		otp: "",
		otpExpiration: "",
		resetPasswordToken: apiUser.resetPasswordToken || "",
		resetPasswordExpires: "",
	};
};

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
		loadingState,
		login: storeLogin,
		logout: storeLogout,
		setFirstTimeLogin,
		setLoadingState,
		setIntendedDestination,
	} = authState;

	// Check access permissions
	const hasAccess = useCallback(() => {
		if (!requireAuth) return true;
		if (!isAuthenticated) return false;
		if (allowedRoles.length > 0 && user?.role) {
			return allowedRoles.includes(user.role as Role);
		}
		return true;
	}, [requireAuth, isAuthenticated, allowedRoles, user]);

	// Enhanced login function
	const login = useCallback(
		async (email: string, password: string, rememberMe: boolean = false) => {
			setLoadingState("submitting");

			try {
				const response = await authApiClient.login(
					{ email, password },
					rememberMe
				);

				// Transform user data
				const transformedUser = transformUserData(response.data.user);

				// Check for first-time login
				const isFirstTimeLogin = !!transformedUser.resetPasswordToken;

				if (isFirstTimeLogin) {
					setFirstTimeLogin(true, response.data.accessToken);
				}

				// Log the user in
				storeLogin(transformedUser);
				setLoadingState("success");

				return {
					success: true,
					user: transformedUser,
					isFirstTimeLogin,
					resetToken: isFirstTimeLogin ? response.data.accessToken : undefined,
				};
			} catch (error) {
				setLoadingState("error");
				return {
					success: false,
					error: error instanceof Error ? error.message : "Login failed",
				};
			}
		},
		[setLoadingState, setFirstTimeLogin, storeLogin]
	);

	// Enhanced logout function
	const logout = useCallback(async () => {
		try {
			await storeLogout();
			navigate(redirectTo);
		} catch (error) {
			console.error("Logout error:", error);
			navigate(redirectTo);
		}
	}, [storeLogout, navigate, redirectTo]);

	// Redirect logic based on auth state
	useEffect(() => {
		if (requireAuth && !isAuthenticated) {
			setIntendedDestination(location.pathname);
			navigate(redirectTo, { state: { from: location } });
		} else if (requireAuth && !hasAccess()) {
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

	return {
		// State
		user,
		isAuthenticated,
		isFirstTimeLogin: loginContext.isFirstTimeLogin,
		requiresPasswordReset: loginContext.requiresPasswordReset,
		selectedRole,
		schoolDomain,
		isLoading: loadingState === "submitting" || loadingState === "validating",
		loadingState,

		// Functions
		login,
		logout,
		hasAccess,

		// Utilities
		isAdmin: user?.role === "ADMIN",
		isTeacher: user?.role === "TEACHER",
		isStudent: user?.role === "STUDENT",
		isParent: user?.role === "PARENT",
	};
};
