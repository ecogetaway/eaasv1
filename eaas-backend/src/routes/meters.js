import express from 'express';
import * as meterController from '../controllers/meterController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all meters for a user
router.get('/user/:userId', authenticate, meterController.getUserMeters);

// Get a specific meter by ID
router.get('/:meterId', authenticate, meterController.getMeterById);

// Sync a meter
router.post('/:meterId/sync', authenticate, meterController.syncMeter);

// Register a new meter
router.post('/', authenticate, meterController.registerMeter);

export default router;

