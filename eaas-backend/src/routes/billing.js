import express from 'express';
import * as billingController from '../controllers/billingController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBillId, validatePayment } from '../middleware/validation.js';

const router = express.Router();

router.get('/user/:userId?', authenticate, billingController.getUserBills);
router.get('/current/:userId?', authenticate, billingController.getCurrentMonthBill);
router.get('/:billId', authenticate, validateBillId, billingController.getBillById);
router.get('/:billId/invoice', authenticate, validateBillId, billingController.generateInvoice);
router.post('/:billId/pay', authenticate, validateBillId, validatePayment, billingController.processPayment);

export default router;

