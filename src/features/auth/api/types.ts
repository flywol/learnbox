import { User } from "../types/user.types";

// Re-export common types used by API
export type { User, Role } from "../types/user.types";

// Generic API Response wrapper
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: ApiError;
}

// API Error structure
export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, any>;
}

// Request types
export interface LoginRequest {
	email: string;
	password: string;
	role: string;
	schoolDomain: string;
}

export interface SignupRequest {
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

export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
	email?: string;
}

export interface OtpVerificationRequest {
	email: string;
	otp: string;
	purpose: "signup" | "reset";
}

// Response types
export interface LoginResponse {
	user: User;
	isFirstTimeLogin: boolean;
	resetToken?: string;
	accessToken?: string;
	refreshToken?: string;
}

export interface SchoolValidationResponse {
	isValid: boolean;
	schoolName: string;
	schoolId: string;
	schoolLogo?: string;
}

export interface OtpResponse {
	isValid: boolean;
	token?: string;
}

export interface PasswordResetResponse {
	success: boolean;
	message?: string;
}
