import { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated, logout } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout, isAuthenticated: isAuthenticated() }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
