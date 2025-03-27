// src/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
  logout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        // Stockage de l’utilisateur dans le localStorage
        localStorage.setItem('user', JSON.stringify(user));
        if (user.token) localStorage.setItem('token', user.token);
        set({ user });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null });
      },
      darkMode: false,
      toggleDarkMode: () => {
        document.documentElement.classList.toggle('dark', !JSON.parse(localStorage.getItem('darkMode') || 'false'));
        set((state) => {
          const newMode = !state.darkMode;
          localStorage.setItem('darkMode', JSON.stringify(newMode));
          return { darkMode: newMode };
        });
      },
    }),
    { name: 'auth-store' }
  )
);
