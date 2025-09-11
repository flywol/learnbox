// src/features/auth/pages/login/LoginPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import AuthIllustration from "./components/AuthIllustration";
import SchoolDomainStep from "./components/SchoolDomainStep";
import LoginForm from "./components/LoginForm";

const CombinedSchoolLoginPage = () => {
	const [currentStep, setCurrentStep] = useState<"school" | "login">("school");
	const [isValidating, setIsValidating] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	// Get success message from navigation state
	const { message } = location.state || {};

	const {
		selectedRole,
		schoolDomain,
		setSchoolDomain,
		hasSeenOnboarding,
		login: loginAction,
		setFirstTimeLogin,
		intendedDestination,
		setIntendedDestination,
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

		try {
			// Call API using new auth client
			const response = await authApiClient.login(
				{
					email: data.email,
					password: data.password,
				},
				data.rememberMe || false
			);


			// Transform API user data to internal User type
			const userId = response.data.user.id || response.data.user._id;
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

			// Handle unverified users - redirect to OTP verification  
			// Simply redirect without setting tokens (keeps user unauthenticated)
			if (!transformedUser.isVerified) {
				try {
					// Auto-resend OTP for unverified users
					await authApiClient.resendOtp({
						email: transformedUser.email
					});
					
					// Navigate to OTP verification page (no authentication, no clearing)
					navigate("/verify-email", {
						state: {
							email: transformedUser.email,
							message: "Your account is not verified. Please enter the verification code we just sent to your email.",
							from: intendedDestination || "/dashboard",
						},
					});
				} catch (otpError) {
					// If OTP resend fails, still redirect but with error message
					navigate("/verify-email", {
						state: {
							email: transformedUser.email,
							message: "Your account is not verified. Please verify your email to continue.",
							error: "Failed to send verification code. Please try again.",
							from: intendedDestination || "/dashboard",
						},
					});
				}
				return; // Exit early - don't set tokens, don't authenticate
			}

			// Check for first-time login
			const isFirstTimeLogin = !!(
				transformedUser.resetPasswordToken &&
				transformedUser.resetPasswordToken.length > 0
			);
			if (isFirstTimeLogin) {
				setFirstTimeLogin(true, response.data.accessToken);
			}

			// Authenticate user in store
			loginAction(transformedUser);

			// Small delay to ensure state propagation
			setTimeout(() => {
				// Navigate based on user state
				if (isFirstTimeLogin) {
					navigate("/reset-password", {
						state: {
							resetToken: response.data.accessToken,
							email: transformedUser.email,
							from: intendedDestination || "/dashboard",
						},
						replace: true,
					});
				} else if (intendedDestination) {
					const destination = intendedDestination;
					setIntendedDestination(null);
					navigate(destination, { replace: true });
				} else if (hasSeenOnboarding) {
					navigate("/dashboard", { replace: true });
				} else {
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
				<SchoolDomainStep
					form={schoolForm}
					onSubmit={handleSchoolSubmit}
					isVisible={currentStep === "school"}
					isValidating={isValidating}
				/>

				<LoginForm
					form={loginForm}
					onSubmit={handleLoginSubmit}
					onForgotPassword={handleForgotPassword}
					onBackToSchool={handleBackToSchool}
					isVisible={currentStep === "login"}
					isLoggingIn={isLoggingIn}
					schoolDomain={schoolDomain}
					selectedRole={selectedRole!}
					message={message}
					loginError={loginError}
				/>
			</div>
		</div>
	);
};

export default CombinedSchoolLoginPage;
