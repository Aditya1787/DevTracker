import axiosInstance from '../utils/axiosInstance';

export const signup = async (userData) => {
  const { data } = await axiosInstance.post('/auth/signup', userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.post('/auth/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await axiosInstance.get('/auth/me');
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await axiosInstance.post('/auth/forgotpassword', { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await axiosInstance.post(`/auth/resetpassword/${token}`, { password });
  return data;
};
