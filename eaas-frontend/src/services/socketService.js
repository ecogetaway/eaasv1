import { io } from 'socket.io-client';
import { WS_URL } from '../utils/constants.js';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
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
    if (!this.socket) {
      this.connect();
    }
    this.socket.on('energy_update', callback);
  }

  offEnergyUpdate(callback) {
    if (this.socket) {
      this.socket.off('energy_update', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default new SocketService();

