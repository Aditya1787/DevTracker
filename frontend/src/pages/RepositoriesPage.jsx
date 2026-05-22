import React, { useContext, useEffect, useState } from 'react';
import { Plus, RefreshCw, Star, GitFork, Check, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';
import { GithubIcon } from '../components/common/GithubIcon';
import { GitHubContext } from '../contexts/GitHubContext';
import { AuthContext } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Badge from '../components/common/Badge';
import ConnectGitHub from '../components/github/ConnectGitHub';
import RepoCard from '../components/github/RepoCard';

const RepositoriesPage = () => {
  const { user } = useContext(AuthContext);
  const {
    repos,
    githubRepos,
    isLoading,
    isGitHubReposLoading,
    addRepo,
    syncRepo,
    fetchGitHubRepos
  } = useContext(GitHubContext);

  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('tracked'); // 'tracked' | 'import'
  const [syncingRepoId, setSyncingRepoId] = useState(null);
  const [addingRepoName, setAddingRepoName] = useState(null);

  useEffect(() => {
    if (user && user.githubToken && activeTab === 'import' && githubRepos.length === 0) {
      fetchGitHubRepos();
    }
  }, [user, activeTab]);

  if (user && !user.githubToken) {
    return <ConnectGitHub />;
  }

  const handleSync = async (repoId) => {
    setSyncingRepoId(repoId);
    showToast('Syncing repository telemetry. This may take a few seconds...', 'info');
    const res = await syncRepo(repoId);
    if (res.success) {
      showToast('Repository synced successfully!', 'success');
    } else {
      showToast(res.message || 'Sync failed', 'error');
    }
    setSyncingRepoId(null);
  };

  const handleAddRepo = async (ghRepo) => {
    setAddingRepoName(ghRepo.fullName);
    showToast(`Adding ${ghRepo.name} and initiating data ingestion...`, 'info');
    const res = await addRepo({
      repoName: ghRepo.name,
      owner: ghRepo.owner?.login || ghRepo.owner,
      fullName: ghRepo.fullName,
      description: ghRepo.description || '',
      stars: ghRepo.stargazers_count || 0,
      forks: ghRepo.forks_count || 0,
      language: ghRepo.language || 'JavaScript',
      githubUrl: ghRepo.html_url
    });

    if (res.success) {
      showToast(`${ghRepo.name} linked and data sync scheduled!`, 'success');
      setActiveTab('tracked');
    } else {
      showToast(res.message || 'Failed to link repository', 'error');
    }
    setAddingRepoName(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Repositories Workspace
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Connect, import, and sync your team's code telemetry assets.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850/80 w-fit self-start">
          <button
            onClick={() => setActiveTab('tracked')}
            className={`text-xs font-bold py-1.5 px-4 rounded-lg transition-all duration-200 ${
              activeTab === 'tracked'
                ? 'bg-indigo-650 text-white shadow-md shadow-indigo-600/10'
                : 'text-slate-450 hover:text-slate-200'
            }`}
          >
            Tracked ({repos.length})
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`text-xs font-bold py-1.5 px-4 rounded-lg transition-all duration-200 ${
              activeTab === 'import'
                ? 'bg-indigo-650 text-white shadow-md shadow-indigo-600/10'
                : 'text-slate-450 hover:text-slate-200'
            }`}
          >
            Link New ({githubRepos.length || 0})
          </button>
        </div>
      </div>

      {activeTab === 'tracked' ? (
        repos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <RepoCard
                key={repo._id}
                repo={repo}
                onSync={() => handleSync(repo._id)}
                isSyncing={syncingRepoId === repo._id}
              />
            ))}
          </div>
        ) : (
          <Card className="py-16 text-center max-w-lg mx-auto flex flex-col items-center">
            <BookOpen className="w-12 h-12 text-slate-500 mb-4 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-200 mb-2">No Active Workspaces</h3>
            <p className="text-xs text-textMuted max-w-sm mb-6 leading-relaxed">
              You aren't active in any repositories yet. Link one of your GitHub repos to start telemetry collection.
            </p>
            <Button onClick={() => setActiveTab('import')} icon={Plus} size="sm">
              Link Your First Repository
            </Button>
          </Card>
        )
      ) : (
        /* Inactive or available repos to link */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">
              Available GitHub Repositories
            </h3>
            <Button
              variant="outline"
              size="xs"
              onClick={fetchGitHubRepos}
              disabled={isGitHubReposLoading}
              className="flex items-center gap-1.5 text-[10px] border-slate-800 text-slate-400 hover:bg-slate-900/50"
            >
              <RefreshCw className={`w-3 h-3 ${isGitHubReposLoading ? 'animate-spin' : ''}`} />
              <span>Refresh GitHub List</span>
            </Button>
          </div>

          {isGitHubReposLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : githubRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {githubRepos.map((ghRepo) => {
                const isAlreadyTracked = repos.some((r) => r.fullName === ghRepo.fullName);
                const isAdding = addingRepoName === ghRepo.fullName;

                return (
                  <Card
                    key={ghRepo.id || ghRepo.fullName}
                    className="p-5 border border-slate-850 hover:border-slate-800 bg-slate-900/40 relative flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <GithubIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                            {ghRepo.language || 'JS/TS'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 text-[10px] font-mono">
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5" />
                            {ghRepo.stargazers_count || 0}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <GitFork className="w-3.5 h-3.5" />
                            {ghRepo.forks_count || 0}
                          </span>
                        </div>
                      </div>

                      <div className="text-left">
                        <h4 className="text-sm font-bold text-slate-200 truncate">{ghRepo.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                          {ghRepo.fullName}
                        </p>
                        <p className="text-xs text-textMuted line-clamp-2 mt-2 leading-relaxed h-8">
                          {ghRepo.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-900/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        {isAlreadyTracked ? 'Sync active' : 'Linkable'}
                      </span>

                      {isAlreadyTracked ? (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </div>
                      ) : (
                        <Button
                          size="xs"
                          onClick={() => handleAddRepo(ghRepo)}
                          disabled={isAdding || isLoading}
                          className="text-[10px] font-bold py-1.5 px-3 flex items-center gap-1.5"
                        >
                          {isAdding ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin text-white" />
                              <span>Linking...</span>
                            </>
                          ) : (
                            <>
                              <span>Track Telemetry</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="py-12 text-center max-w-lg mx-auto border border-amber-500/20 bg-amber-500/5 text-amber-200">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold uppercase tracking-wider mb-1">No Public GitHub Repos Found</h3>
              <p className="text-xs text-amber-350 max-w-sm mx-auto leading-relaxed">
                Ensure you have authorized public repository scopes, or double-check that your GitHub organization permissions are enabled.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default RepositoriesPage;
