// src/features/auth/store/authStore.ts - UPDATED to use new API clients and types
import { create } from "zustand";
import { persist } from "zustand/middleware";
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
				console.log("💧 setHasHydrated:", value);
				set({ hasHydrated: value });
			},

			// Role and school management
			setRole: (role) => {
				console.log("🎭 setRole:", role);
				set({ selectedRole: role });
			},

			setSchoolDomain: (domain) => {
				const clean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
				console.log("🏫 setSchoolDomain:", clean);
				set({ schoolDomain: clean });
			},

			// School domain verification
			verifySchoolDomain: async (domain) => {
				try {
					console.log("🔍 Verifying school domain:", domain);

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
						console.log("✅ School domain verified", response.data.school);
						return true;
					} else {
						console.log("❌ School domain not verified - no school data");
						return false;
					}
				} catch (error) {
					console.error("❌ School domain verification failed:", error);
					// Throw the error so the calling component can handle it
					throw error;
				}
			},

			// Core authentication
			login: (user) => {
				console.log("🔐 login action:", {
					userId: user.id,
					email: user.email,
					role: user.role,
					isVerified: user.isVerified,
				});

				set({
					user,
					isAuthenticated: true,
					loadingState: "success",
				});

				console.log("✅ User authenticated successfully");
			},

			// Fix for authStore.ts - Complete logout with storage clearing

			logout: async () => {
				console.log("🚪 logout action called");

				try {
					// Call API logout
					await authApiClient.logout();
					console.log("✅ API logout successful");
				} catch (error) {
					console.log(
						"⚠️ API logout failed, but continuing with local cleanup:",
						error
					);
				}

				// Clear ALL storage data related to auth
				try {
					// Clear localStorage
					localStorage.removeItem("learnbox-auth-storage");
					localStorage.removeItem("learnbox_user_data");
					localStorage.removeItem("access_token");
					localStorage.removeItem("refresh_token");
					localStorage.removeItem("remember_me");

					// Clear sessionStorage
					sessionStorage.removeItem("learnbox-auth-storage");
					sessionStorage.removeItem("learnbox_user_data");
					sessionStorage.removeItem("access_token");
					sessionStorage.removeItem("refresh_token");

					// Clear any other auth-related storage
					Object.keys(localStorage).forEach((key) => {
						if (
							key.includes("auth") ||
							key.includes("token") ||
							key.includes("user") ||
							key.includes("learnbox")
						) {
							localStorage.removeItem(key);
						}
					});

					Object.keys(sessionStorage).forEach((key) => {
						if (
							key.includes("auth") ||
							key.includes("token") ||
							key.includes("user") ||
							key.includes("learnbox")
						) {
							sessionStorage.removeItem(key);
						}
					});

					console.log("✅ All storage cleared");
				} catch (error) {
					console.error("❌ Error clearing storage:", error);
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

				console.log("✅ Logout completed - all data cleared");
			},

			// Session restoration
			restoreSession: async () => {
				console.log("🔄 Attempting session restoration...");

				if (!authApiClient.isAuthenticated()) {
					console.log("❌ No access token for session restoration");
					return false;
				}

				try {
					set({ loadingState: "validating" });

					// First try to get user data from storage
					const storedUserData = authApiClient.getUserData();
					if (storedUserData) {
						console.log("✅ Session restored from stored user data");
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
						console.log("✅ Session restored from API");
						const user = transformUserData(apiUser);

						set({
							user,
							isAuthenticated: true,
							loadingState: "success",
						});

						return true;
					} catch (apiError) {
						console.log("⚠️ Could not fetch user from API, but token exists");
						set({ loadingState: "error" });
						return false;
					}
				} catch (error) {
					console.log("❌ Session restoration failed:", error);

					// Clear invalid session using logout to properly clear tokens
					try {
						await authApiClient.logout();
					} catch (logoutError) {
						console.log(
							"⚠️ Logout during session restore failed, clearing state anyway"
						);
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

				console.log("🚀 Initializing auth system...");
				set({ isInitializing: true });

				const isAuthenticated = authApiClient.isAuthenticated();

				// If we have a user in state but no token, clear state
				if (state.user && !isAuthenticated) {
					console.log("⚠️ User in state but no token - clearing state");
					set({
						user: null,
						isAuthenticated: false,
						loginContext: initialLoginContext,
					});
				}

				// If we have token but no user, try to restore
				else if (isAuthenticated && !state.user) {
					console.log("🔄 Token exists, attempting session restoration...");
					await state.restoreSession();
				}

				// If we have both, verify consistency
				else if (isAuthenticated && state.user) {
					console.log("✅ Both token and user exist - verifying consistency");
					if (!state.isAuthenticated) {
						set({ isAuthenticated: true });
					}
				}

				set({ isInitializing: false });
				console.log("✅ Auth initialization completed");
			},

			// Auth status checker
			checkAuthStatus: () => {
				const state = get();
				const isAuthenticated = authApiClient.isAuthenticated();

				console.log("🔍 checkAuthStatus:", {
					hasToken: isAuthenticated,
					hasUser: !!state.user,
					isAuthenticated: state.isAuthenticated,
				});

				// Quick consistency check
				if (isAuthenticated && state.user && !state.isAuthenticated) {
					console.log("🔧 Fixing auth flag consistency");
					set({ isAuthenticated: true });
				} else if (!isAuthenticated && state.isAuthenticated) {
					console.log("🔧 Clearing auth due to missing token");
					set({
						isAuthenticated: false,
						user: null,
						loginContext: initialLoginContext,
					});
				}
			},

			// Onboarding
			markOnboardingComplete: () => {
				console.log("🎓 markOnboardingComplete");
				set({ hasSeenOnboarding: true });
			},

			// Flow management
			resetFlow: () => {
				console.log("🔄 resetFlow");
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
				console.log("🔐 setLoginContext:", context);
				set((state) => ({
					loginContext: { ...state.loginContext, ...context },
				}));
			},

			setFirstTimeLogin: (isFirstTime, resetToken) => {
				console.log("🆕 setFirstTimeLogin:", {
					isFirstTime,
					hasResetToken: !!resetToken,
				});
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
				console.log("💧 Store rehydrating...");
				if (state) {
					console.log("💧 Rehydrated state:", {
						hasUser: !!state.user,
						isAuthenticated: state.isAuthenticated,
						selectedRole: state.selectedRole,
					});

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
