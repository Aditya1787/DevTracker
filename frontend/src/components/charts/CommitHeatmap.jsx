import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import { Tooltip } from '../common/Tooltip';

export const CommitHeatmap = ({ commits = [], isLoading = false }) => {
  const contributionGrid = useMemo(() => {
    // Generate dates for the last 12 weeks (84 days)
    const grid = [];
    
    // Find the latest commit date to center the calendar dynamically if all commits are older than 12 weeks
    let referenceDate = new Date();
    if (commits.length > 0) {
      const dates = commits
        .filter(c => c.commitDate)
        .map(c => new Date(c.commitDate).getTime());
      if (dates.length > 0) {
        const maxDate = Math.max(...dates);
        const isLatestCommitOlderThan12Weeks = (Date.now() - maxDate) > 84 * 24 * 60 * 60 * 1000;
        if (isLatestCommitOlderThan12Weeks) {
          referenceDate = new Date(maxDate);
        }
      }
    }
    
    // Set to 84 days ago relative to referenceDate
    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() - 83);

    // Group commits by YYYY-MM-DD
    const commitCounts = {};
    commits.forEach(c => {
      if (c.commitDate) {
        const dateStr = new Date(c.commitDate).toISOString().split('T')[0];
        commitCounts[dateStr] = (commitCounts[dateStr] || 0) + 1;
      }
    });

    for (let i = 0; i < 84; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = commitCounts[dateStr] || 0;

      grid.push({
        date: dateStr,
        count,
        dayOfWeek: currentDate.getDay(),
        formattedDate: currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      });
    }

    return grid;
  }, [commits]);

  if (isLoading) {
    return (
      <Card className="h-44 flex flex-col justify-between p-6 animate-pulse">
        <div className="h-5 bg-slate-800 rounded w-1/4" />
        <div className="h-16 bg-slate-800/40 rounded-xl w-full" />
      </Card>
    );
  }

  // Get color state based on commit count
  const getShadingClass = (count) => {
    if (count === 0) return 'bg-slate-800/45 border-slate-700/30';
    if (count <= 2) return 'bg-indigo-950 border-indigo-900/40 text-indigo-300';
    if (count <= 5) return 'bg-indigo-850/90 border-indigo-700/40';
    if (count <= 9) return 'bg-indigo-600 border-indigo-500/40';
    return 'bg-cyan-400 shadow-lg shadow-cyan-400/20 border-cyan-300';
  };

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Activity Frequency</h3>
        <p className="text-xs text-slate-500">Distribution of code commits over the past 12 weeks</p>
      </div>

      {/* Contribution Calendar grid */}
      <div className="flex flex-col gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
        <div className="flex gap-[3.5px] items-center min-w-[340px]">
          {/* Days labels */}
          <div className="flex flex-col justify-between h-24 text-[8px] font-bold text-slate-500 pr-1.5 uppercase select-none">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Grid Blocks */}
          <div className="grid grid-flow-col grid-rows-7 gap-[3.5px] h-24 flex-1">
            {contributionGrid.map((day) => (
              <Tooltip
                key={day.date}
                content={`${day.count} commit${day.count === 1 ? '' : 's'} on ${day.formattedDate}`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-sm border transition-all duration-300 hover:scale-115 ${getShadingClass(day.count)}`}
                />
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 text-[9px] font-bold text-slate-500 mt-2 select-none uppercase">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-950/20" />
          <div className="w-2.5 h-2.5 rounded bg-indigo-950 border border-indigo-900/30" />
          <div className="w-2.5 h-2.5 rounded bg-indigo-800/80 border-indigo-700/30" />
          <div className="w-2.5 h-2.5 rounded bg-indigo-650" />
          <div className="w-2.5 h-2.5 rounded bg-cyan-400" />
          <span>More</span>
        </div>
      </div>
    </Card>
  );
};
export default CommitHeatmap;
