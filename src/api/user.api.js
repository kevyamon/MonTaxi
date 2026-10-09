import apiClient from './client';

export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete('/users/account');
    return response.data;
  },

  getNotifications: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/users/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await apiClient.patch('/users/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await apiClient.delete(`/users/notifications/${id}`);
    return response.data;
  },

  archiveNotification: async (id) => {
    const response = await apiClient.patch(`/users/notifications/${id}/archive`);
    return response.data;
  }
};
