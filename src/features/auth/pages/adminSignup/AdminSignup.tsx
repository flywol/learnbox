import { SchoolInfoFormData, PersonalInfoFormData } from "@/common/schemas/SignupSchema";
import { useState } from "react";
import OtpVerificationStep from "./components/OtpVerificationStep";
import PersonalInfoStep from "./components/PersonalInfoStep";
import SchoolInfoStep from "./components/SchoolInfoStep";
import { SuccessStep, ErrorStep } from "./components/SuccessAndErrorSteps";


type SignupStep = "school-info" | "personal-info" | "otp" | "success" | "error";

interface SignupFlowProps {
	onComplete?: () => void;
}

export default function SignupFlow({ onComplete }: SignupFlowProps) {
	const [currentStep, setCurrentStep] = useState<SignupStep>("school-info");
	const [schoolInfo, setSchoolInfo] = useState<SchoolInfoFormData | null>(null);
	const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormData | null>(
		null
	);
	const [generatedUrl, setGeneratedUrl] = useState("");

	const handleSchoolInfoNext = (info: SchoolInfoFormData, url: string) => {
		setSchoolInfo(info);
		setGeneratedUrl(url);
		setCurrentStep("personal-info");
	};

	const handlePersonalInfoNext = (info: PersonalInfoFormData) => {
		setPersonalInfo(info);
		setCurrentStep("otp");

		// In real implementation, this would trigger OTP sending
		console.log("Sending OTP to:", info.email);

		// API call example:
		// await sendOtp({ email: info.email });
	};

	const handleOtpSuccess = async () => {
		try {
			// Since APIs aren't ready, just move to success
			setCurrentStep("success");

			// In real implementation, this would create the school and user
			console.log("Creating school:", schoolInfo);
			console.log("Creating user:", personalInfo);

			// API calls example:
			// const schoolResponse = await createSchool({
			//   name: schoolInfo.name,
			//   shortName: schoolInfo.shortName,
			//   website: schoolInfo.website,
			//   portalUrl: generatedUrl
			// });

			// const userResponse = await createAdminUser({
			//   schoolId: schoolResponse.id,
			//   fullName: personalInfo.fullName,
			//   email: personalInfo.email,
			//   phoneNumber: `+234${personalInfo.phoneNumber}`,
			//   password: personalInfo.password
			// });
		} catch (error) {
			console.error("Error creating school/user:", error);
			setCurrentStep("error");
		}
	};

	const handleOtpError = () => {
		setCurrentStep("error");
	};

	const handleComplete = () => {
		// Navigate back to school link input page
		if (onComplete) {
			onComplete();
		} else {
			console.log("Signup complete! Navigating to school link input...");
			// In real app: navigate("/school-link-input");
		}
	};

	const handleClose = () => {
		// Handle close button on success/error screens
		handleComplete();
	};

	const handleRetry = () => {
		// Go back to OTP screen
		setCurrentStep("otp");
	};

	const renderStep = () => {
		switch (currentStep) {
			case "school-info":
				return (
					<SchoolInfoStep
						onNext={handleSchoolInfoNext}
						initialData={schoolInfo || undefined}
					/>
				);

			case "personal-info":
				return (
					<PersonalInfoStep
						onNext={handlePersonalInfoNext}
						initialData={personalInfo || undefined}
					/>
				);

			case "otp":
				return (
					<OtpVerificationStep
						onSubmit={handleOtpSuccess}
						onError={handleOtpError}
					/>
				);

			case "success":
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
						onRetry={handleRetry}
					/>
				);

			default:
				return null;
		}
	};

	return renderStep();
}
