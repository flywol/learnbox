import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { HydrationGate } from "./components/HydrationGate";
import { SecurityWrapper } from "./common/security/SecurityWrapper";
import { ProtectedRoute } from "./features/auth/components/guards/FirstTimeLoginGuard";
import DashboardLayout from "./common/layout/DashboardLayout";

// Route components
import { PublicRoutes } from "./routes/PublicRoutes";
import { DashboardRoutes } from "./routes/DashboardRoutes";
import { ClassroomRoutes } from "./routes/ClassroomRoutes";
import { UserRoutes } from "./routes/UserRoutes";
import { ProfileRoutes } from "./routes/ProfileRoutes";
import { PaymentRoutes } from "./routes/PaymentRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { TeacherRoutes } from "./routes/TeacherRoutes";

// Error and loading components
import { UnauthorizedPage, NotFoundPage, LoadingSpinner, LayoutNotFoundPage } from "./components/ErrorPages";

// Toast components
import { ToastProvider } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toast";

export default function App() {
  return (
    <SecurityWrapper>
      <HydrationGate>
        <ToastProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {PublicRoutes()}
              {DashboardRoutes()}
              
              {/* Role-based routes */}
              {AdminRoutes()}
              {TeacherRoutes()}
              
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {ClassroomRoutes()}
                {UserRoutes()}
                {ProfileRoutes()}
                {PaymentRoutes()}
                <Route path="*" element={<LayoutNotFoundPage />} />
              </Route>

              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster />
        </ToastProvider>
      </HydrationGate>
    </SecurityWrapper>
  );
}
