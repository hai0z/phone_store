import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  customer_id?: number;
  admin_id?: number;
  full_name?: string;
  email?: string;
  phone?: string;
  role: "admin" | "customer";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (
    type: "customer" | "admin",
    emailOrPhone: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      validateToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/validate",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setToken(token);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    type: "customer" | "admin",
    emailOrPhone: string,
    password: string
  ) => {
    try {
      setLoading(true);

      const endpoint =
        type === "admin"
          ? "http://localhost:8080/api/v1/auth/admin/login"
          : "http://localhost:8080/api/v1/auth/customer/login";

      const body =
        type === "admin"
          ? { username: emailOrPhone, password }
          : { emailOrPhone, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
