// src/features/auth/pages/SchoolSetupPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import SignupFlow from "./signup/AdminSignupFlow";
import { AuthPageWrapper } from "../components/ui/AuthPageWrapper";

// Validation schema for school URL
const schoolSetupSchema = z.object({
	schoolUrl: z
		.string()
		.min(1, { message: "Please enter your school's URL" })
		.refine(
			(url) => {
				// Allow various formats: domain.com, subdomain.domain.com, https://domain.com
				const urlPattern = /^(https?:\/\/)?([\w\-]+\.)*[\w\-]+\.[a-z]{2,}$/i;
				return urlPattern.test(url);
			},
			{ message: "Please enter a valid school URL" }
		),
});

type SchoolSetupFormValues = z.infer<typeof schoolSetupSchema>;

const SchoolSetupPage = () => {
	const navigate = useNavigate();
	const { selectedRole, setSchoolDomain, verifySchoolDomain, clearAllFlowStates, clearSignupData, setSignupStep } = useAuthStore();
	const [isValidating, setIsValidating] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);
	const [showSignupFlow, setShowSignupFlow] = useState(false);


	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<SchoolSetupFormValues>({
		resolver: zodResolver(schoolSetupSchema),
	});

	// Redirect if no role selected
	if (!selectedRole) {
		navigate("/");
		return null;
	}

	const onSubmit = async (data: SchoolSetupFormValues) => {
		setIsValidating(true);
		setValidationError(null);

		try {
			// All roles (including ADMIN) need to verify the school domain first
			const isValid = await verifySchoolDomain(data.schoolUrl);

			if (isValid) {
				setSchoolDomain(data.schoolUrl);
				// Navigate to login page after successful verification for ALL roles
				navigate("/login");
			} else {
				setValidationError(
					"School not found. Please check the URL and try again."
				);
			}
		} catch (error: any) {
			console.error("School validation failed:", error);
			const errorMessage =
				error.message || "Unable to validate school. Please try again.";
			setValidationError(errorMessage);
		} finally {
			setIsValidating(false);
		}
	};

	const handleSignupComplete = () => {
		// After signup is complete, hide the signup flow and return to school setup
		setShowSignupFlow(false);
		// The admin can now enter their newly created school URL
	};

	// If showing signup flow, render that instead
	if (showSignupFlow) {
		return <SignupFlow onComplete={handleSignupComplete} />;
	}

	return (
		<AuthPageWrapper>
			<div className="space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight">School Setup</h1>
					<p className="mt-2 text-muted-foreground">
						Enter your school domain to continue.
					</p>
				</div>

				{/* Error message */}
				{validationError && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
						{validationError}
					</div>
				)}

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4">
					<div className="space-y-2">
						<input
							id="schoolUrl"
							type="text"
							{...register("schoolUrl")}
							className="w-full p-3 border rounded-md"
							placeholder="Input school domain"
							disabled={isValidating}
						/>
						{errors.schoolUrl && (
							<p className="text-red-500 text-sm mt-1">
								{errors.schoolUrl.message}
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
						className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center">
						{isValidating ? (
							<>
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
								Validating...
							</>
						) : (
							"Next"
						)}
					</button>
				</form>

				{/* Show Create Account link only for ADMIN role */}
				{selectedRole === "ADMIN" && (
					<div className="text-center">
						<p className="text-sm text-gray-600 mb-2">School not found?</p>
						<button
							type="button"
							onClick={() => {
								// Clear state immediately - this should be safe since we're in an event handler
								clearAllFlowStates();
								clearSignupData();
								setSignupStep(null);
								
								// Set the domain they entered and go to signup
								const currentUrl = getValues("schoolUrl");
								if (currentUrl) {
									setSchoolDomain(currentUrl);
								}
								setShowSignupFlow(true);
							}}
							className="text-sm text-orange-600 hover:text-orange-700 font-medium"
							disabled={isValidating}>
							Create your school
						</button>
					</div>
				)}
			</div>
		</AuthPageWrapper>
	);
};

export default SchoolSetupPage;
