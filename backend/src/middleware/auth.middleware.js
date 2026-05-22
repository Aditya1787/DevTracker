import { verifyToken } from '../utils/jwtHelper.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if authorization header is present and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token missing'
      });
    }

    // Verify token
    try {
      const decoded = verifyToken(token);
      
      // Attach user details to the request object
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };
      
      next();
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token is invalid or expired'
      });
    }
  } catch (error) {
    next(error);
  }
};
