// User-specific types
export type Role = "STUDENT" | "PARENT" | "ADMIN" | "TEACHER";

export interface User {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at: string;
	fullName: string;
	phoneNumber: string;
	email: string;
	role: string;
	isVerified: boolean;
	isActive: boolean;
	isDeleted: boolean;
	otp: string;
	otpExpiration: string;
	resetPasswordToken: string;
	resetPasswordExpires: string;
}

export interface UserProfile extends User {
	school?: School;
	preferences?: UserPreferences;
	metadata?: UserMetadata;
}

export interface School {
	id: string;
	name: string;
	shortName: string;
	domain: string;
	website?: string;
	logo?: string;
}

export interface UserPreferences {
	theme?: "light" | "dark" | "system";
	language?: string;
	notifications?: NotificationPreferences;
}

export interface NotificationPreferences {
	email: boolean;
	sms: boolean;
	push: boolean;
}

export interface UserMetadata {
	isFirstTimeLogin: boolean;
	passwordLastChanged?: Date;
	mustResetPassword: boolean;
	accountStatus: "active" | "suspended" | "pending";
}
