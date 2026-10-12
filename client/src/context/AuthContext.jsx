import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const saveSession = (authData) => {
    localStorage.setItem("token", authData.token);
    setToken(authData.token);
    setUser(authData.user);
  };

  const login = async (data) => {
    const authData = await loginUser(data);
    saveSession(authData);
    return authData;
  };

  const register = async (data) => {
    const authData = await registerUser(data);
    saveSession(authData);
    return authData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("classtrack_token");
    setToken(null);
    setUser(null);
  };

  const checkAuth = async () => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      setToken(savedToken);
      const data = await getMe();
      setUser(data.user);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("classtrack:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("classtrack:session-expired", handleSessionExpired);
    };
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
    checkAuth
  }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
