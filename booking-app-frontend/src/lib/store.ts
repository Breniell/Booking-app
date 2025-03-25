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
      setUser: (user) => set({ user }),  
      logout: () => {  
        localStorage.removeItem('token');  
        set({ user: null });  
      },  
      darkMode: false,  
      toggleDarkMode: () =>  
        set((state) => {  
          document.documentElement.classList.toggle('dark', !state.darkMode);  
          return { darkMode: !state.darkMode };  
        })  
    }),  
    { name: 'auth-store' }  
  )  
);  