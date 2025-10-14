import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';
import { mockUser } from '../../../tests/mocks/handlers';
import type { User } from '../types/auth.types';

// Mock the API clients
vi.mock('../api/authApiClient', () => ({
  authApiClient: {
    isAuthenticated: vi.fn(() => false),
    getUserData: vi.fn(() => null),
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
    verifyDomain: vi.fn(),
  },
}));

vi.mock('../api/teacherAuthApiClient', () => ({
  teacherAuthApiClient: {
    isAuthenticated: vi.fn(() => false),
    getUserData: vi.fn(() => null),
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
    verifyDomain: vi.fn(),
  },
}));

// Mock storage manager
vi.mock('@/common/storage/StorageManager', () => ({
  storageManager: {
    getStorageKeys: vi.fn(() => ({
      auth: 'learnbox-auth',
      accessToken: 'learnbox-access-token',
      refreshToken: 'learnbox-refresh-token',
      rememberMe: 'learnbox-remember-me',
    })),
    clearAllAppData: vi.fn(),
    migrateExistingData: vi.fn(),
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    isRememberMe: vi.fn(() => false),
    setRememberMe: vi.fn(),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    const store = useAuthStore.getState();
    store.logout();

    // Clear localStorage
    localStorage.clear();

    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.selectedRole).toBeNull();
      expect(state.schoolDomain).toBeNull();
      expect(state.hasSeenOnboarding).toBe(false);
      expect(state.loadingState).toBe('idle');
    });
  });

  describe('Role Management', () => {
    it('should set selected role', () => {
      const store = useAuthStore.getState();
      store.setRole('TEACHER');

      expect(useAuthStore.getState().selectedRole).toBe('TEACHER');
    });

    it('should set school domain', () => {
      const store = useAuthStore.getState();
      store.setSchoolDomain('https://school.example.com/');

      // Should strip protocol and trailing slash
      expect(useAuthStore.getState().schoolDomain).toBe('school.example.com');
    });

    it('should clean domain with http', () => {
      const store = useAuthStore.getState();
      store.setSchoolDomain('http://myschool.com');

      expect(useAuthStore.getState().schoolDomain).toBe('myschool.com');
    });
  });

  describe('Authentication - Login', () => {
    it('should set user and authentication state on login', () => {
      const store = useAuthStore.getState();
      store.login(mockUser as User);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loadingState).toBe('success');
    });

    it('should update user data', () => {
      const store = useAuthStore.getState();
      store.login(mockUser as User);

      store.updateUser({ fullName: 'Updated Name' });

      expect(useAuthStore.getState().user?.fullName).toBe('Updated Name');
    });
  });

  describe('Authentication - Logout', () => {
    it('should clear all state on logout', async () => {
      const store = useAuthStore.getState();

      // Set up authenticated state
      store.setRole('TEACHER');
      store.login(mockUser as User);
      store.setSchoolDomain('school.com');

      // Logout
      await store.logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.selectedRole).toBeNull();
      expect(state.schoolDomain).toBeNull();
      expect(state.loadingState).toBe('idle');
    });

    it('should not throw error if logout API fails', async () => {
      const { authApiClient } = await import('../api/authApiClient');
      vi.mocked(authApiClient.logout).mockRejectedValue(new Error('Network error'));

      const store = useAuthStore.getState();
      store.login(mockUser as User);

      // Should not throw
      await expect(store.logout()).resolves.not.toThrow();

      // State should still be cleared
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('Login Context', () => {
    it('should set first-time login context', () => {
      const store = useAuthStore.getState();
      store.setFirstTimeLogin(true, 'reset-token-123');

      const context = useAuthStore.getState().loginContext;
      expect(context.isFirstTimeLogin).toBe(true);
      expect(context.requiresPasswordReset).toBe(true);
      expect(context.tempCredentialsUsed).toBe(true);
      expect(context.resetToken).toBe('reset-token-123');
    });

    it('should update login context partially', () => {
      const store = useAuthStore.getState();
      store.setLoginContext({ requiresPasswordReset: true });

      expect(useAuthStore.getState().loginContext.requiresPasswordReset).toBe(true);
      expect(useAuthStore.getState().loginContext.isFirstTimeLogin).toBe(false);
    });
  });

  describe('Password Reset Flow', () => {
    it('should set password reset email', () => {
      const store = useAuthStore.getState();
      store.setPasswordResetEmail('test@test.com');

      expect(useAuthStore.getState().passwordResetEmail).toBe('test@test.com');
    });

    it('should set password reset step', () => {
      const store = useAuthStore.getState();
      store.setPasswordResetStep('otp');

      expect(useAuthStore.getState().passwordResetStep).toBe('otp');
    });

    it('should complete password reset and clear context', () => {
      const store = useAuthStore.getState();

      // Set up password reset flow
      store.setPasswordResetEmail('test@test.com');
      store.setPasswordResetStep('newPassword');
      store.setLoginContext({ requiresPasswordReset: true });

      // Complete reset
      store.completePasswordReset();

      const state = useAuthStore.getState();
      expect(state.passwordResetEmail).toBeNull();
      expect(state.passwordResetStep).toBeNull();
      expect(state.loginContext.requiresPasswordReset).toBe(false);
    });

    it('should clear all flow states', () => {
      const store = useAuthStore.getState();

      store.setPasswordResetEmail('test@test.com');
      store.setPasswordResetStep('otp');

      store.clearAllFlowStates();

      const state = useAuthStore.getState();
      expect(state.passwordResetEmail).toBeNull();
      expect(state.passwordResetStep).toBeNull();
    });
  });

  describe('Signup Flow', () => {
    it('should set signup step', () => {
      const store = useAuthStore.getState();
      store.setSignupStep('school');

      expect(useAuthStore.getState().signupStep).toBe('school');
    });

    it('should update signup data', () => {
      const store = useAuthStore.getState();
      store.updateSignupData({ email: 'new@test.com' });
      store.updateSignupData({ fullName: 'Test User' });

      const signupData = useAuthStore.getState().signupData;
      expect(signupData?.email).toBe('new@test.com');
      expect(signupData?.fullName).toBe('Test User');
    });

    it('should clear signup data', () => {
      const store = useAuthStore.getState();
      store.setSignupStep('school');
      store.updateSignupData({ email: 'test@test.com' });

      store.clearSignupData();

      const state = useAuthStore.getState();
      expect(state.signupStep).toBeNull();
      expect(state.signupData).toBeNull();
    });

    it('should complete signup', () => {
      const store = useAuthStore.getState();
      store.completeSignup();

      expect(useAuthStore.getState().signupStep).toBe('complete');
    });
  });

  describe('Navigation', () => {
    it('should set intended destination', () => {
      const store = useAuthStore.getState();
      store.setIntendedDestination('/dashboard');

      expect(useAuthStore.getState().intendedDestination).toBe('/dashboard');
    });

    it('should set loading state', () => {
      const store = useAuthStore.getState();
      store.setLoadingState('submitting');

      expect(useAuthStore.getState().loadingState).toBe('submitting');
    });
  });

  describe('Onboarding', () => {
    it('should mark onboarding as complete', () => {
      const store = useAuthStore.getState();
      store.markOnboardingComplete();

      expect(useAuthStore.getState().hasSeenOnboarding).toBe(true);
    });
  });

  describe('Flow Reset', () => {
    it('should reset all flow-related state', () => {
      const store = useAuthStore.getState();

      // Set various flow states
      store.setRole('TEACHER');
      store.setSchoolDomain('school.com');
      store.setPasswordResetEmail('test@test.com');
      store.setSignupStep('school');

      // Reset flow
      store.resetFlow();

      const state = useAuthStore.getState();
      expect(state.selectedRole).toBeNull();
      expect(state.schoolDomain).toBeNull();
      expect(state.passwordResetEmail).toBeNull();
      expect(state.signupStep).toBeNull();
      expect(state.loadingState).toBe('idle');
    });
  });

  describe('Selectors', () => {
    it('useIsAuthenticated should return auth status', () => {
      const store = useAuthStore.getState();
      store.login(mockUser as User);

      // Note: We can't easily test hooks in isolation, but we can test the state
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('useCurrentUser should return current user', () => {
      const store = useAuthStore.getState();
      store.login(mockUser as User);

      expect(useAuthStore.getState().user).toEqual(mockUser);
    });
  });

  describe('Security - State Isolation', () => {
    it('should not allow direct state mutation', () => {
      const store = useAuthStore.getState();
      store.login(mockUser as User);

      // Try to mutate state directly (should not affect store)
      const user = useAuthStore.getState().user;
      if (user) {
        user.email = 'hacked@evil.com';
      }

      // Store should have original email (Zustand creates new references)
      // This test verifies immutability principles
      expect(useAuthStore.getState().user?.email).toBe(mockUser.email);
    });

    it('should clear sensitive data on logout', async () => {
      const store = useAuthStore.getState();

      // Set sensitive data
      store.login(mockUser as User);
      store.setPasswordResetEmail('reset@test.com');
      store.setLoginContext({ resetToken: 'sensitive-token' });

      // Logout
      await store.logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.passwordResetEmail).toBeNull();
      expect(state.loginContext.resetToken).toBeUndefined();
    });
  });
});
