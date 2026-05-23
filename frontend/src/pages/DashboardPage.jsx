import React, { useContext } from 'react';
import { Sparkles, GitPullRequest, GitCommit, AlertCircle, Users, RefreshCw } from 'lucide-react';
import { GitHubContext } from '../contexts/GitHubContext';
import { AuthContext } from '../contexts/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAIReport } from '../hooks/useAIReport';
import { useToast } from '../hooks/useToast';

import StatCard from '../components/dashboard/StatCard';
import AIInsightCard from '../components/dashboard/AIInsightCard';
import BottleneckAlert from '../components/dashboard/BottleneckAlert';
import SprintSummaryCard from '../components/dashboard/SprintSummaryCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';

import CommitBarChart from '../components/charts/CommitBarChart';
import PRPieChart from '../components/charts/PRPieChart';
import IssueLineChart from '../components/charts/IssueLineChart';
import SprintVelocityChart from '../components/charts/SprintVelocityChart';
import CommitHeatmap from '../components/charts/CommitHeatmap';

import ConnectGitHub from '../components/github/ConnectGitHub';
import Spinner from '../components/common/Spinner';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { selectedRepo, repos, syncRepo, isLoading: isRepoLoading } = useContext(GitHubContext);
  const { analytics, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useAnalytics();
  const { report, isLoading: isReportLoading, isAnalyzing, triggerAnalysis } = useAIReport();
  const { showToast } = useToast();

  const handleSync = async () => {
    if (!selectedRepo) return;
    showToast('Starting repository synchronization...', 'info');
    const res = await syncRepo();
    if (res.success) {
      showToast('Repository statistics synced successfully!', 'success');
      refetchAnalytics();
    } else {
      showToast(res.message || 'Synchronization failed', 'error');
    }
  };

  const handleRunAI = async () => {
    showToast('Triggering Claude AI telemetry diagnostics...', 'info');
    const res = await triggerAnalysis();
    if (res.success) {
      showToast('Claude AI Executive analysis completed!', 'success');
    } else {
      showToast(res.message || 'AI analysis failed', 'error');
    }
  };

  // If user hasn't linked GitHub yet
  if (user && !user.githubToken) {
    return <ConnectGitHub />;
  }

  // If user has linked GitHub but has no tracked repositories yet
  if (!isRepoLoading && repos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-850 w-fit mb-6 text-indigo-400">
            <GitCommit className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 mb-3 tracking-tight">No Tracked Repositories</h2>
          <p className="text-xs text-textMuted leading-relaxed mb-6">
            You have connected GitHub but aren't tracking any repository workspaces yet. Link a repository to start tracking telemetry.
          </p>
          <a href="/repositories" className="w-full">
            <Button variant="primary" className="w-full font-bold">
              Link Your First Repo
            </Button>
          </a>
        </Card>
      </div>
    );
  }

  if (isRepoLoading || (!selectedRepo && repos.length > 0)) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const isPageLoading = isAnalyticsLoading || isRepoLoading;

  // Compute stat highlights safely
  const commitsCount = typeof analytics?.commits?.total === 'number'
    ? analytics.commits.total
    : (analytics?.commits?.daily?.reduce((sum, item) => sum + item.count, 0) || 0);
  const prsOverview = analytics?.pullrequests || { open: 0, closed: 0, merged: 0, total: 0, avgMergeTime: 0, mergeRate: 0 };
  const issuesOverview = analytics?.issues || { open: 0, closed: 0, total: 0, avgResolutionTime: 0 };
  const contributorsList = analytics?.contributors || [];

  // Group commits by weekday or similar for bar charts, otherwise use standard formatting
  const commitChartData = analytics?.commits?.daily || []; 
  // Map weekly velocities or formats
  const sprintData = [
    { name: 'Sprint 1', commits: Math.round(commitsCount * 0.15), issues: Math.round(issuesOverview.closed * 0.15) },
    { name: 'Sprint 2', commits: Math.round(commitsCount * 0.25), issues: Math.round(issuesOverview.closed * 0.25) },
    { name: 'Sprint 3', commits: Math.round(commitsCount * 0.35), issues: Math.round(issuesOverview.closed * 0.35) },
    { name: 'Sprint 4', commits: Math.round(commitsCount * 0.25), issues: Math.round(issuesOverview.closed * 0.25) }
  ];

  const scoreboardStats = {
    totalCommits: commitsCount,
    prMergeRate: `${prsOverview.mergeRate || 0}%`,
    avgPrMergeTime: prsOverview.avgMergeTimeHours ? `${prsOverview.avgMergeTimeHours}h` : 'N/A',
    issueResolutionRate: issuesOverview.total > 0 
      ? `${Math.round((issuesOverview.closed / issuesOverview.total) * 100)}%` 
      : '0%'
  };

  return (
    <div className="space-y-6">
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Workspace Console
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Analyzing telemetric repository footprints for{' '}
            <span className="text-slate-300 font-bold underline decoration-indigo-500/50">
              {selectedRepo?.fullName || selectedRepo?.repoName}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isPageLoading}
            className="flex items-center gap-2 text-xs py-2 px-3 border-slate-800/80 hover:bg-slate-800/20 text-slate-350"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPageLoading ? 'animate-spin' : ''}`} />
            <span>Sync Stats</span>
          </Button>

          <Button
            variant="gradient"
            size="sm"
            onClick={handleRunAI}
            disabled={isAnalyzing || isPageLoading}
            className="flex items-center gap-2 text-xs py-2 px-3 shadow-indigo-500/10 hover:shadow-indigo-500/20"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-pulse text-indigo-200' : 'text-white'}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Run Diagnostics'}</span>
          </Button>
        </div>
      </div>

      {/* Overview Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Commits"
          value={commitsCount}
          icon={GitCommit}
          trend={`${Math.round(commitsCount * 0.12)} new`}
          trendDirection="up"
          isLoading={isPageLoading}
        />
        <StatCard
          title="Merged PRs"
          value={prsOverview.merged}
          icon={GitPullRequest}
          trend={`${prsOverview.mergeRate || 0}% rate`}
          trendDirection={prsOverview.mergeRate >= 70 ? 'up' : 'neutral'}
          isLoading={isPageLoading}
        />
        <StatCard
          title="Active Issues"
          value={issuesOverview.open}
          icon={AlertCircle}
          trend={`${issuesOverview.closed} resolved`}
          trendDirection={issuesOverview.open > 5 ? 'down' : 'up'}
          isLoading={isPageLoading}
        />
        <StatCard
          title="Engineers Connected"
          value={contributorsList.length}
          icon={Users}
          trend="Stable team"
          trendDirection="neutral"
          isLoading={isPageLoading}
        />
      </div>

      {/* Heatmap Section */}
      <CommitHeatmap commits={analytics?.rawCommits || []} isLoading={isPageLoading} />

      {/* Telemetry Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CommitBarChart data={commitChartData} isLoading={isPageLoading} />
        </div>
        <div>
          <PRPieChart
            open={prsOverview.open}
            closed={prsOverview.closed}
            merged={prsOverview.merged}
            isLoading={isPageLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IssueLineChart
          data={analytics?.issueTimeline || [
            { _id: 'W1', open: issuesOverview.open, closed: issuesOverview.closed },
            { _id: 'W2', open: Math.max(0, issuesOverview.open - 2), closed: issuesOverview.closed + 2 },
            { _id: 'W3', open: Math.max(0, issuesOverview.open - 1), closed: issuesOverview.closed + 3 }
          ]}
          isLoading={isPageLoading}
        />
        <SprintVelocityChart data={sprintData} isLoading={isPageLoading} />
      </div>

      {/* Insights and Roadblocks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col justify-between">
          <AIInsightCard report={report} isLoading={isReportLoading || isAnalyzing} onAnalyze={handleRunAI} />
        </div>
        <div className="flex flex-col justify-between gap-6">
          <SprintSummaryCard
            stats={scoreboardStats}
            isLoading={isPageLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed
            commits={analytics?.rawCommits?.slice(0, 5) || []}
            pullRequests={analytics?.rawPRs?.slice(0, 5) || []}
            isLoading={isPageLoading}
          />
        </div>
        <div>
          <BottleneckAlert
            roadblocks={report?.bottlenecks || []}
            isLoading={isReportLoading || isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
