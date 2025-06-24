// src/features/auth/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Role } from "../types/user.types";
import { tokenManager } from "@/lib/api/client";

type LoadingState = "idle" | "validating" | "submitting" | "success" | "error";

interface LoginContext {
	isFirstTimeLogin: boolean;
	requiresPasswordReset: boolean;
	tempCredentialsUsed: boolean;
	resetToken?: string;
}

type SignupStep = "school" | "personal" | "otp" | "complete" | "error" | null;

interface SignupData {
	schoolName?: string;
	schoolWebsite?: string;
	schoolShortName?: string;
	learnboxUrl?: string;
	fullName?: string;
	email?: string;
	phoneNumber?: string;
	password?: string;
	otpVerified?: boolean;
	signupToken?: string;
	error?: string;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	selectedRole: Role | null;
	schoolDomain: string | null;
	hasSeenOnboarding: boolean;
	loginContext: LoginContext;
	passwordResetEmail: string | null;
	passwordResetStep: "email" | "otp" | "newPassword" | null;
	signupStep: SignupStep;
	signupData: SignupData | null;
	intendedDestination: string | null;
	loadingState: LoadingState;
	hasHydrated: boolean;

	// Actions
	setRole: (role: Role) => void;
	setSchoolDomain: (domain: string) => void;
	login: (user: User) => void;
	logout: () => void;
	markOnboardingComplete: () => void;
	resetFlow: () => void;
	setLoginContext: (context: Partial<LoginContext>) => void;
	setFirstTimeLogin: (isFirstTime: boolean, resetToken?: string) => void;
	setPasswordResetEmail: (email: string) => void;
	setPasswordResetStep: (step: "email" | "otp" | "newPassword" | null) => void;
	completePasswordReset: () => void;
	setSignupStep: (step: SignupStep) => void;
	updateSignupData: (data: Partial<SignupData>) => void;
	clearSignupData: () => void;
	completeSignup: () => void;
	setIntendedDestination: (path: string | null) => void;
	setLoadingState: (state: LoadingState) => void;
	updateUser: (updates: Partial<User>) => void;
	checkAuthStatus: () => void;
	setHasHydrated: (value: boolean) => void;
}

const initialLoginContext: LoginContext = {
	isFirstTimeLogin: false,
	requiresPasswordReset: false,
	tempCredentialsUsed: false,
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
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
			hasHydrated: false,

			setHasHydrated: (value) => set({ hasHydrated: value }),

			setRole: (role) => set({ selectedRole: role }),

			setSchoolDomain: (domain) => {
				const clean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
				set({ schoolDomain: clean });
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
				}),

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

			completePasswordReset: () =>
				set({
					loginContext: initialLoginContext,
					passwordResetEmail: null,
					passwordResetStep: null,
				}),

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
				}),

			setIntendedDestination: (path) => set({ intendedDestination: path }),
			setLoadingState: (state) => set({ loadingState: state }),

			updateUser: (updates) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...updates } : null,
				})),

			checkAuthStatus: () => {
				const { accessToken } = tokenManager.getTokens();
				if (!accessToken) {
					set({ isAuthenticated: false, user: null });
				}
			},
		}),
		{
			name: "learnbox-auth-storage",
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				selectedRole: state.selectedRole,
				schoolDomain: state.schoolDomain,
				hasSeenOnboarding: state.hasSeenOnboarding,
				loginContext: state.loginContext,
				passwordResetEmail: state.passwordResetEmail,
				passwordResetStep: state.passwordResetStep,
				signupStep: state.signupStep,
				signupData: state.signupData,
				intendedDestination: state.intendedDestination,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		}
	)
);

// Selectors
export const useHasHydrated = () => useAuthStore((state) => state.hasHydrated);
