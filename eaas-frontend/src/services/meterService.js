import api from './api.js';

export const meterService = {
  /**
   * Get all meters for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of meters
   */
  getUserMeters: async (userId) => {
    const response = await api.get(`/meters/user/${userId}`);
    return response.data.meters;
  },

  /**
   * Get a specific meter by ID
   * @param {string} meterId - Meter ID
   * @returns {Promise<Object>} Meter object
   */
  getMeterById: async (meterId) => {
    const response = await api.get(`/meters/${meterId}`);
    return response.data.meter;
  },

  /**
   * Sync a meter (update last_sync timestamp)
   * @param {string} meterId - Meter ID
   * @returns {Promise<Object>} Updated meter object
   */
  syncMeter: async (meterId) => {
    const response = await api.post(`/meters/${meterId}/sync`);
    return response.data.meter;
  },

  /**
   * Register a new meter
   * @param {Object} meterData - Meter registration data
   * @returns {Promise<Object>} Created meter object
   */
  registerMeter: async (meterData) => {
    const response = await api.post('/meters', meterData);
    return response.data.meter;
  },
};

