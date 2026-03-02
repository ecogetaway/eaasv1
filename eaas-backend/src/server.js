/**
 * Railway / local server — Express + Socket.io
 * For Lambda deployment, see src/lambda.js
 */
import { createServer } from 'http';
import { Server } from 'socket.io';
import pool from './config/database.js';
import iotSimulator from './services/iotSimulator.js';
import app from './app.js';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on('subscribe_user', async (userId) => {
    socket.join(`user_${userId}`);
    console.log(`📡 Socket ${socket.id} subscribed to user ${userId}`);
    try {
      const result = await pool.query(
        `SELECT s.*, u.user_id FROM subscriptions s
         JOIN users u ON s.user_id = u.user_id
         WHERE u.user_id = $1 AND s.status = 'active' LIMIT 1`,
        [userId]
      );
      if (result.rows.length > 0) {
        await iotSimulator.startSimulation(userId, result.rows[0], io);
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

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  iotSimulator.stopAll();
  httpServer.close(() => {
    pool.end(() => process.exit(0));
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  iotSimulator.stopAll();
  httpServer.close(() => {
    pool.end(() => process.exit(0));
  });
});

export default app;
