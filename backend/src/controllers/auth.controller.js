import * as authService from '../services/auth.service.js';
import { generateToken } from '../utils/jwtHelper.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Call service to register user
    const user = await authService.registerUser({ name, email, password });
    
    // Generate JWT token
    const token = generateToken({ userId: user.id, email: user.email });
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login a user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Authenticate user
    const user = await authService.authenticateUser(email, password);
    
    // Generate JWT token
    const token = generateToken({ userId: user.id, email: user.email });
    
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user (Client-side deletes token, server returns success)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    return res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request password reset token (forgot password)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const resetToken = await authService.generatePasswordResetToken(email);
    
    // In production, we'd send an email. For MVP, we return the token in response
    return res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully. In production, this would be sent to your email.',
      data: {
        resetToken
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    await authService.resetUserPassword(token, password);
    
    return res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};
