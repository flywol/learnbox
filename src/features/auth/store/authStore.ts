import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Role } from "../types/user.types";

// Loading states for better UX
type LoadingState = "idle" | "validating" | "submitting" | "success" | "error";

// Auth error types
interface AuthError {
	code:
		| "INVALID_CREDENTIALS"
		| "SCHOOL_NOT_FOUND"
		| "NETWORK_ERROR"
		| "OTP_INVALID"
		| "TOKEN_EXPIRED";
	message: string;
}

// Login context for managing first-time login flow
interface LoginContext {
	isFirstTimeLogin: boolean;
	requiresPasswordReset: boolean;
	tempCredentialsUsed: boolean;
	resetToken?: string;
}

// Main auth state interface
interface AuthState {
	// User & Authentication
	user: User | null;
	isAuthenticated: boolean;

	// Role & School Selection
	selectedRole: Role | null;
	schoolDomain: string | null;

	// Onboarding
	hasSeenOnboarding: boolean;

	// Login Context (NEW)
	loginContext: LoginContext;

	// Password Reset Flow (NEW)
	passwordResetEmail: string | null;
	passwordResetStep: "email" | "otp" | "newPassword" | null;

	// Navigation (NEW)
	intendedDestination: string | null;

	// Error Handling (NEW)
	authError: AuthError | null;

	// Loading States (NEW)
	loadingState: LoadingState;

	// Actions - Existing
	setRole: (role: Role) => void;
	setSchoolDomain: (domain: string) => void;
	login: (user: User) => void;
	logout: () => void;
	markOnboardingComplete: () => void;
	resetFlow: () => void;

	// Actions - New
	setLoginContext: (context: Partial<LoginContext>) => void;
	setFirstTimeLogin: (isFirstTime: boolean, resetToken?: string) => void;
	setPasswordResetEmail: (email: string) => void;
	setPasswordResetStep: (step: "email" | "otp" | "newPassword" | null) => void;
	setIntendedDestination: (path: string | null) => void;
	setAuthError: (error: AuthError | null) => void;
	setLoadingState: (state: LoadingState) => void;
	clearError: () => void;
	completePasswordReset: () => void;
	updateUser: (updates: Partial<User>) => void;
}

// Initial state for login context
const initialLoginContext: LoginContext = {
	isFirstTimeLogin: false,
	requiresPasswordReset: false,
	tempCredentialsUsed: false,
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			// Initial state
			user: null,
			isAuthenticated: false,
			selectedRole: null,
			schoolDomain: null,
			hasSeenOnboarding: false,
			loginContext: initialLoginContext,
			passwordResetEmail: null,
			passwordResetStep: null,
			intendedDestination: null,
			authError: null,
			loadingState: "idle",

			// Existing actions
			setRole: (role) => set({ selectedRole: role }),

			setSchoolDomain: (domain) => {
				const cleanDomain = domain
					.replace(/^https?:\/\//, "")
					.replace(/\/$/, "");
				set({ schoolDomain: cleanDomain });
			},

			login: (user) =>
				set({
					user,
					isAuthenticated: true,
					authError: null,
					loadingState: "success",
				}),

			logout: () =>
				set({
					user: null,
					isAuthenticated: false,
					selectedRole: null,
					schoolDomain: null,
					hasSeenOnboarding: false,
					loginContext: initialLoginContext,
					passwordResetEmail: null,
					passwordResetStep: null,
					intendedDestination: null,
					authError: null,
					loadingState: "idle",
				}),

			markOnboardingComplete: () => set({ hasSeenOnboarding: true }),

			resetFlow: () =>
				set({
					selectedRole: null,
					schoolDomain: null,
					hasSeenOnboarding: false,
					loginContext: initialLoginContext,
					passwordResetEmail: null,
					passwordResetStep: null,
					authError: null,
					loadingState: "idle",
				}),

			// New actions
			setLoginContext: (context) =>
				set((state) => ({
					loginContext: { ...state.loginContext, ...context },
				})),

			setFirstTimeLogin: (isFirstTime, resetToken) =>
				set({
					loginContext: {
						isFirstTimeLogin: isFirstTime,
						requiresPasswordReset: isFirstTime,
						tempCredentialsUsed: isFirstTime,
						resetToken,
					},
				}),

			setPasswordResetEmail: (email) => set({ passwordResetEmail: email }),

			setPasswordResetStep: (step) => set({ passwordResetStep: step }),

			setIntendedDestination: (path) => set({ intendedDestination: path }),

			setAuthError: (error) =>
				set({
					authError: error,
					loadingState: error ? "error" : get().loadingState,
				}),

			setLoadingState: (state) => set({ loadingState: state }),

			clearError: () => set({ authError: null }),

			completePasswordReset: () =>
				set({
					loginContext: initialLoginContext,
					passwordResetEmail: null,
					passwordResetStep: null,
					// Don't clear user or auth status as they might be logged in
				}),

			updateUser: (updates) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...updates } : null,
				})),
		}),
		{
			name: "learnbox-auth-storage",
			// Exclude temporary states from persistence
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				selectedRole: state.selectedRole,
				schoolDomain: state.schoolDomain,
				hasSeenOnboarding: state.hasSeenOnboarding,
				// Don't persist: loginContext, errors, loading states, reset flow states
			}),
		}
	)
);

// Selector hooks for commonly used combinations
export const useIsFirstTimeLogin = () =>
	useAuthStore((state) => state.loginContext.isFirstTimeLogin);

export const useAuthLoading = () => useAuthStore((state) => state.loadingState);

export const useAuthError = () => useAuthStore((state) => state.authError);
