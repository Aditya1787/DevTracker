import React, { createContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load user profile if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await getMe();
          if (res.success) {
            setUser(res.data);
            setIsAuthenticated(true);
          } else {
            handleLogoutState();
          }
        } catch (error) {
          console.error('Failed to load user info:', error);
          handleLogoutState();
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Set user state when user object changes or after loading complete
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [user]);

  const handleLogoutState = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await apiLogin(credentials);
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        if (res.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
          setUser(res.data);
        }
        setToken(res.token);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, message: res.message || 'Login failed' };
      }
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid credentials or server connection failed' 
      };
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const res = await apiSignup(userData);
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        if (res.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
          setUser(res.data);
        }
        setToken(res.token);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, message: res.message || 'Registration failed' };
      }
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Email might already exist.' 
      };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error on backend:', error);
    } finally {
      handleLogoutState();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
