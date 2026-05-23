import { buildOctokit, retry } from '../utils/githubHelpers.js';

/**
 * Fetch repositories belonging to the authenticated user
 * @param {string} token - GitHub Access Token
 * @returns {Promise<Array>} List of user repositories
 */
export const getUserRepos = async (token) => {
  const octokit = buildOctokit(token);
  
  return retry(async () => {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100
    });
    
    return data.map(repo => ({
      id: repo.id.toString(),
      name: repo.name,
      owner: { login: repo.owner.login },
      full_name: repo.full_name,
      description: repo.description || '',
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language || 'Unknown',
      private: repo.private,
      html_url: repo.html_url
    }));
  });
};

/**
 * Fetch repository commits
 * @param {string} token - GitHub Access Token
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} [since] - ISO date string to query from (defaults to 180 days ago)
 * @returns {Promise<Array>} List of commits
 */
export const getRepoCommits = async (token, owner, repo, since) => {
  const octokit = buildOctokit(token);
  
  // Default query window to 180 days ago if "since" is not provided
  if (!since) {
    const date = new Date();
    date.setDate(date.getDate() - 180);
    since = date.toISOString();
  }

  return retry(async () => {
    // To fetch commit details (additions/deletions), we first list commits,
    // then fetch individual details for the top commits. To prevent severe rate-limiting
    // and keep performance high, we'll fetch up to 100 commits and details for them.
    const { data: commitHeaders } = await octokit.repos.listCommits({
      owner,
      repo,
      since,
      per_page: 100
    });

    const detailedCommits = await Promise.all(
      commitHeaders.map(async (c) => {
        try {
          // Fetch detailed commit to get additions/deletions stats
          const { data: fullCommit } = await octokit.repos.getCommit({
            owner,
            repo,
            ref: c.sha
          });
          
          return {
            sha: fullCommit.sha,
            contributor: fullCommit.commit.author?.name || fullCommit.author?.login || 'Unknown',
            contributorAvatar: fullCommit.author?.avatar_url || '',
            message: fullCommit.commit.message,
            commitDate: fullCommit.commit.author?.date || new Date().toISOString(),
            additions: fullCommit.stats?.additions || 0,
            deletions: fullCommit.stats?.deletions || 0,
            url: fullCommit.html_url
          };
        } catch (err) {
          // Fallback to basic header if details fetch fails
          return {
            sha: c.sha,
            contributor: c.commit.author?.name || c.author?.login || 'Unknown',
            contributorAvatar: c.author?.avatar_url || '',
            message: c.commit.message,
            commitDate: c.commit.author?.date || new Date().toISOString(),
            additions: 0,
            deletions: 0,
            url: c.html_url
          };
        }
      })
    );

    return detailedCommits;
  });
};

/**
 * Fetch pull requests (both open and closed)
 * @param {string} token - GitHub Access Token
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Array>} List of pull requests
 */
export const getRepoPullRequests = async (token, owner, repo) => {
  const octokit = buildOctokit(token);

  return retry(async () => {
    const { data } = await octokit.pulls.list({
      owner,
      repo,
      state: 'all',
      per_page: 100
    });

    return data.map(pr => ({
      prNumber: pr.number,
      title: pr.title,
      status: pr.merged_at ? 'merged' : pr.state, // state is 'open' or 'closed'
      createdBy: pr.user?.login || 'Unknown',
      merged: !!pr.merged_at,
      mergedAt: pr.merged_at ? pr.merged_at : null,
      createdAt: pr.created_at,
      closedAt: pr.closed_at ? pr.closed_at : null,
      reviewers: pr.requested_reviewers?.map(r => r.login) || []
    }));
  });
};

/**
 * Fetch issues (both open and closed)
 * @param {string} token - GitHub Access Token
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Array>} List of issues
 */
export const getRepoIssues = async (token, owner, repo) => {
  const octokit = buildOctokit(token);

  return retry(async () => {
    // Note: GitHub issues endpoint returns both issues and pull requests by default.
    // We filter out pull requests by checking if the pr object exists.
    const { data } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      per_page: 100
    });

    return data
      .filter(issue => !issue.pull_request)
      .map(issue => ({
        issueNumber: issue.number,
        title: issue.title,
        status: issue.state, // 'open' or 'closed'
        assignedTo: issue.assignee?.login || null,
        labels: issue.labels?.map(l => (typeof l === 'string' ? l : l.name)) || [],
        createdAt: issue.createdAt || issue.created_at,
        closedAt: issue.closed_at ? issue.closed_at : null
      }));
  });
};

/**
 * Fetch repository contributors
 * @param {string} token - GitHub Access Token
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Array>} List of contributors
 */
export const getRepoContributors = async (token, owner, repo) => {
  const octokit = buildOctokit(token);

  return retry(async () => {
    try {
      const { data } = await octokit.repos.listContributors({
        owner,
        repo,
        per_page: 100
      });

      return data.map(c => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        contributions: c.contributions
      }));
    } catch (err) {
      // If repo has no contributors or is empty, return empty list
      return [];
    }
  });
};
