import api from './api.js';
import { mockMeters } from '../data/mockData.js';

// For demo: Use mock data as primary source
const USE_MOCK_DATA = true; // Set to false to use real backend

export const meterService = {
  /**
   * Get all meters for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of meters
   */
  getUserMeters: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockMeters;
    }
    
    try {
      const response = await api.get(`/meters/user/${userId}`);
      return response.data.meters;
    } catch (error) {
      console.warn('Using mock meters data');
      return mockMeters;
    }
  },

  /**
   * Get a specific meter by ID
   * @param {string} meterId - Meter ID
   * @returns {Promise<Object>} Meter object
   */
  getMeterById: async (meterId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockMeters.find(m => m.meter_id === meterId) || mockMeters[0];
    }
    
    try {
      const response = await api.get(`/meters/${meterId}`);
      return response.data.meter;
    } catch (error) {
      console.warn('Using mock meter data');
      return mockMeters.find(m => m.meter_id === meterId) || mockMeters[0];
    }
  },

  /**
   * Sync a meter (update last_sync timestamp)
   * @param {string} meterId - Meter ID
   * @returns {Promise<Object>} Updated meter object
   */
  syncMeter: async (meterId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const meter = mockMeters.find(m => m.meter_id === meterId) || mockMeters[0];
      meter.last_sync = new Date().toISOString();
      return meter;
    }
    
    try {
      const response = await api.post(`/meters/${meterId}/sync`);
      return response.data.meter;
    } catch (error) {
      console.warn('Using mock meter sync');
      const meter = mockMeters.find(m => m.meter_id === meterId) || mockMeters[0];
      meter.last_sync = new Date().toISOString();
      return meter;
    }
  },

  /**
   * Register a new meter
   * @param {Object} meterData - Meter registration data
   * @returns {Promise<Object>} Created meter object
   */
  registerMeter: async (meterData) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const newMeter = {
        ...mockMeters[0],
        meter_id: `meter_${Date.now()}`,
        meter_number: meterData.meter_number || `MTR${Date.now()}`,
        ...meterData,
        created_at: new Date().toISOString()
      };
      mockMeters.push(newMeter);
      return newMeter;
    }
    
    try {
      const response = await api.post('/meters', meterData);
      return response.data.meter;
    } catch (error) {
      console.warn('Using mock meter registration');
      const newMeter = {
        ...mockMeters[0],
        meter_id: `meter_${Date.now()}`,
        meter_number: meterData.meter_number || `MTR${Date.now()}`,
        ...meterData
      };
      return newMeter;
    }
  },
};

