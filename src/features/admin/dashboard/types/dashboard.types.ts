// ===== SCHOOL SETUP TYPES =====
export interface SchoolInfo {
	schoolName: string;
	schoolShortName: string;
	schoolWebsite: string;
	schoolPhoneNumber: string;
	schoolEmail: string;
	schoolAddress: string;
	learnboxUrl: string;
	schoolLogo: string | File;
	country: string;
	principalSignature: string | File;
	schoolPrincipal: string;
	schoolMotto?: string;
	schoolType: string;
	state: string;
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

// ===== SCHOOL SETUP STATE =====
export interface SchoolSetupState {
	currentStep: number;
	totalSteps: number;
	isCompleted: boolean;
	schoolInfo: Partial<SchoolInfo>;
	session: Partial<Session>;
	selectedClassLevels: ClassLevel[];
	classArms: ClassArm[];
	lastSavedAt: Date | null;
	hasUnsavedChanges: boolean;
}
