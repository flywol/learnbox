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
		hasSeenOnboarding,
		intendedDestination,
		setIntendedDestination,
		login: loginAction,
		setPasswordResetEmail,
		setPasswordResetStep,
	} = useAuthStore();

	// Get user data from navigation state
	const { user } = location.state || {};

	// Redirect if no email or user data
	useEffect(() => {
		if (!passwordResetEmail || !user) {
			navigate("/login");
		}
	}, [passwordResetEmail, user, navigate]);

	// Email verification callback
	const handleEmailVerify = useCallback(
		async (otp: string) => {
			if (!passwordResetEmail) {
				throw new Error("Email is required for verification");
			}

			// Verify the OTP
			await authApiClient.verifyOtp({
				email: passwordResetEmail,
				otp,
			});

			// Clear password reset state since we're done
			setPasswordResetEmail("");
			setPasswordResetStep(null);

			// Complete the login now that email is verified
			loginAction(user);

			// Navigate based on user state
			if (intendedDestination) {
				const destination = intendedDestination;
				setIntendedDestination(null);
				navigate(destination);
			} else if (hasSeenOnboarding) {
				navigate("/dashboard");
			} else {
				navigate("/onboarding");
			}
		},
		[
			passwordResetEmail,
			user,
			loginAction,
			hasSeenOnboarding,
			intendedDestination,
			setIntendedDestination,
			setPasswordResetEmail,
			setPasswordResetStep,
			navigate,
		]
	);

	// Email resend callback
	const handleEmailResend = useCallback(async () => {
		if (!passwordResetEmail) {
			throw new Error("Email is required for resending verification code");
		}
		await authApiClient.resendOtp(passwordResetEmail);
	}, [passwordResetEmail]);

	// Error handling callback
	const handleEmailError = useCallback(
		(error: string) => {
			// For email verification errors, we could:
			// 1. Show the error and stay on the page
			// 2. Or redirect back to login

			// For now, let's redirect back to login with the error
			navigate("/login", {
				state: {
					error: error,
					email: passwordResetEmail,
				},
			});
		},
		[navigate, passwordResetEmail]
	);

	// Show loading if we don't have the required data yet
	if (!passwordResetEmail || !user) {
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
				email={passwordResetEmail}
				onVerify={handleEmailVerify}
				onResend={handleEmailResend}
				onError={handleEmailError}
			/>
		</div>
	);
};

export default EmailVerificationPage;