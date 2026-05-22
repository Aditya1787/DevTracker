import { Octokit } from '@octokit/rest';

/**
 * Delay execution for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Execute an async function with exponential backoff retry
 * @param {Function} fn - Async function to run
 * @param {number} maxRetries - Maximum retry count
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise<any>}
 */
export const retry = async (fn, maxRetries = 3, delay = 1000) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      // If we are hit by a rate limit (status 403 / 429), or a transient 5xx error, retry
      const isRateLimit = error.status === 403 || error.status === 429;
      const isTransient = error.status >= 500 && error.status < 600;
      
      if ((isRateLimit || isTransient) && attempt < maxRetries) {
        const backoffDelay = delay * Math.pow(2, attempt);
        console.warn(`\x1b[33m[GitHub API Retry]: Attempt ${attempt} failed. Retrying in ${backoffDelay}ms...\x1b[0m`);
        await sleep(backoffDelay);
      } else {
        throw error;
      }
    }
  }
};

/**
 * Configure and build a custom Octokit client instance
 * @param {string} token - GitHub Access Token
 * @returns {Octokit} Configured Octokit client
 */
export const buildOctokit = (token) => {
  return new Octokit({
    auth: token,
    userAgent: 'DevTrackr-Analytics'
  });
};
