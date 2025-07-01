// src/features/auth/pages/login/LoginPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import {
	loginSchema,
	SchoolSetupFormData,
	schoolSetupSchema,
} from "../../schemas/authSchema";
import { authApiClient } from "../../api/authApiClient";

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
		verifySchoolDomain,
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
		setIsValidating(true);
		setLoginError(null);

		try {
			// All roles need to verify the school domain
			const isValid = await verifySchoolDomain(data.schoolUrl);

			if (isValid) {
				setSchoolDomain(data.schoolUrl);
				// Wait a brief moment then slide to login
				setTimeout(() => {
					setCurrentStep("login");
				}, 300);
			} else {
				schoolForm.setError("schoolUrl", {
					type: "manual",
					message: "School not found. Please check the URL and try again.",
				});
			}
		} catch (error: any) {
			console.error("School validation failed:", error);
			schoolForm.setError("schoolUrl", {
				type: "manual",
				message:
					error.message || "Unable to validate school. Please try again.",
			});
		} finally {
			setIsValidating(false);
		}
	};

	const handleLoginSubmit = async (data: LoginFormValues) => {
		if (!schoolDomain || !selectedRole) return;

		setIsLoggingIn(true);
		setLoginError(null);
		console.log("🔐 Starting login process...");

		try {
			// Call API using new auth client
			const response = await authApiClient.login(
				{
					email: data.email,
					password: data.password,
				},
				data.rememberMe || false
			);

			console.log("✅ Login API successful:", {
				hasUser: !!response.data.user,
				hasTokens: !!(response.data.accessToken && response.data.refreshToken),
				userVerified: response.data.user.isVerified,
			});

			// Transform API user data to internal User type
			const userId = response.data.user.id || response.data.user.id;
			if (!userId) {
				throw new Error("User ID is required");
			}

			const transformedUser = {
				id: userId,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				deleted_at: "",
				fullName:
					response.data.user.firstName && response.data.user.lastName
						? `${response.data.user.firstName} ${response.data.user.lastName}`
						: response.data.user.fullName || "",
				phoneNumber:
					response.data.user.phone || response.data.user.phoneNumber || "",
				email: response.data.user.email,
				role: response.data.user.role,
				isVerified: response.data.user.isVerified ?? true,
				isActive: response.data.user.isActive ?? true,
				isDeleted: false,
				otp: "",
				otpExpiration: "",
				resetPasswordToken: response.data.user.resetPasswordToken || "",
				resetPasswordExpires: "",
			};

			// Handle unverified users
			if (!transformedUser.isVerified) {
				console.log("📧 User needs email verification");
				setPasswordResetEmail(transformedUser.email);
				setPasswordResetStep("otp");
				navigate("/verify-email", {
					state: {
						user: transformedUser,
						from: intendedDestination || "/dashboard",
					},
				});
				return;
			}

			// Check for first-time login
			const isFirstTimeLogin = !!(
				transformedUser.resetPasswordToken &&
				transformedUser.resetPasswordToken.length > 0
			);
			if (isFirstTimeLogin) {
				console.log("🆕 First-time login detected");
				setFirstTimeLogin(true, response.data.accessToken);
			}

			// Authenticate user in store
			console.log("🔐 Authenticating user in store...");
			loginAction(transformedUser);

			// Small delay to ensure state propagation
			setTimeout(() => {
				// Navigate based on user state
				if (isFirstTimeLogin) {
					console.log("➡️ Redirecting to password reset");
					navigate("/reset-password", {
						state: {
							resetToken: response.data.accessToken,
							email: transformedUser.email,
							from: intendedDestination || "/dashboard",
						},
						replace: true,
					});
				} else if (intendedDestination) {
					console.log(
						"➡️ Redirecting to intended destination:",
						intendedDestination
					);
					const destination = intendedDestination;
					setIntendedDestination(null);
					navigate(destination, { replace: true });
				} else if (hasSeenOnboarding) {
					console.log("➡️ Redirecting to dashboard");
					navigate("/dashboard", { replace: true });
				} else {
					console.log("➡️ Redirecting to onboarding");
					navigate("/onboarding", { replace: true });
				}
			}, 100);
		} catch (error: any) {
			console.error("❌ Login failed:", error);
			setLoginError(
				error.message || "Login failed. Please check your credentials."
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

					{/* No admin-specific logic needed here anymore - handled in SchoolSetupPage */}
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
