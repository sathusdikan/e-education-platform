// Authentication Service with Supabase Integration
import { supabaseService } from './supabaseService';

export const authService = {
  // =======================
  // LOGIN
  // =======================
  async login(email, password) {
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabaseService.signIn(email, password);

      if (error) throw error;

      // Get user profile from public.users table
      const userProfile = await supabaseService.getUserById(data.user.id);

      // Get subscription info
      const subscription = await supabaseService.getUserSubscription(data.user.id);

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: userProfile?.name || data.user.user_metadata?.name || 'User',
          role: userProfile?.role || 'student',
          subscription: subscription || { status: 'inactive', expiry: null }
        },
        token: data.session?.access_token
      };
    } catch (error) {
      // Fallback for development/mock environment
      if (error.message?.includes('Invalid API key') || error.message?.includes('fetch')) {
        console.warn('Supabase not configured, using mock auth');
        return this.mockLogin(email, password);
      }
      throw error;
    }
  },

  // =======================
  // REGISTER
  // =======================
  async register(userData) {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabaseService.signUp(
        userData.email,
        userData.password,
        { name: userData.name } // Supabase user_metadata
      );

      if (error) throw error;

      // Check if data exists
      if (!data) {
        throw new Error('Registration failed: No response from authentication service');
      }

      // Handle email confirmation flow
      if (!data.user) {
        // Email confirmation is required - user not created yet
        return {
          user: null,
          requiresEmailConfirmation: true,
          message: 'Registration successful. Please check your email to confirm your account before logging in.',
          email: userData.email
        };
      }

      // User created immediately - insert profile into public.users table
      const { error: profileError } = await supabaseService.createUser({
        id: data.user.id,
        name: userData.name,
        email: data.user.email,
        role: 'student'
      });

      if (profileError) {
        console.error('Failed to create user profile:', profileError);
        // Don't throw here, user is created in auth, but profile failed
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || userData.name,
          role: 'student',
          subscription: { status: 'inactive', expiry: null }
        },
        token: data.session?.access_token,
        requiresEmailConfirmation: false
      };
    } catch (error) {
      if (
        error.message?.includes('Invalid API key') ||
        error.message?.includes('fetch')
      ) {
        console.warn('Supabase not configured, using mock registration');
        return this.mockRegister(userData);
      }
      throw error;
    }
  },

  // =======================
  // LOGOUT
  // =======================
  async logout() {
    try {
      await supabaseService.signOut();
      return true;
    } catch (error) {
      // Fallback for mock
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return true;
    }
  },

  // =======================
  // GET CURRENT USER
  // =======================
  async getCurrentUser() {
    try {
      const user = await supabaseService.getCurrentUser();
      if (!user) return null;

      const userProfile = await supabaseService.getUserById(user.id);
      const subscription = await supabaseService.getUserSubscription(user.id);

      return {
        id: user.id,
        email: user.email,
        name: userProfile?.name || user.user_metadata?.name || 'User',
        role: userProfile?.role || 'student',
        subscription: subscription || { status: 'inactive', expiry: null }
      };
    } catch (error) {
      // Fallback to localStorage for mock users
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
  },

  // =======================
  // MOCK METHODS (for dev)
  // =======================
  async mockLogin(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          resolve({ user: userWithoutPassword, token: 'mock-jwt-token-' + Date.now() });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  },

  async mockRegister(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.some(u => u.email === userData.email)) {
          reject(new Error('User already exists with this email'));
          return;
        }

        const newUser = {
          id: 'user_' + Date.now(),
          ...userData,
          role: 'student',
          createdAt: new Date().toISOString(),
          subscription: { status: 'inactive', expiry: null }
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const { password: _, ...userWithoutPassword } = newUser;

        resolve({ user: userWithoutPassword, token: 'mock-jwt-token-' + Date.now() });
      }, 500);
    });
  }
};
