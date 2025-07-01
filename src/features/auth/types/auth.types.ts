// src/features/auth/types/auth.types.ts - Updated to match backend responses

// ===== CORE USER TYPES (FROM YOUR ACTUAL CODEBASE) =====
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

// ===== AUTH STATE TYPES =====
export type LoadingState =
	| "idle"
	| "validating"
	| "submitting"
	| "success"
	| "error";

export interface LoginContext {
	isFirstTimeLogin: boolean;
	requiresPasswordReset: boolean;
	tempCredentialsUsed: boolean;
	resetToken?: string;
}

export type PasswordResetStep = "email" | "otp" | "newPassword" | null;
export type SignupStep =
	| "school"
	| "personal"
	| "otp"
	| "complete"
	| "error"
	| null;

export interface SignupData {
	schoolName?: string;
	schoolWebsite?: string;
	schoolShortName?: string;
	learnboxUrl?: string;
	fullName?: string;
	email?: string;
	phoneNumber?: string;
	password?: string;
	otpVerified?: boolean;
	signupToken?: string;
	error?: string;
}

// ===== API REQUEST TYPES =====
export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	fullName: string;
	learnboxUrl: string;
	phoneNumber: string;
	schoolName: string;
	schoolShortName: string;
}

export interface OtpRequest {
	email: string;
	otp: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	password: string;
	confirmPassword: string;
	email: string
}

export interface RefreshTokenRequest {
	refreshToken: string;
}

export interface VerifyDomainRequest {
	schoolDomain: string; // Changed to match backend expectation
}

// ===== API RESPONSE TYPES (ALIGNED WITH BACKEND) =====
export interface UserData {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	phone?: string;
	phoneNumber?: string;
	isVerified?: boolean;
	isActive?: boolean;
	resetPasswordToken?: string;
	fullName?: string;
}

export interface LoginResponse {
	statusCode: number;
	message: string;
	data: {
		accessToken: string;
		refreshToken: string;
		user: UserData;
	};
}

export interface RegisterResponse {
	statusCode: number;
	message: string;
	data: {
		user: UserData;
	};
}

export interface LogoutResponse {
	statusCode: number;
	message: string;
}

export interface RefreshTokenResponse {
	statusCode: number;
	message: string;
	data: {
		accessToken: string;
	};
}

// Updated to match actual backend response
export interface School {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	schoolName: string;
	schoolShortName: string;
	schoolWebsite: string;
	schoolType: string | null;
	schoolPrincipal: string | null;
	schoolMotto: string | null;
	schoolAddress: string | null;
	schoolPhoneNumber: string | null;
	country: string | null;
	state: string | null;
	schoolEmail: string | null;
	schoolLogo: string | null;
	principalSignature: string | null;
	learnboxUrl: string;
	isDeleted: boolean;
}

export interface VerifyDomainResponse {
	statusCode: number;
	data: {
		message: string;
		school: School;
	};
}

export interface OtpResponse {
	statusCode: number;
	message: string;
}

export interface ForgotPasswordResponse {
	statusCode: number;
	message: string;
}

export interface ResetPasswordResponse {
	statusCode: number;
	message: string;
}

export interface CurrentUserResponse {
	statusCode: number;
	message: string;
	data: {
		user: UserData;
	};
}

// ===== FORM DATA TYPES =====
export interface LoginFormData {
	email: string;
	password: string;
	rememberMe?: boolean;
}

export interface SchoolSetupFormData {
	schoolUrl: string;
}

export interface RoleSelectionFormData {
	role: Role;
}

export interface OtpFormData {
	otp: string;
}

export interface ResetPasswordFormData {
	password: string;
	confirmPassword: string;
}

export interface ForgotPasswordFormData {
	email: string;
}

// ===== ERROR TYPES =====
export interface AuthError {
	code:
		| "INVALID_CREDENTIALS"
		| "SCHOOL_NOT_FOUND"
		| "NETWORK_ERROR"
		| "OTP_INVALID"
		| "TOKEN_EXPIRED"
		| "UNAUTHORIZED";
	message: string;
	field?: string;
}

export interface ApiError {
	code: string;
	message: string;
	field?: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: ApiError;
}
