import api from './api.js';
import { mockUsers } from '../data/mockData.js';

// For demo: Use mock data as primary source
const USE_MOCK_DATA = true; // Set to false to use real backend

export const authService = {
  register: async (userData) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const newUser = {
        user_id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.name || userData.full_name,
        phone: userData.phone,
        address: userData.address,
        role: 'customer',
        created_at: new Date().toISOString()
      };
      
      // Generate mock token
      const token = `mock_token_${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return {
        token,
        user: newUser
      };
    }
    
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check mock users
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Generate mock token
      const token = `mock_token_${Date.now()}`;
      const { password: _, ...userWithoutPassword } = user;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return {
        token,
        user: userWithoutPassword
      };
    }
    
    try {
      console.log('Attempting login to:', api.defaults.baseURL + '/auth/login');
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return { user: JSON.parse(userStr) };
      }
      // Return first mock user as default
      const { password: _, ...userWithoutPassword } = mockUsers[0];
      return { user: userWithoutPassword };
    }
    
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.warn('Using mock profile data');
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return { user: JSON.parse(userStr) };
      }
      return { user: mockUsers[0] };
    }
  },

  updateProfile: async (profileData) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const userStr = localStorage.getItem('user');
      let user = userStr ? JSON.parse(userStr) : mockUsers[0];
      user = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(user));
      return { user };
    }
    
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.warn('Using mock profile update');
      const userStr = localStorage.getItem('user');
      let user = userStr ? JSON.parse(userStr) : mockUsers[0];
      user = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(user));
      return { user };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

