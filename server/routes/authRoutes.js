import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  requestOtp,
  verifyOtp,
  oauthLogin,
  bootstrapAdmin,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, getMe);
router.patch('/profile', requireAuth, updateProfile);

// Mobile OTP flow
router.post('/otp/request', authLimiter, requestOtp);
router.post('/otp/verify', authLimiter, verifyOtp);

// Social OAuth
router.post('/oauth', authLimiter, oauthLogin);

// Admin bootstrap
router.post('/bootstrap-admin', bootstrapAdmin);

export default router;
