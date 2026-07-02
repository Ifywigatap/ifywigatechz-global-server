import express from 'express';
import { initializePayment, verifyPayment, webhookHandler } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/initialize', authMiddleware, initializePayment);
router.post('/verify', verifyPayment);
router.post('/webhook', webhookHandler);

export default router;