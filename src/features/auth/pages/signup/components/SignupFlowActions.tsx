import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

interface SignupFlowActionsProps {
  onComplete?: () => void;
}

export function useSignupFlowActions({ onComplete }: SignupFlowActionsProps) {
  const navigate = useNavigate();
  const {
    clearSignupData,
    updateSignupData,
    setSignupStep,
    setLoadingState,
  } = useAuthStore();

  const handleComplete = useCallback(() => {
    clearSignupData();
    navigate("/login");
  }, [clearSignupData, navigate]);

  const handleClose = useCallback(() => {
    clearSignupData();

    if (onComplete) {
      onComplete();
    } else {
      navigate("/");
    }
  }, [clearSignupData, onComplete, navigate]);

  const handleRetry = useCallback(() => {
    updateSignupData({ error: undefined });
    setSignupStep("otp");
    setLoadingState("idle");
  }, [updateSignupData, setSignupStep, setLoadingState]);

  const handleStartOver = useCallback(() => {
    clearSignupData();
    setSignupStep("school");
    setLoadingState("idle");
  }, [clearSignupData, setSignupStep, setLoadingState]);

  return {
    handleComplete,
    handleClose,
    handleRetry,
    handleStartOver,
  };
}