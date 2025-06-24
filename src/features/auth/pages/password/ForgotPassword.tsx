// src/features/auth/pages/password/ForgotPassword.tsx
import { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	forgotPasswordSchema,
	ForgotPasswordFormData,
} from "../../schemas/authSchema";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import OtpVerification from "../../components/OtpVerification";
import { AuthPageWrapper } from "../../components/ui/AuthPageWrapper";

const ForgotPasswordPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const {
		passwordResetEmail,
		passwordResetStep,
		loadingState,
		setPasswordResetEmail,
		setPasswordResetStep,
		setLoadingState,
	} = useAuthStore();

	// Pre-fill email if coming from login page
	const defaultEmail = location.state?.email || "";

	// Initialize password reset flow
	useEffect(() => {
		if (passwordResetStep === null) {
			setPasswordResetStep("email");
		}
	}, [passwordResetStep, setPasswordResetStep]);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: defaultEmail,
		},
	});

	const onEmailSubmit = useCallback(
		async (data: ForgotPasswordFormData) => {
			setLoadingState("submitting");

			try {
				await authApi.forgotPassword(data.email);
				setPasswordResetEmail(data.email);
				setPasswordResetStep("otp");
				setLoadingState("success");
			} catch (err: any) {
				const errorMessage =
					err.response?.data?.message ||
					"Failed to send reset email. Please try again.";
				setError("email", { message: errorMessage });
				setLoadingState("error");
			}
		},
		[setPasswordResetEmail, setPasswordResetStep, setLoadingState, setError]
	);

	// OTP verification callback
	const handleOtpVerify = useCallback(
		async (otp: string) => {
			if (!passwordResetEmail) {
				throw new Error("Email is required for OTP verification");
			}

			await authApi.verifyForgotPasswordOtp(passwordResetEmail, otp);

			// Move to success step briefly, then redirect to reset password
			setPasswordResetStep("newPassword");

			// Redirect to reset password page after a brief delay
			setTimeout(() => {
				navigate("/reset-password", {
					state: {
						email: passwordResetEmail,
						fromForgotPassword: true,
					},
				});
			}, 1500);
		},
		[passwordResetEmail, setPasswordResetStep, navigate]
	);

	// OTP resend callback
	const handleOtpResend = useCallback(async () => {
		if (!passwordResetEmail) {
			throw new Error("Email is required for resending OTP");
		}
		await authApi.forgotPassword(passwordResetEmail);
	}, [passwordResetEmail]);

	// OTP error callback
	const handleOtpError = useCallback(
		(_error: string) => {
			// Show error and go back to email step
			setPasswordResetStep("email");
			setLoadingState("error");
		},
		[setPasswordResetStep, setLoadingState]
	);

	const handleBackToLogin = useCallback(() => {
		navigate("/login", {
			state: { email: passwordResetEmail || defaultEmail },
		});
	}, [navigate, passwordResetEmail, defaultEmail]);

	const handleBackToEmail = useCallback(() => {
		setPasswordResetStep("email");
	}, [setPasswordResetStep]);

	// Render OTP step
	if (passwordResetStep === "otp") {
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
					email={passwordResetEmail || ""}
					onVerify={handleOtpVerify}
					onResend={handleOtpResend}
					onError={handleOtpError}
				/>
			</div>
		);
	}

	// Render success/redirect step
	if (passwordResetStep === "newPassword") {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border text-center">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-10 h-10 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h2 className="text-2xl font-bold mb-2">Verification Successful!</h2>
					<p className="text-gray-600">
						Redirecting you to reset your password...
					</p>
					<div className="mt-4">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
					</div>
				</div>
			</div>
		);
	}

	// Default: Email step
	return (
		<AuthPageWrapper>
			<div className="space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
					<p className="mt-2 text-muted-foreground">
						Enter your email address and we'll send you a verification code.
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onEmailSubmit)}
					className="space-y-4">
					<div className="space-y-2">
						<input
							id="email"
							type="email"
							{...register("email")}
							className="w-full p-3 border rounded-md"
							placeholder="Email address"
							disabled={loadingState === "submitting"}
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">
								{errors.email.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={!isValid || loadingState === "submitting"}
						className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
						{loadingState === "submitting"
							? "Sending..."
							: "Send Verification Code"}
					</button>
				</form>

				<div className="text-center text-sm">
					<p className="text-gray-600">
						Remember your password?{" "}
						<button
							onClick={handleBackToLogin}
							className="text-gray-500 hover:text-gray-700 font-medium">
							Sign in
						</button>
					</p>
				</div>
			</div>
		</AuthPageWrapper>
	);
};

export default ForgotPasswordPage;
