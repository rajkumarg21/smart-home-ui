import { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated, logout } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    console.log("[AuthContext] useEffect - localStorage token:", token);
    console.log("[AuthContext] useEffect - localStorage username:", username);
    console.log("[AuthContext] useEffect - localStorage email:", email);

    if (token && token !== "undefined" && token !== "null") {
      const userObj = { token, username, email };
      console.log("[AuthContext] Setting user from localStorage:", userObj);
      setUser(userObj);
    } else {
      console.log("[AuthContext] No valid token found, user stays null");
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    console.log("[AuthContext] handleLogout called, clearing user");
    setUser(null);
    logout();
  };

  // Wrap setUser to add logging
  const setUserWithLog = (userObj) => {
    console.log("[AuthContext] setUser called with:", userObj);
    setUser(userObj);
  };

  console.log("[AuthContext] Current user state:", user);
  console.log("[AuthContext] isAuthenticated:", isAuthenticated());

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: setUserWithLog,
        handleLogout,
        isAuthenticated: isAuthenticated(),
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
