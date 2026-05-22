import axios from 'axios';
import { githubConfig } from '../config/githubOAuth.js';
import User from '../models/User.model.js';
import Repository from '../models/Repository.model.js';
import Commit from '../models/Commit.model.js';
import PullRequest from '../models/PullRequest.model.js';
import Issue from '../models/Issue.model.js';
import * as githubService from '../services/github.service.js';

/**
 * @desc    Exchange OAuth authorization code for GitHub token and link account
 * @route   POST /api/github/connect
 * @access  Private
 */
export const connectGitHub = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // 1. Exchange code for access token
    const tokenResponse = await axios.post(
      githubConfig.tokenUrl,
      {
        client_id: githubConfig.clientId,
        client_secret: githubConfig.clientSecret,
        code,
        redirect_uri: githubConfig.callbackUrl
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const { access_token, error, error_description } = tokenResponse.data;
    if (error) {
      return res.status(400).json({
        success: false,
        message: error_description || error
      });
    }

    if (!access_token) {
      return res.status(400).json({
        success: false,
        message: 'Failed to retrieve access token from GitHub'
      });
    }

    // 2. Fetch user profile from GitHub
    const userResponse = await axios.get(githubConfig.userUrl, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { id, login, avatar_url } = userResponse.data;

    // 3. Save profile and token to authenticated User document
    await User.findByIdAndUpdate(req.user.userId, {
      githubId: id.toString(),
      githubToken: access_token,
      githubUsername: login,
      githubAvatar: avatar_url
    });

    return res.status(200).json({
      success: true,
      message: 'GitHub account linked successfully',
      data: {
        githubUsername: login,
        githubAvatar: avatar_url
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Retrieve repository list from GitHub for connected account
 * @route   GET /api/github/repos
 * @access  Private
 */
export const getRepos = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub account not connected. Please connect your account first.'
      });
    }

    const repos = await githubService.getUserRepos(user.githubToken);
    
    return res.status(200).json({
      success: true,
      data: { repos }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Link repository to user's DevTrackr workspace
 * @route   POST /api/github/add-repo
 * @access  Private
 */
export const addRepo = async (req, res, next) => {
  try {
    const {
      fullName,
      owner,
      repoName,
      description,
      stars,
      forks,
      language,
      isPrivate,
      githubUrl
    } = req.body;

    if (!fullName || !owner || !repoName) {
      return res.status(400).json({
        success: false,
        message: 'FullName, owner and repoName are required'
      });
    }

    // Check if repository already added for this user
    let repo = await Repository.findOne({ userId: req.user.userId, fullName });
    if (repo) {
      return res.status(400).json({
        success: false,
        message: 'Repository has already been added to your account'
      });
    }

    // Save Repository details
    repo = await Repository.create({
      userId: req.user.userId,
      fullName,
      owner,
      repoName,
      description: description || '',
      stars: stars || 0,
      forks: forks || 0,
      language: language || 'Unknown',
      isPrivate: !!isPrivate,
      githubUrl: githubUrl || '',
      lastSynced: null,
      contributors: []
    });

    // Link repo id to User array
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { repositories: repo._id }
    });

    // Respond to client early, then trigger async initial sync
    res.status(201).json({
      success: true,
      message: 'Repository added successfully. Sync process has been scheduled.',
      data: { repository: repo }
    });

    // Asynchronous initial sync (trigger sync and log outcomes)
    triggerSync(req.user.userId, repo._id).catch(err => {
      console.error(`\x1b[31m[Initial Sync Error for ${fullName}]: ${err.message}\x1b[0m`);
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Sync repository data (Commits, PullRequests, Issues, Contributors)
 * @route   POST /api/github/sync/:repoId
 * @access  Private
 */
export const syncRepo = async (req, res, next) => {
  try {
    const { repoId } = req.params;
    
    const stats = await triggerSync(req.user.userId, repoId);

    return res.status(200).json({
      success: true,
      message: 'Repository synced successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Perform actual database syncing from GitHub API
 * @param {string} userId - User identifier
 * @param {string} repoId - Repository identifier
 * @returns {Promise<Object>} Statistics of synced objects
 */
const triggerSync = async (userId, repoId) => {
  const user = await User.findById(userId);
  if (!user || !user.githubToken) {
    throw new Error('User does not have a linked GitHub token');
  }

  const repo = await Repository.findOne({ _id: repoId, userId });
  if (!repo) {
    throw new Error('Repository not found or does not belong to this user');
  }

  console.log(`\x1b[36m[Sync Action]: Syncing repository ${repo.fullName}...\x1b[0m`);

  // 1. Fetch contributors
  const contributors = await githubService.getRepoContributors(user.githubToken, repo.owner, repo.repoName);

  // 2. Fetch commits
  const commits = await githubService.getRepoCommits(user.githubToken, repo.owner, repo.repoName);

  // 3. Fetch Pull Requests
  const prs = await githubService.getRepoPullRequests(user.githubToken, repo.owner, repo.repoName);

  // 4. Fetch Issues
  const issues = await githubService.getRepoIssues(user.githubToken, repo.owner, repo.repoName);

  // 5. Bulk write / Upsert Commits
  let commitsAdded = 0;
  if (commits.length > 0) {
    const commitOperations = commits.map(c => ({
      updateOne: {
        filter: { sha: c.sha },
        update: {
          $set: {
            repoId: repo._id,
            contributor: c.contributor,
            contributorAvatar: c.contributorAvatar,
            message: c.message,
            commitDate: c.commitDate,
            additions: c.additions,
            deletions: c.deletions,
            url: c.url
          }
        },
        upsert: true
      }
    }));
    const commitResult = await Commit.bulkWrite(commitOperations);
    commitsAdded = (commitResult.upsertedCount || 0) + (commitResult.modifiedCount || 0);
  }

  // 6. Bulk write / Upsert PRs
  let prsAdded = 0;
  if (prs.length > 0) {
    const prOperations = prs.map(p => ({
      updateOne: {
        filter: { repoId: repo._id, prNumber: p.prNumber },
        update: {
          $set: {
            title: p.title,
            status: p.status,
            createdBy: p.createdBy,
            merged: p.merged,
            mergedAt: p.mergedAt,
            createdAt: p.createdAt,
            closedAt: p.closedAt,
            reviewers: p.reviewers
          }
        },
        upsert: true
      }
    }));
    const prResult = await PullRequest.bulkWrite(prOperations);
    prsAdded = (prResult.upsertedCount || 0) + (prResult.modifiedCount || 0);
  }

  // 7. Bulk write / Upsert Issues
  let issuesAdded = 0;
  if (issues.length > 0) {
    const issueOperations = issues.map(i => ({
      updateOne: {
        filter: { repoId: repo._id, issueNumber: i.issueNumber },
        update: {
          $set: {
            title: i.title,
            status: i.status,
            assignedTo: i.assignedTo,
            labels: i.labels,
            createdAt: i.createdAt,
            closedAt: i.closedAt
          }
        },
        upsert: true
      }
    }));
    const issueResult = await Issue.bulkWrite(issueOperations);
    issuesAdded = (issueResult.upsertedCount || 0) + (issueResult.modifiedCount || 0);
  }

  // 8. Update Repository details
  repo.lastSynced = new Date();
  repo.contributors = contributors;
  await repo.save();

  console.log(`\x1b[32m[Sync Complete]: ${repo.fullName} finished syncing. Commits: ${commitsAdded}, PRs: ${prsAdded}, Issues: ${issuesAdded}\x1b[0m`);

  return {
    commitsAdded,
    prsAdded,
    issuesAdded
  };
};
