import express from 'express';
import {
  getSavedListings,
  saveListing,
  removeSavedListing,
} from '../controllers/savedController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getSavedListings);
router.post('/:listingId', requireAuth, saveListing);
router.delete('/:listingId', requireAuth, removeSavedListing);

export default router;
