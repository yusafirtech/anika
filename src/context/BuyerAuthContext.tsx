"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Buyer } from "@/types/buyer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "anika_buyer_token";
const BUYER_KEY = "anika_buyer_profile";

interface BuyerAuthContextType {
  buyer: Buyer | null;
  token: string | null;
  isLoading: boolean;
  register: (data: {
    name: string;
    company?: string;
    email: string;
    password: string;
    country?: string;
    phone?: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
  resendVerification: () => Promise<{ ok: true; message: string } | { ok: false; error: string }>;
}

const BuyerAuthContext = createContext<BuyerAuthContextType | undefined>(undefined);

export function BuyerAuthProvider({ children }: { children: ReactNode }) {
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedBuyer = localStorage.getItem(BUYER_KEY);
      if (storedToken && storedBuyer) {
        // Hydrating session state from localStorage on mount — this effect
        // synchronizes with an external system (browser storage), which is
        // exactly the sanctioned use case the purity rule carves out.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(storedToken);
        setBuyer(JSON.parse(storedBuyer));
      }
    } catch {
      // ignore corrupt storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = useCallback((nextToken: string, nextBuyer: Buyer) => {
    try {
      localStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.setItem(BUYER_KEY, JSON.stringify(nextBuyer));
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
    setToken(nextToken);
    setBuyer(nextBuyer);
  }, []);

  const register: BuyerAuthContextType["register"] = useCallback(
    async (data) => {
      try {
        const res = await fetch(`${API_URL}/buyer-auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) return { ok: false, error: json.error || "Registration failed." };
        persist(json.token, json.buyer);
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not reach the server. Please try again." };
      }
    },
    [persist]
  );

  const login: BuyerAuthContextType["login"] = useCallback(
    async (email, password) => {
      try {
        const res = await fetch(`${API_URL}/buyer-auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const json = await res.json();
        if (!res.ok) return { ok: false, error: json.error || "Login failed." };
        persist(json.token, json.buyer);
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not reach the server. Please try again." };
      }
    },
    [persist]
  );

  const resendVerification: BuyerAuthContextType["resendVerification"] = useCallback(async () => {
    if (!token) return { ok: false, error: "You must be signed in." };
    try {
      const res = await fetch(`${API_URL}/buyer-auth/resend-verification`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) return { ok: false, error: json.error || "Failed to resend." };
      return { ok: true, message: json.message };
    } catch {
      return { ok: false, error: "Could not reach the server. Please try again." };
    }
  }, [token]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(BUYER_KEY);
    } catch {
      // ignore
    }
    setToken(null);
    setBuyer(null);
  }, []);

  return (
    <BuyerAuthContext.Provider value={{ buyer, token, isLoading, register, login, logout, resendVerification }}>
      {children}
    </BuyerAuthContext.Provider>
  );
}

export function useBuyerAuth() {
  const ctx = useContext(BuyerAuthContext);
  if (!ctx) throw new Error("useBuyerAuth must be used within a BuyerAuthProvider");
  return ctx;
}
