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
import { teacherAuthApiClient } from "../api/teacherAuthApiClient";
import { studentAuthApiClient } from "../api/studentAuthApiClient";
import { parentAuthApiClient } from "../api/parentAuthApiClient";

interface AuthState {
	// Core state
	user: User | null;
	isAuthenticated: boolean;
	selectedRole: Role | null;
	schoolDomain: string | null;
	hasSeenOnboarding: boolean;
	loginContext: LoginContext;

	// Password reset state (temporary, not persisted)
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
	isLoggingOut: boolean;

	// Actions
	setRole: (role: Role) => void;
	setSchoolDomain: (domain: string) => void;
	login: (user: User) => void;
	logout: () => void;
	markOnboardingComplete: () => void;
	resetFlow: () => void;
	setLoginContext: (context: Partial<LoginContext>) => void;
	setFirstTimeLogin: (isFirstTime: boolean, resetToken?: string) => void;
	
	// Flow state management
	clearAllFlowStates: () => void;
	
	// Password reset actions
	setPasswordResetEmail: (email: string | null) => void;
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

// Helper function to get the appropriate auth client based on current role
const getAuthClientForRole = (selectedRole: Role | null) => {
	if (selectedRole === "TEACHER") {
		return teacherAuthApiClient;
	}

	if (selectedRole === "STUDENT") {
		return studentAuthApiClient;
	}

	if (selectedRole === "PARENT") {
		return parentAuthApiClient;
	}

	// Use base auth client for ADMIN and other roles
	return authApiClient;
};

// Helper function to transform API user data to internal User type
const transformUserData = (apiUser: UserData): User => {
	return {
		id: apiUser.id || apiUser._id || "",
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
			isLoggingOut: false,

			// Hydration management
			setHasHydrated: (value) => {
				set({ hasHydrated: value });
			},

			// Role and school management
			setRole: (role) => {
				set({ selectedRole: role });
			},

			setSchoolDomain: (domain) => {
				// Just remove trailing slash, keep the protocol (backend needs it)
				const clean = domain.replace(/\/$/, "");
				set({ schoolDomain: clean });
			},

			// School domain verification
			verifySchoolDomain: async (domain) => {
				try {
					const state = get();
					
					const authClient = getAuthClientForRole(state.selectedRole);
					const response = await authClient.verifyDomain({
						schoolDomain: domain,
					});
					

					// Check if school exists in response (indicates verification success)
					const isVerified = !!(
						response.data &&
						response.data.school &&
						(response.data.school.id || response.data.school._id)
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

			// Flow state management
			clearAllFlowStates: () => {
				
				set({
					passwordResetEmail: null,
					passwordResetStep: null,
				});
				
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
				const state = get();

				// Prevent concurrent logout calls
				if (state.isLoggingOut) {
					return;
				}

				set({ isLoggingOut: true });

				// Use StorageManager for complete cleanup
				try {
					storageManager.clearAllAppData(true); // Keep remember me preference
				} catch (error) {
					// Continue silently on error
				}

				// Reset all auth state - do this synchronously before any API calls
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
					hasHydrated: true, // Keep hydrated to allow navigation
					isLoggingOut: false, // Reset the flag
				});

			},

			// Session restoration
			restoreSession: async () => {
				const state = get();
				const authClient = getAuthClientForRole(state.selectedRole);

				if (!authClient.isAuthenticated()) {
					return false;
				}

				try {
					set({ loadingState: "validating" });

					// First try to get user data from storage
					const storedUserData = authClient.getUserData();
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
						const apiUser = await authClient.getCurrentUser();
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
						await authClient.logout();
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

					// Handle selectedRole being null during hydration
					let authClient;
					let isAuthenticated = false;
					
					if (state.selectedRole) {
						// Role is available, use specific client
						authClient = getAuthClientForRole(state.selectedRole);
						isAuthenticated = authClient.isAuthenticated();
					} else if (state.user) {
						// Role not available but user exists, try to determine from user data or check all clients
						const teacherAuthCheck = teacherAuthApiClient.isAuthenticated();
						const studentAuthCheck = studentAuthApiClient.isAuthenticated();
						const regularAuthCheck = authApiClient.isAuthenticated();

						if (teacherAuthCheck) {
							authClient = teacherAuthApiClient;
							isAuthenticated = true;
							// Restore the selectedRole based on which client has valid tokens
							set({ selectedRole: "TEACHER" });
						} else if (studentAuthCheck) {
							authClient = studentAuthApiClient;
							isAuthenticated = true;
							set({ selectedRole: "STUDENT" });
						} else if (regularAuthCheck) {
							authClient = authApiClient;
							isAuthenticated = true;
							// Could set to "ADMIN" or another role, but let's be safe and not assume
						}
					} else {
						// No role and no user, use default client
						authClient = getAuthClientForRole(state.selectedRole);
						isAuthenticated = authClient.isAuthenticated();
					}

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
				
				// Handle selectedRole being null during hydration
				let isAuthenticated = false;
				
				if (state.selectedRole) {
					// Role is available, use specific client
					const authClient = getAuthClientForRole(state.selectedRole);
					isAuthenticated = authClient.isAuthenticated();
				} else if (state.user) {
					// Role not available but user exists, check all clients
					const teacherAuthCheck = teacherAuthApiClient.isAuthenticated();
					const studentAuthCheck = studentAuthApiClient.isAuthenticated();
					const regularAuthCheck = authApiClient.isAuthenticated();

					if (teacherAuthCheck) {
						isAuthenticated = true;
						// Restore the selectedRole based on which client has valid tokens
						set({ selectedRole: "TEACHER" });
					} else if (studentAuthCheck) {
						isAuthenticated = true;
						set({ selectedRole: "STUDENT" });
					} else if (regularAuthCheck) {
						isAuthenticated = true;
						// Could set to other roles, but let's be safe and not assume
					}
				} else {
					// No role and no user, use default client
					const authClient = getAuthClientForRole(state.selectedRole);
					isAuthenticated = authClient.isAuthenticated();
				}

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
				// Exclude password reset states from persistence - they should be temporary
				// passwordResetEmail: NOT persisted - session only
				// passwordResetStep: NOT persisted - session only
				signupStep: state.signupStep,
				signupData: state.signupData,
				intendedDestination: state.intendedDestination,
			}),
			onRehydrateStorage: () => (state) => {
				if (state) {
					// Only clear flow states if they exist (avoid unnecessary updates)
					if (state.passwordResetStep || state.passwordResetEmail) {
						state.clearAllFlowStates();
					}

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
