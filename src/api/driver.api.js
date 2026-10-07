import apiClient from './client';

export const driverApi = {
  updateStatus: async (isOnline) => {
    const response = await apiClient.patch('/drivers/status', { isOnline });
    return response.data;
  },

  updateLocation: async (latitude, longitude, heading = 0) => {
    const response = await apiClient.patch('/drivers/location', {
      latitude,
      longitude,
      heading
    });
    return response.data;
  }
};
