import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import { User } from "../types/auth.types";

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

type SchoolSetupFormValues = z.infer<typeof schoolSetupSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

// Mock API functions
const validateSchoolApi = (
	url: string
): Promise<{ isValid: boolean; schoolName?: string }> => {
	console.log(`Validating school URL: ${url}`);
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				isValid: true,
				schoolName: "Sample School",
			});
		}, 1500);
	});
};

const loginApi = (
	data: LoginFormValues,
	role: string,
	schoolDomain: string
): Promise<{ user: User }> => {
	console.log(
		`Simulating login for ${data.email} as ${role} at ${schoolDomain}...`
	);
	return new Promise((resolve) => {
		setTimeout(() => {
			const mockUser: User = {
				id: `user-${Date.now()}`,
				name: "Test User",
				email: data.email,
				role: role as any,
			};
			resolve({ user: mockUser });
		}, 1500);
	});
};

// Illustration component that stays static during transition
const AuthIllustration = () => (
	<div className="hidden lg:flex lg:w-1/2 bg-[#FFEFE980] items-center justify-center p-8">
		<div className="w-full max-w-md">
			<img
			className="w[710px] h-[560px] object-contain" 
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

	const navigate = useNavigate();
	const {
		selectedRole,
		schoolDomain,
		setSchoolDomain,
		hasSeenOnboarding,
		login: loginAction,
	} = useAuthStore();

	// School setup form
	const schoolForm = useForm<SchoolSetupFormValues>({
		resolver: zodResolver(schoolSetupSchema),
	});

	// Login form
	const loginForm = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	// Redirect if no role selected
	if (!selectedRole) {
		navigate("/");
		return null;
	}

	const handleSchoolSubmit = async (data: SchoolSetupFormValues) => {
		setIsValidating(true);

		try {
			const { isValid } = await validateSchoolApi(data.schoolUrl);

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

	const handleLoginSubmit = async (data: LoginFormValues) => {
		if (!schoolDomain) return;

		setIsLoggingIn(true);

		try {
			const { user } = await loginApi(data, selectedRole, schoolDomain);
			loginAction(user);

			if (hasSeenOnboarding) {
				navigate("/dashboard");
			} else {
				navigate("/onboarding");
			}
		} catch (error) {
			console.error("Login failed:", error);
			loginForm.setError("email", {
				type: "manual",
				message: "Login failed. Please check your credentials.",
			});
		} finally {
			setIsLoggingIn(false);
		}
	};

	const handleBackToSchool = () => {
		setCurrentStep("school");
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
							{isValidating ? "Next" : "Next"}
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
					</div>

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
							<a
								href="#"
								className="text-gray-500 hover:text-gray-700">
								Forgot password?
							</a>
						</div>
						<button
							type="submit"
							disabled={isLoggingIn}
							className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
							{isLoggingIn ? "Login" : "Login"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CombinedSchoolLoginPage;
