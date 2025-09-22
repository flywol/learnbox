// src/features/dashboard/hooks/useSchoolSetupApi.ts
import { useState } from 'react';
import schoolSetupApiClient from '../api/schoolSetupApiClient';
import type { 
  CreateSessionRequest, 
  CreateClassesRequest, 
  AddClassArmsRequest 
} from '../types/dashboard-api.types';

interface UseSchoolSetupApiReturn {
  // Session management
  createSession: (data: CreateSessionRequest) => Promise<unknown>;
  
  // Classes management
  createMultipleClasses: (data: CreateClassesRequest) => Promise<unknown>;
  addClassArms: (data: AddClassArmsRequest) => Promise<unknown>;
  
  // State
  loading: boolean;
  error: string | null;
  
  // Utilities
  clearError: () => void;
}

export const useSchoolSetupApi = (): UseSchoolSetupApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async <T>(apiCall: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (data: CreateSessionRequest) => {
    return handleApiCall(() => schoolSetupApiClient.createSession(data));
  };

  const createMultipleClasses = async (data: CreateClassesRequest) => {
    return handleApiCall(() => schoolSetupApiClient.createMultipleClasses(data));
  };

  const addClassArms = async (data: AddClassArmsRequest) => {
    return handleApiCall(() => schoolSetupApiClient.addClassArms(data));
  };

  const clearError = () => setError(null);

  return {
    createSession,
    createMultipleClasses,
    addClassArms,
    loading,
    error,
    clearError,
  };
};