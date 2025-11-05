import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pool from './config/database.js';
import iotSimulator from './services/iotSimulator.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import subscriptionRoutes from './routes/subscriptions.js';
import energyRoutes from './routes/energy.js';
import billingRoutes from './routes/billing.js';
import supportRoutes from './routes/support.js';
import notificationRoutes from './routes/notifications.js';
import alertRoutes from './routes/alerts.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route - helpful message
app.get('/', (req, res) => {
  res.json({ 
    message: 'EaaS Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      subscriptions: '/api/subscriptions',
      energy: '/api/energy',
      bills: '/api/bills',
      tickets: '/api/tickets'
    },
    frontend: 'http://localhost:5173'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/bills', billingRoutes);
app.use('/api/tickets', supportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/alerts', alertRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on('subscribe_user', async (userId) => {
    socket.join(`user_${userId}`);
    console.log(`📡 Socket ${socket.id} subscribed to user ${userId}`);

    // Start IoT simulation for this user if not already running
    try {
      const result = await pool.query(
        `SELECT s.*, u.user_id 
         FROM subscriptions s
         JOIN users u ON s.user_id = u.user_id
         WHERE u.user_id = $1 AND s.status = 'active' LIMIT 1`,
        [userId]
      );

      if (result.rows.length > 0) {
        const subscription = result.rows[0];
        await iotSimulator.startSimulation(userId, subscription, io);
      }
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  });

  socket.on('unsubscribe_user', (userId) => {
    socket.leave(`user_${userId}`);
    console.log(`📡 Socket ${socket.id} unsubscribed from user ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  iotSimulator.stopAll();
  httpServer.close(() => {
    console.log('HTTP server closed');
    pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  iotSimulator.stopAll();
  httpServer.close(() => {
    console.log('HTTP server closed');
    pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});

export default app;

