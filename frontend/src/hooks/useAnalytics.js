import { useState, useEffect, useCallback, useContext } from 'react';
import { GitHubContext } from '../contexts/GitHubContext';
import { getOverviewAnalytics } from '../api/analytics.api';

export const useAnalytics = () => {
  const { selectedRepo } = useContext(GitHubContext);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (repoId) => {
    const id = repoId || selectedRepo?._id;
    if (!id) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await getOverviewAnalytics(id);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.message || 'Failed to fetch repository analytics');
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err.response?.data?.message || 'Failed to fetch analytics metrics');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRepo?._id]);

  useEffect(() => {
    if (selectedRepo?._id) {
      fetchAnalytics(selectedRepo._id);
    } else {
      setData(null);
    }
  }, [selectedRepo?._id, fetchAnalytics]);

  return {
    analytics: data,
    isLoading,
    error,
    refetch: () => fetchAnalytics(selectedRepo?._id)
  };
};
