import React, { useContext } from 'react';
import { Sparkles, BrainCircuit, RefreshCw, Cpu, Gauge, AlertTriangle, FileText } from 'lucide-react';
import { GitHubContext } from '../contexts/GitHubContext';
import { AuthContext } from '../contexts/AuthContext';
import { useAIReport } from '../hooks/useAIReport';
import { useToast } from '../hooks/useToast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import ReportPreview from '../components/reports/ReportPreview';
import ExportButton from '../components/reports/ExportButton';
import ConnectGitHub from '../components/github/ConnectGitHub';

const AIInsightsPage = () => {
  const { user } = useContext(AuthContext);
  const { selectedRepo, repos, isLoading: isRepoLoading } = useContext(GitHubContext);
  const { report, isLoading: isReportLoading, isAnalyzing, triggerAnalysis, refetch } = useAIReport();
  const { showToast } = useToast();

  const handleRunAI = async () => {
    if (!selectedRepo) {
      showToast('Please select a repository first', 'warning');
      return;
    }
    showToast('Engaging Claude AI telemetry analyzer...', 'info');
    const res = await triggerAnalysis();
    if (res.success) {
      showToast('Claude AI telemetry audit completed!', 'success');
    } else {
      showToast(res.message || 'AI analysis failed', 'error');
    }
  };

  if (user && !user.githubUsername) {
    return <ConnectGitHub />;
  }

  if (isRepoLoading) {
    return (
      <div className="flex-grow flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <Card className="p-8 border border-slate-850 flex flex-col items-center">
          <BrainCircuit className="w-12 h-12 text-slate-500 mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-200 mb-2">No Connected Repositories</h3>
          <p className="text-xs text-textMuted mb-6 leading-relaxed">
            You must link a repository and ingest telemetry data to run AI diagnostics.
          </p>
          <a href="/repositories">
            <Button size="sm">Go to Repositories</Button>
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
            <span>AI Telemetry Audit</span>
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Predictive developer bottlenecks and productivity scoring powered by Claude Sonnet.
          </p>
        </div>

        {selectedRepo && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={isReportLoading || isAnalyzing}
              className="flex items-center gap-1.5 text-xs py-2 px-3 border-slate-800 text-slate-400 hover:bg-slate-800/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReportLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Report</span>
            </Button>

            {report && (
              <ExportButton repoId={selectedRepo._id} repoName={selectedRepo.repoName} />
            )}

            <Button
              variant="gradient"
              size="sm"
              onClick={handleRunAI}
              disabled={isAnalyzing || isReportLoading}
              className="flex items-center gap-2 text-xs py-2 px-3 shadow-indigo-500/10"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-pulse text-indigo-200' : 'text-white'}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Run Diagnostics'}</span>
            </Button>
          </div>
        )}
      </div>

      {isReportLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Spinner size="lg" />
          <p className="text-xs text-slate-550 font-bold uppercase animate-pulse">Loading AI Analysis...</p>
        </div>
      ) : report ? (
        <ReportPreview report={report} repoName={selectedRepo?.fullName || selectedRepo?.repoName} />
      ) : (
        <Card className="py-16 text-center max-w-xl mx-auto flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
          
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-850 w-fit mb-6 text-indigo-400">
            <Cpu className="w-10 h-10 animate-pulse" />
          </div>

          <h3 className="text-lg font-bold text-slate-200 mb-2">Generate Executive AI Audit</h3>
          <p className="text-xs text-textMuted max-w-sm mx-auto mb-8 leading-relaxed">
            There is no AI analysis generated for the workspace{' '}
            <span className="text-indigo-400 font-bold">{selectedRepo?.repoName}</span> yet. We'll run MongoDB telemetry aggregations, map developer patterns, and query Claude Sonnet.
          </p>

          <Button
            size="md"
            onClick={handleRunAI}
            disabled={isAnalyzing}
            className="font-bold flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running Audit Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Run Telemetry Audit</span>
              </>
            )}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default AIInsightsPage;
