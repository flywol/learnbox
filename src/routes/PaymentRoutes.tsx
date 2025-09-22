import { Route } from "react-router-dom";
import { lazy } from "react";

const SchoolPaymentsPage = lazy(() => import("../features/admin/payments/pages/SchoolPaymentsPage"));
const ClassPaymentDetailPage = lazy(() => import("../features/admin/payments/pages/ClassPaymentDetailPage"));

export function PaymentRoutes() {
  return (
    <>
      <Route path="/payments" element={<SchoolPaymentsPage />} />
      <Route path="/payments/:classId" element={<ClassPaymentDetailPage />} />
    </>
  );
}