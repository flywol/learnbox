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

const validateSchoolApi = (
	url: string
): Promise<{ isValid: boolean; schoolName?: string }> => {
	console.log(`Validating school URL: ${url}`);
	return new Promise((resolve) => {
		setTimeout(() => {
			// For now, accept any valid URL format and return success
			// TODO: Replace with real API call to validate school exists
			resolve({
				isValid: true,
				schoolName: "Sample School", // This would come from the API
			});
		}, 1500); // Simulate network delay
	});
};

type SchoolSetupFormValues = z.infer<typeof schoolSetupSchema>;

const SchoolSetupPage = () => {
	const navigate = useNavigate();
	const { selectedRole, setSchoolDomain } = useAuthStore();
	const [isValidating, setIsValidating] = useState(false);
	const [showSignupFlow, setShowSignupFlow] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
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

		try {
			const { isValid } = await validateSchoolApi(data.schoolUrl);

			if (isValid) {
				setSchoolDomain(data.schoolUrl);
				navigate("/login");
			} else {
				setError("schoolUrl", {
					type: "manual",
					message: "School not found. Please check the URL and try again.",
				});
			}
		} catch (error) {
			console.error("School validation failed:", error);
			setError("schoolUrl", {
				type: "manual",
				message: "Unable to validate school. Please try again.",
			});
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
					<h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
					<p className="mt-2 text-muted-foreground">
						Sign in to stay connected.
					</p>
				</div>

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
						className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
						{isValidating ? "Validating..." : "Next"}
					</button>
				</form>

				{/* Show Create Account link only for ADMIN role */}
				{selectedRole === "ADMIN" && (
					<div className="text-center">
						<button
							type="button"
							onClick={() => setShowSignupFlow(true)}
							className="text-sm text-gray-500 hover:text-gray-700"
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
