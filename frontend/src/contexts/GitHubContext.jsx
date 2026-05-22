import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { addRepository, syncRepository, fetchGitHubRepos as apiFetchGitHubRepos } from '../api/github.api';
import { getMe } from '../api/auth.api';

export const GitHubContext = createContext();

export const GitHubProvider = ({ children }) => {
  const { user, setUser, isAuthenticated } = useContext(AuthContext);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubReposLoading, setIsGitHubReposLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync the repos state with the user.repositories array when it changes
  useEffect(() => {
    if (user && user.repositories) {
      setRepos(user.repositories);
      // Select the first repo if none is selected
      if (user.repositories.length > 0 && !selectedRepo) {
        // Try to load selected repo from localStorage first
        const savedRepoId = localStorage.getItem('selectedRepoId');
        const found = user.repositories.find(r => r._id === savedRepoId);
        setSelectedRepo(found || user.repositories[0]);
      } else if (user.repositories.length === 0) {
        setSelectedRepo(null);
      }
    } else {
      setRepos([]);
      setSelectedRepo(null);
    }
  }, [user]);

  // Save selected repo ID to localStorage for session persistence
  useEffect(() => {
    if (selectedRepo) {
      localStorage.setItem('selectedRepoId', selectedRepo._id);
    } else {
      localStorage.removeItem('selectedRepoId');
    }
  }, [selectedRepo]);

  // Helper to refresh user's profile and pull in updated repositories list
  const refreshTrackedRepos = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setRepos(res.data.user.repositories || []);
        // Update selectedRepo reference if it exists
        if (selectedRepo) {
          const updatedSelected = res.data.user.repositories.find(r => r._id === selectedRepo._id);
          if (updatedSelected) setSelectedRepo(updatedSelected);
        }
      }
    } catch (err) {
      console.error('Error refreshing tracked repos:', err);
      setError(err.response?.data?.message || 'Failed to refresh tracked repositories');
    } finally {
      setIsLoading(false);
    }
  };

  const selectRepo = (repo) => {
    setSelectedRepo(repo);
  };

  const addRepo = async (repoDetails) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await addRepository(repoDetails);
      if (res.success && res.data?.repository) {
        const newRepo = res.data.repository;
        
        // Update user repositories state
        const updatedRepos = [...repos, newRepo];
        setRepos(updatedRepos);
        setUser(prev => ({
          ...prev,
          repositories: [...(prev.repositories || []), newRepo]
        }));
        
        // Select it
        setSelectedRepo(newRepo);
        
        // Refresh to get any updated fields or async job logs
        setTimeout(() => {
          refreshTrackedRepos();
        }, 1500);

        return { success: true, repository: newRepo };
      }
      return { success: false, message: res.message || 'Failed to add repository' };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add repository';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const syncRepo = async (repoId) => {
    setIsLoading(true);
    setError(null);
    try {
      const targetId = repoId || selectedRepo?._id;
      if (!targetId) {
        throw new Error('No repository selected for synchronization');
      }

      const res = await syncRepository(targetId);
      if (res.success) {
        // Refresh user profile to load updated statistics
        await refreshTrackedRepos();
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Synchronization failed' };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Synchronization failed';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGitHubReposList = async () => {
    if (!isAuthenticated) return;
    setIsGitHubReposLoading(true);
    setError(null);
    try {
      const res = await apiFetchGitHubRepos();
      if (res.success && res.data?.repos) {
        setGithubRepos(res.data.repos);
        return { success: true, repos: res.data.repos };
      }
      return { success: false, message: res.message || 'Failed to load GitHub repositories' };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to load GitHub repositories. Ensure your account is connected.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setIsGitHubReposLoading(false);
    }
  };

  return (
    <GitHubContext.Provider
      value={{
        repos,
        selectedRepo,
        githubRepos,
        isLoading,
        isGitHubReposLoading,
        error,
        refreshTrackedRepos,
        selectRepo,
        addRepo,
        syncRepo,
        fetchGitHubRepos: fetchGitHubReposList
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
};
