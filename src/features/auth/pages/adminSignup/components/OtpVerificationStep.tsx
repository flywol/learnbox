import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
	onError,
}: OtpVerificationStepProps) {
	const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const {
		setValue,
		handleSubmit,
		formState: { isValid },
	} = useForm<OtpFormData>({
		resolver: zodResolver(otpSchema),
		mode: "onChange",
		defaultValues: {
			otp: "",
		},
	});

	useEffect(() => {
		// Update form value when OTP values change
		const otpString = otpValues.join("");
		setValue("otp", otpString, { shouldValidate: true });
	}, [otpValues, setValue]);

	const handleOtpChange = (index: number, value: string) => {
		if (value.length <= 1 && /^\d*$/.test(value)) {
			const newOtp = [...otpValues];
			newOtp[index] = value;
			setOtpValues(newOtp);

			// Auto-focus next input
			if (value && index < 5) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Backspace" && !otpValues[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text");
		const digits = pastedData.replace(/\D/g, "").slice(0, 6);

		if (digits) {
			const newOtp = [...otpValues];
			digits.split("").forEach((digit, index) => {
				if (index < 6) {
					newOtp[index] = digit;
				}
			});
			setOtpValues(newOtp);

			// Focus the next empty input or the last input
			const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
			const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
			inputRefs.current[focusIndex]?.focus();
		}
	};

	const onFormSubmit = (data: OtpFormData) => {
		// Since APIs aren't ready, accept any complete 6-digit OTP
		onSubmit();
	};

	const handleRequestNewOtp = () => {
		// Clear OTP inputs
		setOtpValues(["", "", "", "", "", ""]);
		// Focus first input
		inputRefs.current[0]?.focus();
		// In real implementation, this would also trigger a new OTP request
		console.log("Requesting new OTP...");
	};

	useEffect(() => {
		// Focus first input on mount
		inputRefs.current[0]?.focus();
	}, []);

	const isOtpComplete = otpValues.every((digit) => digit !== "");

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-2xl px-8">
				<div className="bg-white rounded-lg shadow-sm p-12">
					<div className="flex justify-center mb-8">
						<div className="w-20 h-20 bg-cyan-400 rounded-lg flex items-center justify-center">
							<svg
								className="w-10 h-10 text-white"
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

					<h2 className="text-3xl font-bold text-center mb-4">Verify OTP</h2>
					<p className="text-center text-gray-600 mb-2">
						A one-time password (OTP) has been sent to your email address.
					</p>
					<p className="text-center text-gray-600 mb-8">
						Please check your inbox and enter the OTP below to confirm your
						account.
					</p>

					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className="flex justify-center gap-3 mb-8">
							{otpValues.map((digit, index) => (
								<input
									key={index}
									ref={(el) => {
										inputRefs.current[index] = el;
									}}
									type="text"
									value={digit}
									onChange={(e) => handleOtpChange(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									onPaste={index === 0 ? handlePaste : undefined}
									maxLength={1}
									className="w-14 h-14 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
								/>
							))}
						</div>

						<button
							type="submit"
							disabled={!isOtpComplete}
							className={`w-full py-4 rounded-full font-semibold text-lg transition-colors ${
								isOtpComplete
									? "bg-orange-500 text-white hover:bg-orange-600"
									: "bg-gray-200 text-gray-400 cursor-not-allowed"
							}`}>
							Submit
						</button>
					</form>

					<div className="text-center mt-8">
						<p className="text-gray-600">
							If you haven't received the OTP within a few minutes, please check
							your spam folder.
						</p>
						<p className="text-gray-600 mt-2">
							If you continue to have issues:{" "}
							<button
								type="button"
								onClick={handleRequestNewOtp}
								className="text-orange-500 font-semibold hover:underline">
								Request a new OTP
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
