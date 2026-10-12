import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getMe, loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionVersion = useRef(0);

  const saveSession = (authData) => {
    if (!authData?.token) {
      throw new Error("Invalid login response: missing token");
    }
    sessionVersion.current += 1;
    localStorage.setItem("token", authData.token);
    setToken(authData.token);
    setUser(authData.user || null);
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
    sessionVersion.current += 1;
    localStorage.removeItem("token");
    localStorage.removeItem("classtrack_token");
    setToken(null);
    setUser(null);
  };

  const checkAuth = async () => {
    const myVersion = sessionVersion.current;
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      setToken(savedToken);
      const data = await getMe();
      if (sessionVersion.current !== myVersion) return;
      setUser(data.user);
    } catch (error) {
      if (sessionVersion.current !== myVersion) return;
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      if (sessionVersion.current === myVersion) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
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
    throw new Error("useAuth must be used inside AuthContext");
  }

  return context;
};
