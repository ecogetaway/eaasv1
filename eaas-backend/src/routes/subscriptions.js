import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js';
import { validateSubscription } from '../middleware/validation.js';

const router = express.Router();

router.get('/plans', subscriptionController.getPlans);
router.get('/plans/:planId', subscriptionController.getPlanById);
router.get('/plans/recommend', subscriptionController.recommendPlan);
router.post('/', authenticate, validateSubscription, subscriptionController.createSubscription);
router.get('/user/:userId?', authenticate, subscriptionController.getUserSubscriptions);
router.get('/:subscriptionId', authenticate, subscriptionController.getSubscriptionById);

export default router;

