import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authenticateUser } from '../api/serviceNow';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sn_user_session');
      if (!savedUser) return null;
      
      // Basic obfuscation to avoid plaintext PII in localStorage
      let decodedString;
      try {
        decodedString = atob(savedUser);
      } catch (e) {
        // Handle legacy plaintext session
        localStorage.removeItem('sn_user_session');
        return null;
      }
      
      const decoded = JSON.parse(decodedString);
      
      // Session expiry check (8 hours)
      const now = new Date().getTime();
      if (decoded.expiry && now > decoded.expiry) {
        localStorage.removeItem('sn_user_session');
        return null;
      }
      
      return decoded.user;
    } catch (e) {
      console.error("Session restore failed", e);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const userData = await authenticateUser(username, password);
      setUser(userData);
      
      // Store obfuscated session with 8-hour expiry
      const sessionData = {
        user: userData,
        expiry: new Date().getTime() + (8 * 60 * 60 * 1000)
      };
      localStorage.setItem('sn_user_session', btoa(JSON.stringify(sessionData)));
      
      return userData;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sn_user_session');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
