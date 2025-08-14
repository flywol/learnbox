// src/features/auth/components/OtpVerification.tsx
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	OtpInput,
	OtpInputHandle,
} from "@/features/auth/components/ui/OtpInput";

const otpSchema = z.object({
	otp: z
		.string()
		.length(6, "OTP must be 6 digits")
		.regex(/^\d{6}$/, "OTP must contain only digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface OtpVerificationProps {
	email: string;
	onVerify: (otp: string) => Promise<void>;
	onResend: () => Promise<void>;
	onError: (error: string) => void;
	message?: string;
	initialError?: string;
}

export default function OtpVerification({
	email,
	onVerify,
	onResend,
	onError,
	message,
	initialError,
}: OtpVerificationProps) {
	const otpRef = useRef<OtpInputHandle>(null);
	const [isVerifying, setIsVerifying] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);
	const [apiError, setApiError] = useState<string | null>(initialError || null);

	const {
		setValue,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<OtpFormData>({
		resolver: zodResolver(otpSchema),
		mode: "onBlur",
		defaultValues: {
			otp: "",
		},
	});

	// Memoize computed values
	const otpValue = watch("otp");
	const isOtpComplete = useMemo(() => otpValue?.length === 6, [otpValue]);

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

	// Memoized handlers
	const handleOtpChange = useCallback(
		(otp: string) => {
			setValue("otp", otp);
			// Only clear API error when user is actually typing (not when input is cleared programmatically)
			if (apiError && otp.length > 0) {
				setApiError(null);
			}
		},
		[setValue, apiError]
	);

	const handleFormSubmit = useCallback(
		async (data: OtpFormData) => {
			setIsVerifying(true);
			setApiError(null); // Clear any previous API errors

			try {
				await onVerify(data.otp);
			} catch (error: any) {
				const errorMessage =
					error.response?.data?.message ||
					error.message ||
					"Invalid OTP. Please check and enter the correct code.";

				// Display the error in the UI FIRST
				setApiError(errorMessage);

				// Clear OTP input on error (do this after setting error)
				otpRef.current?.clear();

				// If OTP is expired or invalid, allow immediate resend
				if (errorMessage.toLowerCase().includes("expired")) {
					setResendCooldown(0);
				}

				// Notify parent of error
				onError(errorMessage);
			} finally {
				setIsVerifying(false);
			}
		},
		[onVerify, onError]
	);

	const handleResendOtp = useCallback(async () => {
		if (resendCooldown > 0 || isResending) return;

		setIsResending(true);
		setApiError(null); // Clear any previous API errors

		try {
			await onResend();
			// Set 60 second cooldown
			setResendCooldown(60);
			// Clear the OTP input
			otpRef.current?.clear();
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"Failed to resend verification code";
			
			// Display the error in the UI
			setApiError(errorMessage);
			onError(errorMessage);
		} finally {
			setIsResending(false);
		}
	}, [onResend, resendCooldown, isResending, onError]);

	// Focus on mount
	useEffect(() => {
		otpRef.current?.focus();
	}, []);

	// Memoize button states
	const isSubmitDisabled = useMemo(
		() => !isOtpComplete || isVerifying,
		[isOtpComplete, isVerifying]
	);

	const isResendDisabled = useMemo(
		() => resendCooldown > 0 || isResending,
		[resendCooldown, isResending]
	);

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

				<h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
				
				{/* Success message */}
				{message && (
					<div className="mb-4 p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
						<p className="text-green-700 text-sm font-medium">{message}</p>
					</div>
				)}
				
				<p className="text-gray-700 text-sm mb-1">
					A verification code has been sent to{" "}
					<span className="font-medium">{email}</span>.
				</p>
				<p className="text-gray-700 text-sm mb-6">
					Please check your inbox and enter the code below to continue:
				</p>

				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<OtpInput
						ref={otpRef}
						onChange={handleOtpChange}
						error={!!errors.otp || !!apiError}
						autoFocus
						disabled={isVerifying}
						className="mb-6"
					/>

					{(errors.otp || apiError) && (
						<p className="text-sm text-red-500 mb-3">
							{apiError || errors.otp?.message}
						</p>
					)}

					<button
						type="submit"
						disabled={isSubmitDisabled}
						className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
							!isSubmitDisabled
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
							disabled={isResendDisabled}
							className={`font-semibold ${
								isResendDisabled
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
