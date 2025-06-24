export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: ApiError;
}

export interface ApiError {
	code: string;
	message: string;
	field?: string;
}

export interface BackendError {
	message: string;
	error: string;
	statusCode: number;
}

export interface TokenPair {
	accessToken: string;
	refreshToken: string;
}
