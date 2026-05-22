import * as aiService from '../services/ai.service.js';

/**
 * Trigger new AI analysis and generate a report
 * POST /api/ai/analyze
 * Body: { repoId }
 */
export const analyzeRepo = async (req, res, next) => {
  try {
    const { repoId } = req.body;
    if (!repoId) {
      return res.status(400).json({
        success: false,
        message: 'repoId is required in request body'
      });
    }

    const report = await aiService.generateReport(repoId, req.user.userId);

    res.status(200).json({
      success: true,
      message: 'AI repository analysis completed successfully',
      data: report
    });
  } catch (error) {
    if (error.message.includes('access denied') || error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Get the latest generated AI report for a repository
 * GET /api/ai/report/:repoId
 */
export const getReport = async (req, res, next) => {
  try {
    const { repoId } = req.params;
    if (!repoId) {
      return res.status(400).json({
        success: false,
        message: 'repoId parameter is required'
      });
    }

    const report = await aiService.getLatestReport(repoId, req.user.userId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'No AI reports found for this repository. Please run an analysis first.'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    if (error.message.includes('access denied') || error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};
