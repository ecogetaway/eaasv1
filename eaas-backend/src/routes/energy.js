import express from 'express';
import * as energyController from '../controllers/energyController.js';
import { authenticate } from '../middleware/auth.js';
import { validateEnergyQuery } from '../middleware/validation.js';

const router = express.Router();

router.get('/current/:userId?', authenticate, energyController.getCurrentEnergy);
router.get('/history/:userId?', authenticate, validateEnergyQuery, energyController.getEnergyHistory);
router.get('/dashboard/summary/:userId?', authenticate, energyController.getDashboardSummary);

export default router;

