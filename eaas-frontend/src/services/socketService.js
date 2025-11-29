import { io } from 'socket.io-client';
import { WS_URL } from '../utils/constants.js';
import { mockCurrentEnergy } from '../data/mockData.js';

// For demo: Use mock data as primary source
const USE_MOCK_DATA = true; // Set to false to use real backend

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.mockInterval = null;
    this.energyCallbacks = [];
  }

  connect() {
    if (USE_MOCK_DATA) {
      // Simulate WebSocket connection for demo
      console.log('✅ Mock WebSocket connected (demo mode)');
      this.isConnected = true;
      
      // Start simulating real-time energy updates
      this.startMockUpdates();
      
      // Return a mock socket object
      return {
        connected: true,
        emit: () => {},
        on: () => {},
        off: () => {},
        disconnect: () => this.stopMockUpdates()
      };
    }
    
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  startMockUpdates() {
    // Simulate real-time energy updates every 5 seconds
    this.mockInterval = setInterval(() => {
      const variation = () => (Math.random() - 0.5) * 0.3;
      const mockData = {
        ...mockCurrentEnergy,
        timestamp: new Date().toISOString(),
        solar_generation: Math.max(0, mockCurrentEnergy.solar_generation + variation()),
        grid_import: Math.max(0, mockCurrentEnergy.grid_import + variation()),
        grid_export: Math.max(0, mockCurrentEnergy.grid_export + variation()),
        battery_charge: Math.max(0, Math.min(5, mockCurrentEnergy.battery_charge + variation())),
        total_consumption: Math.max(0, mockCurrentEnergy.total_consumption + variation())
      };
      
      // Call all registered callbacks
      this.energyCallbacks.forEach(callback => {
        callback(mockData);
      });
    }, 5000);
  }

  stopMockUpdates() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    this.isConnected = false;
  }

  subscribeToUser(userId) {
    if (!this.socket) {
      this.connect();
    }
    this.socket.emit('subscribe_user', userId);
  }

  unsubscribeFromUser(userId) {
    if (this.socket) {
      this.socket.emit('unsubscribe_user', userId);
    }
  }

  onEnergyUpdate(callback) {
    if (USE_MOCK_DATA) {
      // Store callback for mock updates
      this.energyCallbacks.push(callback);
      if (!this.isConnected) {
        this.connect();
      }
      return;
    }
    
    if (!this.socket) {
      this.connect();
    }
    this.socket.on('energy_update', callback);
  }

  offEnergyUpdate(callback) {
    if (USE_MOCK_DATA) {
      // Remove callback from mock updates
      this.energyCallbacks = this.energyCallbacks.filter(cb => cb !== callback);
      return;
    }
    
    if (this.socket) {
      this.socket.off('energy_update', callback);
    }
  }

  disconnect() {
    if (USE_MOCK_DATA) {
      this.stopMockUpdates();
      this.energyCallbacks = [];
      return;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default new SocketService();

