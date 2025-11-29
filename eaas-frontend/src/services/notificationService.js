import api from './api.js';
import { mockNotifications } from '../data/mockData.js';

// For demo: Use mock data as primary source
const USE_MOCK_DATA = true; // Set to false to use real backend

export const notificationService = {
  getUserNotifications: async (userId, filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      let notifications = mockNotifications.filter(n => n.user_id === userId);
      
      if (filters.unread) {
        notifications = notifications.filter(n => !n.read_at);
      }
      
      return notifications;
    }
    
    try {
      const response = await api.get(`/notifications/user/${userId}`, {
        params: filters,
      });
      return response.data.notifications || [];
    } catch (error) {
      console.warn('Using mock notifications data');
      return mockNotifications;
    }
  },

  getUnreadCount: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockNotifications.filter(n => n.user_id === userId && !n.read_at).length;
    }
    
    try {
      const response = await api.get(`/notifications/user/${userId}/unread-count`);
      return response.data.count || 0;
    } catch (error) {
      console.warn('Using mock unread count');
      return mockNotifications.filter(n => !n.read_at).length;
    }
  },

  markAsRead: async (notificationId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const notification = mockNotifications.find(n => n.notification_id === notificationId);
      if (notification) {
        notification.read_at = new Date().toISOString();
      }
      return { success: true };
    }
    
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.warn('Using mock mark as read');
      return { success: true };
    }
  },

  markAllAsRead: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      mockNotifications.forEach(n => {
        if (!n.read_at) {
          n.read_at = new Date().toISOString();
        }
      });
      return { success: true };
    }
    
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.warn('Using mock mark all as read');
      return { success: true };
    }
  },
};

