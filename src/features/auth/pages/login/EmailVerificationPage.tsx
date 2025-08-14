// src/features/auth/pages/verification/EmailVerificationPage.tsx
import { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authApiClient } from "../../api/authApiClient";
import OtpVerification from "../../components/OtpVerification";

const EmailVerificationPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const {
		passwordResetEmail,
		setPasswordResetEmail,
		setPasswordResetStep,
	} = useAuthStore();

	// Get data from navigation state (new flow)
	const { email, message, error } = location.state || {};
	
	// Use email from state if available, fallback to store
	const verificationEmail = email || passwordResetEmail;

	// Redirect if no email available
	useEffect(() => {
		if (!verificationEmail) {
			navigate("/login");
		}
	}, [verificationEmail, navigate]);

	// Email verification callback
	const handleEmailVerify = useCallback(
		async (otp: string) => {
			if (!verificationEmail) {
				throw new Error("Email is required for verification");
			}

			// Verify the OTP
			await authApiClient.verifyOtp({
				email: verificationEmail,
				otp
			});

			// Clear password reset state since we're done
			setPasswordResetEmail("");
			setPasswordResetStep(null);

			// Redirect back to login page with success message
			navigate("/login", {
				state: {
					message: "Email verified successfully! Please login again to continue.",
					email: verificationEmail
				}
			});
		},
		[verificationEmail, setPasswordResetEmail, setPasswordResetStep, navigate]
	);

	// Email resend callback
	const handleEmailResend = useCallback(async () => {
		if (!verificationEmail) {
			throw new Error("Email is required for resending verification code");
		}
		await authApiClient.resendOtp({
			email: verificationEmail
		});
	}, [verificationEmail]);

	// Error handling callback
	const handleEmailError = useCallback(
		(error: string) => {
			// Show the error and stay on the page to allow retry
			console.error("Email verification error:", error);
			// The error will be displayed by the OtpVerification component
			// No need to redirect, just let the user try again
		},
		[]
	);

	// Show loading if we don't have the required data yet
	if (!verificationEmail) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#fff6f3]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Back to login button */}
			<div className="fixed top-4 left-4">
				<button
					onClick={() => navigate("/login")}
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
					Back to Login
				</button>
			</div>

			<OtpVerification
				email={verificationEmail}
				onVerify={handleEmailVerify}
				onResend={handleEmailResend}
				onError={handleEmailError}
				message={message}
				initialError={error}
			/>
		</div>
	);
};

export default EmailVerificationPage;