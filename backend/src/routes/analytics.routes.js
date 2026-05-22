import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getCommits,
  getPullRequests,
  getIssues,
  getContributors,
  getOverview
} from '../controllers/analytics.controller.js';

const router = express.Router();

// Apply auth middleware to protect all analytics endpoints
router.use(protect);

/**
 * @route   GET /api/analytics/commits
 * @desc    Get commit aggregations (daily/weekly/monthly)
 * @access  Private
 */
router.get('/commits', getCommits);

/**
 * @route   GET /api/analytics/pullrequests
 * @desc    Get pull request status counts and durations
 * @access  Private
 */
router.get('/pullrequests', getPullRequests);

/**
 * @route   GET /api/analytics/issues
 * @desc    Get issue status counts, labels, and resolution times
 * @access  Private
 */
router.get('/issues', getIssues);

/**
 * @route   GET /api/analytics/contributors
 * @desc    Get detailed contributor metrics and productivity score
 * @access  Private
 */
router.get('/contributors', getContributors);

/**
 * @route   GET /api/analytics/overview
 * @desc    Get comprehensive analytics overview (combined metrics)
 * @access  Private
 */
router.get('/overview', getOverview);

export default router;
