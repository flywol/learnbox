import { useCallback } from 'react';
import { useToast } from '../../hooks/use-toast';

interface ApiErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: ApiErrorResponse | Error | unknown, customMessage?: string) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as ApiErrorResponse).message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    toast({
      variant: "destructive",
      title: "Error",
      description: customMessage || errorMessage,
    });
  }, [toast]);

  const handleApiError = useCallback((error: unknown, context?: string) => {
    const contextMessage = context ? `${context}: ` : '';
    handleError(error, contextMessage + 'Please check your connection and try again.');
  }, [handleError]);

  const handleValidationError = useCallback((error: unknown) => {
    handleError(error, 'Please check your input and try again.');
  }, [handleError]);

  return {
    handleError,
    handleApiError,
    handleValidationError,
  };
};