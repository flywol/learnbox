import { createContext, useContext, ReactNode } from 'react';
import { useAdminProfile } from '@/features/admin/profile/hooks/useProfile';
import type { AdminProfile } from '@/features/admin/profile/types/profile.types';

interface ProfileContextType {
  adminProfile: AdminProfile | undefined;
  isLoading: boolean;
  error: Error | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { data: adminProfile, isLoading, error } = useAdminProfile();

  return (
    <ProfileContext.Provider value={{ adminProfile, isLoading, error }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}

// Hook for components that only need school branding info
export function useSchoolBranding() {
  const { adminProfile } = useProfileContext();
  return adminProfile?.school;
}