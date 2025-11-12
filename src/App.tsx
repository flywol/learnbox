import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { HydrationGate } from "./components/HydrationGate";
import { SecurityWrapper } from "./common/security/SecurityWrapper";

// Route components
import { PublicRoutes } from "./routes/PublicRoutes";
import { DashboardRoutes } from "./routes/DashboardRoutes";
import { AdminRoutes } from "./routes/admin/AdminRoutes";
import { TeacherRoutes } from "./routes/teacher/TeacherRoutes";
import { StudentRoutes } from "./routes/student/StudentRoutes";
import { ParentRoutes } from "./routes/parent/ParentRoutes";

// Error and loading components
import { UnauthorizedPage, NotFoundPage, LoadingSpinner } from "./components/ErrorPages";

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
              
              {/* Secure role-based routes */}
              {AdminRoutes()}
              {TeacherRoutes()}
              {StudentRoutes()}
              {ParentRoutes()}

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
