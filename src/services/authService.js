// Authentication Service with Supabase Integration
import { supabaseService } from './supabaseService';

// Initialize test users in localStorage if not exists
const initializeTestUsers = () => {
  if (!localStorage.getItem('users')) {
    const testUsers = [
      {
        id: 'admin_1',
        name: 'Admin User',
        email: 'admin@edulearn.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString(),
        subscription: {
          status: 'active',
          expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'student_1',
        name: 'John Doe',
        email: 'john@student.com',
        password: 'student123',
        role: 'student',
        createdAt: new Date().toISOString(),
        subscription: {
          status: 'active',
          expiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'student_2',
        name: 'Jane Smith',
        email: 'jane@student.com',
        password: 'student123',
        role: 'student',
        createdAt: new Date().toISOString(),
        subscription: {
          status: 'inactive',
          expiry: null
        }
      },
      {
        id: 'student_3',
        name: 'Mike Johnson',
        email: 'mike@student.com',
        password: 'student123',
        role: 'student',
        createdAt: new Date().toISOString(),
        subscription: {
          status: 'expired',
          expiry: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ];
    localStorage.setItem('users', JSON.stringify(testUsers));
  }
};

initializeTestUsers();

export const authService = {
  async login(email, password) {
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabaseService.signIn(email, password);
      
      if (error) {
        throw error;
      }

      // Get user profile from users table
      const userProfile = await supabaseService.getUserById(data.user.id);
      
      // Get subscription status
      const subscription = await supabaseService.getUserSubscription(data.user.id);

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: userProfile?.name || data.user.user_metadata?.name || 'User',
          role: userProfile?.role || 'student',
          subscription: subscription || {
            status: 'inactive',
            expiry: null
          }
        },
        token: data.session.access_token
      };
    } catch (error) {
      // Fallback to mock for development if Supabase not configured
      if (error.message?.includes('Invalid API key') || error.message?.includes('fetch')) {
        console.warn('Supabase not configured, using mock auth');
        return this.mockLogin(email, password);
      }
      throw error;
    }
  },

  async register(userData) {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabaseService.signUp(
        userData.email,
        userData.password,
        { name: userData.name }
      );

      if (error) {
        throw error;
      }

      // Create user profile in users table
      const userProfile = {
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        role: 'student'
      };

      await supabaseService.createUser(userProfile);

      // Get subscription (should be inactive for new users)
      const subscription = {
        status: 'inactive',
        expiry: null
      };

      return {
        user: {
          ...userProfile,
          subscription
        },
        token: data.session?.access_token || 'mock-token'
      };
    } catch (error) {
      // Fallback to mock for development
      if (error.message?.includes('Invalid API key') || error.message?.includes('fetch')) {
        console.warn('Supabase not configured, using mock registration');
        return this.mockRegister(userData);
      }
      throw error;
    }
  },

  async logout() {
    try {
      await supabaseService.signOut();
      return true;
    } catch (error) {
      // Fallback
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return true;
    }
  },

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
        subscription: subscription || {
          status: 'inactive',
          expiry: null
        }
      };
    } catch (error) {
      // Fallback to localStorage
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
  },

  // Mock methods for development (fallback)
  async mockLogin(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          resolve({
            user: userWithoutPassword,
            token: 'mock-jwt-token-' + Date.now()
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  },

  async mockRegister(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
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
            subscription: {
              status: 'inactive',
              expiry: null
            }
          };
          
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          
          const { password: _, ...userWithoutPassword } = newUser;
          
          resolve({
            user: userWithoutPassword,
            token: 'mock-jwt-token-' + Date.now()
          });
        } catch (error) {
          reject(new Error('Registration failed'));
        }
      }, 1000);
    });
  }
};
