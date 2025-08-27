import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { authApiClient } from "../../../api/authApiClient";
import {
  SchoolInfoFormData,
  PersonalInfoFormData,
} from "@/features/auth/schemas/authSchema";

export function useSignupStepHandlers() {
  const navigate = useNavigate();
  const {
    signupData,
    updateSignupData,
    clearSignupData,
    setSchoolDomain,
    setSignupStep,
    setLoadingState,
  } = useAuthStore();

  const handleSchoolInfoNext = useCallback(
    (info: SchoolInfoFormData, url: string) => {
      updateSignupData({
        schoolName: info.schoolName,
        schoolWebsite: info.website,
        schoolShortName: info.schoolShortName,
        learnboxUrl: url,
      });
      setSignupStep("personal");
    },
    [updateSignupData, setSignupStep]
  );

  const handlePersonalInfoNext = useCallback(
    async (info: PersonalInfoFormData) => {
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
        await authApiClient.register({
          email: info.email,
          password: info.password,
          fullName: info.fullName.split(" ")[0] || info.fullName,
          phoneNumber: `+234${info.phoneNumber}`,
          learnboxUrl: signupData.learnboxUrl || "",
          schoolName: signupData.schoolName || "",
          schoolShortName: signupData.schoolShortName || "",
        });

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

  const handleOtpVerify = useCallback(
    async (otp: string) => {
      if (!signupData?.email) {
        throw new Error("Email is required for OTP verification");
      }

      await authApiClient.verifyOtp({
        email: signupData.email,
        otp
      });

      updateSignupData({ otpVerified: true });

      if (signupData?.learnboxUrl) {
        setSchoolDomain(signupData.learnboxUrl);
      }

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

  const handleOtpResend = useCallback(async () => {
    if (!signupData?.email) {
      throw new Error("Email is required for resending OTP");
    }
    await authApiClient.resendOtp(signupData.email);
  }, [signupData?.email]);

  const handleOtpError = useCallback(() => {
    // OTP component handles displaying errors
  }, []);

  return {
    handleSchoolInfoNext,
    handlePersonalInfoNext,
    handleOtpVerify,
    handleOtpResend,
    handleOtpError,
  };
}