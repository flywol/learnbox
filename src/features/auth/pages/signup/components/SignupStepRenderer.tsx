import { useAuthStore } from "../../../store/authStore";
import OtpVerification from "../../../components/OtpVerification";
import PersonalInfoStep from "./PersonalInfoStep";
import SchoolInfoStep from "./SchoolInfoStep";
import { SuccessStep, ErrorStep } from "./SignupResultSteps.tsx";

interface SignupStepRendererProps {
  onSchoolInfoNext: (info: any, url: string) => void;
  onPersonalInfoNext: (info: any) => void;
  onOtpVerify: (otp: string) => Promise<void>;
  onOtpResend: () => Promise<void>;
  onOtpError: () => void;
  onComplete: () => void;
  onClose: () => void;
  onRetry: () => void;
  onStartOver: () => void;
}

export default function SignupStepRenderer({
  onSchoolInfoNext,
  onPersonalInfoNext,
  onOtpVerify,
  onOtpResend,
  onOtpError,
  onComplete,
  onClose,
  onRetry,
  onStartOver,
}: SignupStepRendererProps) {
  const { signupStep, signupData, loadingState, clearSignupData, setSignupStep } = useAuthStore();

  switch (signupStep) {
    case "school":
      return (
        <SchoolInfoStep
          onNext={onSchoolInfoNext}
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
          onNext={onPersonalInfoNext}
          initialData={
            signupData
              ? {
                  fullName: signupData.fullName || "",
                  email: signupData.email || "",
                  phoneNumber: signupData.phoneNumber || "",
                  password: "",
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
          onVerify={onOtpVerify}
          onResend={onOtpResend}
          onError={onOtpError}
        />
      );

    case "complete":
      return (
        <SuccessStep
          onClose={onClose}
          onContinue={onComplete}
        />
      );

    case "error":
      return (
        <ErrorStep
          onClose={onClose}
          onRetry={
            signupStep === "error" && signupData?.otpVerified === false
              ? onRetry
              : undefined
          }
          onStartOver={onStartOver}
          errorMessage={signupData?.error}
        />
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              Invalid signup step: {signupStep}
            </p>
            <button
              onClick={() => {
                clearSignupData();
                setSignupStep("school");
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            >
              Start Over
            </button>
          </div>
        </div>
      );
  }
}