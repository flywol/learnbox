import BaseApiClient, { ApiErrorResponse } from "@/common/api/baseApiClient";
import { storageManager } from "@/common/storage/StorageManager";
import type {
	LoginRequest,
	LoginResponse,
	LogoutResponse,
	RefreshTokenResponse,
	ForgotPasswordRequest,
	ForgotPasswordResponse,
	ResetPasswordRequest,
	ResetPasswordResponse,
	OtpRequest,
	OtpResponse,
	UserData,
	VerifyDomainRequest,
	VerifyDomainResponse,
} from "../types/auth.types";

// Teacher login response - may have 'teacher' field instead of 'user'
interface TeacherLoginData {
	accessToken: string;
	refreshToken: string;
	teacher?: UserData; // Teacher data (if returned as 'teacher')
	user?: UserData;    // User data (if returned as 'user')
}

interface TeacherLoginResponse {
	statusCode: number;
	message: string;
	data: TeacherLoginData;
}

class TeacherAuthApiClient extends BaseApiClient {
	constructor() {
		super();
	}

	// Teacher login - same logic as base auth, different endpoint
	async login(
		data: LoginRequest,
		rememberMe: boolean = false
	): Promise<LoginResponse> {
		try {
			const response = await this.post<TeacherLoginResponse>("/teacher/login", data);

			// Store tokens and user data on successful login 
			// Teacher endpoint may return 'teacher' field or 'user' field
			const userData = response.data.teacher || response.data.user;
			
			if (
				response.data &&
				response.data.accessToken &&
				response.data.refreshToken &&
				userData
			) {
				this.setTokens(
					response.data.accessToken,
					response.data.refreshToken,
					rememberMe
				);
				// Store user data
				this.setUserData(userData);
			} else {
				throw new Error("Login response missing tokens or user data");
			}

			// Transform the response to match the expected structure
			// Ensure response has 'user' field for frontend compatibility
			const transformedResponse: LoginResponse = {
				...response,
				data: {
					accessToken: response.data.accessToken,
					refreshToken: response.data.refreshToken,
					user: userData
				}
			};

			return transformedResponse;
		} catch (error) {
			const apiError = error as ApiErrorResponse;

			if (apiError.status === 401) {
				throw {
					message: "Invalid email or password",
					status: 401,
				};
			} else if (apiError.status === 429) {
				throw {
					message: "Too many login attempts. Please try again later.",
					status: 429,
				};
			}
			throw apiError;
		}
	}

	// Teacher logout
	async logout(): Promise<void> {
		try {
			await this.post<LogoutResponse>("/teacher/logout");
		} catch (error) {
			// Continue with local cleanup even if API call fails
		} finally {
			// Always clear all auth data regardless of API response
			this.performLogout();
		}
	}

	// Teacher refresh token (keeping existing body-based approach)
	async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
		const response = await this.post<RefreshTokenResponse>(
			"/teacher/refresh-token",
			{ refreshToken }
		);
		return response;
	}

	// Teacher forgot password
	async forgotPassword(
		data: ForgotPasswordRequest
	): Promise<ForgotPasswordResponse> {
		try {
			const response = await this.post<ForgotPasswordResponse>(
				"/teacher/forgot-password",
				data
			);
			return response;
		} catch (error) {
			const apiError = error as ApiErrorResponse;

			if (apiError.status === 400) {
				throw { message: "Invalid email address", status: 400 };
			} else if (apiError.status === 404) {
				throw { message: "Email not found", status: 404 };
			}
			throw apiError;
		}
	}

	// Resend password reset OTP for teachers
	async resendPasswordOtp(email: string): Promise<OtpResponse> {
		const response = await this.post<OtpResponse>(
			"/teacher/resend-password-otp",
			{ email }
		);
		return response;
	}

	// Verify forgot password OTP for teachers
	async verifyForgotPasswordOtp(data: OtpRequest): Promise<OtpResponse> {
		try {
			const response = await this.post<OtpResponse>(
				"/teacher/verify-forgot-password-otp",
				data
			);
			return response;
		} catch (error) {
			throw error;
		}
	}

	// Reset password for teachers
	async resetPassword(
		data: ResetPasswordRequest
	): Promise<ResetPasswordResponse> {
		try {
			const response = await this.post<ResetPasswordResponse>(
				"/teacher/reset-password",
				data
			);
			return response;
		} catch (error) {
			throw error;
		}
	}

	// Verify school domain (shared endpoint - same for all roles)
	async verifyDomain(data: VerifyDomainRequest): Promise<VerifyDomainResponse> {
		const response = await this.post<VerifyDomainResponse>(
			"/school/verify-domain",
			data
		);
		return response;
	}

	// Helper method to check if domain verification was successful
	isDomainVerified(response: VerifyDomainResponse): boolean {
		// Domain is verified if we have a school object with an ID
		return !!(response.data && response.data.school && (response.data.school.id || response.data.school._id));
	}

	// Get current teacher data (use stored data since no API endpoint exists)
	async getCurrentUser(): Promise<UserData> {
		const storedUserData = this.getUserData();
		if (storedUserData) {
			return storedUserData;
		}
		
		throw new Error("No stored teacher data available");
	}

	// Simple logout method that clears everything and redirects (same as base auth)
	performLogout(): void {
		// Use StorageManager for complete cleanup
		storageManager.clearAllAppData(true); // Keep remember me preference

		// Dispatch event for App.tsx to handle navigation
		window.dispatchEvent(new Event("auth:unauthorized"));
	}

	// User data management (shared logic with base auth)
	getUserData(): UserData | null {
		const keys = storageManager.getStorageKeys();
		const userDataString = storageManager.getItem(keys.userProfile);

		try {
			return userDataString ? JSON.parse(userDataString) : null;
		} catch {
			this.clearUserData();
			return null;
		}
	}

	private setUserData(userData: UserData): void {
		const keys = storageManager.getStorageKeys();
		const userDataString = JSON.stringify(userData);
		storageManager.setItem(keys.userProfile, userDataString);
	}

	private clearUserData(): void {
		const keys = storageManager.getStorageKeys();
		storageManager.removeItem(keys.userProfile);
	}

	// Check if teacher needs password change
	needsPasswordChange(): boolean {
		const userData = this.getUserData();
		return userData ? !!userData.resetPasswordToken : false;
	}

	// Public method to clear tokens
	clearTokens(): void {
		try {
			this.clearUserData();
			this.setTokens("", "", false);
		} catch {
			// Continue silently on error
		}
	}
}

export const teacherAuthApiClient = new TeacherAuthApiClient();
export default teacherAuthApiClient;