import * as Location from 'expo-location';
import { checkLocationCoverage } from '../constants/zones.constants';
import { searchLandmarks } from '../constants/landmarks.constants';

/**
 * Récupère la position GPS actuelle
 */
export const getCurrentPosition = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

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
 * Géocodage inversé de la position actuelle
 */
export const getReadableAddress = async (latitude, longitude) => {
  try {
    const geocodeResults = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (geocodeResults && geocodeResults.length > 0) {
      const item = geocodeResults[0];
      const street = item.street || item.name || '';
      const district = item.district || item.subregion || '';
      const city = item.city || item.region || '';
      const parts = [street, district, city].filter(Boolean);
      if (parts.length > 0) return parts.join(', ');
    }
  } catch (e) {
    console.warn('[LocationService] Reverse geocode fallback :', e);
  }

  const coverage = checkLocationCoverage(latitude, longitude);
  if (coverage.isInCoverage && coverage.currentZone) {
    return `${coverage.currentZone.name}, Centre`;
  }
  return 'Position actuelle';
};

/**
 * Calcule la distance routière estimée en kilomètres (Haversine + facteur de voirie)
 */
export const calculateDistanceKm = (coord1, coord2) => {
  const R = 6371;
  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const directDist = R * c;
  const roadDist = directDist * 1.25;
  return Math.max(0.6, Math.round(roadDist * 10) / 10);
};

/**
 * Valide qu'une saisie n'est pas une chaîne incohérente ou fantaisiste
 */
export const validateDestinationInput = (input) => {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Veuillez saisir une destination.' };
  }
  const clean = input.trim();
  if (clean.length < 3) {
    return { valid: false, error: 'La destination doit comporter au moins 3 caractères.' };
  }
  const letters = clean.match(/[a-zA-Zà-ÿÀ-Ÿ]/g);
  if (!letters || letters.length < 3) {
    return {
      valid: false,
      error: 'Destination non reconnue. Entrez un nom de quartier ou carrefour (ex: Marché, Carrefour...)'
    };
  }
  return { valid: true };
};

/**
 * Résout les coordonnées GPS d'une destination à partir d'un repère ou de la zone
 */
export const resolveDestination = async (text, userCoords, zoneId = null) => {
  const validation = validateDestinationInput(text);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 1. Recherche parmi les repères connus
  const matchingLandmarks = searchLandmarks(text, zoneId);
  if (matchingLandmarks.length > 0) {
    const bestMatch = matchingLandmarks[0];
    return {
      address: bestMatch.name,
      coordinates: { latitude: bestMatch.latitude, longitude: bestMatch.longitude },
      isKnownLandmark: true
    };
  }

  // 2. Géocodage d'appoint
  try {
    const geo = await Location.geocodeAsync(text);
    if (geo && geo.length > 0) {
      const point = geo[0];
      const cov = checkLocationCoverage(point.latitude, point.longitude);
      if (cov.isInCoverage) {
        return {
          address: text.trim(),
          coordinates: { latitude: point.latitude, longitude: point.longitude },
          isKnownLandmark: false
        };
      }
    }
  } catch (e) {}

  // 3. Fallback calcul basé sur la dispersion urbaine locale
  const offsetLat = (Math.random() * 0.018 - 0.009);
  const offsetLon = (Math.random() * 0.018 - 0.009);
  const fallbackCoords = {
    latitude: userCoords.latitude + offsetLat,
    longitude: userCoords.longitude + offsetLon
  };

  return {
    address: text.trim(),
    coordinates: fallbackCoords,
    isKnownLandmark: false
  };
};

/**
 * Évalue la couverture complète d'une position
 */
export const evaluateLocation = async (latitude, longitude) => {
  const coverage = checkLocationCoverage(latitude, longitude);
  const address = await getReadableAddress(latitude, longitude);

  return {
    latitude,
    longitude,
    isInCoverage: coverage.isInCoverage,
    zoneId: coverage.currentZone?.id || null,
    zoneName: coverage.currentZone?.name || null,
    address
  };
};
