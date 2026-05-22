/**
 * Assembles a structured, high-context analysis prompt for Claude,
 * packaging all database telemetry metrics (commits, PRs, issues, contributors)
 * into a clear specification.
 * 
 * @param {Object} repoData - The compiled repository analytics and metadata
 * @returns {string} The final system/user prompt for the LLM
 */
export const buildAnalysisPrompt = (repoData) => {
  const { repository, commits, pullrequests, issues, contributors } = repoData;

  // Format summaries of telemetry for concise inclusion in the prompt
  const activeContributors = contributors.filter(c => !c.inactive).length;
  const totalContributors = contributors.length;
  
  const contributorListSummary = contributors.map(c => 
    `- **${c.login}**: ${c.commitsCount} commits, ${c.mergedPRs}/${c.totalPRs} PRs merged, ${c.closedIssues} issues closed, Score: ${c.productivityScore}/100, LOC added: ${c.additions}, LOC deleted: ${c.deletions}, Status: ${c.inactive ? 'Inactive' : 'Active'}`
  ).join('\n');

  const topLabelsSummary = issues.topLabels?.length > 0
    ? issues.topLabels.map(l => `- ${l.name}: ${l.count} issues`).join('\n')
    : 'None';

  return `You are an elite, data-driven Engineering Manager and Senior VP of Engineering. Your task is to perform an in-depth productivity and operational health analysis of a software repository based on its Git and GitHub telemetry.

Here is the repository and development activity telemetry data:

### 1. Repository Info
- **Name**: ${repository.fullName}
- **Description**: ${repository.description || 'No description provided'}
- **Language**: ${repository.language}
- **Stars / Forks**: ⭐ ${repository.stars} / 🍴 ${repository.forks}
- **Last Synced**: ${repository.lastSynced || 'Never'}

### 2. Pull Request Metrics
- **Total PRs**: ${pullrequests.total}
- **Open / Closed / Merged**: Open: ${pullrequests.open} | Closed: ${pullrequests.closed} | Merged: ${pullrequests.merged}
- **PR Merge Rate**: ${pullrequests.mergeRate}%
- **Average Time to Merge**: ${pullrequests.avgMergeTimeHours} hours

### 3. Issue Tracking Metrics
- **Total Issues**: ${issues.total}
- **Open / Closed**: Open: ${issues.open} | Closed: ${issues.closed}
- **Average Resolution Time**: ${issues.avgResolutionTimeHours} hours
- **Top Labels**:
${topLabelsSummary}

### 4. Developer Contributor Activity
- **Total Tracked Contributors**: ${totalContributors} (Active: ${activeContributors}, Inactive (30d): ${totalContributors - activeContributors})
- **Individual Performance & Workload Breakdown**:
${contributorListSummary}

### 5. Historical Commit Trends (Recent window)
- **Total Daily commits recorded (last 30d)**: ${commits.daily?.reduce((sum, d) => sum + d.count, 0) || 0}
- **Total Weekly commits recorded (last 12w)**: ${commits.weekly?.reduce((sum, w) => sum + w.count, 0) || 0}

---

Based on this telemetry, perform a rigorous and highly professional software team analysis.
You MUST respond with a valid, parseable JSON object matching this exact JSON Schema. Do not wrap the response in markdown blocks or include any conversational preambles/postambles—output ONLY the raw JSON string:

{
  "summary": "A concise, high-impact executive summary (2-3 paragraphs) analyzing the team's velocity, operational efficiency, and overall engineering health based on the telemetry. Note code churn, sync frequency, and language specifics.",
  "sprintAnalysis": "A detailed 1-2 paragraph analysis of the team's sprint rhythm and delivery velocity. Critique their release rhythm, evaluate commit sizes (additions vs deletions), and comment on whether the daily/weekly commit trends indicate a healthy, sustainable cadence or spikey/irregular bursts.",
  "contributorInsights": "A thorough critique of workload balance and collaboration patterns. Call out key-person risks (e.g., if one developer is doing 80% of the additions/deletions), acknowledge top contributors driving velocity, and assess whether the active/inactive ratio suggests team attrition or natural shifting of responsibilities.",
  "bottlenecks": [
    "At least 2-4 specific, data-backed operational bottlenecks. Examples: 'Average PR merge time is 72 hours, indicating reviews are stalled', 'High ratio of open to closed issues (X open vs Y closed)', 'Major skew in code additions with 0 deletions, suggesting legacy bloat', 'X% of the team is inactive', etc."
  ],
  "recommendations": [
    "At least 3-5 concrete, actionable, and specific recommendations to improve delivery throughput, team balance, and dev experience. Ensure they directly reference the metrics or bottlenecks identified (e.g., introduce automated PR reviewers, allocate a refactoring sprint to balance deletions, archive/reassign issues older than 30 days)."
  ],
  "productivityScore": 85
}

Note:
- "productivityScore" MUST be an integer between 0 and 100, representing the comprehensive health score of the repository's processes (incorporating PR merge rate, issue resolution efficiency, active/inactive balance, and commit velocity).
- Do not invent names or metrics not present in the data. Make sure all recommendations and bottlenecks are strictly backed by the telemetry.
- Respond with nothing but the JSON document.`;
};
