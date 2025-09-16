// src/common/api/BaseApiClient.ts
import axios, {
	AxiosInstance,
	AxiosError,
	AxiosRequestConfig,
	AxiosResponse,
} from "axios";
import { storageManager } from "../storage/StorageManager";

export interface ApiErrorResponse {
	message: string;
	status: number;
	data?: Record<string, unknown>;
}

export class BaseApiClient {
	protected api: AxiosInstance;
	protected storageManager = storageManager;

	constructor(baseURL?: string) {
		this.api = axios.create({
			baseURL:
				baseURL || import.meta.env.VITE_API_BASE_URL,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.api.interceptors.request.use(
			(config) => {
				const token = this.getToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		this.api.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config;

				if (
					error.response?.status === 401 &&
					originalRequest &&
					!(originalRequest as AxiosRequestConfig & { _retry?: boolean })._retry
				) {
					// Check if this is a validation error (not a token expiry)
					const isValidationError = this.isValidationError(error, originalRequest);
					
					if (isValidationError) {
						// For validation errors, don't try to refresh tokens - just return the error
						return Promise.reject(this.normalizeError(error));
					}

					(originalRequest as AxiosRequestConfig & { _retry?: boolean })._retry = true;

					const refreshToken = this.getRefreshToken();
					if (refreshToken) {
						try {
							const refreshResponse = await axios.post(
								`${this.api.defaults.baseURL}/auth/refresh-token`,
								{ refreshToken }
							);

							const { accessToken: newAccessToken } = refreshResponse.data.data;
							this.setToken(newAccessToken);

							if (originalRequest.headers) {
								originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
							}
							return this.api(originalRequest);
						} catch {
								this.clearAllTokens();
							window.location.href = "/";
							return Promise.reject(this.normalizeError(error));
						}
					} else {
								this.clearAllTokens();
						window.location.href = "/";
					}
				}
				return Promise.reject(this.normalizeError(error));
			}
		);
	}

	// Helper method to determine if a 401 error is a validation error vs token expiry
	private isValidationError(_error: AxiosError, originalRequest: AxiosRequestConfig): boolean {
		const url = originalRequest?.url || '';
		
		// List of endpoints that return 401 for validation errors, not token expiry
		const validationEndpoints = [
			'/auth/login',           // Wrong email/password
			'/auth/verify-otp',      // Wrong OTP
			'/auth/resend-otp',      // OTP-related errors
			'/auth/forgot-password', // Email not found
			'/auth/reset-password',  // Invalid reset token
			'/school/verify-domain', // School domain not found
		];
		
		// Check if this is a validation endpoint
		const isValidationEndpoint = validationEndpoints.some(endpoint => 
			url.includes(endpoint)
		);
		
		return isValidationEndpoint;
	}

	// Access Token Management
	protected getToken(): string | null {
		const keys = this.storageManager.getStorageKeys();
		return this.storageManager.getItem(keys.accessToken);
	}

	protected setToken(token: string): void {
		const keys = this.storageManager.getStorageKeys();
		this.storageManager.setItem(keys.accessToken, token);
	}

	protected clearToken(): void {
		const keys = this.storageManager.getStorageKeys();
		this.storageManager.removeItem(keys.accessToken);
	}

	// Refresh Token Management
	protected getRefreshToken(): string | null {
		const keys = this.storageManager.getStorageKeys();
		return this.storageManager.getItem(keys.refreshToken);
	}

	protected setRefreshToken(token: string): void {
		const keys = this.storageManager.getStorageKeys();
		this.storageManager.setItem(keys.refreshToken, token);
	}

	protected clearRefreshToken(): void {
		const keys = this.storageManager.getStorageKeys();
		this.storageManager.removeItem(keys.refreshToken);
	}

	// Remember Me Management
	protected setRememberMe(remember: boolean): void {
		this.storageManager.setRememberMe(remember);
	}

	protected isRememberMe(): boolean {
		return this.storageManager.isRememberMe();
	}

	// Clear all tokens and preferences
	protected clearAllTokens(): void {
		this.clearToken();
		this.clearRefreshToken();
		this.storageManager.setRememberMe(false);
	}

	// Set tokens with remember me preference
	public setTokens(
		accessToken: string,
		refreshToken: string,
		rememberMe: boolean = false
	): void {

		this.setRememberMe(rememberMe);
		this.setToken(accessToken);
		this.setRefreshToken(refreshToken);
	}

	// Get both tokens
	public getTokens(): {
		accessToken: string | null;
		refreshToken: string | null;
	} {
		return {
			accessToken: this.getToken(),
			refreshToken: this.getRefreshToken(),
		};
	}

	// Check if authenticated
	public isAuthenticated(): boolean {
		return !!this.getToken();
	}

	// Normalize errors
	protected normalizeError(error: AxiosError): ApiErrorResponse {
		if (error.response) {
			const data = (error.response.data as Record<string, unknown>) || {};
			return {
				message:
					(data.message as string) ||
					(error.response.data as { message?: string })?.message ||
					"An error occurred with the request.",
				status: error.response.status,
				data: data,
			};
		} else if (error.request) {
			return {
				message:
					"No response received from the server. Please check your connection.",
				status: 0,
			};
		} else {
			return {
				message: error.message || "An unexpected error occurred.",
				status: 500,
			};
		}
	}

	// HTTP methods
	protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.api.get<T>(url, config);
		return response.data;
	}

	protected async post<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response: AxiosResponse<T> = await this.api.post<T>(
			url,
			data,
			config
		);
		return response.data;
	}

	protected async put<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response: AxiosResponse<T> = await this.api.put<T>(url, data, config);
		return response.data;
	}

	protected async patch<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response: AxiosResponse<T> = await this.api.patch<T>(
			url,
			data,
			config
		);
		return response.data;
	}

	protected async delete<T>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response: AxiosResponse<T> = await this.api.delete<T>(url, config);
		return response.data;
	}
}

export default BaseApiClient;
