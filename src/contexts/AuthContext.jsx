import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(api.getAccessToken());
  const [refreshToken, setRefreshToken] = useState(api.getRefreshToken());
  const [authLoading, setAuthLoading] = useState(false);

  const isAuthenticated = !!accessToken;

  useEffect(() => {
    const init = async () => {
      const token = api.getAccessToken();
      if (!token) return;

      try {
        const me = await api.getMe();
        setUser(me);
      } catch {
        setUser(null);
        setAccessToken(api.getAccessToken());
        setRefreshToken(api.getRefreshToken());
      }
    };
    init();
  }, []);

  const login = async (identifier, password) => {
    setAuthLoading(true);
    try {
      const data = await api.login(identifier, password); // OpenAPI payload already correct
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      setUser(data.user || null);
      return data;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await api.logout();
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setAuthLoading(false);
    }
  };

  const refreshAccess = async () => {
    const newAccess = await api.refreshAccessToken();
    setAccessToken(newAccess);
    return newAccess;
  };

  const reloadMe = async () => {
    const me = await api.getMe();
    setUser(me);
    return me;
  };

  const resendVerification = (email) => api.resendVerification(email);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      authLoading,
      login,
      logout,
      refreshAccess,
      reloadMe,
      resendVerification,
    }),
    [user, accessToken, refreshToken, isAuthenticated, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
