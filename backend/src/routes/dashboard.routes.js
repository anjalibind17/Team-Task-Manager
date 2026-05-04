import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { summary } from '../controllers/dashboard.controller.js';

const router = express.Router();
router.get('/summary', protect, summary);
export default router;
