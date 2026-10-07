import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'montaxi_access_token';
const REFRESH_TOKEN_KEY = 'montaxi_refresh_token';
const USER_DATA_KEY = 'montaxi_user_profile';

export const saveAuthTokens = async (accessToken, refreshToken) => {
  try {
    if (accessToken) {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error('[SecureStore] Erreur enregistrement jetons :', error);
  }
};

export const getAccessToken = async () => {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

export const getRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

export const saveUserProfile = async (user) => {
  try {
    if (user) {
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
    }
  } catch (error) {
    console.error('[SecureStore] Erreur enregistrement profil :', error);
  }
};

export const getUserProfile = async () => {
  try {
    const raw = await SecureStore.getItemAsync(USER_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const clearAuthSession = async () => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  } catch (error) {
    console.error('[SecureStore] Erreur nettoyage session :', error);
  }
};
