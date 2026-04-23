import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "../../../schemas/authSchema";
import PasswordInput from "@/features/auth/components/PasswordInput";

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
	form: UseFormReturn<LoginFormValues>;
	onSubmit: (data: LoginFormValues) => Promise<void>;
	onForgotPassword: () => void;
	onBackToSchool: () => void;
	isVisible: boolean;
	isLoggingIn: boolean;
	schoolDomain: string | null;
	selectedRole: string;
	message?: string;
	loginError?: string | null;
}

export default function LoginForm({
	form,
	onSubmit,
	onForgotPassword,
	onBackToSchool,
	isVisible,
	isLoggingIn,
	message,
	loginError,
}: LoginFormProps) {
	return (
		<div
			className={`w-full max-w-[480px] absolute transition-transform duration-500 ease-in-out ${
				isVisible ? "translate-x-0" : "translate-x-full opacity-0 pointer-events-none"
			}`}
		>
			<div className="border border-[#e6e6e6] rounded-2xl p-10 flex flex-col gap-16 items-center">
				{/* Header */}
				<div className="flex flex-col gap-2 items-center text-center text-[#2b2b2b]">
					<h1 className="text-5xl font-bold leading-[1.4]">Sign In</h1>
					<p className="text-xl font-normal">Sign in to stay connected.</p>
				</div>

				{/* Alerts */}
				{message && (
					<div className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
						{message}
					</div>
				)}
				{loginError && (
					<div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
						{loginError}
					</div>
				)}

				{/* Form */}
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
					{/* Email */}
					<div>
						<input
							id="email"
							type="email"
							{...form.register("email")}
							className="w-full h-14 px-4 border border-[#969696] rounded-lg text-base placeholder:text-[#838383] focus:outline-none focus:border-[#fd5d26] transition-colors"
							placeholder="Email"
							disabled={isLoggingIn}
						/>
						{form.formState.errors.email && (
							<p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
						)}
					</div>

					{/* Password */}
					<div className="flex flex-col gap-1">
						<PasswordInput
							id="password"
							name="password"
							register={form.register}
							placeholder="Password"
							disabled={isLoggingIn}
							error={!!form.formState.errors.password}
							className="w-full h-14 px-4 border border-[#969696] rounded-lg text-base placeholder:text-[#838383] focus:outline-none focus:border-[#fd5d26] transition-colors"
						/>
						{form.formState.errors.password && (
							<p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
						)}
						<div className="flex items-center justify-between text-sm text-[#2b2b2b]">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									{...form.register("rememberMe")}
									className="w-4 h-4 border border-[#6b6b6b] rounded"
								/>
								Remember me
							</label>
							<button
								type="button"
								onClick={onForgotPassword}
								className="text-[#2b2b2b] hover:text-[#fd5d26] text-right"
							>
								Forgot password
							</button>
						</div>
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={isLoggingIn}
						className="w-full bg-[#fd5d26] text-white py-[17px] rounded-2xl text-xl font-semibold hover:bg-[#e84d17] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
					>
						{isLoggingIn ? "Signing in..." : "Login"}
					</button>
				</form>

				{/* Back */}
				<button
					type="button"
					onClick={onBackToSchool}
					disabled={isLoggingIn}
					className="text-sm text-[#838383] hover:text-[#2b2b2b] transition-colors"
				>
					← Change school
				</button>
			</div>
		</div>
	);
}
