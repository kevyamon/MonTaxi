import apiClient from './client';

export const aiApi = {
  /**
   * Envoie un message à l'assistant IA et récupère la réponse générée
   * @param {string} message - Message posé par l'utilisateur
   * @returns {Promise<Object>}
   */
  sendMessage: async (message) => {
    const response = await apiClient.post('/ai/chat', { message });
    return response.data;
  },

  /**
   * Récupère l'historique complet de la discussion active
   * @returns {Promise<Object>}
   */
  getHistory: async () => {
    const response = await apiClient.get('/ai/history');
    return response.data;
  },

  /**
   * Réinitialise la conversation et efface les messages
   * @returns {Promise<Object>}
   */
  clearHistory: async () => {
    const response = await apiClient.delete('/ai/history');
    return response.data;
  }
};
