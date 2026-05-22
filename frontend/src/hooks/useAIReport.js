import { useState, useEffect, useCallback, useContext } from 'react';
import { GitHubContext } from '../contexts/GitHubContext';
import { getLatestReport, analyzeRepo as apiAnalyzeRepo } from '../api/ai.api';

export const useAIReport = () => {
  const { selectedRepo } = useContext(GitHubContext);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatestReport = useCallback(async (repoId) => {
    const id = repoId || selectedRepo?._id;
    if (!id) {
      setReport(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await getLatestReport(id);
      if (res.success && res.data) {
        setReport(res.data);
      } else {
        setReport(null);
      }
    } catch (err) {
      // It's normal to not have a report initially (404 status).
      if (err.response && err.response.status === 404) {
        setReport(null);
      } else {
        console.error('Error fetching AI report:', err);
        setError(err.response?.data?.message || 'Failed to load latest AI analysis');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedRepo?._id]);

  const triggerAnalysis = async () => {
    const id = selectedRepo?._id;
    if (!id) {
      return { success: false, message: 'No repository selected' };
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await apiAnalyzeRepo(id);
      if (res.success && res.data) {
        setReport(res.data);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'AI analysis failed' };
    } catch (err) {
      console.error('Error running AI analysis:', err);
      const errMsg = err.response?.data?.message || 'AI analysis process failed';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (selectedRepo?._id) {
      fetchLatestReport(selectedRepo._id);
    } else {
      setReport(null);
    }
  }, [selectedRepo?._id, fetchLatestReport]);

  return {
    report,
    isLoading,
    isAnalyzing,
    error,
    refetch: () => fetchLatestReport(selectedRepo?._id),
    triggerAnalysis
  };
};
