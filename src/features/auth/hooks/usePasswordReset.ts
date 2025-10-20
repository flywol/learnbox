// src/features/auth/hooks/usePasswordReset.ts
import { useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { authApiClient } from "../api/authApiClient";
import { teacherAuthApiClient } from "../api/teacherAuthApiClient";
import { studentAuthApiClient } from "../api/studentAuthApiClient";

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
		selectedRole,
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
				// Client selection based on role
				let authClient;
				if (selectedRole === "TEACHER") {
					authClient = teacherAuthApiClient;
				} else if (selectedRole === "STUDENT") {
					authClient = studentAuthApiClient;
				} else {
					authClient = authApiClient; // ADMIN, PARENT, etc.
				}
				await authClient.forgotPassword({ email });

				setPasswordResetEmail(email);
				setPasswordResetStep("otp");
				return true;
			} catch (err: any) {
				setError(err.message || "Failed to send reset email");
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
				// Client selection based on role
				let authClient;
				if (selectedRole === "TEACHER") {
					authClient = teacherAuthApiClient;
				} else if (selectedRole === "STUDENT") {
					authClient = studentAuthApiClient;
				} else {
					authClient = authApiClient; // ADMIN, PARENT, etc.
				}
				await authClient.verifyForgotPasswordOtp({
					email: passwordResetEmail,
					otp,
				});
				setPasswordResetStep("newPassword");
				return true;
			} catch (err: any) {
				setError(err.message || "Invalid or expired OTP");
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[passwordResetEmail, setPasswordResetStep]
	);

	// Reset password with new password
	const resetPassword = useCallback(
		async (password: string, confirmPassword: string): Promise<boolean> => {
			if (!passwordResetEmail) {
				setError("Email not found. Please start over.");
				return false;
			}

			setIsLoading(true);
			setError(null);

			try {
				// Client selection based on role
				let authClient;
				if (selectedRole === "TEACHER") {
					authClient = teacherAuthApiClient;
				} else if (selectedRole === "STUDENT") {
					authClient = studentAuthApiClient;
				} else {
					authClient = authApiClient; // ADMIN, PARENT, etc.
				}
				await authClient.resetPassword({
					password: password,
					confirmPassword: confirmPassword,
					email: passwordResetEmail,
				});

				// Clear reset state
				completePasswordReset();
				return true;
			} catch (err: any) {
				setError(err.message || "Failed to reset password");
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
			// Client selection based on role and use proper resend endpoint
			if (selectedRole === "TEACHER") {
				await teacherAuthApiClient.resendPasswordOtp(passwordResetEmail);
			} else if (selectedRole === "STUDENT") {
				await studentAuthApiClient.resendPasswordOtp(passwordResetEmail);
			} else {
				// ADMIN, PARENT - use base client (may not have resend endpoint)
				await authApiClient.forgotPassword({ email: passwordResetEmail });
			}
			return true;
		} catch (err: any) {
			setError(err.message || "Failed to resend OTP");
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
