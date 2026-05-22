/**
 * Front-end utility to calculate and classify contributor productivity scores.
 * 
 * @param {number} commits - Commit count
 * @param {number} prsMerged - Merged pull requests count
 * @param {number} issuesClosed - Closed issues count
 * @returns {Object} Score details: { score, level, color }
 */
export const calcProductivityScore = (commits = 0, prsMerged = 0, issuesClosed = 0) => {
  const rawScore = (commits * 0.4) + (prsMerged * 0.3) + (issuesClosed * 0.3);
  const score = Math.min(100, Math.round(rawScore * 10));

  let level = 'Moderate Activity';
  let color = 'text-accent border-cyan-500/30 bg-cyan-500/10';
  let badgeColor = 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';

  if (score >= 80) {
    level = 'High Performer';
    color = 'text-success border-emerald-500/30 bg-emerald-500/10';
    badgeColor = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  } else if (score < 40) {
    level = 'Critical Focus';
    color = 'text-danger border-rose-500/30 bg-rose-500/10';
    badgeColor = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
  }

  return { score, level, color, badgeColor };
};
