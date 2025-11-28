
import { Role } from "../types/auth.types";

/**
 * Check if a password meets strength requirements
 */
export const validatePasswordStrength = (
	password: string
): {
	isValid: boolean;
	errors: string[];
	strength: "weak" | "medium" | "strong";
} => {
	const errors: string[] = [];

	if (password.length < 8) {
		errors.push("Password must be at least 8 characters");
	}

	if (!/[0-9]/.test(password)) {
		errors.push("Password must contain at least one number");
	}

	if (!/[^A-Za-z0-9]/.test(password)) {
		errors.push("Password must contain at least one special character");
	}

	// Calculate strength
	let strength: "weak" | "medium" | "strong" = "weak";
	const hasLower = /[a-z]/.test(password);
	const hasUpper = /[A-Z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecial = /[^A-Za-z0-9]/.test(password);
	const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
		Boolean
	).length;

	if (password.length >= 12 && score >= 3) {
		strength = "strong";
	} else if (password.length >= 8 && score >= 2) {
		strength = "medium";
	}

	return {
		isValid: errors.length === 0,
		errors,
		strength,
	};
};

/**
 * Format a phone number for display
 */
export const formatPhoneNumber = (
	phoneNumber: string,
	countryCode: string = "+234"
): string => {
	// Remove all non-digits
	const cleaned = phoneNumber.replace(/\D/g, "");

	// Format based on length
	if (cleaned.length === 10) {
		return `${countryCode} ${cleaned.slice(0, 3)} ${cleaned.slice(
			3,
			6
		)} ${cleaned.slice(6)}`;
	}

	return phoneNumber;
};

/**
 * Generate a temporary password
 */
export const generateTempPassword = (): string => {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
	let password = "";

	// Ensure at least one of each required type
	password += chars.slice(0, 26).charAt(Math.floor(Math.random() * 26)); // Uppercase
	password += chars.slice(26, 52).charAt(Math.floor(Math.random() * 26)); // Lowercase
	password += chars.slice(52, 62).charAt(Math.floor(Math.random() * 10)); // Number
	password += chars.slice(62).charAt(Math.floor(Math.random() * 5)); // Special

	// Fill remaining length
	for (let i = 4; i < 12; i++) {
		password += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	// Shuffle
	return password
		.split("")
		.sort(() => Math.random() - 0.5)
		.join("");
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: Role): string => {
	const roleMap: Record<Role, string> = {
		ADMIN: "Administrator",
		TEACHER: "Teacher",
		STUDENT: "Student",
		PARENT: "Parent",
	};

	return roleMap[role] || role;
};

/**
 * Check if email belongs to a specific domain
 */
export const isEmailFromDomain = (email: string, domain: string): boolean => {
	const emailDomain = email.split("@")[1];
	return emailDomain === domain;
};

/**
 * Parse school URL to get clean domain
 */
export const parseSchoolUrl = (
	url: string
): {
	domain: string;
	subdomain?: string;
	isValid: boolean;
} => {
	try {
		// Remove protocol if present
		const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

		// Check if it's a valid format
		const urlPattern = /^([\w\-]+\.)*[\w\-]+\.[a-z]{2,}$/i;
		if (!urlPattern.test(cleanUrl)) {
			return { domain: "", isValid: false };
		}

		// Extract parts
		const parts = cleanUrl.split(".");
		if (parts.length >= 3) {
			// Has subdomain
			const subdomain = parts[0];
			const domain = parts.slice(1).join(".");
			return { domain, subdomain, isValid: true };
		} else {
			// No subdomain
			return { domain: cleanUrl, isValid: true };
		}
	} catch (error) {
		return { domain: "", isValid: false };
	}
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
};

/**
 * Validate Nigerian phone number
 */
export const validateNigerianPhone = (phone: string): boolean => {
	// Remove country code if present
	const cleaned = phone.replace(/^\+?234/, "").replace(/\D/g, "");

	// Check if it's 10 digits and starts with valid prefixes
	const validPrefixes = ["070", "080", "081", "090", "091"];
	if (cleaned.length === 10) {
		return validPrefixes.some((valid) => cleaned.startsWith(valid));
	}

	return false;
};

/**
 * Normalize school URL by ensuring it has https:// protocol
 * - If URL already has http:// or https://, use as is
 * - If URL has no protocol, add https://
 */
export const normalizeSchoolUrl = (url: string): string => {
	// Trim whitespace
	const trimmedUrl = url.trim();

	// Check if URL already has a protocol
	if (/^https?:\/\//i.test(trimmedUrl)) {
		return trimmedUrl;
	}

	// Add https:// if no protocol present
	return `https://${trimmedUrl}`;
};

/**
 * Get time-based greeting
 */
export const getGreeting = (name?: string): string => {
	const hour = new Date().getHours();
	let greeting = "Good evening";

	if (hour < 12) {
		greeting = "Good morning";
	} else if (hour < 17) {
		greeting = "Good afternoon";
	}

	return name ? `${greeting}, ${name}` : greeting;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (
	userRole: Role | undefined,
	allowedRoles: Role[]
): boolean => {
	if (!userRole) return false;
	return allowedRoles.includes(userRole);
};

/**
 * Generate OTP expiry time (10 minutes from now)
 */
export const getOtpExpiryTime = (): Date => {
	const expiry = new Date();
	expiry.setMinutes(expiry.getMinutes() + 10);
	return expiry;
};

/**
 * Format remaining time for OTP
 */
export const formatOtpRemainingTime = (expiryTime: Date): string => {
	const now = new Date();
	const diff = expiryTime.getTime() - now.getTime();

	if (diff <= 0) return "Expired";

	const minutes = Math.floor(diff / 60000);
	const seconds = Math.floor((diff % 60000) / 1000);

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
