// Role-Based Access Control Guard
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

import { useShallow } from 'zustand/react/shallow';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallbackPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  children, 
  fallbackPath = '/unauthorized' 
}) => {
  const { user, isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    }))
  );
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If no user data, redirect to unauthorized
  if (!user) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }

  // Check if user role is in allowed roles (case-insensitive)
  const userRole = user.role.toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());
  
  if (!normalizedAllowedRoles.includes(userRole)) {
    console.warn(`SECURITY: User with role ${user.role} attempted to access ${location.pathname} (allowed: ${allowedRoles.join(', ')})`);
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }

  // Role is authorized, render children
  return <>{children}</>;
};