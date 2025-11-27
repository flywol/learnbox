import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { HydrationGate } from "./components/HydrationGate";

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

import { useEffect } from "react";
import { useAuthStore } from "./features/auth/store/authStore";

export default function App() {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  return (
    <HydrationGate>
      <ToastProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Secure role-based routes - must come before catch-all routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/teacher/*" element={<TeacherRoutes />} />
            <Route path="/student/*" element={<StudentRoutes />} />
            <Route path="/parent/*" element={<ParentRoutes />} />

            {/* Dashboard routes for legacy /dashboard paths */}
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
            <Route path="/notifications" element={<DashboardRoutes />} />

            {/* Public routes */}
            <Route path="/*" element={<PublicRoutes />} />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster />
      </ToastProvider>
    </HydrationGate>
  );
} 
