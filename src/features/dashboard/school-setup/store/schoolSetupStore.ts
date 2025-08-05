import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageManager } from "@/common/storage/StorageManager";
import { SchoolInfo } from "../../types/dashboard.types";


export interface Term {
	name: string;
	startDate: string;
	endDate: string;
}

export interface Session {
	name: string;
	terms: {
		first: Term;
		second: Term;
		third: Term;
	};
}

export interface ClassLevel {
	id: string;
	name: string;
	category:
		| "nursery"
		| "grade"
		| "primary"
		| "junior_secondary"
		| "senior_secondary";
	selected: boolean;
	subLevels?: string[];
}

export interface ClassArm {
	classId: string;
	className: string;
	arms: string[];
	customArms?: string[];
	deletedDefaultArms?: string[];
}

interface SchoolSetupState {
	// Current step tracking
	currentStep: number;
	totalSteps: number;
	isCompleted: boolean;

	// Form data
	schoolInfo: Partial<SchoolInfo>;
	session: Partial<Session>;
	selectedClassLevels: ClassLevel[];
	classArms: ClassArm[];

	// Draft saving and API state
	lastSavedAt: Date | null;
	hasUnsavedChanges: boolean;
	isSubmitting: boolean;
	apiError: string | null;

	// Actions
	setCurrentStep: (step: number) => void;
	nextStep: () => void;
	previousStep: () => void;

	// School info actions
	updateSchoolInfo: (info: Partial<SchoolInfo>) => void;

	// Session actions
	updateSession: (session: Partial<Session>) => void;

	// Class level actions
	toggleClassLevel: (levelId: string) => void;
	toggleCategoryLevels: (category: string, selected: boolean) => void;

	// Class arms actions
	updateClassArms: (classId: string, arms: string[]) => void;
	addCustomArm: (classId: string, armName: string) => void;
	removeCustomArm: (classId: string, armName: string) => void;
	deleteDefaultArm: (classId: string, armName: string) => void;

	// API state management
	setSubmitting: (submitting: boolean) => void;
	setApiError: (error: string | null) => void;
	clearApiError: () => void;

	// Utility actions
	saveDraft: () => void;
	resetSetup: () => void;
	markAsCompleted: () => void;
	clearStorageAfterCompletion: () => void;

	// Validation helpers
	validateCurrentStep: () => boolean;
	getStepCompletionStatus: () => { [key: number]: boolean };
}

// Initial class levels data
const initialClassLevels: ClassLevel[] = [
	// Nursery Class
	{ id: "playgroup", name: "Playgroup", category: "nursery", selected: false },
	{
		id: "kindergarten",
		name: "Kindergarten",
		category: "nursery",
		selected: false,
	},
	{ id: "reception", name: "Reception", category: "nursery", selected: false },
	{ id: "nursery1", name: "Nursery 1", category: "nursery", selected: false },
	{ id: "nursery2", name: "Nursery 2", category: "nursery", selected: false },

	// Grade Class
	{ id: "grade1", name: "Grade 1", category: "grade", selected: false },
	{ id: "grade2", name: "Grade 2", category: "grade", selected: false },
	{ id: "grade3", name: "Grade 3", category: "grade", selected: false },
	{ id: "grade4", name: "Grade 4", category: "grade", selected: false },
	{ id: "grade5", name: "Grade 5", category: "grade", selected: false },

	// Primary Class
	{ id: "primary1", name: "Primary 1", category: "primary", selected: false },
	{ id: "primary2", name: "Primary 2", category: "primary", selected: false },
	{ id: "primary3", name: "Primary 3", category: "primary", selected: false },
	{ id: "primary4", name: "Primary 4", category: "primary", selected: false },
	{ id: "primary5", name: "Primary 5", category: "primary", selected: false },
	{ id: "primary6", name: "Primary 6", category: "primary", selected: false },

	// Junior Secondary
	{
		id: "jss1",
		name: "Junior Secondary School 1",
		category: "junior_secondary",
		selected: false,
	},
	{
		id: "jss2",
		name: "Junior Secondary School 2",
		category: "junior_secondary",
		selected: false,
	},
	{
		id: "jss3",
		name: "Junior Secondary School 3",
		category: "junior_secondary",
		selected: false,
	},

	// Senior Secondary
	{
		id: "sss1",
		name: "Senior Secondary School 1",
		category: "senior_secondary",
		selected: false,
	},
	{
		id: "sss2",
		name: "Senior Secondary School 2",
		category: "senior_secondary",
		selected: false,
	},
	{
		id: "sss3",
		name: "Senior Secondary School 3",
		category: "senior_secondary",
		selected: false,
	},
];

export const useSchoolSetupStore = create<SchoolSetupState>()(
	persist(
		(set, get) => ({
			// Initial state
			currentStep: 1,
			totalSteps: 4,
			isCompleted: false,
			schoolInfo: {},
			session: {
				terms: {
					first: { name: "First term", startDate: "", endDate: "" },
					second: { name: "Second term", startDate: "", endDate: "" },
					third: { name: "Third term", startDate: "", endDate: "" },
				},
			},
			selectedClassLevels: initialClassLevels,
			classArms: [],
			lastSavedAt: null,
			hasUnsavedChanges: false,
			isSubmitting: false,
			apiError: null,

			// Step navigation
			setCurrentStep: (step) => set({ currentStep: step }),
			nextStep: () =>
				set((state) => ({
					currentStep: Math.min(state.currentStep + 1, state.totalSteps),
					hasUnsavedChanges: true,
				})),
			previousStep: () =>
				set((state) => ({
					currentStep: Math.max(state.currentStep - 1, 1),
				})),

			// School info actions
			updateSchoolInfo: (info) =>
				set((state) => ({
					schoolInfo: { ...state.schoolInfo, ...info },
					hasUnsavedChanges: true,
				})),

			// Session actions
			updateSession: (session) =>
				set((state) => ({
					session: { ...state.session, ...session },
					hasUnsavedChanges: true,
				})),

			// Class level actions
			toggleClassLevel: (levelId) =>
				set((state) => ({
					selectedClassLevels: state.selectedClassLevels.map((level) =>
						level.id === levelId
							? { ...level, selected: !level.selected }
							: level
					),
					hasUnsavedChanges: true,
				})),

			toggleCategoryLevels: (category, selected) =>
				set((state) => ({
					selectedClassLevels: state.selectedClassLevels.map((level) =>
						level.category === category ? { ...level, selected } : level
					),
					hasUnsavedChanges: true,
				})),

			// Class arms actions
			updateClassArms: (classId, arms) =>
				set((state) => {
					const existingIndex = state.classArms.findIndex(
						(ca) => ca.classId === classId
					);
					const classLevel = state.selectedClassLevels.find(
						(cl) => cl.id === classId
					);

					if (existingIndex >= 0) {
						const newClassArms = [...state.classArms];
						newClassArms[existingIndex] = {
							...newClassArms[existingIndex],
							arms,
						};
						return { classArms: newClassArms, hasUnsavedChanges: true };
					} else if (classLevel) {
						return {
							classArms: [
								...state.classArms,
								{
									classId,
									className: classLevel.name,
									arms,
									customArms: [],
									deletedDefaultArms: [],
								},
							],
							hasUnsavedChanges: true,
						};
					}
					return state;
				}),

			addCustomArm: (classId, armName) =>
				set((state) => {
					const classArmIndex = state.classArms.findIndex(
						(ca) => ca.classId === classId
					);
					if (classArmIndex >= 0) {
						const newClassArms = [...state.classArms];
						const customArms = newClassArms[classArmIndex].customArms || [];
						newClassArms[classArmIndex] = {
							...newClassArms[classArmIndex],
							customArms: [...customArms, armName],
						};
						return { classArms: newClassArms, hasUnsavedChanges: true };
					}
					return state;
				}),

			removeCustomArm: (classId, armName) =>
				set((state) => {
					const classArmIndex = state.classArms.findIndex(
						(ca) => ca.classId === classId
					);
					if (classArmIndex >= 0) {
						const newClassArms = [...state.classArms];
						const customArms = newClassArms[classArmIndex].customArms || [];
						const arms = newClassArms[classArmIndex].arms || [];
						
						newClassArms[classArmIndex] = {
							...newClassArms[classArmIndex],
							customArms: customArms.filter((arm) => arm !== armName),
							arms: arms.filter((arm) => arm !== armName), // Also remove from selected arms
						};
						return { classArms: newClassArms, hasUnsavedChanges: true };
					}
					return state;
				}),

			deleteDefaultArm: (classId, armName) =>
				set((state) => {
					const classArmIndex = state.classArms.findIndex(
						(ca) => ca.classId === classId
					);
					if (classArmIndex >= 0) {
						const newClassArms = [...state.classArms];
						const deletedDefaultArms = newClassArms[classArmIndex].deletedDefaultArms || [];
						const arms = newClassArms[classArmIndex].arms || [];
						
						newClassArms[classArmIndex] = {
							...newClassArms[classArmIndex],
							deletedDefaultArms: [...deletedDefaultArms, armName],
							arms: arms.filter((arm) => arm !== armName), // Also remove from selected arms
						};
						return { classArms: newClassArms, hasUnsavedChanges: true };
					} else {
						// If no class arm entry exists, create one with just the deleted default arm
						const classLevel = state.selectedClassLevels.find(
							(cl) => cl.id === classId
						);
						if (classLevel) {
							return {
								classArms: [
									...state.classArms,
									{
										classId,
										className: classLevel.name,
										arms: [],
										customArms: [],
										deletedDefaultArms: [armName],
									},
								],
								hasUnsavedChanges: true,
							};
						}
					}
					return state;
				}),

			// API state management
			setSubmitting: (submitting) => set({ isSubmitting: submitting }),
			setApiError: (error) => set({ apiError: error }),
			clearApiError: () => set({ apiError: null }),

			// Validation helpers
			validateCurrentStep: () => {
				const state = get();
				switch (state.currentStep) {
					case 1: // School Info
						return !!(
							state.schoolInfo.schoolName &&
							state.schoolInfo.schoolShortName &&
							state.schoolInfo.schoolAddress &&
							state.schoolInfo.schoolPhoneNumber &&
							state.schoolInfo.schoolEmail
						);
					case 2: // Session
						return !!(
							state.session.name &&
							state.session.terms?.first.startDate &&
							state.session.terms?.first.endDate &&
							state.session.terms?.second.startDate &&
							state.session.terms?.second.endDate &&
							state.session.terms?.third.startDate &&
							state.session.terms?.third.endDate
						);
					case 3: // Class Levels
						return state.selectedClassLevels.some((level) => level.selected);
					case 4: // Class Arms
						const selectedLevels = state.selectedClassLevels.filter(
							(level) => level.selected
						);
						return selectedLevels.every((level) => {
							const classArm = state.classArms.find(
								(ca) => ca.classId === level.id
							);
							return classArm && classArm.arms.length > 0;
						});
					default:
						return false;
				}
			},

			getStepCompletionStatus: () => {
				const state = get();
				const status: { [key: number]: boolean } = {};

				// Check each step completion
				for (let step = 1; step <= state.totalSteps; step++) {
					const originalStep = state.currentStep;
					// Temporarily set step to check validation
					set({ currentStep: step });
					status[step] = get().validateCurrentStep();
					// Restore original step
					set({ currentStep: originalStep });
				}

				return status;
			},

			// Utility actions
			saveDraft: () =>
				set({
					lastSavedAt: new Date(),
					hasUnsavedChanges: false,
				}),

			resetSetup: () =>
				set({
					currentStep: 1,
					isCompleted: false,
					schoolInfo: {},
					session: {
						terms: {
							first: { name: "First term", startDate: "", endDate: "" },
							second: { name: "Second term", startDate: "", endDate: "" },
							third: { name: "Third term", startDate: "", endDate: "" },
						},
					},
					selectedClassLevels: initialClassLevels,
					classArms: [],
					lastSavedAt: null,
					hasUnsavedChanges: false,
					isSubmitting: false,
					apiError: null,
				}),

			markAsCompleted: () =>
				set({
					isCompleted: true,
					hasUnsavedChanges: false,
					lastSavedAt: new Date(),
				}),

			clearStorageAfterCompletion: () => {
				// Clear the persisted storage since setup is complete
				const storageKey = storageManager.getStorageKeys().schoolSetup;
				storageManager.removeItem(storageKey);
				console.log("🧹 Cleared school setup storage after successful completion");
			},
		}),
		{
			name: storageManager.getStorageKeys().schoolSetup,
			partialize: (state) => ({
				currentStep: state.currentStep,
				schoolInfo: state.schoolInfo,
				session: state.session,
				selectedClassLevels: state.selectedClassLevels,
				classArms: state.classArms,
				lastSavedAt: state.lastSavedAt,
				isCompleted: state.isCompleted,
			}),
		}
	)
);
