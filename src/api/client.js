import axios from 'axios';
import { getAccessToken, getRefreshToken, saveAuthTokens, clearAuthSession } from '../utils/storage';

// Base URL pour le serveur MonTaxi (dynamique depuis .env ou Render)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://montaxi-backend.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Extraction intelligente du message d'erreur serveur
export const getApiErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    if (error.response.data.errors && error.response.data.errors.length > 0) {
      return `${error.response.data.message} : ${error.response.data.errors[0].message}`;
    }
    return error.response.data.message;
  }
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return 'Le serveur met du temps à répondre (démarrage du serveur Render). Veuillez réessayer.';
  }
  if (error?.message === 'Network Error' || !error?.response) {
    return 'Connexion au serveur MonTaxi impossible. Vérifiez votre accès Internet.';
  }
  return error?.message || 'Une erreur inattendue est survenue.';
};

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
