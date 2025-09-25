import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Toast {
  id: string;
  variant?: 'default' | 'success' | 'destructive';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'DISMISS_TOAST'; toastId: string }
  | { type: 'REMOVE_TOAST'; toastId: string };

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toastId ? { ...toast, open: false } : toast
        ),
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };
    default:
      return state;
  }
};

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (toastId: string) => void;
  removeToast: (toastId: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      variant: 'default',
      duration: toast.variant === 'destructive' ? 7000 : 5000,
      ...toast,
    };

    dispatch({ type: 'ADD_TOAST', toast: newToast });

    // Auto-dismiss after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', toastId: id });
      }, newToast.duration);
    }
  };

  const dismissToast = (toastId: string) => {
    dispatch({ type: 'DISMISS_TOAST', toastId });
  };

  const removeToast = (toastId: string) => {
    dispatch({ type: 'REMOVE_TOAST', toastId });
  };

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        addToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    toast: context.addToast,
    toasts: context.toasts,
    dismiss: context.dismissToast,
  };
}