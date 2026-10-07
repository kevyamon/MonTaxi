import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  saveAuthTokens,
  saveUserProfile,
  getUserProfile,
  getAccessToken,
  clearAuthSession
} from '../utils/storage';
import { authApi } from '../api/auth.api';
import { userApi } from '../api/user.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = useCallback(async () => {
    try {
      const storedToken = await getAccessToken();
      const storedUser = await getUserProfile();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);

        // Rafraîchir les informations utilisateur en arrière-plan
        userApi
          .getProfile()
          .then((res) => {
            if (res.success && res.data) {
              setUser(res.data);
              saveUserProfile(res.data);
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      console.error('[AuthContext] Erreur chargement session :', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (identifier, password) => {
    const res = await authApi.login({ identifier, password });
    if (res.success && res.data) {
      const { user: userData, tokens } = res.data;
      setUser(userData);
      setToken(tokens.accessToken);
      await saveAuthTokens(tokens.accessToken, tokens.refreshToken);
      await saveUserProfile(userData);
      return userData;
    }
    throw new Error(res.message || 'Échec de la connexion');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.data) {
      const { user: newUser, tokens } = res.data;
      setUser(newUser);
      setToken(tokens.accessToken);
      await saveAuthTokens(tokens.accessToken, tokens.refreshToken);
      await saveUserProfile(newUser);
      return newUser;
    }
    throw new Error(res.message || 'Échec de l’inscription');
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await clearAuthSession();
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      saveUserProfile(updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isDriver: user?.role === 'driver',
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider');
  }
  return context;
};
