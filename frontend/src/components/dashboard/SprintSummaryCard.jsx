import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CheckCircle2, Clock, GitMerge, FileText } from 'lucide-react';

export const SprintSummaryCard = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="p-6 h-64 flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-slate-800 rounded w-1/4" />
        <div className="h-10 bg-slate-850 rounded w-full" />
      </Card>
    );
  }

  // Pre-process metrics
  const totalCommits = stats?.totalCommits || 0;
  const prMergeRate = stats?.prMergeRate || '0%';
  const avgPrMergeTime = stats?.avgPrMergeTime || 'N/A';
  const issueResolutionRate = stats?.issueResolutionRate || '0%';

  return (
    <Card className="p-6">
      <div className="mb-6 text-left">
        <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Velocity Scoreboard</h3>
        <p className="text-xs text-slate-500">Summary statistics of code changes and merge velocities</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Commits */}
        <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-left flex flex-col justify-between h-24">
          <div className="flex items-center gap-1.5 text-slate-450 text-[10px] uppercase font-bold tracking-wider">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Total Commits</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-200 mt-2">{totalCommits}</p>
        </div>

        {/* PR Merge Rate */}
        <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-left flex flex-col justify-between h-24">
          <div className="flex items-center gap-1.5 text-slate-450 text-[10px] uppercase font-bold tracking-wider">
            <GitMerge className="w-3.5 h-3.5 text-emerald-400" />
            <span>PR Merge Rate</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-200 mt-2">{prMergeRate}</p>
        </div>

        {/* PR Resolution Time */}
        <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-left flex flex-col justify-between h-24">
          <div className="flex items-center gap-1.5 text-slate-450 text-[10px] uppercase font-bold tracking-wider">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Avg Merge Time</span>
          </div>
          <p className="text-sm font-bold font-mono text-slate-200 truncate mt-2">{avgPrMergeTime}</p>
        </div>

        {/* Issue Resolutions */}
        <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-left flex flex-col justify-between h-24">
          <div className="flex items-center gap-1.5 text-slate-450 text-[10px] uppercase font-bold tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Issue Resolve</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-200 mt-2">{issueResolutionRate}</p>
        </div>
      </div>
    </Card>
  );
};
export default SprintSummaryCard;
