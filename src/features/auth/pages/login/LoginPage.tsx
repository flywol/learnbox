// src/features/auth/pages/login/LoginPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import { useAuth } from "../../hooks/useAuth";
import {
	loginSchema,
	SchoolSetupFormData,
	schoolSetupSchema,
} from "../../schemas/authSchema";
import { normalizeSchoolUrl } from "../../utils/authHelpers";
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
		intendedDestination,
		setIntendedDestination,
		verifySchoolDomain,
	} = useAuthStore();

	// Use the auth hook which has the factory pattern
	const { login: authLogin } = useAuth();

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
			// Normalize the school URL (add https:// if not present)
			const normalizedUrl = normalizeSchoolUrl(data.schoolUrl);

			// All roles need to verify the school domain
			const isValid = await verifySchoolDomain(normalizedUrl);

			if (isValid) {
				setSchoolDomain(normalizedUrl);
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
			// Use the auth hook which includes the factory pattern
			const result = await authLogin(data.email, data.password, data.rememberMe || false);

			if (result.success && result.user) {

				// Handle unverified users
				if (!result.user.isVerified) {
					// TODO: Handle OTP verification flow
					navigate("/verify-email", {
						state: {
							email: result.user.email,
							message: "Your account is not verified. Please verify your email to continue.",
							from: intendedDestination || "/dashboard",
						},
					});
					return;
				}

				// Ensure auth state is properly set before navigation
				const checkAndNavigate = () => {
					const currentAuthState = useAuthStore.getState();
					
					// Verify that authentication state is properly set
					if (currentAuthState.isAuthenticated && currentAuthState.user) {
						// Determine default destination based on role
						const getDefaultDashboard = () => {
							const userRole = currentAuthState.user?.role;
							if (userRole === "PARENT") return "/parent/dashboard";
							if (userRole === "TEACHER") return "/teacher/dashboard";
							if (userRole === "STUDENT") return "/student/dashboard";
							return "/dashboard"; // ADMIN default
						};

						// Navigate based on user state
						if (result.isFirstTimeLogin) {
							navigate("/reset-password", {
								state: {
									resetToken: result.resetToken,
									email: result.user!.email,
									from: intendedDestination || getDefaultDashboard(),
								},
								replace: true,
							});
						} else if (intendedDestination) {
							const destination = intendedDestination;
							setIntendedDestination(null);
							navigate(destination, { replace: true });
						} else if (hasSeenOnboarding) {
							navigate(getDefaultDashboard(), { replace: true });
						} else {
							navigate("/onboarding", { replace: true });
						}
					} else {
						// State not yet ready, wait a bit more
						setTimeout(checkAndNavigate, 100);
					}
				};
				
				// Start checking after a brief delay
				setTimeout(checkAndNavigate, 200);
			} else {
				setLoginError(result.error || "Login failed. Please check your credentials.");
			}
		} catch (error: any) {
			setLoginError(error.message || "Login failed. Please check your credentials.");
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
			<div className="flex flex-1 flex-col justify-center items-center px-8 py-12 relative overflow-hidden">
				{/* Logo */}
				<div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
					<h1 className="text-2xl font-bold text-[#2b2b2b] leading-tight">
						Learn<br />
						<span className="bg-[#fd5d26] text-white px-1.5 rounded">Box</span>
					</h1>
				</div>
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
