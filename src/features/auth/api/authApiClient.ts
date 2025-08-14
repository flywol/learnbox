import BaseApiClient, { ApiErrorResponse } from "@/common/api/baseApiClient";
import { storageManager } from "@/common/storage/StorageManager";
import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	LogoutResponse,
	RefreshTokenResponse,
	OtpRequest,
	OtpResponse,
	ResendOtpRequest,
	ForgotPasswordRequest,
	ForgotPasswordResponse,
	ResetPasswordRequest,
	ResetPasswordResponse,
	UserData,
	CurrentUserResponse,
	VerifyDomainRequest,
	VerifyDomainResponse,
} from "../types/auth.types";

class AuthApiClient extends BaseApiClient {

	constructor() {
		super();
	}

	// Register new user
	async register(data: RegisterRequest): Promise<RegisterResponse> {
		try {
			const response = await this.post<RegisterResponse>(
				"/auth/register",
				data
			);
			return response;
		} catch (error) {
			throw error;
		}
	}

	// Verify school domain
	async verifyDomain(data: VerifyDomainRequest): Promise<VerifyDomainResponse> {
		try {
			const response = await this.post<VerifyDomainResponse>(
				"/school/verify-domain",
				data
			);

			return response;
		} catch (error) {
			throw error;
		}
	}

	// Helper method to check if domain verification was successful
	isDomainVerified(response: VerifyDomainResponse): boolean {
		// Domain is verified if we have a school object with an ID
		return !!(response.data && response.data.school && response.data.school.id);
	}

	// Login with email and password
	async login(
		data: LoginRequest,
		rememberMe: boolean = false
	): Promise<LoginResponse> {
		try {
			const response = await this.post<LoginResponse>("/auth/login", data);

			// Store tokens and user data on successful login
			if (
				response.data &&
				response.data.accessToken &&
				response.data.refreshToken
			) {
				this.setTokens(
					response.data.accessToken,
					response.data.refreshToken,
					rememberMe
				);
				this.setUserData(response.data.user);
			} else {
				throw new Error("Login response missing tokens");
			}

			return response;
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


	// Logout the current user
	async logout(): Promise<void> {
		try {
			await this.post<LogoutResponse>("/auth/logout");
		} catch (error) {
			// Continue with local cleanup even if API call fails
		} finally {
			// Always clear all auth data regardless of API response
			this.performLogout();
		}
	}

	// Simple logout method that clears everything and redirects
	performLogout(): void {
		// Use StorageManager for complete cleanup
		storageManager.clearAllAppData(true); // Keep remember me preference

		// Redirect to login
		window.location.href = "/";
	}

	// Refresh access token
	async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
		try {
			const response = await this.post<RefreshTokenResponse>(
				"/auth/refresh-token",
				{ refreshToken }
			);
			return response;
		} catch (error) {
			throw error;
		}
	}

	// Send OTP to email - support both old signature and new object signature
	async resendOtp(emailOrRequest: string | ResendOtpRequest): Promise<OtpResponse> {
		try {
			const requestData = typeof emailOrRequest === 'string' 
				? { email: emailOrRequest }
				: emailOrRequest;
				
			const response = await this.post<OtpResponse>("/auth/resend-otp", requestData);
			return response;
		} catch (error) {
			throw error;
		}
	}

	// Verify OTP
	async verifyOtp(data: OtpRequest): Promise<OtpResponse> {
		try {
			const response = await this.post<OtpResponse>("/auth/verify-otp", data);
			return response;
		} catch (error) {
			throw error;
		}
	}

	// Initiate forgot password flow
	async forgotPassword(
		data: ForgotPasswordRequest
	): Promise<ForgotPasswordResponse> {
		try {
			const response = await this.post<ForgotPasswordResponse>(
				"/auth/forgot-password",
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

	// Resend password reset OTP
	async resendPasswordOtp(email: string): Promise<OtpResponse> {
		try {
			const response = await this.post<OtpResponse>(
				"/auth/resend-password-otp",
				{ email }
			);
			return response;
		} catch (error) {
			throw error;
		}
	}

	// Verify forgot password OTP
	async verifyForgotPasswordOtp(data: OtpRequest): Promise<OtpResponse> {
		try {
			const response = await this.post<OtpResponse>(
				"/auth/verify-forgot-password-otp",
				data
			);
			return response;
		} catch (error) {
			throw error;
		}
	}

	// Reset password with OTP
	async resetPassword(
		data: ResetPasswordRequest
	): Promise<ResetPasswordResponse> {
		try {
			const response = await this.post<ResetPasswordResponse>(
				"/auth/reset-password",
				data
			);
			return response;
		} catch (error) {
			throw error;
		}
	}

	// Get current user data (for session restoration)
	async getCurrentUser(): Promise<UserData> {
		try {
			const response = await this.get<CurrentUserResponse>("/auth/me");
			return response.data.user;
		} catch (error) {
			throw error;
		}
	}

	// User data management
	getUserData(): UserData | null {
		const keys = storageManager.getStorageKeys();
		const userDataString = storageManager.getItem(keys.userProfile);

		try {
			return userDataString ? JSON.parse(userDataString) : null;
		} catch (error) {
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

	// Check if user needs password change (if applicable)
	needsPasswordChange(): boolean {
		const userData = this.getUserData();
		return userData ? !!userData.resetPasswordToken : false;
	}
	// Public method to clear tokens (wrapper for protected method)
	clearTokens(): void {
		try {
			// Call the protected method through logout to ensure proper cleanup
			this.clearUserData();
			// Force token cleanup by setting empty tokens
			this.setTokens("", "", false);
		} catch (error) {
			// Continue silently on error
		}
	}
}

export const authApiClient = new AuthApiClient();
export default authApiClient;
