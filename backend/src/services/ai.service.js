import anthropic from '../ai/openaiClient.js';
import { buildAnalysisPrompt } from '../ai/promptBuilder.js';
import { parseAIResponse } from '../ai/responseParser.js';
import Repository from '../models/Repository.model.js';
import AIReport from '../models/AIReport.model.js';
import * as analyticsService from './analytics.service.js';
import { env } from '../config/env.js';

/**
 * Generate a programmatic fallback report based on database telemetry metrics
 * in case the Anthropic API key is missing or the external API call fails.
 */
const generateFallbackReport = (repoData) => {
  const { repository, pullrequests, issues, contributors } = repoData;
  const activeContributors = contributors.filter(c => !c.inactive).length;
  const totalCommits = contributors.reduce((sum, c) => sum + c.commitsCount, 0);

  // Compute a dynamic fallback productivity score based on PR merge rate and contributor scores
  const avgContributorScore = contributors.length > 0
    ? contributors.reduce((sum, c) => sum + c.productivityScore, 0) / contributors.length
    : 70;
  
  const score = Math.min(100, Math.max(10, Math.round(
    (pullrequests.mergeRate * 0.4) + (avgContributorScore * 0.6)
  )));

  const bottlenecks = [];
  if (pullrequests.avgMergeTimeHours > 24) {
    bottlenecks.push(`Pull Request merge times average ${pullrequests.avgMergeTimeHours} hours, indicating potential bottlenecks in the review pipeline.`);
  }
  if (issues.open > issues.closed) {
    bottlenecks.push(`The issue backlog is accumulating, with ${issues.open} open issues compared to ${issues.closed} closed.`);
  }
  const heavyContr = contributors.find(c => c.commitsCount > (totalCommits * 0.7));
  if (heavyContr) {
    bottlenecks.push(`Key-person risk: ${heavyContr.login} contributes over 70% of the repository's commit activity.`);
  }
  if (contributors.length - activeContributors > 0) {
    bottlenecks.push(`${contributors.length - activeContributors} out of ${contributors.length} contributors have been inactive for over 30 days.`);
  }
  if (bottlenecks.length === 0) {
    bottlenecks.push('Telemetry reports optimal operational flow; keep monitoring issue labeling patterns.');
  }

  const recommendations = [
    'Establish clear code ownership and review rotation policies to decrease PR review lag.',
    'Execute a dedicated sprint grooming session to resolve stale, high-priority issues.',
    'Balance git workload to mitigate key-person risks and avoid core delivery bottlenecks.',
    'Set up automated Slack/Discord webhooks to notify team members of active pull requests.'
  ];

  return {
    summary: `Operational telemetry review for ${repository.fullName}. The codebase is built primarily with ${repository.language}. Git activity records ⭐ ${repository.stars} stars and 🍴 ${repository.forks} forks, showing solid baseline repository configuration. Development speed and sync flow are healthy, and the overall team structure exhibits stable activity.`,
    sprintAnalysis: `Sprint velocity metrics record ${totalCommits} total commits across the synced timeframe. Commit sizing has an additions-to-deletions footprint. Weekly git patterns show a moderate delivery rhythm, with opportunities to establish a more consistent daily commit cadence.`,
    contributorInsights: `The project features ${activeContributors} active contributors out of ${contributors.length} total members. The workload distribution reveals that key developers drive the core velocity. Contributor productivity indexes score an average of ${Math.round(avgContributorScore)}/100, showing good team skill alignments.`,
    bottlenecks,
    recommendations,
    productivityScore: score
  };
};

/**
 * Perform AI analysis on repository data and save report
 * @param {string} repoId - Repository ID
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<Object>} The generated AI report document
 */
export const generateReport = async (repoId, userId) => {
  // 1. Verify repository access
  const repo = await Repository.findOne({ _id: repoId, userId });
  if (!repo) {
    throw new Error('Repository not found or access denied');
  }

  // 2. Fetch full repository analytics in parallel
  const [commits, pullrequests, issues, contributors] = await Promise.all([
    analyticsService.getCommitAnalytics(repoId),
    analyticsService.getPRAnalytics(repoId),
    analyticsService.getIssueAnalytics(repoId),
    analyticsService.getContributorAnalytics(repoId)
  ]);

  const repoData = {
    repository: {
      fullName: repo.fullName,
      description: repo.description,
      stars: repo.stars,
      forks: repo.forks,
      language: repo.language,
      lastSynced: repo.lastSynced
    },
    commits,
    pullrequests,
    issues,
    contributors
  };

  let reportData;

  // 3. Check if Anthropic API key is provided and is not a default/dummy key
  const hasValidApiKey = env.ANTHROPIC_API_KEY && 
                        env.ANTHROPIC_API_KEY !== 'dummy_api_key_for_scaffolding' && 
                        !env.ANTHROPIC_API_KEY.startsWith('your_');

  if (hasValidApiKey) {
    try {
      // Build the highly context-rich prompt
      const prompt = buildAnalysisPrompt(repoData);

      // Call Anthropic Claude Messages API
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3000,
        temperature: 0.2,
        system: 'You are a highly experienced software engineering metrics analyser. Your output must strictly be formatted as raw, valid JSON matching the user prompt specification.',
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const responseText = response.content[0].text;
      
      // Clean and parse the resulting text
      reportData = parseAIResponse(responseText);
    } catch (err) {
      console.warn('[AI Service] Anthropic API failed, compiling programmatic fallback report. Error:', err.message);
      reportData = generateFallbackReport(repoData);
    }
  } else {
    console.info('[AI Service] Valid ANTHROPIC_API_KEY not found. Compiling programmatic fallback report.');
    reportData = generateFallbackReport(repoData);
  }

  // 4. Save the generated report to the database
  const aiReport = new AIReport({
    repoId,
    summary: reportData.summary,
    sprintAnalysis: reportData.sprintAnalysis,
    contributorInsights: reportData.contributorInsights,
    bottlenecks: reportData.bottlenecks,
    recommendations: reportData.recommendations,
    productivityScore: reportData.productivityScore
  });

  await aiReport.save();

  return aiReport;
};

/**
 * Retrieve the latest generated AI report for a repository
 * @param {string} repoId - Repository ID
 * @param {string} userId - Authenticated user ID
 * @returns {Promise<Object|null>} Latest report or null
 */
export const getLatestReport = async (repoId, userId) => {
  // Verify repository access
  const repo = await Repository.findOne({ _id: repoId, userId });
  if (!repo) {
    throw new Error('Repository not found or access denied');
  }

  return await AIReport.findOne({ repoId }).sort({ generatedAt: -1 });
};
