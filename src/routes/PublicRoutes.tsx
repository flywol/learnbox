import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { AuthGuard } from "../features/auth/components/guards/AuthGuard";
import { FlowGuard } from "../features/auth/components/guards/FlowGuard";
import { FlowContextGuard } from "../features/auth/components/guards/FlowContextGuard";
import { DeviceRestrictedPage } from "../common/security/DeviceRestrictedPage";

const RoleSelectionPage = lazy(() => import("../features/auth/pages/RoleSelectionPage"));
const SchoolSetupPage = lazy(() => import("../features/auth/pages/SchoolSetupPage"));
const SignupFlow = lazy(() => import("../features/auth/pages/signup/AdminSignupFlow"));
const LoginPage = lazy(() => import("../features/auth/pages/login/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../features/auth/pages/password/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/password/ResetPassword"));
const EmailVerificationPage = lazy(() => import("../features/auth/pages/login/EmailVerificationPage"));
const OnboardingPage = lazy(() => import("../features/auth/pages/onboarding/OnboardingPage"));

export function PublicRoutes() {
  return (
    <Routes>
      <Route path="/device-restricted" element={<DeviceRestrictedPage />} />
      
      <Route
        path="/"
        element={
          <AuthGuard requiresAuth={false}>
            <FlowContextGuard flowType="role-selection">
              <RoleSelectionPage />
            </FlowContextGuard>
          </AuthGuard>
        }
      />
      
      <Route
        path="/school-setup"
        element={
          <AuthGuard requiresAuth={false}>
            <FlowGuard requiresRole>
              <FlowContextGuard flowType="school-setup">
                <SchoolSetupPage />
              </FlowContextGuard>
            </FlowGuard>
          </AuthGuard>
        }
      />
      
      <Route
        path="/signup"
        element={
          <AuthGuard requiresAuth={false}>
            <FlowGuard requiresRole allowedRoles={["ADMIN"]}>
              <FlowContextGuard flowType="signup">
                <SignupFlow />
              </FlowContextGuard>
            </FlowGuard>
          </AuthGuard>
        }
      />
      
      <Route
        path="/login"
        element={
          <AuthGuard requiresAuth={false}>
            <FlowGuard requiresRole requiresSchool>
              <FlowContextGuard flowType="login">
                <LoginPage />
              </FlowContextGuard>
            </FlowGuard>
          </AuthGuard>
        }
      />
      
      <Route
        path="/forgot-password"
        element={
          <AuthGuard requiresAuth={false}>
            <FlowContextGuard flowType="forgot-password">
              <ForgotPasswordPage />
            </FlowContextGuard>
          </AuthGuard>
        }
      />
      
      <Route
        path="/verify-email"
        element={
          <FlowContextGuard flowType="email-verification">
            <EmailVerificationPage />
          </FlowContextGuard>
        }
      />
      
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      <Route
        path="/onboarding"
        element={
          <AuthGuard requiresAuth={false}>
            <FlowGuard requiresRole>
              <FlowContextGuard flowType="onboarding">
                <OnboardingPage />
              </FlowContextGuard>
            </FlowGuard>
          </AuthGuard>
        }
      />
    </Routes>
  );
}