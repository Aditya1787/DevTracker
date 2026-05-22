import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle, TrendingUp, Award, Calendar, FileText } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { calcProductivityScore } from '../../utils/calcProductivityScore';
import { formatDate } from '../../utils/formatDate';

const ReportPreview = ({ report, repoName }) => {
  if (!report) {
    return (
      <Card className="text-center py-12 flex flex-col items-center justify-center space-y-4">
        <FileText className="w-12 h-12 text-slate-500 animate-pulse" />
        <h3 className="text-xl font-semibold text-textPrimary">No Report Data</h3>
        <p className="text-textMuted max-w-md text-sm">
          Select a repository and trigger an AI analysis to see insights, bottlenecks, and recommendations.
        </p>
      </Card>
    );
  }

  const { score, level, color, badgeColor } = calcProductivityScore(
    report.productivityScore / 10, // Adjust factor if calcProductivityScore scales raw inputs
    0,
    0
  );
  // Wait, let's just use the report.productivityScore directly or adjust it
  const displayScore = report.productivityScore;
  let scoreColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
  let scoreBadge = 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
  let scoreLevel = 'Moderate Activity';

  if (displayScore >= 80) {
    scoreColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    scoreBadge = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    scoreLevel = 'High Performer';
  } else if (displayScore < 40) {
    scoreColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    scoreBadge = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    scoreLevel = 'Critical Focus';
  }

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <Card className="relative overflow-hidden border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI Executive Analysis
              </h2>
            </div>
            <p className="text-textMuted text-xs flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Generated on {formatDate(report.generatedAt)} {repoName ? `• ${repoName}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - displayScore / 100)}
                  className={
                    displayScore >= 80
                      ? 'text-emerald-500'
                      : displayScore >= 40
                      ? 'text-cyan-500'
                      : 'text-rose-500'
                  }
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-bold text-textPrimary">{displayScore}</span>
                <span className="text-[10px] block text-textMuted">SCORE</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-textMuted uppercase tracking-wider font-semibold">
                Productivity Class
              </div>
              <div className="text-sm font-bold text-textPrimary mt-0.5">{scoreLevel}</div>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1.5 font-medium ${scoreBadge}`}>
                {displayScore}% Velocity
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Summaries & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Executive Summary" icon={Sparkles} className="h-full">
            <div className="prose prose-invert max-w-none text-textMuted text-sm leading-relaxed whitespace-pre-line">
              {report.summary}
            </div>
          </Card>

          <Card title="Sprint & Velocity Analysis" icon={TrendingUp}>
            <div className="prose prose-invert max-w-none text-textMuted text-sm leading-relaxed whitespace-pre-line">
              {report.sprintAnalysis}
            </div>
          </Card>

          <Card title="Contributor Insights" icon={Award}>
            <div className="prose prose-invert max-w-none text-textMuted text-sm leading-relaxed whitespace-pre-line">
              {report.contributorInsights}
            </div>
          </Card>
        </div>

        {/* Right column - Bottlenecks & Recommendations */}
        <div className="space-y-6">
          {/* Bottlenecks Card */}
          <Card
            title="Identified Bottlenecks"
            icon={AlertTriangle}
            className="border-rose-500/20 bg-gradient-to-b from-slate-900/60 to-rose-950/5"
          >
            {report.bottlenecks && report.bottlenecks.length > 0 ? (
              <ul className="space-y-3.5">
                {report.bottlenecks.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-textMuted">
                    <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#F43F5E]" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>No severe blockages or bottlenecks detected! Velocity is stable.</span>
              </div>
            )}
          </Card>

          {/* Recommendations Card */}
          <Card
            title="Strategic Recommendations"
            icon={CheckCircle}
            className="border-indigo-500/20 bg-gradient-to-b from-slate-900/60 to-indigo-950/5"
          >
            {report.recommendations && report.recommendations.length > 0 ? (
              <ul className="space-y-3.5">
                {report.recommendations.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-textMuted">
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-textMuted text-sm">No new recommendations needed for this iteration cycle.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
