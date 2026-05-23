import React, { useContext } from 'react';
import { FileText, Download, Sparkles, BrainCircuit, Calendar, Award, CheckCircle, RefreshCw } from 'lucide-react';
import { GitHubContext } from '../contexts/GitHubContext';
import { AuthContext } from '../contexts/AuthContext';
import { useAIReport } from '../hooks/useAIReport';
import { formatDate } from '../utils/formatDate';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import ExportButton from '../components/reports/ExportButton';
import ConnectGitHub from '../components/github/ConnectGitHub';

const ReportsPage = () => {
  const { user } = useContext(AuthContext);
  const { selectedRepo, repos, isLoading: isRepoLoading } = useContext(GitHubContext);
  const { report, isLoading: isReportLoading, isAnalyzing, refetch } = useAIReport();

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
          <FileText className="w-12 h-12 text-slate-500 mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-200 mb-2">No Active Workspaces</h3>
          <p className="text-xs text-textMuted mb-6 leading-relaxed">
            You must connect a repository and synch telemetry data to manage analytics reports.
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
            <FileText className="w-6 h-6 text-indigo-400" />
            <span>Telemetry Reports</span>
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Download high-fidelity executive summaries and developer velocity reports.
          </p>
        </div>

        {selectedRepo && report && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={isReportLoading || isAnalyzing}
              className="flex items-center gap-1 text-xs py-2 px-3 border-slate-800 text-slate-400 hover:bg-slate-800/30"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload</span>
            </Button>
            <ExportButton repoId={selectedRepo._id} repoName={selectedRepo.repoName} />
          </div>
        )}
      </div>

      {isReportLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History Grid / Available Report Info */}
          <div className="lg:col-span-1 space-y-6 text-left">
            <Card title="Active Report Info" icon={FileText}>
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-950/40 rounded-lg border border-slate-850">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Repository Target
                  </div>
                  <div className="text-sm font-bold text-slate-200 mt-1 truncate">
                    {selectedRepo?.fullName || selectedRepo?.repoName}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/40 rounded-lg border border-slate-850">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Generation Timestamp
                  </div>
                  <div className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>{formatDate(report.generatedAt)}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/40 rounded-lg border border-slate-850">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Productivity Rating
                  </div>
                  <div className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>{report.productivityScore || 0}% Operational Velocity</span>
                  </div>
                </div>

                <div className="pt-2">
                  <ExportButton repoId={selectedRepo._id} repoName={selectedRepo.repoName} />
                </div>
              </div>
            </Card>

            <Card title="Report PDF Structure" icon={CheckCircle}>
              <ul className="space-y-2.5 text-xs text-textMuted leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  <span>Dual headers featuring full repository scope details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  <span>Interactive layout blocks parsing Git & Issues parameters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  <span>Comprehensive list highlighting key bottlenecks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  <span>Bullet list summarizing developer strategies.</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-0 border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm overflow-hidden flex flex-col h-full text-left">
              {/* Header preview ribbon */}
              <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Interactive PDF Preview
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase select-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Live telemetry</span>
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 max-h-[600px] scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
                <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/30 space-y-4">
                  <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-indigo-400" />
                    <span>Executive Highlights</span>
                  </h4>
                  <p className="text-xs text-textMuted leading-relaxed whitespace-pre-line">
                    {report.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/30 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Identified Roadblocks
                    </h4>
                    <ul className="space-y-2">
                      {report.bottlenecks?.map((item, idx) => (
                        <li key={idx} className="text-xs text-textMuted flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                          <span className="leading-normal">{item}</span>
                        </li>
                      )) || <p className="text-xs text-slate-500 italic">None detected.</p>}
                    </ul>
                  </div>

                  <div className="border border-slate-800 rounded-xl p-5 bg-slate-950/30 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Strategic Action Items
                    </h4>
                    <ul className="space-y-2">
                      {report.recommendations?.map((item, idx) => (
                        <li key={idx} className="text-xs text-textMuted flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                          <span className="leading-normal">{item}</span>
                        </li>
                      )) || <p className="text-xs text-slate-500 italic">None compiled.</p>}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="py-16 text-center max-w-xl mx-auto flex flex-col items-center">
          <BrainCircuit className="w-12 h-12 text-slate-500 mb-4 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-200 mb-2">No Reports Generated</h3>
          <p className="text-xs text-textMuted max-w-sm mb-6 leading-relaxed">
            There is no AI analysis telemetry compiled for the repository{' '}
            <span className="text-indigo-400 font-bold">{selectedRepo?.repoName}</span>. Go to the AI Insights tab to trigger a report.
          </p>
          <a href="/insights">
            <Button size="sm" icon={Sparkles}>
              Analyze Workspace
            </Button>
          </a>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;
