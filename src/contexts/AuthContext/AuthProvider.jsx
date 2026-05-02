import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router";
import API from "../../api/auth"; // your axios instance

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // start as true
  const navigate = useNavigate();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error(err); // only log real issues
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  const register = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", data, {
        withCredentials: true,
      });
      setUser(res.data.user);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };
  const login = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", data, { withCredentials: true });
      setUser(res.data.user);
      navigate("/homepage");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};