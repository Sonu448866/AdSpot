import express from 'express';
import { submitContact } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', contactLimiter, submitContact);

export default router;
