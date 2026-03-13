"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACCOUNTS: Record<string, { password: string; name: string }> = {
  "demo@pestxlawn.com": { password: "demo123", name: "Demo User" },
  "james@gmail.com": { password: "password", name: "James" },
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pestxlawn_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("pestxlawn_user");
      }
    }
    setLoaded(true);
  }, []);

  const login = (email: string, password: string): boolean => {
    const normalizedEmail = email.toLowerCase().trim();

    // Check demo accounts first
    const demo = DEMO_ACCOUNTS[normalizedEmail];
    if (demo && password === demo.password) {
      const u: User = { name: demo.name, email: normalizedEmail };
      setUser(u);
      localStorage.setItem("pestxlawn_user", JSON.stringify(u));
      return true;
    }

    // Allow any valid email with password "password"
    if (isValidEmail(normalizedEmail) && password === "password") {
      const namePart = normalizedEmail.split("@")[0];
      const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const u: User = { name, email: normalizedEmail };
      setUser(u);
      localStorage.setItem("pestxlawn_user", JSON.stringify(u));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pestxlawn_user");
  };

  if (!loaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
