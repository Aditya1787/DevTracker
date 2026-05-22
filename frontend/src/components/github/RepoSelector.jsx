import React, { useContext, useState } from 'react';
import { GitHubContext } from '../../contexts/GitHubContext';
import { GitBranch, ChevronDown, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RepoSelector = ({ isCollapsed = false }) => {
  const { repos, selectedRepo, selectRepo, syncRepo, isLoading } = useContext(GitHubContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (repo) => {
    selectRepo(repo);
    setIsOpen(false);
  };

  if (isCollapsed) {
    return (
      <div className="flex justify-center p-2">
        <button
          onClick={() => navigate('/repositories')}
          className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-slate-750 text-indigo-400 transition-all active:scale-95"
          title="Manage Repositories"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5 px-1">
        Active Workspace
      </label>
      
      {/* Current Selection button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700/60 text-slate-200 transition-all font-medium text-sm text-left active:scale-[0.99] group shadow-inner"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <GitBranch className="w-4 h-4" />
          </div>
          <div className="truncate pr-1">
            {selectedRepo ? (
              <p className="font-semibold text-slate-200 truncate">{selectedRepo.repoName}</p>
            ) : (
              <p className="text-slate-450 text-xs italic">Connect a repository</p>
            )}
            {selectedRepo && (
              <p className="text-[10px] text-slate-500 truncate">{selectedRepo.owner}</p>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 mt-2 z-20 rounded-xl bg-slate-900 border border-slate-850 shadow-2xl p-1.5 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
            {repos.length > 0 ? (
              <>
                {repos.map((r) => (
                  <button
                    key={r._id}
                    onClick={() => handleSelect(r)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm text-left transition-colors ${
                      selectedRepo?._id === r._id
                        ? 'bg-indigo-650/15 border border-indigo-550/20 text-indigo-300 font-semibold'
                        : 'hover:bg-slate-800 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate font-semibold">{r.repoName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{r.owner}</p>
                    </div>
                    {selectedRepo?._id === r._id && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    )}
                  </button>
                ))}
                
                <div className="border-t border-slate-800 my-1.5 pt-1.5">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/repositories');
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800 text-xs font-semibold text-slate-350 hover:text-slate-200 transition-colors border border-slate-850"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Track new repository</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 text-center">
                <p className="text-xs text-slate-400 mb-3">No repositories linked yet</p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/repositories');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Connect
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default RepoSelector;
