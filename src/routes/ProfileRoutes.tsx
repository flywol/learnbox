import { Route } from "react-router-dom";
import { lazy } from "react";

const AdminProfilePage = lazy(() => import("../features/admin/profile/pages/AdminProfilePage"));
const EditPersonalInfoPage = lazy(() => import("../features/admin/profile/pages/EditPersonalInfoPage"));
const EditSchoolInfoPage = lazy(() => import("../features/admin/profile/pages/EditSchoolInfoPage"));
const SessionConfigPage = lazy(() => import("../features/admin/profile/pages/SessionConfigPage"));

export function ProfileRoutes() {
  return (
    <>
      <Route path="/profile" element={<AdminProfilePage />} />
      <Route path="/profile/edit-personal" element={<EditPersonalInfoPage />} />
      <Route path="/profile/edit-school" element={<EditSchoolInfoPage />} />
      <Route path="/profile/session-config" element={<SessionConfigPage />} />
    </>
  );
}