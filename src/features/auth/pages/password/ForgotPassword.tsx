// src/features/auth/pages/password/ForgotPasswordPage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	forgotPasswordSchema,
	ForgotPasswordFormData,
} from "../../schemas/authSchema";
import { mockAuthApi } from "../../api/mockAuthApi";
import { useAuthStore } from "../../store/authStore";
import OtpVerificationStep from "../signup/components/OtpVerificationStep";

type ForgotPasswordStep = "email" | "otp" | "success";

const ForgotPasswordPage = () => {
	const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [emailSent, setEmailSent] = useState(false);
	const [userEmail, setUserEmail] = useState("");

	const navigate = useNavigate();
	const location = useLocation();
	const { setPasswordResetEmail, setPasswordResetStep } = useAuthStore();

	// Pre-fill email if coming from login page
	const defaultEmail = location.state?.email || "";

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: defaultEmail,
		},
	});

	const onEmailSubmit = async (data: ForgotPasswordFormData) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await mockAuthApi.forgotPassword(data.email);

			if (response.success) {
				setUserEmail(data.email);
				setPasswordResetEmail(data.email);
				setPasswordResetStep("otp");
				setEmailSent(true);

				// Move to OTP step
				setCurrentStep("otp");
			} else {
				setError(
					response.error?.message ||
						"Failed to send reset email. Please try again."
				);
			}
		} catch (error) {
			console.error("Forgot password failed:", error);
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOtpSuccess = async () => {
		// In real implementation, the OTP verification would return a reset token
		// For now, we'll generate a mock token
		const mockResetToken = `verified-${Date.now()}-reset`;

		setPasswordResetStep("newPassword");
		setCurrentStep("success");

		// Redirect to reset password page with the token
		setTimeout(() => {
			navigate("/reset-password", {
				state: {
					resetToken: mockResetToken,
					email: userEmail,
					fromForgotPassword: true,
				},
			});
		}, 2000);
	};

	const handleOtpError = () => {
		setError("OTP verification failed. Please try again.");
		setCurrentStep("email");
	};

	const handleBackToLogin = () => {
		navigate("/login", { state: { email: userEmail || defaultEmail } });
	};

	// Render different steps
	if (currentStep === "otp") {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="fixed top-4 left-4">
					<button
						onClick={() => setCurrentStep("email")}
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
				<OtpVerificationStep
					onSubmit={handleOtpSuccess}
					onError={handleOtpError}
				/>
			</div>
		);
	}

	if (currentStep === "success") {
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
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-sm border">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
					<p className="mt-2 text-muted-foreground">
						Enter your email address and we'll send you a verification code.
					</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
						{error}
					</div>
				)}

				{emailSent && (
					<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
						Verification code sent! Please check your email.
					</div>
				)}

				<form
					onSubmit={handleSubmit(onEmailSubmit)}
					className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="email"
							className="text-sm font-medium">
							Email Address
						</label>
						<input
							id="email"
							type="email"
							{...register("email")}
							className="w-full p-3 border rounded-md focus:outline-none focus:border-orange-500"
							placeholder="Enter your email"
							disabled={isSubmitting}
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">
								{errors.email.message}
							</p>
						)}
					</div>

					<div className="pt-4 space-y-3">
						<button
							type="submit"
							disabled={!isValid || isSubmitting}
							className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
							{isSubmitting ? "Sending..." : "Send Verification Code"}
						</button>

						<button
							type="button"
							onClick={handleBackToLogin}
							className="w-full border border-gray-300 text-gray-700 p-3 rounded-md font-semibold hover:bg-gray-50 transition-colors">
							Back to Login
						</button>
					</div>
				</form>

				<div className="text-center text-sm text-gray-600">
					<p>
						Remember your password?{" "}
						<button
							onClick={handleBackToLogin}
							className="text-orange-500 hover:underline font-medium">
							Sign in
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
