import { create } from "zustand";

interface AuthUser {
  email: string;
  name?: string | null;
  picture?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  setAuth: (user, token) => set({ user, token, isLoggedIn: true }),
  clearUser: () => set({ user: null, isLoggedIn: false }),
}));
