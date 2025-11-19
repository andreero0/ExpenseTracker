/**
 * User Store (Zustand)
 * Manages user preferences and settings
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  biometricEnabled: boolean;
}

interface UserState {
  // State
  preferences: UserPreferences;
  onboardingCompleted: boolean;

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  toggleNotification: (type: 'push' | 'email' | 'sms') => void;
  setBiometric: (enabled: boolean) => void;
  completeOnboarding: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    push: true,
    email: true,
    sms: false,
  },
  biometricEnabled: false,
};

/**
 * User Store
 * Persisted user preferences using AsyncStorage
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      preferences: defaultPreferences,
      onboardingCompleted: false,

      // Set theme
      setTheme: (theme) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            theme,
          },
        })),

      // Set language
      setLanguage: (language) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            language,
          },
        })),

      // Toggle notification preference
      toggleNotification: (type) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            notifications: {
              ...state.preferences.notifications,
              [type]: !state.preferences.notifications[type],
            },
          },
        })),

      // Set biometric preference
      setBiometric: (enabled) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            biometricEnabled: enabled,
          },
        })),

      // Mark onboarding as completed
      completeOnboarding: () => set({ onboardingCompleted: true }),

      // Reset preferences to default
      resetPreferences: () =>
        set({
          preferences: defaultPreferences,
          onboardingCompleted: false,
        }),
    }),
    {
      name: 'user-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;
