import { AxiosError } from "axios";
import type { ApiError, BackendError } from "../types";

export const handleApiError = (error: AxiosError<BackendError>): ApiError => {
	if (error.response?.data) {
		const { message, statusCode } = error.response.data;

		switch (statusCode) {
			case 400:
				if (message.includes("already exists")) {
					return { code: "USER_EXISTS", message };
				}
				if (message.includes("OTP not verified")) {
					return { code: "OTP_NOT_VERIFIED", message };
				}
				return { code: "BAD_REQUEST", message };

			case 401:
				if (message.includes("Invalid otp")) {
					return { code: "OTP_INVALID", message };
				}
				if (message.includes("Invalid credentials")) {
					return { code: "INVALID_CREDENTIALS", message };
				}
				return { code: "UNAUTHORIZED", message };

			case 403:
				if (message.includes("passwords do not match")) {
					return { code: "PASSWORD_MISMATCH", message };
				}
				return { code: "FORBIDDEN", message };

			case 404:
				if (message.includes("School not found")) {
					return { code: "SCHOOL_NOT_FOUND", message };
				}
				return { code: "NOT_FOUND", message };

			case 500:
				return {
					code: "SERVER_ERROR",
					message: "Server error. Please try again later.",
				};

			default:
				return { code: "UNKNOWN_ERROR", message };
		}
	}

	if (error.code === "ECONNABORTED") {
		return { code: "TIMEOUT", message: "Request timed out. Please try again." };
	}

	if (!error.response) {
		return {
			code: "NETWORK_ERROR",
			message: "Network error. Please check your connection.",
		};
	}

	return { code: "UNKNOWN_ERROR", message: "An unexpected error occurred" };
};
