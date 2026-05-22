import Repository from '../models/Repository.model.js';
import * as analyticsService from '../services/analytics.service.js';

/**
 * Helper to verify repository ownership and access
 * @param {string} repoId - Repository ID
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<Object|null>} Repository document if found and authorized
 */
const verifyRepoAccess = async (repoId, userId) => {
  if (!repoId) return null;
  return await Repository.findOne({ _id: repoId, userId });
};

/**
 * Get commit aggregations (daily/weekly/monthly)
 * GET /api/analytics/commits?repoId=
 */
export const getCommits = async (req, res, next) => {
  try {
    const { repoId } = req.query;
    if (!repoId) {
      return res.status(400).json({ success: false, message: 'repoId parameter is required' });
    }

    const repo = await verifyRepoAccess(repoId, req.user.userId);
    if (!repo) {
      return res.status(404).json({ success: false, message: 'Repository not found or access denied' });
    }

    const data = await analyticsService.getCommitAnalytics(repoId);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pull request metrics (states, merge rates, durations)
 * GET /api/analytics/pullrequests?repoId=
 */
export const getPullRequests = async (req, res, next) => {
  try {
    const { repoId } = req.query;
    if (!repoId) {
      return res.status(400).json({ success: false, message: 'repoId parameter is required' });
    }

    const repo = await verifyRepoAccess(repoId, req.user.userId);
    if (!repo) {
      return res.status(404).json({ success: false, message: 'Repository not found or access denied' });
    }

    const data = await analyticsService.getPRAnalytics(repoId);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get issue metrics (states, durations, labels)
 * GET /api/analytics/issues?repoId=
 */
export const getIssues = async (req, res, next) => {
  try {
    const { repoId } = req.query;
    if (!repoId) {
      return res.status(400).json({ success: false, message: 'repoId parameter is required' });
    }

    const repo = await verifyRepoAccess(repoId, req.user.userId);
    if (!repo) {
      return res.status(404).json({ success: false, message: 'Repository not found or access denied' });
    }

    const data = await analyticsService.getIssueAnalytics(repoId);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get contributor detailed activity matrix
 * GET /api/analytics/contributors?repoId=
 */
export const getContributors = async (req, res, next) => {
  try {
    const { repoId } = req.query;
    if (!repoId) {
      return res.status(400).json({ success: false, message: 'repoId parameter is required' });
    }

    const repo = await verifyRepoAccess(repoId, req.user.userId);
    if (!repo) {
      return res.status(404).json({ success: false, message: 'Repository not found or access denied' });
    }

    const data = await analyticsService.getContributorAnalytics(repoId);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get combined overview analytics including repository info
 * GET /api/analytics/overview?repoId=
 */
export const getOverview = async (req, res, next) => {
  try {
    const { repoId } = req.query;
    if (!repoId) {
      return res.status(400).json({ success: false, message: 'repoId parameter is required' });
    }

    const repo = await verifyRepoAccess(repoId, req.user.userId);
    if (!repo) {
      return res.status(404).json({ success: false, message: 'Repository not found or access denied' });
    }

    // Load all analytics in parallel to minimize latency
    const [commits, pullrequests, issues, contributors] = await Promise.all([
      analyticsService.getCommitAnalytics(repoId),
      analyticsService.getPRAnalytics(repoId),
      analyticsService.getIssueAnalytics(repoId),
      analyticsService.getContributorAnalytics(repoId)
    ]);

    res.status(200).json({
      success: true,
      data: {
        repository: {
          id: repo._id,
          name: repo.repoName,
          owner: repo.owner,
          fullName: repo.fullName,
          description: repo.description,
          stars: repo.stars,
          forks: repo.forks,
          language: repo.language,
          githubUrl: repo.githubUrl,
          lastSynced: repo.lastSynced,
          createdAt: repo.createdAt
        },
        commits,
        pullrequests,
        issues,
        contributors
      }
    });
  } catch (error) {
    next(error);
  }
};
