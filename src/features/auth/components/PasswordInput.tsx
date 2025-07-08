import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
	id?: string;
	name: string;
	placeholder?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	className?: string;
	error?: boolean;
	register?: any;
}

export default function PasswordInput({
	id,
	name,
	placeholder = "Password",
	disabled = false,
	className = "",
	error = false,
	register,
	...props
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const baseClassName = `w-full p-3 pr-10 border rounded-md focus:outline-none focus:border-orange-500 ${
		error ? "border-red-500" : "border-gray-300"
	} ${disabled ? "bg-gray-100" : ""} ${className}`;

	return (
		<div className="relative">
			<input
				id={id}
				type={showPassword ? "text" : "password"}
				placeholder={placeholder}
				disabled={disabled}
				className={baseClassName}
				{...(register ? register(name) : props)}
			/>
			<button
				type="button"
				onClick={togglePasswordVisibility}
				disabled={disabled}
				className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{showPassword ? (
					<EyeOff className="w-5 h-5" />
				) : (
					<Eye className="w-5 h-5" />
				)}
			</button>
		</div>
	);
}