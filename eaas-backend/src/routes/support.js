import express from 'express';
import * as supportController from '../controllers/supportController.js';
import { authenticate } from '../middleware/auth.js';
import { validateTicket, validateTicketReply } from '../middleware/validation.js';

const router = express.Router();

router.post('/', authenticate, validateTicket, supportController.createTicket);
router.get('/user/:userId?', authenticate, supportController.getUserTickets);
router.get('/:ticketId', authenticate, supportController.getTicketById);
router.post('/:ticketId/reply', authenticate, validateTicketReply, supportController.addTicketReply);
router.put('/:ticketId/status', authenticate, supportController.updateTicketStatus);

export default router;

