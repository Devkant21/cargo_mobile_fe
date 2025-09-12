import { create } from "zustand";

interface AuthUser {
  email: string;
  name?: string | null;
  picture?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: true }),
  clearUser: () => set({ user: null, isLoggedIn: false }),
}));
