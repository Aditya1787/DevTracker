import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { analyzeRepo, getReport } from '../controllers/ai.controller.js';

const router = express.Router();

// Apply authorization check to protect all AI endpoints
router.use(protect);

/**
 * @route   POST /api/ai/analyze
 * @desc    Triggers a fresh Claude AI analytics report for a repository
 * @access  Private
 */
router.post('/analyze', analyzeRepo);

/**
 * @route   GET /api/ai/report/:repoId
 * @desc    Fetches the latest completed AI report for a repository
 * @access  Private
 */
router.get('/report/:repoId', getReport);

export default router;
