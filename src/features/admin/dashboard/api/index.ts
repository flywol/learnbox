// src/features/dashboard/api/index.ts
// Placeholder for future role-based API selection
// When teacher endpoints are ready, this file will export:
// - getDashboardApi() function for role-based selection
// - Individual API clients

// For now, components should import adminDashboardApi directly

// Future implementation:
// import { useAuthStore } from "@/features/auth/store/authStore";
// import { adminDashboardApi } from "./adminDashboardApi";
// import { teacherDashboardApi } from "./teacherDashboardApi";

// export const getDashboardApi = () => {
//   const { user } = useAuthStore.getState();
//   
//   if (user?.role?.toLowerCase() === 'teacher') {
//     return teacherDashboardApi;
//   }
//   
//   return adminDashboardApi;
// };