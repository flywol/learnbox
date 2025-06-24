// src/features/auth/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Role } from "../types/user.types";
import { tokenManager } from "@/lib/api/client";

// Loading states for better UX
type LoadingState = "idle" | "validating" | "submitting" | "success" | "error";

// Login context for managing first-time login flow
interface LoginContext {
	isFirstTimeLogin: boolean;
	requiresPasswordReset: boolean;
	tempCredentialsUsed: boolean;
	resetToken?: string;
}

// Signup flow steps
type SignupStep = "school" | "personal" | "otp" | "complete" | "error" | null;

// Signup data interface - only what you actually use
interface SignupData {
	// School information (matches your SchoolInfoFormData)
	schoolName?: string;
	schoolWebsite?: string;
	schoolShortName?: string;
	learnboxUrl?: string;
	
	// Personal information (matches your PersonalInfoFormData)
	fullName?: string;
	email?: string;
	phoneNumber?: string;
	password?: string;
	
	// Verification
	otpVerified?: boolean;
	signupToken?: string;
	
	// Error handling
	error?: string;
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

	// Login Context
	loginContext: LoginContext;

	// Password Reset Flow
	passwordResetEmail: string | null;
	passwordResetStep: "email" | "otp" | "newPassword" | null;

	// Signup Flow
	signupStep: SignupStep;
	signupData: SignupData | null;

	// Navigation
	intendedDestination: string | null;

	// Loading States
	loadingState: LoadingState;

	// Actions - Authentication
	setRole: (role: Role) => void;
	setSchoolDomain: (domain: string) => void;
	login: (user: User) => void;
	logout: () => void;
	markOnboardingComplete: () => void;
	resetFlow: () => void;

	// Actions - Login Context
	setLoginContext: (context: Partial<LoginContext>) => void;
	setFirstTimeLogin: (isFirstTime: boolean, resetToken?: string) => void;

	// Actions - Password Reset
	setPasswordResetEmail: (email: string) => void;
	setPasswordResetStep: (step: "email" | "otp" | "newPassword" | null) => void;
	completePasswordReset: () => void;

	// Actions - Signup Flow
	setSignupStep: (step: SignupStep) => void;
	updateSignupData: (data: Partial<SignupData>) => void;
	clearSignupData: () => void;
	completeSignup: () => void;

	// Actions - Navigation & Utils
	setIntendedDestination: (path: string | null) => void;
	setLoadingState: (state: LoadingState) => void;
	updateUser: (updates: Partial<User>) => void;
	checkAuthStatus: () => void;
}

// Initial state for login context
const initialLoginContext: LoginContext = {
	isFirstTimeLogin: false,
	requiresPasswordReset: false,
	tempCredentialsUsed: false,
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			// Initial state
			user: null,
			isAuthenticated: false,
			selectedRole: null,
			schoolDomain: null,
			hasSeenOnboarding: false,
			loginContext: initialLoginContext,
			passwordResetEmail: null,
			passwordResetStep: null,
			signupStep: null,
			signupData: null,
			intendedDestination: null,
			loadingState: "idle",

			// Authentication actions
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
					loadingState: "success",
				}),

			logout: () => {
				tokenManager.clearTokens();
				set({
					user: null,
					isAuthenticated: false,
					selectedRole: null,
					schoolDomain: null,
					hasSeenOnboarding: false,
					loginContext: initialLoginContext,
					passwordResetEmail: null,
					passwordResetStep: null,
					signupStep: null,
					signupData: null,
					intendedDestination: null,
					loadingState: "idle",
				});
			},

			markOnboardingComplete: () => set({ hasSeenOnboarding: true }),

			resetFlow: () =>
				set({
					selectedRole: null,
					schoolDomain: null,
					hasSeenOnboarding: false,
					loginContext: initialLoginContext,
					passwordResetEmail: null,
					passwordResetStep: null,
					signupStep: null,
					signupData: null,
					loadingState: "idle",
					// Keep intendedDestination for deep linking
				}),

			// Login Context actions
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

			// Password Reset actions
			setPasswordResetEmail: (email) => set({ passwordResetEmail: email }),

			setPasswordResetStep: (step) => set({ passwordResetStep: step }),

			completePasswordReset: () =>
				set({
					loginContext: initialLoginContext,
					passwordResetEmail: null,
					passwordResetStep: null,
					// Don't clear user or auth status as they might be logged in
				}),

			// Signup Flow actions
			setSignupStep: (step) => set({ signupStep: step }),

			updateSignupData: (data) =>
				set((state) => ({
					signupData: { ...state.signupData, ...data },
				})),

			clearSignupData: () =>
				set({
					signupStep: null,
					signupData: null,
				}),

			completeSignup: () =>
				set({
					signupStep: "complete",
					// Keep signupData until they successfully log in
					// Will be cleared in login() or logout()
				}),

			// Navigation & Utility actions
			setIntendedDestination: (path) => set({ intendedDestination: path }),

			setLoadingState: (state) => set({ loadingState: state }),

			updateUser: (updates) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...updates } : null,
				})),

			// Check auth status on app load
			checkAuthStatus: () => {
				const { accessToken } = tokenManager.getTokens();
				if (!accessToken) {
					set({ isAuthenticated: false, user: null });
				}
				// If token exists, user data should be in persisted state
			},
		}),
		{
			name: "learnbox-auth-storage",
			// Persist all important auth flow state
			partialize: (state) => ({
				// Core auth state
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				selectedRole: state.selectedRole,
				schoolDomain: state.schoolDomain,
				hasSeenOnboarding: state.hasSeenOnboarding,
				
				// Auth flow state
				loginContext: state.loginContext,
				passwordResetEmail: state.passwordResetEmail,
				passwordResetStep: state.passwordResetStep,
				
				// Signup flow state
				signupStep: state.signupStep,
				signupData: state.signupData,
				
				// Navigation state
				intendedDestination: state.intendedDestination,
				
				// Exclude only truly temporary states:
				// - loadingState (should reset on page refresh)
			}),
		}
	)
);

// Selector hooks for commonly used combinations
export const useIsFirstTimeLogin = () =>
	useAuthStore((state) => state.loginContext.isFirstTimeLogin);

export const useAuthLoading = () => useAuthStore((state) => state.loadingState);

export const useSignupProgress = () =>
	useAuthStore((state) => ({
		step: state.signupStep,
		data: state.signupData,
	}));

export const usePasswordResetProgress = () =>
	useAuthStore((state) => ({
		email: state.passwordResetEmail,
		step: state.passwordResetStep,
	}));

// Helper function to check if user is in any active flow
export const useActiveAuthFlow = () =>
	useAuthStore((state) => ({
		hasActiveSignup: state.signupStep !== null,
		hasActivePasswordReset: state.passwordResetStep !== null,
		isFirstTimeLogin: state.loginContext.isFirstTimeLogin,
		hasIntendedDestination: state.intendedDestination !== null,
	}));