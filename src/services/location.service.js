import * as Location from 'expo-location';
import { checkLocationCoverage } from '../constants/zones.constants';

/**
 * Demande de permission et récupération de la position GPS actuelle
 * @returns {Promise<{ latitude: number, longitude: number } | null>}
 */
export const getCurrentPosition = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  } catch (error) {
    console.warn('[LocationService] Erreur GPS :', error);
    return null;
  }
};

/**
 * Géocodage inversé pour afficher le quartier et la ville
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>}
 */
export const getReadableAddress = async (latitude, longitude) => {
  try {
    const geocodeResults = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });

    if (geocodeResults && geocodeResults.length > 0) {
      const item = geocodeResults[0];
      const street = item.street || item.name || '';
      const district = item.district || item.subregion || '';
      const city = item.city || item.region || '';

      const parts = [street, district, city].filter(Boolean);
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
  } catch (e) {
    console.warn('[LocationService] Reverse geocode fallback :', e);
  }

  // Vérification de la zone pour le libellé par défaut
  const coverage = checkLocationCoverage(latitude, longitude);
  if (coverage.isInCoverage && coverage.currentZone) {
    return `${coverage.currentZone.name}, Centre`;
  }

  return 'Position actuelle';
};

/**
 * Détermine le statut complet de couverture pour une position
 * @param {number} latitude
 * @param {number} longitude
 */
export const evaluateLocation = async (latitude, longitude) => {
  const coverage = checkLocationCoverage(latitude, longitude);
  const address = await getReadableAddress(latitude, longitude);

  return {
    latitude,
    longitude,
    isInCoverage: coverage.isInCoverage,
    zoneName: coverage.currentZone?.name || null,
    address
  };
};
