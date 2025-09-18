// src/features/auth/pages/password/ResetPassword.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	resetPasswordSchema,
	ResetPasswordFormData,
} from "../../schemas/authSchema";
import { useAuthStore } from "../../store/authStore";
import { usePasswordReset } from "../../hooks/usePasswordReset";

// Illustration component that stays static during transition
const AuthIllustration = () => (
	<div className="hidden lg:flex lg:w-1/2 bg-[#FFEFE980] items-center justify-center p-8">
		<div className="w-full max-w-md">
			<img
				className="w-[710px] h-[560px] object-contain"
				src="/images/illustration.svg"
				alt="illustration"
			/>
		</div>
	</div>
);

const ResetPasswordPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isResetting, setIsResetting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { loginContext, user, logout } = useAuthStore();
	const { resetPassword } = usePasswordReset();

	// Get email from location state (from forgot password flow)
	const userEmail = location.state?.email || user?.email;
	const isFromForgotPassword = location.state?.fromForgotPassword || false;

	// For first-time login, we use the token from login response
	// For forgot password, email verification has already happened
	const isFirstTimeLogin =
		loginContext.isFirstTimeLogin && !isFromForgotPassword;

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onChange",
	});

	const password = watch("password");

	// Redirect if no email available
	useEffect(() => {
		if (!userEmail) {
			navigate("/login");
		}
	}, [userEmail, navigate]);

	// Password strength indicator
	const getPasswordStrength = (pwd: string) => {
		if (!pwd) return { strength: 0, label: "" };

		let strength = 0;
		if (pwd.length >= 8) strength++;
		if (/[0-9]/.test(pwd)) strength++;
		if (/[^A-Za-z0-9]/.test(pwd)) strength++;
		if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++;

		const labels = ["", "Weak", "Fair", "Good", "Strong"];
		return { strength, label: labels[strength] };
	};

	const passwordStrength = getPasswordStrength(password || "");

	const onSubmit = async (data: ResetPasswordFormData) => {
		if (!userEmail) {
			setError("Email not found. Please start the process again.");
			return;
		}

		setIsResetting(true);
		setError(null);

		try {
			const success = await resetPassword(data.password, data.confirmPassword);
			
			if (!success) {
				throw new Error("Password reset failed");
			}

			// For first-time login, they're already logged in, just redirect
			if (isFirstTimeLogin) {
				navigate("/dashboard");
			} else {
				// For forgot password, they need to login again
				logout();

				// Show success message and redirect to login
				alert(
					"Password reset successful! Please login with your new password."
				);
				navigate("/login");
			}
		} catch (error: any) {
			setError(error.message || "Failed to reset password. Please try again.");
		} finally {
			setIsResetting(false);
		}
	};

	if (!userEmail) {
		return null; // Will redirect in useEffect
	}

	return (
		<div className="flex min-h-screen bg-white">
			<AuthIllustration />
			<div className="flex flex-1 flex-col justify-center items-center p-6 sm:p-8">
				<div className="w-full max-w-sm space-y-6">
					<div className="text-center">
						<h1 className="text-3xl font-bold tracking-tight">
							Reset Password
						</h1>
						{isFirstTimeLogin ? (
							<p className="mt-2 text-muted-foreground">
								Welcome! Please create a new password for your account.
							</p>
						) : (
							<p className="mt-2 text-muted-foreground">
								Enter your new password below.
							</p>
						)}
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
							{error}
						</div>
					)}

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="password"
								className="text-sm font-medium block text-gray-700">
								New Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									{...register("password")}
									className="w-full p-3 pr-10 border rounded-md"
									placeholder="Enter new password"
									disabled={isResetting}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
									{showPassword ? "Hide" : "Show"}
								</button>
							</div>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">
									{errors.password.message}
								</p>
							)}
							{password && (
								<div className="mt-2">
									<div className="flex items-center gap-2">
										<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
											<div
												className={`h-full transition-all ${
													passwordStrength.strength === 1
														? "bg-red-500 w-1/4"
														: passwordStrength.strength === 2
														? "bg-yellow-500 w-2/4"
														: passwordStrength.strength === 3
														? "bg-blue-500 w-3/4"
														: passwordStrength.strength === 4
														? "bg-green-500 w-full"
														: "w-0"
												}`}
											/>
										</div>
										<span
											className={`text-sm font-medium ${
												passwordStrength.strength === 1
													? "text-red-500"
													: passwordStrength.strength === 2
													? "text-yellow-500"
													: passwordStrength.strength === 3
													? "text-blue-500"
													: passwordStrength.strength === 4
													? "text-green-500"
													: "text-gray-400"
											}`}>
											{passwordStrength.label}
										</span>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Use 8+ characters with numbers and special characters
									</p>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<label
								htmlFor="confirmPassword"
								className="text-sm font-medium block text-gray-700">
								Confirm New Password
							</label>
							<div className="relative">
								<input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									{...register("confirmPassword")}
									className="w-full p-3 pr-10 border rounded-md"
									placeholder="Confirm new password"
									disabled={isResetting}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
									{showConfirmPassword ? "Hide" : "Show"}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="text-red-500 text-sm mt-1">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						<button
							type="submit"
							disabled={!isValid || isResetting}
							className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
							{isResetting ? "Resetting Password..." : "Reset Password"}
						</button>
					</form>

					{isFirstTimeLogin && (
						<div className="text-center text-sm text-gray-600">
							<p>
								This is a one-time setup. After resetting your password, you'll
								be able to access your dashboard.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordPage;
