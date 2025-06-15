import { User, Role } from "../types/user.types";

// API Response Types
interface ApiResponse<T> {
	[x: string]: any;
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
	};
}

interface LoginResponse {
	user: User;
	isFirstTimeLogin: boolean;
	resetToken?: string;
}

interface SchoolValidationResponse {
	isValid: boolean;
	schoolName: string;
	schoolId: string;
}

interface OtpResponse {
	isValid: boolean;
	token?: string;
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database (for demo purposes)
const mockUsers: Record<
	string,
	{ password: string; isFirstTime: boolean; user: User }
> = {
	"teacher@school.com": {
		password: "temp123!",
		isFirstTime: true,
		user: {
			id: "user-1",
			name: "John Teacher",
			email: "teacher@school.com",
			role: "TEACHER",
		},
	},
	"student@school.com": {
		password: "password123!",
		isFirstTime: false,
		user: {
			id: "user-2",
			name: "Jane Student",
			email: "student@school.com",
			role: "STUDENT",
		},
	},
};

// Mock school database
const mockSchools: Record<string, SchoolValidationResponse> = {
	"westfield-high.learnbox.com": {
		isValid: true,
		schoolName: "Westfield High School",
		schoolId: "school-1",
	},
	"eastside-academy.learnbox.com": {
		isValid: true,
		schoolName: "Eastside Academy",
		schoolId: "school-2",
	},
};

// Temporary storage for OTPs (in real app, this would be server-side)
const otpStorage: Record<string, { otp: string; expiry: number }> = {};

export const mockAuthApi = {
	// Login with first-time detection
	async login(
		email: string,
		password: string,
		role: Role,
		schoolDomain: string
	): Promise<ApiResponse<LoginResponse>> {
		await delay(1500);

		const mockUser = mockUsers[email];

		// User not found
		if (!mockUser) {
			return {
				success: false,
				error: {
					code: "INVALID_CREDENTIALS",
					message: "Invalid email or password",
				},
			};
		}

		// Wrong password
		if (mockUser.password !== password) {
			return {
				success: false,
				error: {
					code: "INVALID_CREDENTIALS",
					message: "Invalid email or password",
				},
			};
		}

		// Success - check if first time login
		const response: LoginResponse = {
			user: {
				...mockUser.user,
				role: role, // Use the role they selected
			},
			isFirstTimeLogin: mockUser.isFirstTime,
		};

		// If first time, generate a reset token
		if (mockUser.isFirstTime) {
			response.resetToken = `reset-${Date.now()}-${Math.random()
				.toString(36)
				.substr(2, 9)}`;
		}

		return {
			success: true,
			data: response,
		};
	},

	// Validate school domain
	async validateSchool(
		schoolUrl: string
	): Promise<ApiResponse<SchoolValidationResponse>> {
		await delay(1500);

		const cleanUrl = schoolUrl
			.toLowerCase()
			.replace(/^https?:\/\//, "")
			.replace(/\/$/, "");
		const school = mockSchools[cleanUrl];

		if (!school) {
			return {
				success: false,
				error: {
					code: "SCHOOL_NOT_FOUND",
					message: "School not found. Please check the URL and try again.",
				},
			};
		}

		return {
			success: true,
			data: school,
		};
	},

	// Create new school (Admin signup)
	async createSchool(schoolData: {
		name: string;
		shortName: string;
		website: string;
	}): Promise<ApiResponse<{ schoolId: string; portalUrl: string }>> {
		await delay(2000);

		// Simulate validation
		if (mockSchools[`${schoolData.shortName.toLowerCase()}.learnbox.com`]) {
			return {
				success: false,
				error: {
					code: "SCHOOL_EXISTS",
					message: "A school with this short name already exists",
				},
			};
		}

		return {
			success: true,
			data: {
				schoolId: `school-${Date.now()}`,
				portalUrl: `https://${schoolData.shortName.toLowerCase()}.learnbox.com`,
			},
		};
	},

	// Create admin user
	async createAdminUser(userData: {
		schoolId: string;
		fullName: string;
		email: string;
		phoneNumber: string;
		password: string;
	}): Promise<ApiResponse<User>> {
		await delay(1500);

		// Check if email exists
		if (mockUsers[userData.email]) {
			return {
				success: false,
				error: {
					code: "EMAIL_EXISTS",
					message: "An account with this email already exists",
				},
			};
		}

		const newUser: User = {
			id: `user-${Date.now()}`,
			name: userData.fullName,
			email: userData.email,
			role: "ADMIN",
		};

		// Add to mock database
		mockUsers[userData.email] = {
			password: userData.password,
			isFirstTime: false,
			user: newUser,
		};

		return {
			success: true,
			data: newUser,
		};
	},

	// Send OTP
	async sendOtp(
		email: string,
		purpose: "signup" | "reset"
	): Promise<ApiResponse<{ sent: boolean }>> {
		await delay(1000);

		// Generate 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		// Store OTP with 10-minute expiry
		otpStorage[email] = {
			otp,
			expiry: Date.now() + 10 * 60 * 1000,
		};

		console.log(`[Mock] OTP for ${email}: ${otp}`); // For development

		return {
			success: true,
			data: { sent: true },
		};
	},

	// Verify OTP
	async verifyOtp(
		email: string,
		otp: string
	): Promise<ApiResponse<OtpResponse>> {
		await delay(1000);

		const storedOtp = otpStorage[email];

		// No OTP found
		if (!storedOtp) {
			return {
				success: false,
				error: {
					code: "OTP_INVALID",
					message: "Invalid or expired OTP",
				},
			};
		}

		// OTP expired
		if (Date.now() > storedOtp.expiry) {
			delete otpStorage[email];
			return {
				success: false,
				error: {
					code: "OTP_EXPIRED",
					message: "OTP has expired. Please request a new one",
				},
			};
		}

		// Wrong OTP
		if (storedOtp.otp !== otp) {
			return {
				success: false,
				error: {
					code: "OTP_INVALID",
					message: "Invalid OTP. Please try again",
				},
			};
		}

		// Success - generate token for password reset
		delete otpStorage[email];
		const token = `verified-${Date.now()}-${Math.random()
			.toString(36)
			.substr(2, 9)}`;

		return {
			success: true,
			data: {
				isValid: true,
				token,
			},
		};
	},

	// Forgot password - initiate reset
	async forgotPassword(email: string): Promise<ApiResponse<{ sent: boolean }>> {
		await delay(1500);

		// Check if user exists
		if (!mockUsers[email]) {
			// For security, still return success to not reveal if email exists
			return {
				success: true,
				data: { sent: true },
			};
		}

		// Send OTP
		return this.sendOtp(email, "reset");
	},

	// Reset password
	async resetPassword(
		token: string,
		newPassword: string,
		email?: string
	): Promise<ApiResponse<{ success: boolean }>> {
		await delay(1500);

		// In real app, validate token server-side
		if (!token.startsWith("reset-") && !token.startsWith("verified-")) {
			return {
				success: false,
				error: {
					code: "TOKEN_INVALID",
					message: "Invalid or expired reset token",
				},
			};
		}

		// Update password in mock database
		if (email && mockUsers[email]) {
			mockUsers[email].password = newPassword;
			mockUsers[email].isFirstTime = false; // No longer first time
		}

		return {
			success: true,
			data: { success: true },
		};
	},

	// Validate reset token
	async validateResetToken(
		token: string
	): Promise<ApiResponse<{ isValid: boolean }>> {
		await delay(500);

		// Simple validation for mock
		const isValid = token.startsWith("reset-") || token.startsWith("verified-");

		return {
			success: isValid,
			data: { isValid },
			error: !isValid
				? {
						code: "TOKEN_INVALID",
						message: "Invalid or expired reset token",
				  }
				: undefined,
		};
	},

	// Resend credentials (for admin)
	async resendCredentials(
		userId: string
	): Promise<ApiResponse<{ sent: boolean }>> {
		await delay(1000);

		// In real app, this would generate new temp password and email user
		console.log(`[Mock] Resending credentials for user ${userId}`);

		return {
			success: true,
			data: { sent: true },
		};
	},

	// Logout (cleanup)
	async logout(): Promise<ApiResponse<{ success: boolean }>> {
		await delay(500);

		// In real app, this would invalidate tokens, clear sessions, etc.
		return {
			success: true,
			data: { success: true },
		};
	},
};
