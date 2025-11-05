import express from 'express';
import * as alertController from '../controllers/alertController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/user/:userId?', authenticate, alertController.getUserAlerts);
router.put('/:alertId/acknowledge', authenticate, alertController.acknowledgeAlert);
router.put('/:alertId/resolve', authenticate, alertController.resolveAlert);

export default router;

