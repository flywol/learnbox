// src/features/auth/api/authApi.ts
import apiClient, { tokenManager } from "@/lib/api/client";
import { User} from "../types/user.types";

// API response types matching backend
interface LoginResponse {
	data: {
		user: User;
		tokens: {
			accessToken: string;
			refreshToken: string;
		};
	};
}

interface RegisterResponse {
	data: {
		message:string
		user: User;
	};
}

interface VerifyDomainResponse {
	data: {
		schoolId: string;
		schoolName: string;
	};
}

export const authApi = {
	// Register new admin and school
	async register(data: {
		fullName: string;
		email: string;
		password: string;
		schoolName: string;
		schoolWebsite: string;
		schoolShortName: string;
		learnboxUrl: string;
		phoneNumber: string;
	}) {
		const response = await apiClient.post<RegisterResponse>(
			"/auth/register",
			data
		);
		return response.data;
	},

	// Login user
	async login(email: string, password: string, rememberMe: boolean = false) {
		const response = await apiClient.post<LoginResponse>("/auth/login", {
			email,
			password,
		});

		// Store tokens based on remember me preference
		if (response.data.data.tokens) {
			tokenManager.setTokens(response.data.data.tokens, rememberMe);
		}

		return response.data;
	},

	// Logout user
	async logout() {
		try {
			await apiClient.post("/auth/logout");
		} finally {
			// Clear tokens regardless of API response
			tokenManager.clearTokens();
		}
	},

	// Verify OTP
	async verifyOtp(email: string, otp: string) {
		const response = await apiClient.post("/auth/verify-otp", {
			email,
			otp,
		});
		return response.data;
	},

	// Resend OTP
	async resendOtp(email: string) {
		const response = await apiClient.post("/auth/resend-otp", {
			email,
		});
		return response.data;
	},

	// Forgot password - initiate reset
	async forgotPassword(email: string) {
		const response = await apiClient.post("/auth/forgot-password", {
			email,
		});
		return response.data;
	},

	// Verify forgot password OTP
	async verifyForgotPasswordOtp(email: string, otp: string) {
		const response = await apiClient.post("/auth/verify-forgot-password-otp", {
			email,
			otp,
		});
		return response.data;
	},

	// Reset password
	async resetPassword(
		email: string,
		password: string,
		confirmPassword: string
	) {
		const response = await apiClient.post("/auth/reset-password", {
			email,
			password,
			confirmPassword,
		});
		return response.data;
	},

	// Verify school domain
	async verifyDomain(schoolDomain: string) {
		const response = await apiClient.post<VerifyDomainResponse>(
			"/school/verify-domain",
			{
				schoolDomain,
			}
		);
		return response.data;
	},

	// Refresh token (handled by interceptor, but available if needed directly)
	async refreshToken(refreshToken: string) {
		const response = await apiClient.post(
			"/auth/refresh-token",
			{},
			{
				headers: {
					"refresh-token": refreshToken,
				},
			}
		);
		return response.data;
	},
};
