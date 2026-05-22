import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

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

// Global Rate Limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api', limiter);

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
app.use((err, req, res, next) => {
  console.error('\x1b[31m[Global Error Handler]:\x1b[0m', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

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
