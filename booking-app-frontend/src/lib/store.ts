// src/lib/store.ts
import { create } from 'zustand';

interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
  logout: () => void; // Ajoute cette ligne
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },   // Définis la fonction logout
  darkMode: false,
  toggleDarkMode: () => set((state) => {
    document.documentElement.classList.toggle('dark', !state.darkMode);
    return { darkMode: !state.darkMode };
  }),
}));
