import express from 'express';
import {
  getMyNotifications,
  markAsRead,
} from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getMyNotifications);
router.patch('/:id/read', requireAuth, markAsRead);

export default router;
