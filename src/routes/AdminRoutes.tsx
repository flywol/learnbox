// src/routes/AdminRoutes.tsx
import { Route } from "react-router-dom";
import { lazy } from "react";

// Admin feature pages
const AdminDashboard = lazy(() => import("../features/admin/dashboard/pages/AdminDashboard"));
const UserListPage = lazy(() => import("../features/admin/user-management/pages/UserListPage"));
const CreateUserPage = lazy(() => import("../features/admin/user-management/pages/CreateUserPage"));
const EditUserPage = lazy(() => import("../features/admin/user-management/pages/EditUserPage"));
const UserDetailPage = lazy(() => import("../features/admin/user-management/pages/UserDetailPage"));
const SchoolPaymentsPage = lazy(() => import("../features/admin/payments/pages/SchoolPaymentsPage"));
const ClassPaymentDetailPage = lazy(() => import("../features/admin/payments/pages/ClassPaymentDetailPage"));

export function AdminRoutes() {
  return (
    <>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
      {/* User Management */}
      <Route path="/admin/users" element={<UserListPage />} />
      <Route path="/admin/users/create" element={<CreateUserPage />} />
      <Route path="/admin/users/:id" element={<UserDetailPage />} />
      <Route path="/admin/users/:id/edit" element={<EditUserPage />} />
      
      {/* Payments */}
      <Route path="/admin/payments" element={<SchoolPaymentsPage />} />
      <Route path="/admin/payments/:classId" element={<ClassPaymentDetailPage />} />
    </>
  );
}