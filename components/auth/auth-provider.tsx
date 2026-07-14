"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from "@/lib/api-client";
import { clearClientAccessToken, getClientAccessToken, setClientAccessToken } from "@/lib/auth-cookie";

interface AuthContextValue {
  accessToken: string | null;
  isAuthenticated: boolean;
  loginWithGoogleIdToken: (idToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    setAccessToken(getClientAccessToken());
  }, []);

  const loginWithGoogleIdToken = useCallback(async (idToken: string) => {
    const { accessToken: token } = await loginWithGoogle(idToken);
    setClientAccessToken(token);
    setAccessToken(token);
  }, []);

  const logout = useCallback(() => {
    clearClientAccessToken();
    setAccessToken(null);
    router.push("/login");
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ accessToken, isAuthenticated: Boolean(accessToken), loginWithGoogleIdToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
