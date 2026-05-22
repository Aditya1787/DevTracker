import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { downloadPdfReport } from '../controllers/report.controller.js';

const router = express.Router();

// Apply auth protection middleware to all PDF download endpoints
router.use(protect);

/**
 * @route   GET /api/reports/pdf/:repoId
 * @desc    Generates and downloads a custom styled, data-rich engineering analytics PDF report
 * @access  Private
 */
router.get('/pdf/:repoId', downloadPdfReport);

export default router;
