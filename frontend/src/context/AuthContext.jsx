import { useState, useCallback } from 'react';
import { AuthContext } from './authContext';

const SESSION_KEY = 'flowops_token';
const REFRESH_KEY = 'flowops_refresh_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY));

  const login = useCallback((accessToken, refreshToken) => {
    sessionStorage.setItem(SESSION_KEY, accessToken);
    if (refreshToken) {
      sessionStorage.setItem(REFRESH_KEY, refreshToken);
    }
    setToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    setToken(null);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
