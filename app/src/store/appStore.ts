import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const ONBOARDING_KEY = '@cgpa/hasSeenOnboarding';

interface AppState {
  hasSeenOnboarding: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  hasSeenOnboarding: false,
  isHydrated: false,
  hydrate: async () => {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    set({ hasSeenOnboarding: value === 'true', isHydrated: true });
  },
  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    set({ hasSeenOnboarding: true });
  },
}));
