import { Route } from "react-router-dom";
import { lazy } from "react";

const CreateUserPage = lazy(() => import("../features/admin/user-management/pages/CreateUserPage"));
const UserListPage = lazy(() => import("../features/admin/user-management/pages/UserListPage"));
const UserDetailPage = lazy(() => import("../features/admin/user-management/pages/UserDetailPage"));
const EditUserPage = lazy(() => import("../features/admin/user-management/pages/EditUserPage"));

export function UserRoutes() {
  return (
    <>
      <Route path="/user-management" element={<UserListPage />} />
      <Route path="/user-management/create" element={<CreateUserPage />} />
      <Route path="/user-management/:id" element={<UserDetailPage />} />
      <Route path="/user-management/:id/edit" element={<EditUserPage />} />
    </>
  );
}