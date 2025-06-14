import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import SignupFlow from "./signup/AdminSignupFlow";

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

// Mock API function to simulate school validation
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
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-sm border">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight">
						Connect to your school
					</h1>
					<p className="mt-2 text-muted-foreground">
						Enter your school's Learn Box URL to continue as a{" "}
						<span className="font-medium text-orange-600">
							{selectedRole.toLowerCase()}
						</span>
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="schoolUrl"
							className="text-sm font-medium">
							School URL
						</label>
						<input
							id="schoolUrl"
							type="text"
							{...register("schoolUrl")}
							className="w-full p-3 border rounded-md focus:outline-none focus:border-orange-500"
							placeholder="e.g., westfield-high.learnbox.com"
							disabled={isValidating}
						/>
						{errors.schoolUrl && (
							<p className="text-red-500 text-sm mt-1">
								{errors.schoolUrl.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={isValidating}
						className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
						{isValidating ? "Validating..." : "Continue"}
					</button>
				</form>

				{/* Show Create Account button only for ADMIN role */}
				{selectedRole === "ADMIN" && (
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">OR</span>
						</div>
					</div>
				)}

				{selectedRole === "ADMIN" && (
					<button
						type="button"
						onClick={() => setShowSignupFlow(true)}
						className="w-full border-2 border-orange-500 text-orange-500 p-3 rounded-md font-semibold hover:bg-orange-50 transition-colors"
						disabled={isValidating}>
						Create New School Account
					</button>
				)}

				<div className="text-center">
					<button
						onClick={() => navigate("/")}
						className="text-sm text-gray-500 hover:text-gray-700"
						disabled={isValidating}>
						← Back to role selection
					</button>
				</div>
			</div>
		</div>
	);
};

export default SchoolSetupPage;
