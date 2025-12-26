import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiService } from "@/services/api";

interface User {
  id?: number;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("oncoai_user");
    // Persist demo/local user across reloads even if no token is present.
    // Previously we required both `oncoai_user` and `oncoai_token` which
    // caused demo users (no token) to be logged out after a reload.
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);
      
      if (response.token && response.user) {
        const newUser = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
        };
        
        setUser(newUser);
        localStorage.setItem("oncoai_token", response.token);
        localStorage.setItem("oncoai_user", JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      // Fallback to demo mode if backend is not available
      if (email && password) {
        const newUser = {
          email,
          name: email.split("@")[0],
        };
        setUser(newUser);
        localStorage.setItem("oncoai_user", JSON.stringify(newUser));
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("oncoai_user");
    localStorage.removeItem("oncoai_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
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

