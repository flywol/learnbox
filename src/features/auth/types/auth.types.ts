import { User, Role } from "./user.types";

// Re-export for convenience
export type { User, Role };

// Loading states for better UX
export type LoadingState =
	| "idle"
	| "validating"
	| "submitting"
	| "success"
	| "error";

// Auth error types
export interface AuthError {
	code:
		| "INVALID_CREDENTIALS"
		| "SCHOOL_NOT_FOUND"
		| "NETWORK_ERROR"
		| "OTP_INVALID"
		| "TOKEN_EXPIRED"
		| "UNAUTHORIZED";
	message: string;
	field?: string; // For field-specific errors
}

// Login context for managing auth flows
export interface LoginContext {
	isFirstTimeLogin: boolean;
	requiresPasswordReset: boolean;
	tempCredentialsUsed: boolean;
	resetToken?: string;
}

// Auth session information
export interface AuthSession {
	user: User;
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: Date;
}

// Password reset flow states
export type PasswordResetStep = "email" | "otp" | "newPassword" | null;

// Auth flow types
export type AuthFlow = "login" | "signup" | "forgotPassword" | "firstTimeLogin";

// Form data types
// Note: LoginFormData is now exported from authSchema.ts

export interface SignupFormData {
	schoolInfo: {
		name: string;
		shortName: string;
		website: string;
	};
	personalInfo: {
		fullName: string;
		email: string;
		phoneNumber: string;
		password: string;
	};
}

export interface ResetPasswordFormData {
	password: string;
	confirmPassword: string;
}

export interface ForgotPasswordFormData {
	email: string;
}

// OTP related types
export interface OtpData {
	otp: string;
	purpose: "signup" | "reset";
}
