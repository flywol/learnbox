// src/lib/api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Token storage utilities
export const tokenManager = {
	getTokens() {
		const accessToken =
			sessionStorage.getItem("accessToken") ||
			localStorage.getItem("accessToken");
		const refreshToken =
			sessionStorage.getItem("refreshToken") ||
			localStorage.getItem("refreshToken");
		return { accessToken, refreshToken };
	},

	setTokens(
		tokens: { accessToken: string; refreshToken: string },
		rememberMe: boolean = false
	) {
		const storage = rememberMe ? localStorage : sessionStorage;
		storage.setItem("accessToken", tokens.accessToken);
		storage.setItem("refreshToken", tokens.refreshToken);
	},

	clearTokens() {
		sessionStorage.removeItem("accessToken");
		sessionStorage.removeItem("refreshToken");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	},
};

// Create axios instance
const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const { accessToken } = tokenManager.getTokens();
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for token refresh
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value: any) => void;
	reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => {
						return apiClient(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const { refreshToken } = tokenManager.getTokens();

			if (!refreshToken) {
				tokenManager.clearTokens();
				window.location.href = "/login";
				return Promise.reject(error);
			}

			try {
				const response = await axios.post(
					`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
					{},
					{
						headers: {
							"refresh-token": refreshToken,
						},
					}
				);

				const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
					response.data.data;

				// Store new tokens (check if remember me was used)
				const rememberMe = !!localStorage.getItem("accessToken");
				tokenManager.setTokens(
					{ accessToken: newAccessToken, refreshToken: newRefreshToken },
					rememberMe
				);

				processQueue(null);
				return apiClient(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				tokenManager.clearTokens();
				window.location.href = "/login";
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
