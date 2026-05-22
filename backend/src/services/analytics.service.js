import mongoose from 'mongoose';
import Repository from '../models/Repository.model.js';
import Commit from '../models/Commit.model.js';
import PullRequest from '../models/PullRequest.model.js';
import Issue from '../models/Issue.model.js';
import { calcScore } from '../utils/productivityScore.js';

/**
 * Get commit aggregations (daily, weekly, monthly)
 * @param {string} repoId - Repository ID
 * @returns {Promise<Object>} Commit analytics
 */
export const getCommitAnalytics = async (repoId) => {
  const repositoryId = new mongoose.Types.ObjectId(repoId);

  // Daily commits for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyStats = await Commit.aggregate([
    {
      $match: {
        repoId: repositoryId,
        commitDate: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$commitDate' } },
        count: { $sum: 1 },
        additions: { $sum: '$additions' },
        deletions: { $sum: '$deletions' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Weekly commits for the last 12 weeks
  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

  const weeklyStats = await Commit.aggregate([
    {
      $match: {
        repoId: repositoryId,
        commitDate: { $gte: twelveWeeksAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $isoWeekYear: '$commitDate' },
          week: { $isoWeek: '$commitDate' }
        },
        count: { $sum: 1 },
        additions: { $sum: '$additions' },
        deletions: { $sum: '$deletions' }
      }
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } }
  ]);

  // Monthly commits for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStats = await Commit.aggregate([
    {
      $match: {
        repoId: repositoryId,
        commitDate: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$commitDate' } },
        count: { $sum: 1 },
        additions: { $sum: '$additions' },
        deletions: { $sum: '$deletions' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return {
    daily: dailyStats.map(d => ({
      date: d._id,
      count: d.count,
      additions: d.additions,
      deletions: d.deletions
    })),
    weekly: weeklyStats.map(w => ({
      week: `Week ${w._id.week}, ${w._id.year}`,
      count: w.count,
      additions: w.additions,
      deletions: w.deletions
    })),
    monthly: monthlyStats.map(m => ({
      month: m._id,
      count: m.count,
      additions: m.additions,
      deletions: m.deletions
    }))
  };
};

/**
 * Get pull request metrics (status counts, merge rate, avg merge time)
 * @param {string} repoId - Repository ID
 * @returns {Promise<Object>} Pull request analytics
 */
export const getPRAnalytics = async (repoId) => {
  const repositoryId = new mongoose.Types.ObjectId(repoId);

  const prStats = await PullRequest.aggregate([
    { $match: { repoId: repositoryId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
        closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
        merged: { $sum: { $cond: [{ $eq: ['$status', 'merged'] }, 1, 0] } },
        totalMergeTimeMs: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$status', 'merged'] }, { $ne: ['$mergedAt', null] }] },
              { $subtract: ['$mergedAt', '$createdAt'] },
              0
            ]
          }
        }
      }
    }
  ]);

  if (prStats.length === 0) {
    return {
      total: 0,
      open: 0,
      closed: 0,
      merged: 0,
      mergeRate: 0,
      avgMergeTimeHours: 0
    };
  }

  const { total, open, closed, merged, totalMergeTimeMs } = prStats[0];

  const mergeRate = total > 0 ? parseFloat(((merged / total) * 100).toFixed(2)) : 0;
  const avgMergeTimeHours = merged > 0 ? parseFloat((totalMergeTimeMs / (merged * 1000 * 60 * 60)).toFixed(2)) : 0;

  return {
    total,
    open,
    closed,
    merged,
    mergeRate,
    avgMergeTimeHours
  };
};

/**
 * Get issue metrics (open/closed, avg resolution time, top labels)
 * @param {string} repoId - Repository ID
 * @returns {Promise<Object>} Issue analytics
 */
export const getIssueAnalytics = async (repoId) => {
  const repositoryId = new mongoose.Types.ObjectId(repoId);

  // General counts & resolution time
  const issueStats = await Issue.aggregate([
    { $match: { repoId: repositoryId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
        closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
        totalResolutionTimeMs: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$status', 'closed'] }, { $ne: ['$closedAt', null] }] },
              { $subtract: ['$closedAt', '$createdAt'] },
              0
            ]
          }
        }
      }
    }
  ]);

  // Label breakdown
  const labelStats = await Issue.aggregate([
    { $match: { repoId: repositoryId } },
    { $unwind: '$labels' },
    { $group: { _id: '$labels', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const topLabels = labelStats.map(l => ({
    name: l._id,
    count: l.count
  }));

  if (issueStats.length === 0) {
    return {
      total: 0,
      open: 0,
      closed: 0,
      avgResolutionTimeHours: 0,
      topLabels: []
    };
  }

  const { total, open, closed, totalResolutionTimeMs } = issueStats[0];
  const avgResolutionTimeHours = closed > 0 ? parseFloat((totalResolutionTimeMs / (closed * 1000 * 60 * 60)).toFixed(2)) : 0;

  return {
    total,
    open,
    closed,
    avgResolutionTimeHours,
    topLabels
  };
};

/**
 * Get contributor activity stats, productivity score, and active/inactive state
 * @param {string} repoId - Repository ID
 * @returns {Promise<Array>} Contributor analytics list
 */
export const getContributorAnalytics = async (repoId) => {
  const repositoryId = new mongoose.Types.ObjectId(repoId);

  const repo = await Repository.findById(repositoryId);
  if (!repo) {
    throw new Error('Repository not found');
  }

  let contributorsList = repo.contributors || [];

  // Fallback to extraction from Commits if contributor list in Repository is empty
  if (contributorsList.length === 0) {
    const uniqueCommitters = await Commit.aggregate([
      { $match: { repoId: repositoryId } },
      {
        $group: {
          _id: '$contributor',
          avatarUrl: { $first: '$contributorAvatar' }
        }
      }
    ]);
    contributorsList = uniqueCommitters.map(c => ({
      login: c._id,
      avatarUrl: c.avatarUrl || '',
      contributions: 0
    }));
  }

  // Aggregate commits stats per contributor
  const commitStats = await Commit.aggregate([
    { $match: { repoId: repositoryId } },
    {
      $group: {
        _id: '$contributor',
        commitsCount: { $sum: 1 },
        lastCommitDate: { $max: '$commitDate' },
        additions: { $sum: '$additions' },
        deletions: { $sum: '$deletions' }
      }
    }
  ]);

  // Aggregate PR stats per contributor
  const prStats = await PullRequest.aggregate([
    { $match: { repoId: repositoryId } },
    {
      $group: {
        _id: '$createdBy',
        totalPRs: { $sum: 1 },
        mergedPRs: { $sum: { $cond: [{ $eq: ['$status', 'merged'] }, 1, 0] } }
      }
    }
  ]);

  // Aggregate Issue stats per contributor
  const issueStats = await Issue.aggregate([
    { $match: { repoId: repositoryId } },
    {
      $group: {
        _id: '$assignedTo',
        assignedIssues: { $sum: 1 },
        closedIssues: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
      }
    }
  ]);

  const commitMap = new Map(commitStats.map(c => [c._id, c]));
  const prMap = new Map(prStats.map(p => [p._id, p]));
  const issueMap = new Map(issueStats.map(i => [i._id, i]));

  const contributorsData = contributorsList.map(c => {
    const cStats = commitMap.get(c.login) || { commitsCount: 0, lastCommitDate: null, additions: 0, deletions: 0 };
    const pStats = prMap.get(c.login) || { totalPRs: 0, mergedPRs: 0 };
    const iStats = issueMap.get(c.login) || { assignedIssues: 0, closedIssues: 0 };

    // Calculate normalized productivity score
    const productivityScore = calcScore(
      cStats.commitsCount,
      pStats.mergedPRs,
      iStats.closedIssues
    );

    // Contributor is considered inactive if their last commit date is missing
    // or is older than 30 days.
    const inactive = cStats.lastCommitDate
      ? (Date.now() - new Date(cStats.lastCommitDate).getTime() > 30 * 24 * 60 * 60 * 1000)
      : true;

    return {
      login: c.login,
      avatarUrl: c.avatarUrl || '',
      githubContributions: c.contributions || 0,
      commitsCount: cStats.commitsCount,
      lastCommitDate: cStats.lastCommitDate,
      additions: cStats.additions,
      deletions: cStats.deletions,
      totalPRs: pStats.totalPRs,
      mergedPRs: pStats.mergedPRs,
      assignedIssues: iStats.assignedIssues,
      closedIssues: iStats.closedIssues,
      productivityScore,
      inactive
    };
  });

  // Sort by productivity score descending
  return contributorsData.sort((a, b) => b.productivityScore - a.productivityScore);
};
