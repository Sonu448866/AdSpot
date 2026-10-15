import express from 'express';
import {
  getMapListings,
  getAudienceInsights,
  getHeatmapData,
  checkHeatmapStatus,
} from '../controllers/mapController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/listings', getMapListings);
router.get('/insights', getAudienceInsights);
router.get('/heatmap', optionalAuth, getHeatmapData);
router.get('/heatmap-status', optionalAuth, checkHeatmapStatus);

export default router;
