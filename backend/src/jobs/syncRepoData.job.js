import cron from 'node-cron';
import Repository from '../models/Repository.model.js';
import User from '../models/User.model.js';
import Commit from '../models/Commit.model.js';
import PullRequest from '../models/PullRequest.model.js';
import Issue from '../models/Issue.model.js';
import * as githubService from '../services/github.service.js';

/**
 * Sync data for a specific repository
 */
const syncSingleRepo = async (repo, user) => {
  try {
    console.log(`\x1b[36m[Cron Job Sync]: Syncing ${repo.fullName} for user ${user.email}...\x1b[0m`);
    
    // Fetch from GitHub
    const contributors = await githubService.getRepoContributors(user.githubToken, repo.owner, repo.repoName);
    const commits = await githubService.getRepoCommits(user.githubToken, repo.owner, repo.repoName);
    const prs = await githubService.getRepoPullRequests(user.githubToken, repo.owner, repo.repoName);
    const issues = await githubService.getRepoIssues(user.githubToken, repo.owner, repo.repoName);

    // Bulk write Commits
    if (commits.length > 0) {
      const commitOps = commits.map(c => ({
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
      await Commit.bulkWrite(commitOps);
    }

    // Bulk write PRs
    if (prs.length > 0) {
      const prOps = prs.map(p => ({
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
      await PullRequest.bulkWrite(prOps);
    }

    // Bulk write Issues
    if (issues.length > 0) {
      const issueOps = issues.map(i => ({
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
      await Issue.bulkWrite(issueOps);
    }

    // Update repository record
    repo.lastSynced = new Date();
    repo.contributors = contributors;
    await repo.save();

    console.log(`\x1b[32m[Cron Job Sync Complete]: Successfully synced ${repo.fullName}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[Cron Job Sync Failed] for ${repo.fullName}: ${error.message}\x1b[0m`);
  }
};

/**
 * Initialize and start the background sync cron job
 */
export const startSyncRepoDataJob = () => {
  // Run every 6 hours: '0 */6 * * *'
  cron.schedule('0 */6 * * *', async () => {
    console.log('\x1b[35m[Cron Job Sync]: Starting global repository background sync...\x1b[0m');
    
    try {
      const repos = await Repository.find({});
      
      for (const repo of repos) {
        const user = await User.findById(repo.userId);
        if (user && user.githubToken) {
          await syncSingleRepo(repo, user);
        }
      }
      
      console.log('\x1b[35m[Cron Job Sync]: Global background sync finished.\x1b[0m');
    } catch (error) {
      console.error('\x1b[31m[Cron Job Sync Critical Error]:\x1b[0m', error.message);
    }
  });
  
  console.log('\x1b[34m[Cron Scheduled]: Repository data sync background job active (runs every 6 hours)\x1b[0m');
};
