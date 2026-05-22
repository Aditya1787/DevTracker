import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  isLoading = false,
  className = ''
}) => {
  if (isLoading) {
    return (
      <Card className="p-6 flex flex-col justify-between h-32 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/2" />
        <div className="h-8 bg-slate-800 rounded w-3/4 mt-2" />
      </Card>
    );
  }

  const getTrendColor = () => {
    if (trendDirection === 'up') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (trendDirection === 'down') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    return 'text-slate-400 bg-slate-800 border-slate-700/60';
  };

  const TrendIcon = () => {
    if (trendDirection === 'up') return <TrendingUp className="w-3 h-3" />;
    if (trendDirection === 'down') return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  return (
    <Card className={`p-6 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-slate-700/60 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Decorative subtle top right glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4 text-left select-none">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {title}
          </span>
          <span className="text-2xl font-bold font-mono text-slate-100 tracking-tight leading-tight block">
            {value}
          </span>
        </div>

        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-indigo-400">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center justify-between">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${getTrendColor()}`}>
            <TrendIcon />
            <span>{trend}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold select-none uppercase tracking-wider">vs last week</span>
        </div>
      )}
    </Card>
  );
};
export default StatCard;
