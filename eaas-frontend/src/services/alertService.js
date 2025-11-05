import api from './api.js';

export const alertService = {
  getUserAlerts: async (userId, filters = {}) => {
    const response = await api.get(`/alerts/user/${userId}`, {
      params: filters,
    });
    return response.data.alerts || [];
  },

  acknowledgeAlert: async (alertId) => {
    const response = await api.put(`/alerts/${alertId}/acknowledge`);
    return response.data;
  },

  resolveAlert: async (alertId) => {
    const response = await api.put(`/alerts/${alertId}/resolve`);
    return response.data;
  },
};

