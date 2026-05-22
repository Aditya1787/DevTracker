import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generate a JWT token for a given payload
 * @param {Object} payload - The token payload (e.g. { userId, email })
 * @returns {string} The signed JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

/**
 * Verify a JWT token
 * @param {string} token - The signed JWT token
 * @returns {Object} The decoded payload if valid
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
