import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { authApiClient } from "../../../api/authApiClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../../hooks/useAuth";
import {
  SchoolInfoFormData,
  PersonalInfoFormData,
} from "@/features/auth/schemas/authSchema";

import { getFirstName } from "@/common/utils/userUtils";

export function useSignupStepHandlers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const {
    signupData,
    updateSignupData,
    clearSignupData,
    setSchoolDomain,
    setSignupStep,
    setLoadingState,
    hasSeenOnboarding,
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
          fullName: getFirstName(info.fullName) || info.fullName,
          phoneNumber: `+234${info.phoneNumber}`,
          learnboxUrl: signupData.learnboxUrl || "",
          schoolName: signupData.schoolName || "",
          schoolShortName: signupData.schoolShortName || "",
        });

        setSignupStep("otp");
        setLoadingState("success");
      } catch (error: any) {
        console.error("Registration failed:", error);
        const errorMessage = error.message || "Failed to create account";
        
        // Show error toast
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        updateSignupData({
          error: errorMessage,
        });
        setSignupStep("error");
        setLoadingState("error");
      }
    },
    [signupData, updateSignupData, setSignupStep, setLoadingState]
  );

  const handleOtpVerify = useCallback(
    async (otp: string) => {
      if (!signupData?.email || !signupData?.password) {
        throw new Error("Email and password are required for OTP verification");
      }

      try {
        // Verify OTP first
        await authApiClient.verifyOtp({
          email: signupData.email,
          otp
        });

        updateSignupData({ otpVerified: true });

        if (signupData?.learnboxUrl) {
          setSchoolDomain(signupData.learnboxUrl);
        }

        // Show success toast
        toast({
          title: "Account verified successfully!",
          description: "Logging you in...",
          variant: "default",
        });

        // Clear signup data before login
        const email = signupData.email;
        const password = signupData.password;
        clearSignupData();

        // Auto-login the user with their credentials
        const loginResult = await login(email, password, false);

        if (loginResult.success && loginResult.user) {
          // Determine dashboard based on role
          const getDashboardPath = () => {
            const userRole = loginResult.user?.role;
            if (userRole === "PARENT") return "/parent/dashboard";
            if (userRole === "TEACHER") return "/teacher/dashboard";
            if (userRole === "STUDENT") return "/student/dashboard";
            return "/dashboard"; // ADMIN default
          };

          // Navigate to onboarding or dashboard
          if (hasSeenOnboarding) {
            navigate(getDashboardPath(), { replace: true });
          } else {
            navigate("/onboarding", { replace: true });
          }
        } else {
          // If auto-login failed, redirect to login page with pre-filled email
          toast({
            title: "Please login to continue",
            description: loginResult.error || "Please login with your credentials",
            variant: "default",
          });
          navigate("/login", { 
            state: { 
              email: email 
            }
          });
        }
      } catch (error: any) {
        // If OTP verification failed, let it bubble up to be handled by the component
        throw error;
      }
    },
    [signupData, updateSignupData, setSchoolDomain, clearSignupData, navigate, toast, login, hasSeenOnboarding]
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