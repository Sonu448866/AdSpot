import express from 'express';
import {
  createOrder,
  verifyPayment,
  handleWebhook,
} from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
