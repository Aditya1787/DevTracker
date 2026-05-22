import User from '../models/User.model.js';
import { hashPassword, comparePassword } from '../utils/bcryptHelper.js';
import crypto from 'crypto';

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} Created user object (excluding password)
 */
export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Save to DB
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    githubId: user.githubId,
    githubUsername: user.githubUsername,
    githubAvatar: user.githubAvatar,
    createdAt: user.createdAt
  };
};

/**
 * Authenticate a user by email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User details (excluding password)
 */
export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    githubId: user.githubId,
    githubUsername: user.githubUsername,
    githubAvatar: user.githubAvatar,
    createdAt: user.createdAt
  };
};

/**
 * Retrieve user by ID
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} User details (excluding password)
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Create a forgot password reset token
 * @param {string} email - User email
 * @returns {Promise<string>} Plain-text reset token (in MVP, returned to client)
 */
export const generatePasswordResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User with this email does not exist');
    error.statusCode = 404;
    throw error;
  }

  // Generate crypto token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token to store in DB
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Expire in 1 hour
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  
  await user.save();

  return resetToken;
};

/**
 * Reset a user's password
 * @param {string} resetToken - The plain-text token
 * @param {string} newPassword - The new password
 * @returns {Promise<boolean>} Success
 */
export const resetUserPassword = async (resetToken, newPassword) => {
  // Hash token to lookup in DB
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    const error = new Error('Password reset token is invalid or has expired');
    error.statusCode = 400;
    throw error;
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Set new password and clear reset tokens
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  return true;
};
