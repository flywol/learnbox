// src/features/auth/hooks/usePasswordReset.ts
import { useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { authApi } from "../api/authApi";

interface UsePasswordResetReturn {
	// State
	currentStep: "email" | "otp" | "newPassword" | null;
	isLoading: boolean;
	error: string | null;
	email: string;

	// Functions
	requestPasswordReset: (email: string) => Promise<boolean>;
	verifyOtp: (otp: string) => Promise<boolean>;
	resetPassword: (
		newPassword: string,
		confirmPassword: string
	) => Promise<boolean>;
	resendOtp: () => Promise<boolean>;
	clearError: () => void;
	reset: () => void;
}

/**
 * usePasswordReset - Manages the complete password reset flow
 *
 * Handles:
 * - Email submission
 * - OTP verification
 * - Password reset
 * - Error states
 * - Navigation between steps
 */
export const usePasswordReset = (): UsePasswordResetReturn => {
	const {
		passwordResetEmail,
		passwordResetStep,
		setPasswordResetEmail,
		setPasswordResetStep,
		completePasswordReset,
	} = useAuthStore();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Request password reset (send OTP)
	const requestPasswordReset = useCallback(
		async (email: string): Promise<boolean> => {
			setIsLoading(true);
			setError(null);

			try {
				await authApi.forgotPassword(email);

				setPasswordResetEmail(email);
				setPasswordResetStep("otp");
				return true;
			} catch (err: any) {
				setError(err.response?.data?.message || "Failed to send reset email");
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[setPasswordResetEmail, setPasswordResetStep]
	);

	// Verify OTP
	const verifyOtp = useCallback(
		async (otp: string): Promise<boolean> => {
			if (!passwordResetEmail) {
				setError("Email not found. Please start over.");
				return false;
			}

			setIsLoading(true);
			setError(null);

			try {
				await authApi.verifyForgotPasswordOtp(passwordResetEmail, otp);
				setPasswordResetStep("newPassword");
				return true;
			} catch (err: any) {
				setError(err.response?.data?.message || "Invalid or expired OTP");
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[passwordResetEmail, setPasswordResetStep]
	);

	// Reset password with new password
	const resetPassword = useCallback(
		async (newPassword: string, confirmPassword: string): Promise<boolean> => {
			if (!passwordResetEmail) {
				setError("Email not found. Please start over.");
				return false;
			}

			setIsLoading(true);
			setError(null);

			try {
				await authApi.resetPassword(
					passwordResetEmail,
					newPassword,
					confirmPassword
				);

				// Clear reset state
				completePasswordReset();
				return true;
			} catch (err: any) {
				setError(err.response?.data?.message || "Failed to reset password");
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[passwordResetEmail, completePasswordReset]
	);

	// Resend OTP
	const resendOtp = useCallback(async (): Promise<boolean> => {
		if (!passwordResetEmail) {
			setError("Email not found. Please start over.");
			return false;
		}

		setIsLoading(true);
		setError(null);

		try {
			await authApi.forgotPassword(passwordResetEmail);
			return true;
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to resend OTP");
			return false;
		} finally {
			setIsLoading(false);
		}
	}, [passwordResetEmail]);

	// Clear error
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	// Reset entire flow
	const reset = useCallback(() => {
		setPasswordResetEmail("");
		setPasswordResetStep(null);
		setError(null);
	}, [setPasswordResetEmail, setPasswordResetStep]);

	return {
		// State
		currentStep: passwordResetStep,
		isLoading,
		error,
		email: passwordResetEmail || "",

		// Functions
		requestPasswordReset,
		verifyOtp,
		resetPassword,
		resendOtp,
		clearError,
		reset,
	};
};
