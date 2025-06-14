import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role, User } from "../types/auth.types";

// This defines the shape of our store: the data and the actions
interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	selectedRole: Role | null;
	schoolDomain: string | null;
	hasSeenOnboarding: boolean;

	// Actions
	setRole: (role: Role) => void;
	setSchoolDomain: (domain: string) => void;
	login: (user: User) => void;
	logout: () => void;
	markOnboardingComplete: () => void;
	resetFlow: () => void; // Useful for clearing the flow if user wants to start over
}

export const useAuthStore = create<AuthState>()(
	// The 'persist' middleware automatically saves the store's data to localStorage.
	// This means the user will stay logged in even after refreshing the page.
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			selectedRole: null,
			schoolDomain: null,
			hasSeenOnboarding: false,

			setRole: (role) => set({ selectedRole: role }),

			setSchoolDomain: (domain) => {
				// Clean up the domain input - remove protocol and trailing slash if present
				const cleanDomain = domain
					.replace(/^https?:\/\//, "")
					.replace(/\/$/, "");
				set({ schoolDomain: cleanDomain });
			},

			login: (user) =>
				set({
					user,
					isAuthenticated: true,
				}),

			logout: () =>
				set({
					user: null,
					isAuthenticated: false,
					selectedRole: null,
					schoolDomain: null,
					hasSeenOnboarding: false,
				}),

			markOnboardingComplete: () => set({ hasSeenOnboarding: true }),

			resetFlow: () =>
				set({
					selectedRole: null,
					schoolDomain: null,
					hasSeenOnboarding: false,
				}),
		}),
		{
			name: "learnbox-auth-storage", // Unique name for the localStorage key
		}
	)
);
