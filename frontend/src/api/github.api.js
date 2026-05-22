import axiosInstance from '../utils/axiosInstance';

export const connectGitHub = async (code) => {
  const { data } = await axiosInstance.post('/github/connect', { code });
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
