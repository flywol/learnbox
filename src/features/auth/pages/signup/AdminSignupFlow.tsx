import {
	SchoolInfoFormData,
	PersonalInfoFormData,
} from "@/features/auth/schemas/authSchema";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authApi } from "../../api/authApi";
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
		completeSignup,
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
				schoolName: info.name,
				schoolWebsite: info.website,
				schoolShortName: info.shortName,
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
				await authApi.register({
					fullName: info.fullName,
					email: info.email,
					password: info.password,
					schoolName: signupData.schoolName,
					schoolWebsite: signupData.schoolWebsite || "",
					schoolShortName: signupData.schoolShortName || "",
					learnboxUrl: signupData.learnboxUrl || "",
					phoneNumber: `+234${info.phoneNumber}`,
				});

				// Registration successful, now send OTP
				await authApi.resendOtp(info.email);

				// Move to OTP step
				setSignupStep("otp");
				setLoadingState("success");
			} catch (error: any) {
				console.error("Registration failed:", error);
				updateSignupData({
					error: error.response?.data?.message || "Failed to create account",
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
			await authApi.verifyOtp(signupData.email, otp);

			// Mark OTP as verified
			updateSignupData({ otpVerified: true });

			// Set the school domain for future login
			if (signupData?.learnboxUrl) {
				setSchoolDomain(signupData.learnboxUrl);
			}

			// Complete signup and show success
			completeSignup();
		},
		[signupData, updateSignupData, setSchoolDomain, completeSignup]
	);

	// OTP resend callback
	const handleOtpResend = useCallback(async () => {
		if (!signupData?.email) {
			throw new Error("Email is required for resending OTP");
		}
		await authApi.resendOtp(signupData.email);
	}, [signupData?.email]);

	// OTP error callback
	const handleOtpError = useCallback(
		(error: string) => {
			updateSignupData({ error });
			setSignupStep("error");
		},
		[updateSignupData, setSignupStep]
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
										name: signupData.schoolName || "",
										website: signupData.schoolWebsite || "",
										shortName: signupData.schoolShortName || "",
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
