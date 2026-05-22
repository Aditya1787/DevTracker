import cron from 'node-cron';
import Repository from '../models/Repository.model.js';
import Commit from '../models/Commit.model.js';

/**
 * Perform inactivity check for a single repository
 */
const checkRepoInactivity = async (repo) => {
  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // Fetch all commits in the last 14 days for this repository
    const recentCommits = await Commit.find({
      repoId: repo._id,
      commitDate: { $gte: fourteenDaysAgo }
    }).select('contributor');

    // Collect unique contributor names
    const activeContributors = new Set(recentCommits.map(c => c.contributor));

    // Determine inactive contributors
    const inactive = repo.contributors.filter(c => !activeContributors.has(c.login));

    if (inactive.length > 0) {
      console.log(`\x1b[33m[Inactivity Alert] Repo: ${repo.fullName} has ${inactive.length} inactive contributors in the last 14 days:\x1b[0m`);
      inactive.forEach(c => {
        console.log(`  - Contributor: \x1b[35m${c.login}\x1b[0m (Total contributions: ${c.contributions})`);
      });
    } else {
      console.log(`\x1b[32m[Inactivity Check] Repo: ${repo.fullName} - All contributors active in the last 14 days.\x1b[0m`);
    }
  } catch (err) {
    console.error(`\x1b[31m[Inactivity Check Failed] for ${repo.fullName}: ${err.message}\x1b[0m`);
  }
};

/**
 * Initialize and start the background inactivity check cron job
 */
export const startInactivityCheckJob = () => {
  // Run every day at 9:00 AM: '0 9 * * *'
  cron.schedule('0 9 * * *', async () => {
    console.log('\x1b[35m[Cron Job Inactivity]: Starting daily contributor activity check...\x1b[0m');
    
    try {
      const repos = await Repository.find({});
      for (const repo of repos) {
        await checkRepoInactivity(repo);
      }
      console.log('\x1b[35m[Cron Job Inactivity]: Daily check finished.\x1b[0m');
    } catch (error) {
      console.error('\x1b[31m[Cron Job Inactivity Critical Error]:\x1b[0m', error.message);
    }
  });

  console.log('\x1b[34m[Cron Scheduled]: Contributor inactivity check active (runs daily at 9:00 AM)\x1b[0m');
};
