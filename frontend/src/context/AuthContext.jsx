import { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

function parseUser(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { username: payload.sub, role: payload.roles?.[0] };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    return t ? parseUser(t) : null;
  });
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setError(null);
    try {
      const data = await authApi.login({ username, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({ username: data.username, role: data.role, totalPoints: data.totalPoints });
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    setError(null);
    try {
      const data = await authApi.register({ username, email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({ username: data.username, role: data.role, totalPoints: data.totalPoints });
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, error, login, register, logout, isAdmin: user?.role === "ROLE_ADMIN" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
