import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  familyId: string | null;
  setUser: (user: User | null) => void;
  setFamilyId: (familyId: string | null) => void;
  clearAuth: () => void;
}

/**
 * Zustand store for authentication state
 * Persisted to localStorage for PWA offline support
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      familyId: null,
      setUser: (user) => set({ user }),
      setFamilyId: (familyId) => set({ familyId }),
      clearAuth: () => set({ user: null, familyId: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
