import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	OtpInput,
	OtpInputHandle,
} from "@/features/auth/components/ui/OtpInput";
import { authApi } from "@/features/auth/api/authApi";

const otpSchema = z.object({
	otp: z
		.string()
		.length(6, "OTP must be 6 digits")
		.regex(/^\d{6}$/, "OTP must contain only digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface ForgotPasswordOtpProps {
	email: string;
	onSubmit: () => void;
	onError: () => void;
}

export default function ForgotPasswordOtp({
	email,
	onSubmit,
	onError,
}: ForgotPasswordOtpProps) {
	const otpRef = useRef<OtpInputHandle>(null);
	const [isVerifying, setIsVerifying] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isResending, setIsResending] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);

	const {
		setValue,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<OtpFormData>({
		resolver: zodResolver(otpSchema),
		mode: "onChange",
		defaultValues: {
			otp: "",
		},
	});

	// Cooldown timer for resend
	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(
				() => setResendCooldown(resendCooldown - 1),
				1000
			);
			return () => clearTimeout(timer);
		}
	}, [resendCooldown]);

	// Update react-hook-form value when OTP changes
	const handleOtpChange = (otp: string) => {
		setValue("otp", otp, { shouldValidate: true });
		setError(null); // Clear error when user types
	};

	const handleFormSubmit = async (data: OtpFormData) => {
		setIsVerifying(true);
		setError(null);

		try {
			// Use the forgot password specific OTP verification endpoint
			await authApi.verifyForgotPasswordOtp(email, data.otp);
			onSubmit();
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message || "Invalid or expired OTP";
			setError(errorMessage);

			// Clear OTP input on error
			otpRef.current?.clear();

			// If OTP is expired or invalid, allow immediate resend
			if (errorMessage.toLowerCase().includes("expired")) {
				setResendCooldown(0);
			}
		} finally {
			setIsVerifying(false);
		}
	};

	const handleResendOtp = async () => {
		if (resendCooldown > 0 || isResending) return;

		setIsResending(true);
		setError(null);

		try {
			// Resend forgot password OTP
			await authApi.forgotPassword(email);
			// Set 60 second cooldown
			setResendCooldown(60);
			// Clear the OTP input
			otpRef.current?.clear();
		} catch (error: any) {
			setError(error.response?.data?.message || "Failed to resend OTP");
		} finally {
			setIsResending(false);
		}
	};

	useEffect(() => {
		otpRef.current?.focus();
	}, []);

	const otpValue = watch("otp");
	const isOtpComplete = otpValue?.length === 6;

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#fff6f3] px-4">
			<div className="w-full max-w-md rounded-3xl bg-[#fff6f3] p-8 text-center">
				{/* Icon */}
				<div className="flex justify-center mb-6">
					<div className="w-20 h-20 rounded-full bg-[#ffe7dd] flex items-center justify-center">
						<svg
							className="w-10 h-10 text-orange-500"
							fill="currentColor"
							viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>

				<h2 className="text-2xl font-bold mb-2">Verify Password Reset Code</h2>
				<p className="text-gray-700 text-sm mb-1">
					We've sent a verification code to reset your password.
				</p>
				<p className="text-gray-700 text-sm mb-6">
					Please check your email and enter the code below:
				</p>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<OtpInput
						ref={otpRef}
						onChange={handleOtpChange}
						error={!!errors.otp || !!error}
						autoFocus
						disabled={isVerifying}
						className="mb-6"
					/>

					{errors.otp && !error && (
						<p className="text-sm text-red-500 mb-3">{errors.otp.message}</p>
					)}

					<button
						type="submit"
						disabled={!isOtpComplete || isVerifying}
						className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
							isOtpComplete && !isVerifying
								? "bg-[#fd6b21] hover:bg-orange-600"
								: "bg-gray-200 text-gray-400 cursor-not-allowed"
						}`}>
						{isVerifying ? "Verifying..." : "Submit"}
					</button>
				</form>

				{/* Resend Option */}
				<div className="mt-6 text-sm text-gray-600">
					<p>
						If you haven't received the code within a few minutes, check your
						spam folder.
					</p>
					<p className="mt-1">
						If you continue to have issues:{" "}
						<button
							type="button"
							onClick={handleResendOtp}
							disabled={resendCooldown > 0 || isResending}
							className={`font-semibold ${
								resendCooldown > 0 || isResending
									? "text-gray-400 cursor-not-allowed"
									: "text-orange-500 hover:underline"
							}`}>
							{isResending
								? "Sending..."
								: resendCooldown > 0
								? `Resend code (${resendCooldown}s)`
								: "Request a new code"}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
