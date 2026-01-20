import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { supabase } from '../config/supabase';
import { supabaseService } from '../services/supabaseService';

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

    // Listen for auth state changes (e.g., email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in (possibly after email confirmation)
        try {
          // Get user profile from database
          const userProfile = await supabaseService.getUserById(session.user.id);

          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: userProfile?.name || session.user.user_metadata?.name || 'User',
            role: userProfile?.role || 'student',
            subscription: userProfile?.subscription || { status: 'inactive', expiry: null }
          };

          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', session.access_token);
        } catch (error) {
          console.error('Failed to handle auth state change:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
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

      if (response.requiresEmailConfirmation) {
        // Email confirmation required - don't set user yet
        return {
          success: true,
          requiresEmailConfirmation: true,
          message: response.message,
          email: response.email
        };
      }

      // Normal registration - user created immediately
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