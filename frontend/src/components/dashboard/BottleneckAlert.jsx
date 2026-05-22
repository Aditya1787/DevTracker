import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { AlertCircle, ChevronRight, ZapOff } from 'lucide-react';

export const BottleneckAlert = ({ bottlenecks = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="p-6 h-64 flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-slate-800 rounded w-1/4" />
        <div className="space-y-2.5">
          <div className="h-10 bg-slate-800 rounded w-full" />
          <div className="h-10 bg-slate-800 rounded w-full" />
        </div>
      </Card>
    );
  }

  // Pre-process or select fallbacks if empty
  const activeBlockers = bottlenecks.length > 0 ? bottlenecks : [
    { title: 'No active bottlenecks found', severity: 'low', description: 'Development velocity is optimal.' }
  ];

  const getSeverityVariant = (sev) => {
    if (sev?.toLowerCase() === 'high' || sev?.toLowerCase() === 'critical') return 'error';
    if (sev?.toLowerCase() === 'medium') return 'warning';
    return 'success';
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Workflow Bottlenecks</h3>
          <p className="text-xs text-slate-500">Active delays compiled by AI diagnostics</p>
        </div>
        
        {bottlenecks.length > 0 && (
          <Badge variant="error" size="sm">
            {bottlenecks.length} Active
          </Badge>
        )}
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
        {bottlenecks.length > 0 ? (
          bottlenecks.map((item, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850 flex items-start gap-3.5 text-left group hover:border-slate-800 transition-colors"
            >
              <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 mt-0.5 ${
                getSeverityVariant(item.severity) === 'error' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-bold text-slate-200 truncate">{item.title}</p>
                  <Badge variant={getSeverityVariant(item.severity)} size="sm" className="scale-85 origin-left">
                    {item.severity || 'low'}
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-650 group-hover:text-slate-450 transition-colors mt-2" />
            </div>
          ))
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="p-3 rounded-full bg-slate-800/40 text-slate-550 border border-slate-850 mb-3">
              <ZapOff className="w-8 h-8" />
            </div>
            <p className="text-xs text-slate-400 font-bold mb-1">Optimal Workspace Delivery</p>
            <p className="text-[10px] text-slate-550 max-w-[200px]">No active blockages identified by Claude.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
export default BottleneckAlert;
