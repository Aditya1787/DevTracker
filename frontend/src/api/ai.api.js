import axiosInstance from '../utils/axiosInstance';

export const analyzeRepo = async (repoId) => {
  const { data } = await axiosInstance.post('/ai/analyze', { repoId });
  return data;
};

export const getLatestReport = async (repoId) => {
  const { data } = await axiosInstance.get(`/ai/report/${repoId}`);
  return data;
};
