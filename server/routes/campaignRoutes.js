import express from 'express';
import {
  createCampaignBrief,
  getMyCampaigns,
} from '../controllers/managedCampaignController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, createCampaignBrief);
router.get('/me', requireAuth, getMyCampaigns);

export default router;
