import React, { useContext, useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Star, GitFork, RefreshCw, BarChart2, Calendar, Lock, Globe } from 'lucide-react';
import { GitHubContext } from '../../contexts/GitHubContext';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';

export const RepoCard = ({ repo }) => {
  const { syncRepo, selectRepo } = useContext(GitHubContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async (e) => {
    e.stopPropagation(); // Avoid selecting card
    setIsSyncing(true);
    showToast(`Syncing ${repo.repoName}...`, 'info');
    try {
      const res = await syncRepo(repo._id);
      if (res.success) {
        showToast(`Successfully synced ${repo.repoName}!`, 'success');
      } else {
        showToast(res.message || 'Sync failed', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred during sync', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card hoverEffect className="p-6 flex flex-col justify-between h-full bg-slate-900/60 backdrop-blur-md relative overflow-hidden group">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-indigo-500 via-indigo-650 to-cyan-500 opacity-80" />

      {/* Info Header */}
      <div className="space-y-3.5 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-100 truncate text-base group-hover:text-indigo-400 transition-colors">
                {repo.repoName}
              </h3>
              {repo.isPrivate ? (
                <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">by {repo.owner}</p>
          </div>
          
          <Badge variant="indigo" size="sm">
            {repo.language || 'Unknown'}
          </Badge>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 h-8 leading-relaxed font-medium">
          {repo.description || 'No description provided for this repository.'}
        </p>

        {/* Stars, Forks stats */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-450 pt-1 select-none">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="font-mono text-slate-300">{repo.stars || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4 text-slate-450" />
            <span className="font-mono text-slate-300">{repo.forks || 0}</span>
          </div>
        </div>
      </div>

      {/* Footer Area: Sync + Analytics button hooks */}
      <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between gap-3">
        <span className="text-[10px] text-slate-500 font-semibold inline-flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Synced {repo.lastSynced ? formatDate(repo.lastSynced) : 'Never'}</span>
        </span>

        <div className="flex items-center gap-2">
          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`p-2 rounded-xl border border-slate-850 hover:border-slate-700/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all ${
              isSyncing ? 'animate-spin border-indigo-500/30 text-indigo-400' : 'active:scale-95'
            }`}
            title="Force synchronization"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* View Analytics Button */}
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl"
            icon={BarChart2}
            onClick={() => {
              selectRepo(repo);
              navigate('/');
            }}
          >
            View
          </Button>
        </div>
      </div>
    </Card>
  );
};
export default RepoCard;
