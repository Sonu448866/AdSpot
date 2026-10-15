import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  requestCancellation,
} from '../controllers/bookingController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, createBooking);
router.get('/me', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);
router.post('/:id/cancel', requireAuth, requestCancellation);

export default router;
