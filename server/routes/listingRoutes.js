import express from 'express';
import {
  getPublicListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Publicly browse approved listings
router.get('/', getPublicListings);

// Get single listing (optionalAuth so owner/admin can preview unapproved listing)
router.get('/:id', optionalAuth, getListingById);

// Space owners submit listing (with multiple image upload support)
router.post('/', requireAuth, upload.array('images', 8), createListing);

// Space owners update listing
router.patch('/:id', requireAuth, upload.array('images', 8), updateListing);

// Delete listing
router.delete('/:id', requireAuth, deleteListing);

export default router;
