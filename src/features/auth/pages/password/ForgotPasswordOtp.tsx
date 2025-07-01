// src/features/auth/pages/password/ForgotPasswordOtp.tsx
import { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import OtpVerification from "../../components/OtpVerification";
import { authApiClient } from "../../api/authApiClient";

const ForgotPasswordOtpPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const { passwordResetEmail, setPasswordResetStep } = useAuthStore();

	// Get email from location state if not in store
	const emailFromState = location.state?.email;
	const verificationEmail = passwordResetEmail || emailFromState;

	// Redirect if no email available
	useEffect(() => {
		if (!verificationEmail) {
			navigate("/forgot-password");
		}
	}, [verificationEmail, navigate]);

	// OTP verification callback
	const handleOtpVerify = useCallback(
		async (otp: string) => {
			if (!verificationEmail) {
				throw new Error("Email is required for OTP verification");
			}

			await authApiClient.verifyForgotPasswordOtp({
				email: verificationEmail,
				otp,
			});

			// Move to success step briefly, then redirect to reset password
			setPasswordResetStep("newPassword");

			// Redirect to reset password page after a brief delay
			setTimeout(() => {
				navigate("/reset-password", {
					state: {
						email: verificationEmail,
						fromForgotPassword: true,
					},
				});
			}, 1500);
		},
		[verificationEmail, setPasswordResetStep, navigate]
	);

	// OTP resend callback
	const handleOtpResend = useCallback(async () => {
		if (!verificationEmail) {
			throw new Error("Email is required for resending OTP");
		}
		await authApiClient.forgotPassword({ email: verificationEmail });
	}, [verificationEmail]);

	// Error handling callback
	const handleOtpError = useCallback((error: string) => {
		console.error("OTP verification error:", error);
		// Could redirect back to forgot password or show error inline
		// For now, the OtpVerification component will handle showing the error
	}, []);

	const handleBackToEmail = useCallback(() => {
		navigate("/forgot-password", {
			state: { email: verificationEmail },
		});
	}, [navigate, verificationEmail]);

	if (!verificationEmail) {
		return null; // Will redirect in useEffect
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="fixed top-4 left-4">
				<button
					onClick={handleBackToEmail}
					className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back
				</button>
			</div>
			<OtpVerification
				email={verificationEmail}
				onVerify={handleOtpVerify}
				onResend={handleOtpResend}
				onError={handleOtpError}
			/>
		</div>
	);
};

export default ForgotPasswordOtpPage;
