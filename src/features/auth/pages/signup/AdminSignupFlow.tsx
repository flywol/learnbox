// src/features/auth/pages/signup/AdminSignupFlow.tsx
import {
	SchoolInfoFormData,
	PersonalInfoFormData,
} from "@/features/auth/schemas/authSchema";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authApiClient } from "../../api/authApiClient";
import OtpVerification from "../../components/OtpVerification";
import PersonalInfoStep from "./components/PersonalInfoStep";
import SchoolInfoStep from "./components/SchoolInfoStep";
import { SuccessStep, ErrorStep } from "./components/SignupResultSteps.tsx";

interface SignupFlowProps {
	onComplete?: () => void;
}

export default function SignupFlow({ onComplete }: SignupFlowProps) {
	const navigate = useNavigate();

	const {
		signupStep,
		signupData,
		loadingState,
		setSignupStep,
		updateSignupData,
		clearSignupData,
		setSchoolDomain,
		setLoadingState,
	} = useAuthStore();

	// Initialize signup flow if not already started
	useEffect(() => {
		if (signupStep === null) {
			setSignupStep("school");
		}
	}, [signupStep, setSignupStep]);

	const handleSchoolInfoNext = useCallback(
		(info: SchoolInfoFormData, url: string) => {
			// Save school info to store
			updateSignupData({
				schoolName: info.schoolName,
				schoolWebsite: info.website,
				schoolShortName: info.schoolShortName,
				learnboxUrl: url,
			});

			// Move to next step
			setSignupStep("personal");
		},
		[updateSignupData, setSignupStep]
	);

	const handlePersonalInfoNext = useCallback(
		async (info: PersonalInfoFormData) => {
			// Save personal info to store
			updateSignupData({
				fullName: info.fullName,
				email: info.email,
				phoneNumber: info.phoneNumber,
				password: info.password,
			});

			if (!signupData?.schoolName) {
				updateSignupData({ error: "School information is missing" });
				setSignupStep("error");
				return;
			}

			setLoadingState("submitting");

			try {
				// Call the register endpoint with all collected data
				// OTP is automatically sent by the backend after successful registration
				await authApiClient.register({
					email: info.email,
					password: info.password,
					fullName: info.fullName.split(" ")[0] || info.fullName,
					phoneNumber: `+234${info.phoneNumber}`,
					learnboxUrl: signupData.learnboxUrl || "",
					schoolName: signupData.schoolName || "",
					schoolShortName: signupData.schoolShortName || "",
				});

				// Move to OTP step - OTP already sent automatically by backend
				setSignupStep("otp");
				setLoadingState("success");
			} catch (error: any) {
				console.error("Registration failed:", error);
				updateSignupData({
					error: error.message || "Failed to create account",
				});
				setSignupStep("error");
				setLoadingState("error");
			}
		},
		[signupData, updateSignupData, setSignupStep, setLoadingState]
	);

	// OTP verification callback
	const handleOtpVerify = useCallback(
		async (otp: string) => {
			if (!signupData?.email) {
				throw new Error("Email is required for OTP verification");
			}

			await authApiClient.verifyOtp({
				email: signupData.email,
				otp
			});

			// Mark OTP as verified but DON'T authenticate user yet
			updateSignupData({ otpVerified: true });

			// Set the school domain for future login
			if (signupData?.learnboxUrl) {
				setSchoolDomain(signupData.learnboxUrl);
			}

			// Clear signup data and redirect to login
			clearSignupData();
			navigate("/login", { 
				state: { 
					message: "Account verified successfully! Please login to continue.",
					email: signupData.email 
				}
			});
		},
		[signupData, updateSignupData, setSchoolDomain, clearSignupData, navigate]
	);

	// OTP resend callback
	const handleOtpResend = useCallback(async () => {
		if (!signupData?.email) {
			throw new Error("Email is required for resending OTP");
		}
		await authApiClient.resendOtp(signupData.email);
	}, [signupData?.email]);

	// OTP error callback - stay on OTP page, don't redirect
	const handleOtpError = useCallback(
		() => {
			// Just log the error, OTP component will handle displaying it
			// Don't redirect to error page - stay on OTP input page
		},
		[]
	);

	const handleComplete = useCallback(() => {
		// Clear signup data and navigate to login
		clearSignupData();
		navigate("/login");
	}, [clearSignupData, navigate]);

	const handleClose = useCallback(() => {
		// Clear signup data
		clearSignupData();

		if (onComplete) {
			onComplete();
		} else {
			navigate("/");
		}
	}, [clearSignupData, onComplete, navigate]);

	const handleRetry = useCallback(() => {
		// Clear error and go back to OTP screen
		updateSignupData({ error: undefined });
		setSignupStep("otp");
		setLoadingState("idle");
	}, [updateSignupData, setSignupStep, setLoadingState]);

	const handleStartOver = useCallback(() => {
		// Clear all data and start from beginning
		clearSignupData();
		setSignupStep("school");
		setLoadingState("idle");
	}, [clearSignupData, setSignupStep, setLoadingState]);

	const renderStep = () => {
		switch (signupStep) {
			case "school":
				return (
					<SchoolInfoStep
						onNext={handleSchoolInfoNext}
						initialData={
							signupData
								? {
										schoolName: signupData.schoolName || "",
										website: signupData.schoolWebsite || "",
										schoolShortName: signupData.schoolShortName || "",
								  }
								: undefined
						}
					/>
				);

			case "personal":
				return (
					<PersonalInfoStep
						onNext={handlePersonalInfoNext}
						initialData={
							signupData
								? {
										fullName: signupData.fullName || "",
										email: signupData.email || "",
										phoneNumber: signupData.phoneNumber || "",
										password: "", // Don't pre-fill password for security
								  }
								: undefined
						}
						isSubmitting={loadingState === "submitting"}
					/>
				);

			case "otp":
				return (
					<OtpVerification
						email={signupData?.email || ""}
						onVerify={handleOtpVerify}
						onResend={handleOtpResend}
						onError={handleOtpError}
					/>
				);

			case "complete":
				return (
					<SuccessStep
						onClose={handleClose}
						onContinue={handleComplete}
					/>
				);

			case "error":
				return (
					<ErrorStep
						onClose={handleClose}
						onRetry={
							signupStep === "error" && signupData?.otpVerified === false
								? handleRetry
								: undefined
						}
						onStartOver={handleStartOver}
						errorMessage={signupData?.error}
					/>
				);

			default:
				// If somehow we get into an invalid state, start over
				setSignupStep("school");
				return null;
		}
	};

	return renderStep();
}
