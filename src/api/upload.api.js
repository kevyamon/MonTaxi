import apiClient from './client';

export const uploadApi = {
  /**
   * Téléverse la photo de profil vers Cloudinary
   * @param {string} imageUri - URI locale de l'image sélectionnée
   * @returns {Promise<Object>}
   */
  uploadAvatar: async (imageUri) => {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || `avatar_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1].toLowerCase() : 'jpg';
    const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    formData.append('image', {
      uri: imageUri,
      name: filename,
      type
    });

    const response = await apiClient.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Téléverse un document officiel vers Cloudinary
   * @param {string} documentUri - URI locale du document
   * @param {string} docType - 'driverLicense' | 'idCard' | 'vehicleRegistration'
   * @returns {Promise<Object>}
   */
  uploadDocument: async (documentUri, docType) => {
    const formData = new FormData();
    const filename = documentUri.split('/').pop() || `${docType}_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1].toLowerCase() : 'jpg';
    const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    formData.append('document', {
      uri: documentUri,
      name: filename,
      type
    });
    formData.append('docType', docType);

    const response = await apiClient.post('/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
