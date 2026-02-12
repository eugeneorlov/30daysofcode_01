import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = (email, password) => {
    const userData = { email, name: email.split("@")[0] };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return Promise.resolve(userData);
  };

  const signUp = (email, password, name) => {
    const userData = { email, name: name || email.split("@")[0] };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return Promise.resolve(userData);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
