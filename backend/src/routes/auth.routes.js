import express from 'express';
import { body } from 'express-validator';
import { signup, login, me } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.post('/signup', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validate, signup);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, login);

router.get('/me', protect, me);

export default router;
