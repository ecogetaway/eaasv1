import api from './api.js';

export const notificationService = {
  getUserNotifications: async (userId, filters = {}) => {
    const response = await api.get(`/notifications/user/${userId}`, {
      params: filters,
    });
    return response.data.notifications || [];
  },

  getUnreadCount: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}/unread-count`);
    return response.data.count || 0;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
};

