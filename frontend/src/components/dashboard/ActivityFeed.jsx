import React from 'react';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { GitCommit, Clock, ExternalLink } from 'lucide-react';
import { timeAgo } from '../../utils/formatDate';

export const ActivityFeed = ({ commits = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="p-6 h-64 flex flex-col justify-between animate-pulse">
        <div className="h-5 bg-slate-800 rounded w-1/4" />
        <div className="space-y-3">
          <div className="h-10 bg-slate-800 rounded w-full" />
          <div className="h-10 bg-slate-800 rounded w-full" />
        </div>
      </Card>
    );
  }

  const recentCommits = commits.slice(0, 5); // Display top 5 most recent

  return (
    <Card className="p-6">
      <div className="mb-6 text-left">
        <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Recent Commits</h3>
        <p className="text-xs text-slate-500">Live feed of push activities in active repository</p>
      </div>

      <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
        {recentCommits.length > 0 ? (
          recentCommits.map((c, i) => (
            <div
              key={c.sha || i}
              className="flex gap-4 items-start pb-4 border-b border-slate-850 last:border-b-0 last:pb-0 text-left"
            >
              {/* Contributor Avatar */}
              <Avatar
                src={c.contributorAvatar}
                name={c.contributor || 'Contributor'}
                size="sm"
                className="border border-slate-800/80 mt-0.5"
              />

              {/* Detail body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {c.contributor || 'Unknown Contributor'}
                  </span>
                  
                  <span className="text-[10px] text-slate-550 font-semibold inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{c.commitDate ? timeAgo(c.commitDate) : 'Recently'}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-355 line-clamp-1 leading-relaxed font-medium">
                  {c.message}
                </p>

                {/* Commit hash pill */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold text-slate-500 bg-slate-950 border border-slate-850/60 px-2 py-0.5 rounded-md">
                    <GitCommit className="w-3 h-3 text-indigo-400" />
                    <span>{c.sha ? c.sha.substring(0, 7) : 'Unknown'}</span>
                  </span>
                  
                  {c.url && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-slate-400 transition-colors"
                      title="View commit on GitHub"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center select-none text-slate-450 italic text-xs">
            No recent commit events recorded yet. Connect a repository and sync data!
          </div>
        )}
      </div>
    </Card>
  );
};
export default ActivityFeed;
