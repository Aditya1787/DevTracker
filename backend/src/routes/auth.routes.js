import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

// Validation chains
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email').trim().isEmail().withMessage('Must be a valid email address')
];

const resetPasswordValidation = [
  body('token').trim().notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Mount endpoints
router.post('/signup', signupValidation, validateRequest, authController.signup);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.post('/forgot-password', forgotPasswordValidation, validateRequest, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, authController.resetPassword);

export default router;
