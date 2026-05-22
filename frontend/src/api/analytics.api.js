import axiosInstance from '../utils/axiosInstance';

export const getCommitsAnalytics = async (repoId) => {
  const { data } = await axiosInstance.get(`/analytics/commits?repoId=${repoId}`);
  return data;
};

export const getPRsAnalytics = async (repoId) => {
  const { data } = await axiosInstance.get(`/analytics/pullrequests?repoId=${repoId}`);
  return data;
};

export const getIssuesAnalytics = async (repoId) => {
  const { data } = await axiosInstance.get(`/analytics/issues?repoId=${repoId}`);
  return data;
};

export const getContributorsAnalytics = async (repoId) => {
  const { data } = await axiosInstance.get(`/analytics/contributors?repoId=${repoId}`);
  return data;
};

export const getOverviewAnalytics = async (repoId) => {
  const { data } = await axiosInstance.get(`/analytics/overview?repoId=${repoId}`);
  return data;
};
