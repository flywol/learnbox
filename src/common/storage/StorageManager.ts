// src/common/storage/StorageManager.ts
/**
 * Centralized Storage Manager for LearnBox Admin
 * 
 * Features:
 * - Unified storage strategy based on "Remember Me" preference
 * - Centralized key management
 * - Complete cleanup on logout
 * - Migration support for existing data
 * - Type-safe storage operations
 */

export interface StorageConfig {
  key: string;
  persistent?: boolean; // If true, always use localStorage regardless of Remember Me
}

export class StorageManager {
  private static instance: StorageManager;
  private readonly rememberMeKey = 'learnbox_remember_me';
  
  // Centralized storage keys registry
  private readonly storageKeys = {
    // Authentication
    auth: 'learnbox-auth-storage',
    userProfile: 'learnbox_user_data',
    accessToken: 'learnbox_access_token',
    refreshToken: 'learnbox_refresh_token',
    rememberMe: 'learnbox_remember_me',
    
    // Application data
    schoolSetup: 'school-setup-storage',
    sessionSetup: 'session-setup-storage',
    
    // Legacy keys for cleanup
    legacyAccessToken: 'access_token',
    legacyRefreshToken: 'refresh_token',
    legacyRememberMe: 'remember_me',
  } as const;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Get the appropriate storage based on Remember Me preference
   */
  private getStorage(): Storage {
    const rememberMe = localStorage.getItem(this.rememberMeKey) === 'true';
    return rememberMe ? localStorage : sessionStorage;
  }

  /**
   * Set Remember Me preference
   */
  setRememberMe(remember: boolean): void {
    if (remember) {
      localStorage.setItem(this.rememberMeKey, 'true');
    } else {
      localStorage.removeItem(this.rememberMeKey);
    }
  }

  /**
   * Get Remember Me preference
   */
  isRememberMe(): boolean {
    return localStorage.getItem(this.rememberMeKey) === 'true';
  }

  /**
   * Set item in appropriate storage
   */
  setItem(key: string, value: string, config?: StorageConfig): void {
    const storage = config?.persistent ? localStorage : this.getStorage();
    storage.setItem(key, value);
  }

  /**
   * Get item from storage (checks both localStorage and sessionStorage)
   */
  getItem(key: string): string | null {
    // First check the appropriate storage based on Remember Me
    const primaryStorage = this.getStorage();
    const value = primaryStorage.getItem(key);
    
    if (value) return value;
    
    // Fallback: check both storages for migration compatibility
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  /**
   * Remove item from both storages
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  /**
   * Clear all application data (complete logout)
   */
  clearAllAppData(keepRememberMe: boolean = true): void {
    
    // Clear all registered keys
    Object.values(this.storageKeys).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Pattern-based cleanup for any remaining learnbox-related keys
    this.clearPatternKeys(localStorage);
    this.clearPatternKeys(sessionStorage);

    // Optionally keep Remember Me preference for next login
    if (keepRememberMe && this.isRememberMe()) {
      localStorage.setItem(this.rememberMeKey, 'true');
    }

  }

  /**
   * Clear keys matching patterns
   */
  private clearPatternKeys(storage: Storage): void {
    const patterns = ['learnbox', 'auth', 'token', 'user', 'school-setup'];
    
    Object.keys(storage).forEach(key => {
      if (patterns.some(pattern => key.includes(pattern))) {
        storage.removeItem(key);
      }
    });
  }

  /**
   * Migrate existing data to new storage strategy
   */
  migrateExistingData(): void {
    
    const rememberMe = this.isRememberMe();
    const targetStorage = rememberMe ? localStorage : sessionStorage;
    const sourceStorage = rememberMe ? sessionStorage : localStorage;
    
    // Migrate data if it exists in the wrong storage
    Object.values(this.storageKeys).forEach(key => {
      const sourceValue = sourceStorage.getItem(key);
      if (sourceValue && !targetStorage.getItem(key)) {
        targetStorage.setItem(key, sourceValue);
        sourceStorage.removeItem(key);
      }
    });

  }

  /**
   * Get storage keys for external use
   */
  getStorageKeys() {
    return this.storageKeys;
  }

  /**
   * Create a custom storage adapter for Zustand persist
   */
  createZustandStorage() {
    return {
      getItem: (key: string) => {
        const value = this.getItem(key);
        if (value === null) return null;
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      },
      setItem: (key: string, value: unknown) => {
        this.setItem(key, JSON.stringify(value));
      },
      removeItem: (key: string) => {
        this.removeItem(key);
      },
    };
  }

  /**
   * Debug: Log current storage state
   */
  debugStorageState(): void {
  }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance();