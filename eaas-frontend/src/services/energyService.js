import api from './api.js';

export const energyService = {
  getCurrentEnergy: async (userId) => {
    const response = await api.get(`/energy/current/${userId}`);
    return response.data; // Returns { data: {...} }
  },

  getEnergyHistory: async (userId, period = 'day') => {
    const response = await api.get(`/energy/history/${userId}`, {
      params: { period },
    });
    return response.data; // Returns { period, startDate, endDate, data: [...] }
  },

  getDashboardSummary: async (userId) => {
    const response = await api.get(`/energy/dashboard/summary/${userId}`);
    return response.data; // Returns { today: {...}, month: {...} }
  },
};

