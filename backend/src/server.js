import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import githubRoutes from './routes/github.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import reportRoutes from './routes/report.routes.js';
import { startSyncRepoDataJob } from './jobs/syncRepoData.job.js';
import { startInactivityCheckJob } from './jobs/inactivityCheck.job.js';



const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connectivity check middleware
app.use((req, res, next) => {
  if (req.path === '/health') return next();
  const state = mongoose.connection.readyState;
  if (state !== 1 && state !== 2) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is not established. Please check your MONGO_URI configuration in backend/.env and make sure your MongoDB server or MongoDB Atlas cluster is online and reachable.'
    });
  }
  next();
});

// Apply rate limiter to all API endpoints
app.use('/api', apiLimiter);

// Mount authentication, GitHub, Analytics, AI, and Report routes
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);



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
console.log("Bhai chal jaa");
// Start Server & Connect Database
const startServer = async () => {
  // Connect database
  console.log("Trying to connect db")
  await connectDB()

  // Initialize cron background tasks
  startSyncRepoDataJob();
  startInactivityCheckJob();

  const PORT = env.PORT;
  app.listen(PORT, () => {
    console.log(`\x1b[34m[DevTrackr Backend] Server listening on port ${PORT} in ${env.NODE_ENV} mode\x1b[0m`);
  });
};

startServer();

export default app;
