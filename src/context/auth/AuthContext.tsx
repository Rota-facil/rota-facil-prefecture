"use client";

import { createContext, useEffect, useState } from "react";

import { getToken, removeToken, saveToken } from "@/service/auth/TokenService";

type AuthContextType = {
  authenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    setAuthenticated(!!token);
    setLoading(false);
  }, []);

  function login(token: string) {
    saveToken(token);

    setAuthenticated(true);
  }

  function logout() {
    removeToken();

    setAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
