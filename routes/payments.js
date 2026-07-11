import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  initializePayment,
  verifyPayment,
  webhookHandler,
  downloadProduct,
} from '../controllers/paymentController.js';

const router = express.Router();

// Health/info (optional, useful for debugging)
router.get('/ping', (req, res) => {
  res.status(200).json({ ok: true, message: 'Payments API is running' });
});

/**
 * @route   POST /api/payments/initialize
 * @desc    Initialize a Paystack transaction
 */
router.post('/initialize', asyncHandler(initializePayment));

/**
 * @route   POST /api/payments/verify
 * @desc    Verify a Paystack transaction reference
 */
router.post('/verify', asyncHandler(verifyPayment));

/**
 * @route   POST /api/payments/webhook
 * @desc    Paystack webhook endpoint
 */
router.post('/webhook', asyncHandler(webhookHandler));

/**
 * @route   GET /api/payments/download/:productName
 * @desc    Download purchased digital product
 * @access  Private
 */
router.get('/download/:productName', authMiddleware, asyncHandler(downloadProduct));

export default router;

