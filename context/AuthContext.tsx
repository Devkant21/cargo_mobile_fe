import React, { createContext, ReactNode, useContext } from "react";
import { useAuthStore } from "../store/authStore";

interface AuthUser {
  email: string;
  name?: string | null;
  picture?: string | null;
}

interface AuthContextProps {
  user: AuthUser | null;
  isLoggedIn: boolean;
  setAuth: (user: AuthUser) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoggedIn, setUser, clearUser } = useAuthStore();

  const setAuth = (user: AuthUser) => setUser(user);
  const clearAuth = () => clearUser();

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
