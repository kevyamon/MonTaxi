import axios from 'axios';
import { getAccessToken, getRefreshToken, saveAuthTokens, clearAuthSession } from '../utils/storage';

// Base URL pour le serveur MonTaxi (dynamique depuis .env ou Render)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://montaxi-backend.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Injection automatique du token d'accès
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gestion de renouvellement automatique en cas de 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          await clearAuthSession();
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });

        if (refreshResponse.data?.success) {
          const { accessToken, refreshToken: newRefresh } = refreshResponse.data.data;
          await saveAuthTokens(accessToken, newRefresh);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        await clearAuthSession();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
