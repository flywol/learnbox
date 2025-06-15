import { useEffect, useRef } from "react";
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

interface OtpVerificationStepProps {
	onSubmit: () => void;
	onError: () => void;
}

export default function OtpVerificationStep({
	onSubmit,
}: OtpVerificationStepProps) {
	const otpRef = useRef<OtpInputHandle>(null);

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

	// Update react-hook-form value when OTP changes
	const handleOtpChange = (otp: string) => {
		setValue("otp", otp, { shouldValidate: true });
	};

	const handleFormSubmit = (data: OtpFormData) => {
		console.log("Submitted OTP:", data.otp);
		onSubmit();
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

				<h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
				<p className="text-gray-700 text-sm mb-1">
					A one-time password (OTP) has been sent to your email address.
				</p>
				<p className="text-gray-700 text-sm mb-6">
					Please check your inbox and enter the OTP below to confirm your
					account:
				</p>

				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<OtpInput
						ref={otpRef}
						onChange={handleOtpChange}
						error={!!errors.otp}
						autoFocus
						className="mb-6"
					/>

					{errors.otp && (
						<p className="text-sm text-red-500 mb-3">{errors.otp.message}</p>
					)}

					<button
						type="submit"
						disabled={!isOtpComplete}
						className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
							isOtpComplete
								? "bg-[#fd6b21] hover:bg-orange-600"
								: "bg-gray-200 text-gray-400 cursor-not-allowed"
						}`}>
						Submit
					</button>
				</form>

				{/* Resend Option */}
				<div className="mt-6 text-sm text-gray-600">
					<p>
						If you haven't received the OTP within a few minutes, check your
						spam folder.
					</p>
					<p className="mt-1">
						If you continue to have issues:{" "}
						<button
							type="button"
							onClick={() => {
								otpRef.current?.clear();
								console.log("Resend OTP triggered");
							}}
							className="text-orange-500 font-semibold hover:underline">
							Request a new OTP
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
