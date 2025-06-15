// src/features/auth/components/ui/OtpInput.tsx
import {
	useState,
	useRef,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";

interface OtpInputProps {
	length?: number;
	onComplete?: (otp: string) => void;
	onChange?: (otp: string) => void;
	disabled?: boolean;
	error?: boolean;
	autoFocus?: boolean;
	className?: string;
}

export interface OtpInputHandle {
	clear: () => void;
	focus: () => void;
	getValue: () => string;
}

/**
 * Reusable OTP Input Component
 *
 * Features:
 * - Configurable length (default 6)
 * - Auto-focus next input
 * - Paste support
 * - Backspace navigation
 * - Error state styling
 * - Imperative API for parent control
 */
export const OtpInput = forwardRef<OtpInputHandle, OtpInputProps>(
	(
		{
			length = 6,
			onComplete,
			onChange,
			disabled = false,
			error = false,
			autoFocus = true,
			className = "",
		},
		ref
	) => {
		const [values, setValues] = useState<string[]>(Array(length).fill(""));
		const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

		// Expose methods to parent
		useImperativeHandle(ref, () => ({
			clear: () => {
				setValues(Array(length).fill(""));
				inputRefs.current[0]?.focus();
			},
			focus: () => {
				inputRefs.current[0]?.focus();
			},
			getValue: () => values.join(""),
		}));

		useEffect(() => {
			// Auto-focus first input on mount if enabled
			if (autoFocus) {
				inputRefs.current[0]?.focus();
			}
		}, [autoFocus]);

		useEffect(() => {
			const otpString = values.join("");

			// Call onChange whenever values change
			onChange?.(otpString);

			// Call onComplete when all digits are entered
			if (otpString.length === length && !values.includes("")) {
				onComplete?.(otpString);
			}
		}, [values, length, onChange, onComplete]);

		const handleChange = (index: number, value: string) => {
			// Only allow single digit
			if (value.length > 1) {
				value = value[0];
			}

			// Only allow numbers
			if (value && !/^\d$/.test(value)) {
				return;
			}

			const newValues = [...values];
			newValues[index] = value;
			setValues(newValues);

			// Auto-focus next input
			if (value && index < length - 1) {
				inputRefs.current[index + 1]?.focus();
			}
		};

		const handleKeyDown = (
			index: number,
			e: React.KeyboardEvent<HTMLInputElement>
		) => {
			// Handle backspace
			if (e.key === "Backspace") {
				e.preventDefault();

				if (values[index]) {
					// Clear current input
					const newValues = [...values];
					newValues[index] = "";
					setValues(newValues);
				} else if (index > 0) {
					// Move to previous input and clear it
					const newValues = [...values];
					newValues[index - 1] = "";
					setValues(newValues);
					inputRefs.current[index - 1]?.focus();
				}
			}

			// Handle arrow keys
			if (e.key === "ArrowLeft" && index > 0) {
				inputRefs.current[index - 1]?.focus();
			}
			if (e.key === "ArrowRight" && index < length - 1) {
				inputRefs.current[index + 1]?.focus();
			}
		};

		const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
			e.preventDefault();
			const pastedData = e.clipboardData.getData("text");
			const digits = pastedData.replace(/\D/g, "").slice(0, length);

			if (digits) {
				const newValues = [...values];
				digits.split("").forEach((digit, idx) => {
					if (idx < length) {
						newValues[idx] = digit;
					}
				});
				setValues(newValues);

				// Focus the next empty input or the last input
				const nextEmptyIndex = newValues.findIndex((val) => !val);
				const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
				inputRefs.current[focusIndex]?.focus();
			}
		};

		const handleFocus = (index: number) => {
			// Select the content when focused
			inputRefs.current[index]?.select();
		};

		return (
			<div className={`flex gap-2 justify-center ${className}`}>
				{values.map((value, index) => (
					<input
						key={index}
						ref={(el) => {
							inputRefs.current[index] = el;
						}}
						type="text"
						inputMode="numeric"
						value={value}
						onChange={(e) => handleChange(index, e.target.value)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						onPaste={index === 0 ? handlePaste : undefined}
						onFocus={() => handleFocus(index)}
						disabled={disabled}
						maxLength={1}
						className={`
						w-12 h-14 text-2xl font-bold text-center border-2 rounded-lg 
						transition-all duration-200
						${
							error
								? "border-red-500 focus:border-red-600"
								: "border-gray-300 focus:border-orange-500"
						}
						${
							disabled
								? "bg-gray-100 cursor-not-allowed"
								: "bg-white hover:border-gray-400"
						}
						focus:outline-none focus:ring-2 focus:ring-orange-500/20
					`}
						aria-label={`OTP digit ${index + 1}`}
					/>
				))}
			</div>
		);
	}
);

OtpInput.displayName = "OtpInput";
