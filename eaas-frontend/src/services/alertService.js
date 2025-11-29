import api from './api.js';
import { mockAlerts } from '../data/mockData.js';

// For demo: Use mock data as primary source
const USE_MOCK_DATA = true; // Set to false to use real backend

export const alertService = {
  getUserAlerts: async (userId, filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      let alerts = mockAlerts.filter(a => a.user_id === userId);
      
      if (filters.unresolved) {
        alerts = alerts.filter(a => !a.resolved_at);
      }
      
      return alerts;
    }
    
    try {
      const response = await api.get(`/alerts/user/${userId}`, {
        params: filters,
      });
      return response.data.alerts || [];
    } catch (error) {
      console.warn('Using mock alerts data');
      return mockAlerts;
    }
  },

  acknowledgeAlert: async (alertId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const alert = mockAlerts.find(a => a.alert_id === alertId);
      if (alert) {
        alert.acknowledged_at = new Date().toISOString();
      }
      return { success: true, alert: alert || mockAlerts[0] };
    }
    
    try {
      const response = await api.put(`/alerts/${alertId}/acknowledge`);
      return response.data;
    } catch (error) {
      console.warn('Using mock alert acknowledgment');
      return { success: true };
    }
  },

  resolveAlert: async (alertId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const alert = mockAlerts.find(a => a.alert_id === alertId);
      if (alert) {
        alert.resolved_at = new Date().toISOString();
      }
      return { success: true, alert: alert || mockAlerts[0] };
    }
    
    try {
      const response = await api.put(`/alerts/${alertId}/resolve`);
      return response.data;
    } catch (error) {
      console.warn('Using mock alert resolution');
      return { success: true };
    }
  },
};

