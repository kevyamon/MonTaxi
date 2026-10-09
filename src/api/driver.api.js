import apiClient from './client';

export const driverApi = {
  updateStatus: async (isOnline, coords = null) => {
    const payload = { isOnline };
    if (coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
      payload.latitude = coords.latitude;
      payload.longitude = coords.longitude;
    }
    const response = await apiClient.patch('/drivers/status', payload);
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
