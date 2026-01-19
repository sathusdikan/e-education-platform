import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateSubscription = (subscriptionStatus) => {
    const updatedUser = { ...user, subscription: subscriptionStatus };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAdmin = () => user?.role === 'admin';
  const hasActiveSubscription = () => {
    if (!user?.subscription) return false;
    return user.subscription.status === 'active' && 
           new Date(user.subscription.expiry) > new Date();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateSubscription,
      isAdmin,
      hasActiveSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
};