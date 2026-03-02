/**
 * Express app — shared by both:
 * - server.js (Railway: HTTP server + Socket.io)
 * - lambda.js (AWS Lambda + API Gateway)
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import subscriptionRoutes from './routes/subscriptions.js';
import energyRoutes from './routes/energy.js';
import billingRoutes from './routes/billing.js';
import supportRoutes from './routes/support.js';
import notificationRoutes from './routes/notifications.js';
import alertRoutes from './routes/alerts.js';
import meterRoutes from './routes/meters.js';
import discomRoutes from './routes/discom.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://ecogetaway.github.io',
  'https://eaasproj.netlify.app',
  'https://eaasproject.netlify.app',
  'https://eaasp.vercel.app',
  'https://eaasv1.netlify.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (origin?.endsWith('.vercel.app')) return true;
  if (origin?.endsWith('.netlify.app')) return true;
  if (origin?.endsWith('.amplifyapp.com')) return true;
  return false;
};

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/test/db', async (req, res) => {
  try {
    const connectionTest = await pool.query('SELECT NOW(), current_database(), current_schema()');
    const tablesResult = await pool.query(`
      SELECT table_schema, table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    const planCatalogCheck = await pool.query(`
      SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'plan_catalog')
    `);
    res.json({
      success: true,
      connection: connectionTest.rows[0],
      tables: tablesResult.rows,
      tableCount: tablesResult.rows.length,
      planCatalogExists: planCatalogCheck.rows[0].exists,
    });
  } catch (error) {
    res.json({ success: false, error: error.message, stack: error.stack });
  }
});

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
      tickets: '/api/tickets',
      meters: '/api/meters',
      discom: '/api/discom',
      upload: '/api/upload',
    },
    runtime: process.env.AWS_LAMBDA_FUNCTION_NAME ? 'lambda' : 'server',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/bills', billingRoutes);
app.use('/api/tickets', supportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/meters', meterRoutes);
app.use('/api/discom', discomRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
