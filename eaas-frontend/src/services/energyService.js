import api from './api.js';
import { mockCurrentEnergy, mockEnergyHistory, mockDashboardSummary } from '../data/mockData.js';

// For demo: Use mock data as primary source
const USE_MOCK_DATA = true; // Set to false to use real backend

export const energyService = {
  getCurrentEnergy: async (userId) => {
    if (USE_MOCK_DATA) {
      // Simulate real-time data with slight variations
      await new Promise(resolve => setTimeout(resolve, 200));
      const now = new Date();
      // Add small random variations to make it feel live
      const variation = () => (Math.random() - 0.5) * 0.3;
      const mockData = {
        ...mockCurrentEnergy,
        timestamp: now.toISOString(),
        solar_generation: Math.max(0, mockCurrentEnergy.solar_generation + variation()),
        grid_import: Math.max(0, mockCurrentEnergy.grid_import + variation()),
        grid_export: Math.max(0, mockCurrentEnergy.grid_export + variation()),
        battery_charge: Math.max(0, Math.min(5, mockCurrentEnergy.battery_charge + variation())),
        total_consumption: Math.max(0, mockCurrentEnergy.total_consumption + variation())
      };
      return { data: mockData };
    }
    
    try {
      const response = await api.get(`/energy/current/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock current energy data');
      const mockData = {
        ...mockCurrentEnergy,
        timestamp: new Date().toISOString()
      };
      return { data: mockData };
    }
  },

  getEnergyHistory: async (userId, period = 'day') => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const days = period === 'week' ? 7 : period === 'month' ? 30 : 1;
      const history = mockEnergyHistory(days);
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - days);
      
      return {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        data: history
      };
    }
    
    try {
      const response = await api.get(`/energy/history/${userId}`, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.warn('Using mock energy history');
      const days = period === 'week' ? 7 : period === 'month' ? 30 : 1;
      const history = mockEnergyHistory(days);
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - days);
      
      return {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        data: history
      };
    }
  },

  getDashboardSummary: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockDashboardSummary;
    }
    
    try {
      const response = await api.get(`/energy/dashboard/summary/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock dashboard summary');
      return mockDashboardSummary;
    }
  },
};

