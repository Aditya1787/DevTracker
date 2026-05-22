import axiosInstance from '../utils/axiosInstance';

export const downloadPdfReport = async (repoId) => {
  const { data } = await axiosInstance.get(`/reports/pdf/${repoId}`, {
    responseType: 'blob', // Critical for streaming files like PDFs
  });
  return data;
};
