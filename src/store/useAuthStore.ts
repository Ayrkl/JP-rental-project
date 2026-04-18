import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'tenant';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Mock Login fonksiyonu, test için kullanıyoruz. Backend geldiğinde burası
      // tRPC'den token alıp set edeceği yere dönüşecek.
      login: (userData, token) => 
        set({ user: userData, token, isAuthenticated: true }),

      logout: () => 
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // Geçici olarak auth state'ini tutuyoruz
    }
  )
);
