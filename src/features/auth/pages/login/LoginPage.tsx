// src/features/auth/pages/login/LoginPage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import { mockAuthApi } from "../../api/mockAuthApi";
import { LoginFormData, SchoolSetupFormData } from "../../schemas/authSchema";

// Validation schemas
const schoolSetupSchema = z.object({
	schoolUrl: z
		.string()
		.min(1, { message: "Please enter your school's URL" })
		.refine(
			(url) => {
				const urlPattern = /^(https?:\/\/)?([\w\-]+\.)*[\w\-]+\.[a-z]{2,}$/i;
				return urlPattern.test(url);
			},
			{ message: "Please enter a valid school URL" }
		),
});

const loginSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
});

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
	const location = useLocation();
	const {
		selectedRole,
		schoolDomain,
		setSchoolDomain,
		hasSeenOnboarding,
		login: loginAction,
		setFirstTimeLogin,
		intendedDestination,
		setIntendedDestination,
	} = useAuthStore();

	// School setup form
	const schoolForm = useForm<SchoolSetupFormData>({
		resolver: zodResolver(schoolSetupSchema),
		defaultValues: {
			schoolUrl: schoolDomain || "",
		},
	});

	// Login form
	const loginForm = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	// Redirect if no role selected
	if (!selectedRole) {
		navigate("/");
		return null;
	}

	// If school domain is already set, go directly to login
	if (schoolDomain && currentStep === "school") {
		setCurrentStep("login");
	}

	const handleSchoolSubmit = async (data: SchoolSetupFormData) => {
		setIsValidating(true);

		try {
			const response = await mockAuthApi.validateSchool(data.schoolUrl);

			if (response.success && response.data) {
				setSchoolDomain(data.schoolUrl);
				// Wait a brief moment then slide to login
				setTimeout(() => {
					setCurrentStep("login");
				}, 300);
			} else {
				schoolForm.setError("schoolUrl", {
					type: "manual",
					message:
						response.error?.message ||
						"School not found. Please check the URL and try again.",
				});
			}
		} catch (error) {
			console.error("School validation failed:", error);
			schoolForm.setError("schoolUrl", {
				type: "manual",
				message: "Unable to validate school. Please try again.",
			});
		} finally {
			setIsValidating(false);
		}
	};

	const handleLoginSubmit = async (data: LoginFormData) => {
		if (!schoolDomain || !selectedRole) return;

		setIsLoggingIn(true);
		setLoginError(null);

		try {
			const response = await mockAuthApi.login(
				data.email,
				data.password,
				selectedRole,
				schoolDomain
			);

			if (response.success && response.data) {
				const { user, isFirstTimeLogin, resetToken } = response.data;

				// Set login context for first-time users
				if (isFirstTimeLogin && resetToken) {
					setFirstTimeLogin(true, resetToken);
				}

				// Log the user in
				loginAction(user);

				// Navigation logic
				if (isFirstTimeLogin && resetToken) {
					// First-time users go to password reset
					navigate("/reset-password", {
						state: {
							resetToken,
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
			} else {
				setLoginError(
					response.error?.message ||
						"Login failed. Please check your credentials."
				);
			}
		} catch (error) {
			console.error("Login failed:", error);
			setLoginError("An unexpected error occurred. Please try again.");
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
