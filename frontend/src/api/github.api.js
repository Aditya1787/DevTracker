import axiosInstance from '../utils/axiosInstance';

export const connectGitHub = async (code) => {
  const redirectUri = window.location.origin.includes('localhost')
    ? 'http://localhost:5173/github/callback'
    : window.location.origin + '/github/callback';
  const { data } = await axiosInstance.post('/github/connect', { code, redirectUri });
  return data;
};

export const fetchGitHubRepos = async () => {
  const { data } = await axiosInstance.get('/github/repos');
  return data;
};

export const addRepository = async (repoDetails) => {
  const { data } = await axiosInstance.post('/github/add-repo', repoDetails);
  return data;
};

export const syncRepository = async (repoId) => {
  const { data } = await axiosInstance.post(`/github/sync/${repoId}`);
  return data;
};

export const disconnectGitHub = async () => {
  const { data } = await axiosInstance.post('/github/disconnect');
  return data;
};
