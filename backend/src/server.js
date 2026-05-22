import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to all API endpoints
app.use('/api', apiLimiter);

// Mount authentication routes
app.use('/api/auth', authRoutes);

// Basic status route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DevTrackr Backend is healthy and running',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server & Connect Database
const startServer = async () => {
  // Connect database
  await connectDB();

  const PORT = env.PORT;
  app.listen(PORT, () => {
    console.log(`\x1b[34m[DevTrackr Backend] Server listening on port ${PORT} in ${env.NODE_ENV} mode\x1b[0m`);
  });
};

startServer();

export default app;
