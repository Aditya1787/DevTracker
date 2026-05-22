import * as reportService from '../services/report.service.js';

/**
 * Downloads a premium, custom styled PDF analytics report for a repository
 * GET /api/reports/pdf/:repoId
 */
export const downloadPdfReport = async (req, res, next) => {
  try {
    const { repoId } = req.params;
    if (!repoId) {
      return res.status(400).json({
        success: false,
        message: 'repoId parameter is required'
      });
    }

    await reportService.generatePdfReport(repoId, req.user.userId, res);
  } catch (error) {
    // If headers have already been sent, pass error to the global handler.
    // Otherwise, respond with appropriate API error codes.
    if (res.headersSent) {
      return next(error);
    }

    if (error.message.includes('access denied') || error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('No AI reports found')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};
