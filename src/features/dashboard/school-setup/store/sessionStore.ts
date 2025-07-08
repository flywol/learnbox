// src/features/dashboard/school-setup/store/sessionStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageManager } from "@/common/storage/StorageManager";
import type { CreateSessionRequest } from "../../types/dashboard-api.types";

export interface SessionState {
  // Session data
  sessionData: Partial<CreateSessionRequest>;
  
  // UI state
  isSubmitting: boolean;
  apiError: string | null;
  
  // Actions
  updateSessionData: (data: Partial<CreateSessionRequest>) => void;
  clearSessionData: () => void;
  setSubmitting: (submitting: boolean) => void;
  setApiError: (error: string | null) => void;
  clearApiError: () => void;
  
  // Validation
  validateSessionData: () => boolean;
}

const initialSessionData: Partial<CreateSessionRequest> = {
  name: "",
  firstTermName: "First Term",
  secondTermName: "Second Term", 
  thirdTermName: "Third Term",
  firstTermStartDate: "",
  firstTermEndDate: "",
  secondTermStartDate: "",
  secondTermEndDate: "",
  thirdTermStartDate: "",
  thirdTermEndDate: "",
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionData: initialSessionData,
      isSubmitting: false,
      apiError: null,

      // Session data actions
      updateSessionData: (data) =>
        set((state) => ({
          sessionData: { ...state.sessionData, ...data },
        })),

      clearSessionData: () =>
        set({ sessionData: initialSessionData }),

      // API state management
      setSubmitting: (submitting) => set({ isSubmitting: submitting }),
      setApiError: (error) => set({ apiError: error }),
      clearApiError: () => set({ apiError: null }),

      // Validation
      validateSessionData: () => {
        const { sessionData } = get();
        
        const requiredFields = [
          'name',
          'firstTermStartDate',
          'firstTermEndDate',
          'secondTermStartDate',
          'secondTermEndDate',
          'thirdTermStartDate',
          'thirdTermEndDate',
        ];

        return requiredFields.every(field => {
          const value = sessionData[field as keyof CreateSessionRequest];
          return value && value.trim() !== '';
        });
      },
    }),
    {
      name: "session-setup-storage",
      storage: storageManager.createZustandStorage(),
      partialize: (state) => ({
        sessionData: state.sessionData,
      }),
    }
  )
);