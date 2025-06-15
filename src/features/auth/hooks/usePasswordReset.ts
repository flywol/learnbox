// src/features/auth/hooks/usePasswordReset.ts
import { useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { mockAuthApi } from "../api/mockAuthApi";

interface UsePasswordResetReturn {
	// State
	currentStep: "email" | "otp" | "newPassword" | null;
	isLoading: boolean;
	error: string | null;
	email: string | null;

	// Functions
	requestPasswordReset: (email: string) => Promise<boolean>;
	verifyOtp: (otp: string) => Promise<boolean>;
	resetPassword: (newPassword: string, token: string) => Promise<boolean>;
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
				const response = await mockAuthApi.forgotPassword(email);

				if (response.success) {
					setPasswordResetEmail(email);
					setPasswordResetStep("otp");
					return true;
				} else {
					setError(response.error?.message || "Failed to send reset email");
					return false;
				}
			} catch (err) {
				setError("An unexpected error occurred. Please try again.");
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
				const response = await mockAuthApi.verifyOtp(passwordResetEmail, otp);

				if (response.success && response.data?.isValid) {
					setPasswordResetStep("newPassword");
					return true;
				} else {
					setError(response.error?.message || "Invalid or expired OTP");
					return false;
				}
			} catch (err) {
				setError("Failed to verify OTP. Please try again.");
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[passwordResetEmail, setPasswordResetStep]
	);

	// Reset password with new password
	const resetPassword = useCallback(
		async (newPassword: string, token: string): Promise<boolean> => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await mockAuthApi.resetPassword(
					token,
					newPassword,
					passwordResetEmail || undefined
				);

				if (response.success) {
					// Clear reset state
					completePasswordReset();
					return true;
				} else {
					setError(response.error?.message || "Failed to reset password");
					return false;
				}
			} catch (err) {
				setError("An unexpected error occurred. Please try again.");
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
			const response = await mockAuthApi.sendOtp(passwordResetEmail, "reset");

			if (response.success) {
				return true;
			} else {
				setError(response.error?.message || "Failed to resend OTP");
				return false;
			}
		} catch (err) {
			setError("Failed to resend OTP. Please try again.");
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
		setPasswordResetEmail(null);
		setPasswordResetStep(null);
		setError(null);
	}, [setPasswordResetEmail, setPasswordResetStep]);

	return {
		// State
		currentStep: passwordResetStep,
		isLoading,
		error,
		email: passwordResetEmail,

		// Functions
		requestPasswordReset,
		verifyOtp,
		resetPassword,
		resendOtp,
		clearError,
		reset,
	};
};
