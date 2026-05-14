"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

interface AuthState {
  user: User | null;
}

const USER_STORAGE_KEY = "auth-user";
const LEGACY_STORAGE_KEY = "auth";

function readStoredAuth(): AuthState {
  if (typeof window === "undefined") return { user: null };

  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);

    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (!saved) return { user: null };

    const user = JSON.parse(saved) as User;
    if (!user.id || !user.email || !user.role) return { user: null };

    return { user };
  } catch {
    return { user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(readStoredAuth);
  const [loading, setLoading] = useState(() => auth.user === null);
  const skipSessionRefresh = useRef(false);

  useEffect(() => {
    if (skipSessionRefresh.current) return;

    let active = true;

    void fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as { user: User };
      })
      .then((data) => {
        if (!active) return;

        if (!data?.user) {
          setAuth({ user: null });
          localStorage.removeItem(USER_STORAGE_KEY);
          return;
        }

        setAuth({ user: data.user });
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback((u: User) => {
    skipSessionRefresh.current = false;
    setAuth({ user: u });
    setLoading(false);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    skipSessionRefresh.current = true;
    setAuth({ user: null });
    setLoading(false);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    void fetch("/api/auth/logout", { method: "POST" });
  }, []);

  return (
    <AuthContext.Provider value={{ user: auth.user, token: null, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
