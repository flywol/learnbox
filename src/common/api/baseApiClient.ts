// src/common/api/BaseApiClient.ts
import axios, {
	AxiosInstance,
	AxiosError,
	AxiosRequestConfig,
	AxiosResponse,
} from "axios";

export interface ApiErrorResponse {
	message: string;
	status: number;
	data?: any;
}

export class BaseApiClient {
	protected api: AxiosInstance;
	protected tokenKey = "learnbox_access_token";
	protected refreshTokenKey = "learnbox_refresh_token";
	protected rememberMeKey = "learnbox_remember_me";

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
					!(originalRequest as any)._retry
				) {
					(originalRequest as any)._retry = true;

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
						} catch (refreshError) {
							console.error("Token refresh failed:", refreshError);
							this.clearAllTokens();
							window.location.href = "/";
							return Promise.reject(this.normalizeError(error));
						}
					} else {
						console.warn("401 Unauthorized: No refresh token available");
						this.clearAllTokens();
						window.location.href = "/";
					}
				}
				return Promise.reject(this.normalizeError(error));
			}
		);
	}

	// Access Token Management
	protected getToken(): string | null {
		const rememberMe = this.isRememberMe();
		const storage = rememberMe ? localStorage : sessionStorage;
		return storage.getItem(this.tokenKey);
	}

	protected setToken(token: string): void {
		const rememberMe = this.isRememberMe();
		const storage = rememberMe ? localStorage : sessionStorage;
		storage.setItem(this.tokenKey, token);
	}

	protected clearToken(): void {
		sessionStorage.removeItem(this.tokenKey);
		localStorage.removeItem(this.tokenKey);
	}

	// Refresh Token Management
	protected getRefreshToken(): string | null {
		const rememberMe = this.isRememberMe();
		const storage = rememberMe ? localStorage : sessionStorage;
		return storage.getItem(this.refreshTokenKey);
	}

	protected setRefreshToken(token: string): void {
		const rememberMe = this.isRememberMe();
		const storage = rememberMe ? localStorage : sessionStorage;
		storage.setItem(this.refreshTokenKey, token);
	}

	protected clearRefreshToken(): void {
		sessionStorage.removeItem(this.refreshTokenKey);
		localStorage.removeItem(this.refreshTokenKey);
	}

	// Remember Me Management
	protected setRememberMe(remember: boolean): void {
		if (remember) {
			localStorage.setItem(this.rememberMeKey, "true");
		} else {
			localStorage.removeItem(this.rememberMeKey);
		}
	}

	protected isRememberMe(): boolean {
		return localStorage.getItem(this.rememberMeKey) === "true";
	}

	// Clear all tokens and preferences
	protected clearAllTokens(): void {
		this.clearToken();
		this.clearRefreshToken();
		localStorage.removeItem(this.rememberMeKey);
	}

	// Set tokens with remember me preference
	public setTokens(
		accessToken: string,
		refreshToken: string,
		rememberMe: boolean = false
	): void {
		console.log("💾 Setting tokens:", {
			hasAccessToken: !!accessToken,
			hasRefreshToken: !!refreshToken,
			rememberMe,
			storage: rememberMe ? "localStorage" : "sessionStorage",
		});

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
			const data = (error.response.data as Record<string, any>) || {};
			return {
				message:
					data.message ||
					(error.response as any).message ||
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
		data?: any,
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
		data?: any,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response: AxiosResponse<T> = await this.api.put<T>(url, data, config);
		return response.data;
	}

	protected async patch<T>(
		url: string,
		data?: any,
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
