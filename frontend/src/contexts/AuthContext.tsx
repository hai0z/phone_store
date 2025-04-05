import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  admin: User | null;
  token: string | null;
  loading: boolean;
  login: (
    type: "customer" | "admin",
    emailOrPhone: string,
    password: string
  ) => Promise<void>;
  register: (
    full_name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<any>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
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
  const [admin, setAdmin] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const pathName = useLocation().pathname;

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [pathName]);

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

        if (userData.role === "admin") {
          setAdmin(userData);
        } else {
          setUser(userData);
        }
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

      if (type === "admin") {
        setAdmin(data.user);
      } else {
        setUser(data.user);
      }
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (error: any) {
      throw new Error(error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    full_name: string,
    email: string,
    phone: string,
    password: string
  ) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/customer/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ full_name, email, phone, password }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Đăng ký thất bại");
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/customer/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Gửi email khôi phục mật khẩu thất bại");
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/customer/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Đặt lại mật khẩu thất bại");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAdmin(null);

    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!token,
    admin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
