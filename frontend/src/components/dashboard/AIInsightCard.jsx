import React from 'react';
import { Card } from '../common/Card';
import { BrainCircuit, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIInsightCard = ({ report, isLoading = false, onAnalyze }) => {
  if (isLoading) {
    return (
      <Card className="p-6 h-64 flex flex-col justify-between border-indigo-500/20 bg-slate-900/40 animate-pulse">
        <div className="space-y-3">
          <div className="h-5 bg-slate-800 rounded w-1/4" />
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-5/6" />
        </div>
        <div className="h-8 bg-slate-850 rounded w-1/3" />
      </Card>
    );
  }

  return (
    <Card className="p-6 border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-950/20 to-slate-900/80 text-left select-none relative overflow-hidden flex flex-col justify-between h-full group">
      {/* Sparkle subtle decoration */}
      <div className="absolute top-4 right-4 text-indigo-400 opacity-60 group-hover:scale-110 transition-transform">
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">AI Executive Summary</h3>
        </div>

        {report ? (
          <p className="text-xs text-slate-350 leading-relaxed font-medium line-clamp-4">
            {report.summary || 'No summary text available.'}
          </p>
        ) : (
          <div className="space-y-3 py-1">
            <p className="text-xs text-slate-400 italic">
              No AI analysis has been generated for this repository workspace. Connect and trigger analysis.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between">
        {report ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Productivity Index</span>
              <span className="font-mono text-xs font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                {report.productivityScore || 0}/100
              </span>
            </div>
            <Link
              to="/insights"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 group/btn"
            >
              <span>Full Audit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </>
        ) : (
          <button
            onClick={onAnalyze}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Analysis</span>
          </button>
        )}
      </div>
    </Card>
  );
};
export default AIInsightCard;
