// src/features/auth/store/authStore.ts - UPDATED to use new API clients and types
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageManager } from "@/common/storage/StorageManager";
import type {
	User,
	Role,
	LoadingState,
	LoginContext,
	SignupStep,
	SignupData,
	UserData,
} from "../types/auth.types";
import { authApiClient } from "../api/authApiClient";

interface AuthState {
	// Core state
	user: User | null;
	isAuthenticated: boolean;
	selectedRole: Role | null;
	schoolDomain: string | null;
	hasSeenOnboarding: boolean;
	loginContext: LoginContext;

	// Password reset state
	passwordResetEmail: string | null;
	passwordResetStep: "email" | "otp" | "newPassword" | null;

	// Signup state
	signupStep: SignupStep;
	signupData: SignupData | null;

	// Navigation state
	intendedDestination: string | null;
	loadingState: LoadingState;

	// Hydration state
	hasHydrated: boolean;
	isInitializing: boolean;

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
	initializeAuth: () => Promise<void>;
	restoreSession: () => Promise<boolean>;
	verifySchoolDomain: (domain: string) => Promise<boolean>;
}

const initialLoginContext: LoginContext = {
	isFirstTimeLogin: false,
	requiresPasswordReset: false,
	tempCredentialsUsed: false,
};

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
			signupStep: null,
			signupData: null,
			intendedDestination: null,
			loadingState: "idle",
			hasHydrated: false,
			isInitializing: false,

			// Hydration management
			setHasHydrated: (value) => {
				set({ hasHydrated: value });
			},

			// Role and school management
			setRole: (role) => {
				set({ selectedRole: role });
			},

			setSchoolDomain: (domain) => {
				const clean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
				set({ schoolDomain: clean });
			},

			// School domain verification
			verifySchoolDomain: async (domain) => {
				try {
					const response = await authApiClient.verifyDomain({
						schoolDomain: domain,
					});

					// Check if school exists in response (indicates verification success)
					const isVerified = !!(
						response.data &&
						response.data.school &&
						response.data.school.id
					);

					if (isVerified) {
						return true;
					} else {
						return false;
					}
				} catch (error) {
					// Throw the error so the calling component can handle it
					throw error;
				}
			},

			// Core authentication
			login: (user) => {
				set({
					user,
					isAuthenticated: true,
					loadingState: "success",
				});
			},

			// Fix for authStore.ts - Complete logout with storage clearing

			logout: async () => {

				try {
					// Call API logout
					await authApiClient.logout();
				} catch (error) {
					// Continue with local cleanup even if API call fails
				}

				// Use StorageManager for complete cleanup
				try {
					storageManager.clearAllAppData(true); // Keep remember me preference
				} catch (error) {
					// Continue silently on error
				}

				// Reset all auth state
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
					hasHydrated: false, // Force re-hydration
				});

			},

			// Session restoration
			restoreSession: async () => {

				if (!authApiClient.isAuthenticated()) {
					return false;
				}

				try {
					set({ loadingState: "validating" });

					// First try to get user data from storage
					const storedUserData = authApiClient.getUserData();
					if (storedUserData) {
						const user = transformUserData(storedUserData);
						set({
							user,
							isAuthenticated: true,
							loadingState: "success",
						});
						return true;
					}

					// If no stored user data, try to fetch from API
					try {
						const apiUser = await authApiClient.getCurrentUser();
						const user = transformUserData(apiUser);

						set({
							user,
							isAuthenticated: true,
							loadingState: "success",
						});

						return true;
					} catch (apiError) {
						set({ loadingState: "error" });
						return false;
					}
				} catch (error) {

					// Clear invalid session using logout to properly clear tokens
					try {
						await authApiClient.logout();
					} catch (logoutError) {
						// Continue with state clearing anyway
					}

					set({
						user: null,
						isAuthenticated: false,
						loadingState: "error",
					});

					return false;
				}
			},

			// Initialize auth system
			initializeAuth: async () => {
				const state = get();
				if (state.isInitializing) return;

				set({ isInitializing: true });

				try {
					// Run migration for existing users
					storageManager.migrateExistingData();

					const isAuthenticated = authApiClient.isAuthenticated();

					// If we have a user in state but no token, clear state
					if (state.user && !isAuthenticated) {
						set({
							user: null,
							isAuthenticated: false,
							loginContext: initialLoginContext,
						});
					}

					// If we have token but no user, try to restore
					else if (isAuthenticated && !state.user) {
						await state.restoreSession();
					}

					// If we have both, verify consistency
					else if (isAuthenticated && state.user) {
						if (!state.isAuthenticated) {
							set({ isAuthenticated: true });
						}
					}

				} catch (error) {
				} finally {
					set({ isInitializing: false });
				}
			},

			// Auth status checker
			checkAuthStatus: () => {
				const state = get();
				const isAuthenticated = authApiClient.isAuthenticated();


				// Quick consistency check
				if (isAuthenticated && state.user && !state.isAuthenticated) {
					set({ isAuthenticated: true });
				} else if (!isAuthenticated && state.isAuthenticated) {
					set({
						isAuthenticated: false,
						user: null,
						loginContext: initialLoginContext,
					});
				}
			},

			// Onboarding
			markOnboardingComplete: () => {
				set({ hasSeenOnboarding: true });
			},

			// Flow management
			resetFlow: () => {
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
				});
			},

			// Login context
			setLoginContext: (context) => {
				set((state) => ({
					loginContext: { ...state.loginContext, ...context },
				}));
			},

			setFirstTimeLogin: (isFirstTime, resetToken) => {
				set({
					loginContext: {
						isFirstTimeLogin: isFirstTime,
						requiresPasswordReset: isFirstTime,
						tempCredentialsUsed: isFirstTime,
						resetToken,
					},
				});
			},

			// Password reset
			setPasswordResetEmail: (email) => set({ passwordResetEmail: email }),
			setPasswordResetStep: (step) => set({ passwordResetStep: step }),
			completePasswordReset: () =>
				set({
					loginContext: initialLoginContext,
					passwordResetEmail: null,
					passwordResetStep: null,
				}),

			// Signup
			setSignupStep: (step) => set({ signupStep: step }),
			updateSignupData: (data) =>
				set((state) => ({
					signupData: { ...state.signupData, ...data },
				})),
			clearSignupData: () => set({ signupStep: null, signupData: null }),
			completeSignup: () => set({ signupStep: "complete" }),

			// Navigation
			setIntendedDestination: (path) => set({ intendedDestination: path }),
			setLoadingState: (state) => set({ loadingState: state }),

			// User updates
			updateUser: (updates) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...updates } : null,
				})),
		}),
		{
			name: storageManager.getStorageKeys().auth,
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
				if (state) {

					// Mark as hydrated
					state.setHasHydrated(true);

					// Initialize auth after rehydration
					setTimeout(() => {
						state.initializeAuth();
					}, 0);
				}
			},
		}
	)
);

// Selectors
export const useHasHydrated = () => useAuthStore((state) => state.hasHydrated);
export const useIsAuthenticated = () =>
	useAuthStore((state) => state.isAuthenticated);
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () =>
	useAuthStore(
		(state) => state.isInitializing || state.loadingState === "validating"
	);
