import { useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useSignupStepHandlers } from "./components/SignupStepHandlers";
import { useSignupFlowActions } from "./components/SignupFlowActions";
import SignupStepRenderer from "./components/SignupStepRenderer";

interface SignupFlowProps {
	onComplete?: () => void;
}

export default function SignupFlow({ onComplete }: SignupFlowProps) {
	const initialized = useRef(false);
	const { signupStep, setSignupStep } = useAuthStore();

	// Initialize signup flow if not already started
	if (!initialized.current && (signupStep === null || signupStep === undefined)) {
		initialized.current = true;
		setTimeout(() => setSignupStep("school"), 0);
	}

	const stepHandlers = useSignupStepHandlers();
	const flowActions = useSignupFlowActions({ onComplete });

	return (
		<SignupStepRenderer
			onSchoolInfoNext={stepHandlers.handleSchoolInfoNext}
			onPersonalInfoNext={stepHandlers.handlePersonalInfoNext}
			onOtpVerify={stepHandlers.handleOtpVerify}
			onOtpResend={stepHandlers.handleOtpResend}
			onOtpError={stepHandlers.handleOtpError}
			onComplete={flowActions.handleComplete}
			onClose={flowActions.handleClose}
			onRetry={flowActions.handleRetry}
			onStartOver={flowActions.handleStartOver}
		/>
	);
}
