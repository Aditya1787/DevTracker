/**
 * Normalizes developer activity metrics into a 0-100 productivity score.
 * 
 * Formula:
 * rawScore = (commits * 0.4) + (prsMerged * 0.3) + (issuesClosed * 0.3)
 * scaledScore = rawScore * 10, capped at 100
 * 
 * @param {number} commits - Number of commits
 * @param {number} prsMerged - Number of pull requests merged
 * @param {number} issuesClosed - Number of issues closed
 * @returns {number} Productivity score from 0 to 100
 */
export const calcScore = (commits = 0, prsMerged = 0, issuesClosed = 0) => {
  const c = Math.max(0, commits);
  const p = Math.max(0, prsMerged);
  const i = Math.max(0, issuesClosed);

  const rawScore = (c * 0.4) + (p * 0.3) + (i * 0.3);
  
  // Scale to 0-100 (where a raw score of 10 points is 100) and round to nearest integer
  const score = Math.min(100, Math.round(rawScore * 10));
  
  return score;
};
