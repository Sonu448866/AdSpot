import express from 'express';
import { getMyListings, getOwnerBookings } from '../controllers/ownerController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me/listings', requireAuth, getMyListings);
router.get('/me/bookings', requireAuth, getOwnerBookings);

export default router;
