import apiClient from './client';

export const rideApi = {
  estimateFare: async (params) => {
    const response = await apiClient.post('/rides/estimate', params);
    return response.data;
  },

  createRide: async (rideData) => {
    const response = await apiClient.post('/rides', rideData);
    return response.data;
  },

  getRideHistory: async (page = 1, limit = 15, archived = false) => {
    const response = await apiClient.get(`/rides/history?page=${page}&limit=${limit}&archived=${archived}`);
    return response.data;
  },

  getRideDetails: async (id) => {
    const response = await apiClient.get(`/rides/${id}`);
    return response.data;
  },

  cancelRide: async (id, reason) => {
    const response = await apiClient.patch(`/rides/${id}/cancel`, { reason });
    return response.data;
  },

  acceptRide: async (id) => {
    const response = await apiClient.patch(`/rides/${id}/accept`);
    return response.data;
  },

  notifyArrived: async (id) => {
    const response = await apiClient.patch(`/rides/${id}/arrived`);
    return response.data;
  },

  startRide: async (id) => {
    const response = await apiClient.patch(`/rides/${id}/start`);
    return response.data;
  },

  completeRide: async (id) => {
    const response = await apiClient.patch(`/rides/${id}/complete`);
    return response.data;
  },

  deleteRide: async (id) => {
    const response = await apiClient.delete(`/rides/${id}`);
    return response.data;
  },

  archiveRide: async (id) => {
    const response = await apiClient.patch(`/rides/${id}/archive`);
    return response.data;
  },

  unarchiveRide: async (id) => {
    const response = await apiClient.patch(`/rides/${id}/unarchive`);
    return response.data;
  }
};
