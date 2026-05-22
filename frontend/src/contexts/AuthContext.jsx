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
          console.log('loadUser (getMe) response:', res);
          
          const success = res && (res.success || res.status === 'success');
          const userVal = res && (res.user || res.data?.user || res.data);
          
          if (success && userVal) {
            setUser(userVal);
            setIsAuthenticated(true);
            setIsLoading(false);
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
      console.log('Login API Response:', res);
      
      const success = res && (res.success || res.status === 'success' || (res.data?.token ? true : false) || (res.token ? true : false));
      const tokenVal = res && (res.token || res.data?.token || (typeof res.data === 'string' ? res.data : null));
      const userVal = res && (res.user || res.data?.user || (res.data && !res.data.token ? res.data : null));
      
      if (success && tokenVal) {
        localStorage.setItem('token', tokenVal);
        if (userVal) {
          localStorage.setItem('user', JSON.stringify(userVal));
          setUser(userVal);
        }
        setToken(tokenVal);
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, message: res?.message || 'Login failed' };
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
      console.log('Signup API Response:', res);
      
      const success = res && (res.success || res.status === 'success' || (res.data?.token ? true : false) || (res.token ? true : false));
      const tokenVal = res && (res.token || res.data?.token || (typeof res.data === 'string' ? res.data : null));
      const userVal = res && (res.user || res.data?.user || (res.data && !res.data.token ? res.data : null));
      
      if (success && tokenVal) {
        localStorage.setItem('token', tokenVal);
        if (userVal) {
          localStorage.setItem('user', JSON.stringify(userVal));
          setUser(userVal);
        }
        setToken(tokenVal);
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, message: res?.message || 'Registration failed' };
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
