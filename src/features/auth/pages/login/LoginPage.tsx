// src/features/auth/pages/login/LoginPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import { authApi } from "../../api/authApi";
import { loginSchema, SchoolSetupFormData, schoolSetupSchema } from "../../schemas/authSchema";



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

const CombinedSchoolLoginPage = () => {
	const [currentStep, setCurrentStep] = useState<"school" | "login">("school");
	const [isValidating, setIsValidating] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const navigate = useNavigate();

	const {
		selectedRole,
		schoolDomain,
		setSchoolDomain,
		hasSeenOnboarding,
		login: loginAction,
		setFirstTimeLogin,
		intendedDestination,
		setIntendedDestination,
		setPasswordResetEmail,
		setPasswordResetStep,
	} = useAuthStore();

	// School setup form
	const schoolForm = useForm<SchoolSetupFormData>({
		resolver: zodResolver(schoolSetupSchema),
		defaultValues: {
			schoolUrl: schoolDomain || "",
		},
	});

	// Login form - updated type
	type LoginFormValues = z.infer<typeof loginSchema>;
	const loginForm = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			rememberMe: false,
		},
	});

	// Redirect if no role selected
	useEffect(() => {
		if (!selectedRole) {
			navigate("/");
		}
	}, [selectedRole, navigate]);

	// If school domain is already set, go directly to login
	useEffect(() => {
		if (schoolDomain && currentStep === "school") {
			setCurrentStep("login");
		}
	}, [schoolDomain]); // Don't include currentStep to avoid infinite loop

	const handleSchoolSubmit = async (data: SchoolSetupFormData) => {
		// Skip validation for admin signup
		if (selectedRole === "ADMIN") {
			setSchoolDomain(data.schoolUrl);
			navigate("/signup");
			return;
		}

		setIsValidating(true);
		setLoginError(null);

		try {
			const response = await authApi.verifyDomain(data.schoolUrl);
			if (response.data) {
				setSchoolDomain(data.schoolUrl);
				// Wait a brief moment then slide to login
				setTimeout(() => {
					setCurrentStep("login");
				}, 300);
			}
		} catch (error: any) {
			schoolForm.setError("schoolUrl", {
				type: "manual",
				message:
					error.response?.data?.message ||
					"School not found. Please check the URL and try again.",
			});
		} finally {
			setIsValidating(false);
		}
	};

	const handleLoginSubmit = async (data: LoginFormValues) => {
		if (!schoolDomain || !selectedRole) return;

		setIsLoggingIn(true);
		setLoginError(null);

		try {
			const response = await authApi.login(
				data.email,
				data.password,
				data.rememberMe || false
			);
			const { user, tokens } = response.data;

			// Check if user needs email verification
			if (!user.isVerified) {
				// Don't complete login yet - user needs to verify email
				setPasswordResetEmail(user.email);
				setPasswordResetStep("otp");

				// Navigate to email verification
				navigate("/verify-email", {
					state: {
						user: user,
						tokens: tokens,
						from: intendedDestination || "/dashboard",
					},
				});
				return;
			}

			// Check if this is a first-time login (backend should indicate this)
			// For now, we'll assume if user has a certain flag or pattern
			// TODO: Update this based on actual backend response
			const isFirstTimeLogin = false; // Backend should provide this

			// Set login context for first-time users
			if (isFirstTimeLogin) {
				setFirstTimeLogin(true, tokens.accessToken);
			}

			// Log the user in
			loginAction(user);

			// Navigation logic for verified users
			if (isFirstTimeLogin) {
				// First-time users go to password reset
				navigate("/reset-password", {
					state: {
						resetToken: tokens.accessToken,
						email: user.email,
						from: intendedDestination || "/dashboard",
					},
				});
			} else if (intendedDestination) {
				// Go to intended destination
				const destination = intendedDestination;
				setIntendedDestination(null); // Clear it
				navigate(destination);
			} else if (hasSeenOnboarding) {
				// Regular users who've completed onboarding
				navigate("/dashboard");
			} else {
				// New users who need onboarding
				navigate("/onboarding");
			}
		} catch (error: any) {
			setLoginError(
				error.response?.data?.message ||
					"Login failed. Please check your credentials."
			);
		} finally {
			setIsLoggingIn(false);
		}
	};

	const handleBackToSchool = () => {
		setCurrentStep("school");
		setLoginError(null);
	};

	const handleForgotPassword = () => {
		navigate("/forgot-password", {
			state: { email: loginForm.getValues("email") },
		});
	};

	if (!selectedRole) {
		return null; // Will redirect in useEffect
	}

	return (
		<div className="flex min-h-screen bg-white">
			<AuthIllustration />
			<div className="flex flex-1 flex-col justify-center items-center p-6 sm:p-8 relative overflow-hidden">
				{/* School Setup Form */}
				<div
					className={`w-full max-w-sm space-y-6 absolute transition-transform duration-500 ease-in-out ${
						currentStep === "school"
							? "translate-x-0"
							: "-translate-x-full opacity-0"
					}`}>
					<div className="text-center">
						<h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
						<p className="mt-2 text-muted-foreground">
							Sign in to stay connected.
						</p>
					</div>

					<form
						onSubmit={schoolForm.handleSubmit(handleSchoolSubmit)}
						className="space-y-4">
						<div className="space-y-2">
							<input
								id="schoolUrl"
								type="text"
								{...schoolForm.register("schoolUrl")}
								className="w-full p-3 border rounded-md"
								placeholder="Input school domain"
								disabled={isValidating}
							/>
							{schoolForm.formState.errors.schoolUrl && (
								<p className="text-red-500 text-sm mt-1">
									{schoolForm.formState.errors.schoolUrl.message}
								</p>
							)}
						</div>

						<div className="text-right">
							<a
								href="#"
								className="text-sm text-gray-500 hover:text-gray-700">
								Need help?
							</a>
						</div>

						<button
							type="submit"
							disabled={isValidating}
							className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
							{isValidating ? "Validating..." : "Next"}
						</button>
					</form>

					{/* Show Create Account link only for ADMIN role */}
					{selectedRole === "ADMIN" && (
						<div className="text-center">
							<button
								type="button"
								onClick={() => {
									if (schoolForm.getValues("schoolUrl")) {
										setSchoolDomain(schoolForm.getValues("schoolUrl"));
									}
									navigate("/signup");
								}}
								className="text-sm text-gray-500 hover:text-gray-700"
								disabled={isValidating}>
								Create your school
							</button>
						</div>
					)}
				</div>

				{/* Login Form */}
				<div
					className={`w-full max-w-sm space-y-6 absolute transition-transform duration-500 ease-in-out ${
						currentStep === "login"
							? "translate-x-0"
							: "translate-x-full opacity-0"
					}`}>
					<div className="text-center">
						<h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
						<p className="mt-2 text-muted-foreground">
							Sign in to stay connected.
						</p>
						{schoolDomain && (
							<p className="mt-1 text-sm text-gray-600">
								{schoolDomain} • {selectedRole.toLowerCase()}
							</p>
						)}
					</div>

					{loginError && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
							{loginError}
						</div>
					)}

					<form
						onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
						className="space-y-4">
						<div className="space-y-2">
							<input
								id="email"
								type="email"
								{...loginForm.register("email")}
								className="w-full p-3 border rounded-md"
								placeholder="Email"
								disabled={isLoggingIn}
							/>
							{loginForm.formState.errors.email && (
								<p className="text-red-500 text-sm mt-1">
									{loginForm.formState.errors.email.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<input
								id="password"
								type="password"
								{...loginForm.register("password")}
								className="w-full p-3 border rounded-md"
								placeholder="Password"
								disabled={isLoggingIn}
							/>
							{loginForm.formState.errors.password && (
								<p className="text-red-500 text-sm mt-1">
									{loginForm.formState.errors.password.message}
								</p>
							)}
						</div>

						<div className="flex items-center justify-between text-sm">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									{...loginForm.register("rememberMe")}
									className="rounded"
								/>
								Remember me
							</label>
							<button
								type="button"
								onClick={handleForgotPassword}
								className="text-gray-500 hover:text-gray-700">
								Forgot password?
							</button>
						</div>

						<button
							type="submit"
							disabled={isLoggingIn}
							className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
							{isLoggingIn ? "Signing in..." : "Login"}
						</button>
					</form>

					<div className="text-center">
						<button
							type="button"
							onClick={handleBackToSchool}
							className="text-sm text-gray-500 hover:text-gray-700"
							disabled={isLoggingIn}>
							← Change school
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CombinedSchoolLoginPage;
