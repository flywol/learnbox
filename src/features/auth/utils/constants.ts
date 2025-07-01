import { Role } from "../types/auth.types";


// API Endpoints (will be replaced with actual endpoints)
export const AUTH_ENDPOINTS = {
	LOGIN: "/api/auth/login",
	LOGOUT: "/api/auth/logout",
	FORGOT_PASSWORD: "/api/auth/forgot-password",
	RESET_PASSWORD: "/api/auth/reset-password",
	VERIFY_OTP: "/api/auth/verify-otp",
	RESEND_OTP: "/api/auth/resend-otp",
	VALIDATE_TOKEN: "/api/auth/validate-token",
	REFRESH_TOKEN: "/api/auth/refresh-token",
	CREATE_SCHOOL: "/api/schools/create",
	VALIDATE_SCHOOL: "/api/schools/validate",
	CREATE_ADMIN: "/api/users/create-admin",
} as const;

// Route paths
export const AUTH_ROUTES = {
	LOGIN: "/login",
	ROLE_SELECTION: "/",
	SCHOOL_SETUP: "/school-setup",
	SIGNUP: "/signup",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	ONBOARDING: "/onboarding",
	DASHBOARD: "/dashboard",
	UNAUTHORIZED: "/unauthorized",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
	AUTH_TOKEN: "learnbox_auth_token",
	REFRESH_TOKEN: "learnbox_refresh_token",
	USER_PREFERENCES: "learnbox_user_prefs",
	SELECTED_ROLE: "learnbox_selected_role",
	SCHOOL_DOMAIN: "learnbox_school_domain",
} as const;

// Session configuration
export const SESSION_CONFIG = {
	TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour in milliseconds
	REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh when 5 minutes remaining
	INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
	REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;

// Password configuration
export const PASSWORD_CONFIG = {
	MIN_LENGTH: 8,
	MAX_LENGTH: 128,
	REQUIRE_UPPERCASE: false, // Optional but contributes to strength
	REQUIRE_LOWERCASE: false, // Optional but contributes to strength
	REQUIRE_NUMBER: true,
	REQUIRE_SPECIAL: true,
	SPECIAL_CHARS: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

// OTP configuration
export const OTP_CONFIG = {
	LENGTH: 6,
	EXPIRY_MINUTES: 10,
	MAX_ATTEMPTS: 3,
	RESEND_COOLDOWN: 60, // seconds
} as const;

// Role configuration
export const ROLE_CONFIG: Record<
	Role,
	{
		label: string;
		description: string;
		defaultRoute: string;
		permissions: string[];
	}
> = {
	ADMIN: {
		label: "Administrator",
		description: "Manage school settings, users, and content",
		defaultRoute: "/dashboard",
		permissions: [
			"manage_users",
			"manage_school",
			"manage_content",
			"view_reports",
		],
	},
	TEACHER: {
		label: "Teacher",
		description: "Create courses, manage students, and track progress",
		defaultRoute: "/dashboard",
		permissions: ["manage_courses", "manage_students", "view_reports"],
	},
	STUDENT: {
		label: "Student",
		description: "Access courses, submit assignments, and track learning",
		defaultRoute: "/dashboard",
		permissions: ["view_courses", "submit_assignments", "view_grades"],
	},
	PARENT: {
		label: "Parent",
		description: "Monitor child's progress and communicate with teachers",
		defaultRoute: "/dashboard",
		permissions: [
			"view_child_progress",
			"communicate_teachers",
			"view_reports",
		],
	},
} as const;

// Error messages
export const ERROR_MESSAGES = {
	NETWORK_ERROR:
		"Unable to connect to the server. Please check your internet connection.",
	INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
	ACCOUNT_LOCKED: "Your account has been locked. Please contact support.",
	SESSION_EXPIRED: "Your session has expired. Please login again.",
	UNAUTHORIZED: "You don't have permission to access this resource.",
	SCHOOL_NOT_FOUND: "School not found. Please check the URL and try again.",
	OTP_INVALID: "Invalid verification code. Please try again.",
	OTP_EXPIRED: "Verification code has expired. Please request a new one.",
	PASSWORD_MISMATCH: "Passwords do not match.",
	WEAK_PASSWORD: "Password is too weak. Please choose a stronger password.",
	EMAIL_EXISTS: "An account with this email already exists.",
	GENERAL_ERROR: "An unexpected error occurred. Please try again.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
	LOGIN_SUCCESS: "Login successful! Redirecting...",
	LOGOUT_SUCCESS: "You have been logged out successfully.",
	PASSWORD_RESET_SUCCESS:
		"Password reset successful! Please login with your new password.",
	OTP_SENT: "Verification code sent to your email.",
	SCHOOL_CREATED: "School created successfully!",
	ACCOUNT_CREATED: "Account created successfully!",
	PROFILE_UPDATED: "Profile updated successfully.",
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
	EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	PHONE_NIGERIA: /^(\+?234)?[789][01]\d{8}$/,
	SCHOOL_URL: /^(https?:\/\/)?([\w\-]+\.)*[\w\-]+\.[a-z]{2,}$/i,
	ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
	NAME: /^[a-zA-Z\s'-]+$/,
} as const;

// Default values
export const DEFAULTS = {
	COUNTRY_CODE: "+234",
	CURRENCY: "NGN",
	TIMEZONE: "Africa/Lagos",
	DATE_FORMAT: "DD/MM/YYYY",
	TIME_FORMAT: "HH:mm",
} as const;
