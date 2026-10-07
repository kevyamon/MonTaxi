import apiClient from './client';

export const authApi = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  updatePassword: async (passwords) => {
    const response = await apiClient.put('/auth/password', passwords);
    return response.data;
  },

  updatePushToken: async (expoPushToken) => {
    const response = await apiClient.put('/auth/push-token', { expoPushToken });
    return response.data;
  }
};
