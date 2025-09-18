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
	CurrentUserResponse,
	VerifyDomainRequest,
	VerifyDomainResponse,
} from "../types/auth.types";

// Teacher login response has 'teacher' instead of 'user'
interface TeacherLoginData {
	accessToken: string;
	refreshToken: string;
	teacher: UserData; // Teacher data with same structure as UserData
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
		console.log("🍎 TeacherAuthApiClient: Starting teacher login", {
			email: data.email,
			rememberMe,
			endpoint: "/teacher/login"
		});

		try {
			const response = await this.post<TeacherLoginResponse>("/teacher/login", data);
			console.log("🍎 TeacherAuthApiClient: Teacher login response received", {
				hasData: !!response.data,
				hasAccessToken: !!(response.data?.accessToken),
				hasRefreshToken: !!(response.data?.refreshToken),
				hasTeacher: !!(response.data?.teacher),
				responseStructure: response.data,
				dataKeys: response.data ? Object.keys(response.data) : []
			});

			// Store tokens and user data on successful login 
			// Note: Teacher endpoint returns 'teacher' field instead of 'user'
			if (
				response.data &&
				response.data.accessToken &&
				response.data.refreshToken &&
				response.data.teacher
			) {
				console.log("🍎 TeacherAuthApiClient: Storing tokens and teacher data");
				this.setTokens(
					response.data.accessToken,
					response.data.refreshToken,
					rememberMe
				);
				// Use teacher data but store as user data for consistency
				this.setUserData(response.data.teacher);
				console.log("🍎 TeacherAuthApiClient: Teacher login successful");
			} else {
				console.error("🍎 TeacherAuthApiClient: Login response missing tokens", response.data);
				throw new Error("Login response missing tokens");
			}

			// Transform the response to match the expected structure
			// Convert teacher field to user field for consistency with frontend
			const transformedResponse = {
				...response,
				data: {
					...response.data,
					user: response.data.teacher // Map teacher to user for frontend compatibility
				}
			};

			return transformedResponse;
		} catch (error) {
			console.error("🍎 TeacherAuthApiClient: Teacher login failed", error);
			const apiError = error as ApiErrorResponse;

			if (apiError.status === 401) {
				console.log("🍎 TeacherAuthApiClient: 401 Unauthorized - Invalid credentials");
				throw {
					message: "Invalid email or password",
					status: 401,
				};
			} else if (apiError.status === 429) {
				console.log("🍎 TeacherAuthApiClient: 429 Too Many Requests");
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
		console.log("🍎 TeacherAuthApiClient: Starting teacher logout");

		try {
			await this.post<LogoutResponse>("/teacher/logout");
			console.log("🍎 TeacherAuthApiClient: Teacher logout API call successful");
		} catch (error) {
			console.error("🍎 TeacherAuthApiClient: Teacher logout API call failed", error);
			// Continue with local cleanup even if API call fails
		} finally {
			console.log("🍎 TeacherAuthApiClient: Performing local logout cleanup");
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
		console.log("🍎 TeacherAuthApiClient: Starting teacher forgot password", {
			email: data.email,
			endpoint: "/teacher/forgot-password"
		});

		try {
			const response = await this.post<ForgotPasswordResponse>(
				"/teacher/forgot-password",
				data
			);
			console.log("🍎 TeacherAuthApiClient: Teacher forgot password successful");
			return response;
		} catch (error) {
			console.error("🍎 TeacherAuthApiClient: Teacher forgot password failed", error);
			const apiError = error as ApiErrorResponse;

			if (apiError.status === 400) {
				console.log("🍎 TeacherAuthApiClient: 400 Bad Request - Invalid email");
				throw { message: "Invalid email address", status: 400 };
			} else if (apiError.status === 404) {
				console.log("🍎 TeacherAuthApiClient: 404 Not Found - Email not found");
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
		console.log("🍎 TeacherAuthApiClient: Starting teacher OTP verification", {
			email: data.email,
			otp: data.otp,
			endpoint: "/teacher/verify-forgot-password-otp"
		});

		try {
			const response = await this.post<OtpResponse>(
				"/teacher/verify-forgot-password-otp",
				data
			);
			console.log("🍎 TeacherAuthApiClient: Teacher OTP verification successful");
			return response;
		} catch (error) {
			console.error("🍎 TeacherAuthApiClient: Teacher OTP verification failed", error);
			throw error;
		}
	}

	// Reset password for teachers
	async resetPassword(
		data: ResetPasswordRequest
	): Promise<ResetPasswordResponse> {
		console.log("🍎 TeacherAuthApiClient: Starting teacher password reset", {
			email: data.email,
			endpoint: "/teacher/reset-password"
		});

		try {
			const response = await this.post<ResetPasswordResponse>(
				"/teacher/reset-password",
				data
			);
			console.log("🍎 TeacherAuthApiClient: Teacher password reset successful");
			return response;
		} catch (error) {
			console.error("🍎 TeacherAuthApiClient: Teacher password reset failed", error);
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

	// Get current teacher data (following existing pattern)
	async getCurrentUser(): Promise<UserData> {
		const response = await this.get<CurrentUserResponse>("/teacher/me");
		return response.data.user;
	}

	// Simple logout method that clears everything and redirects (same as base auth)
	performLogout(): void {
		// Use StorageManager for complete cleanup
		storageManager.clearAllAppData(true); // Keep remember me preference

		// Redirect to login
		window.location.href = "/";
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