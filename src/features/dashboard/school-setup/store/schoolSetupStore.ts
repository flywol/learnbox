// src/features/school-setup/store/schoolSetupStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SchoolInfo {
	name: string;
	shortName: string;
	principal: string;
	schoolType: string;
	motto: string;
	address: string;
	country: string;
	state: string;
	schoolUrl: string;
	website?: string;
	phoneNumber: string;
	email: string;
	logo?: File | string;
	principalSignature?: File | string;
}

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

	// Draft saving
	lastSavedAt: Date | null;
	hasUnsavedChanges: boolean;

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

	// Utility actions
	saveDraft: () => void;
	resetSetup: () => void;
	markAsCompleted: () => void;
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
		(set) => ({
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
				}),

			markAsCompleted: () =>
				set({
					isCompleted: true,
					hasUnsavedChanges: false,
				}),
		}),
		{
			name: "school-setup-storage",
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
