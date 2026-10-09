/**
 * Base de données des repères, carrefours et lieux connus
 * Villes couvertes : Bonoua, Aboisso, Adiaké
 */

export const CITY_LANDMARKS = {
  bonoua: [
    { name: 'Carrefour Pain Sucré', zone: 'Bonoua', latitude: 5.2730, longitude: -3.5930 },
    { name: 'Marché Central de Bonoua', zone: 'Bonoua', latitude: 5.2715, longitude: -3.5960 },
    { name: 'Hôpital Général de Bonoua', zone: 'Bonoua', latitude: 5.2680, longitude: -3.6020 },
    { name: 'Gare Routière UTB / SBTA', zone: 'Bonoua', latitude: 5.2750, longitude: -3.5910 },
    { name: 'Carrefour Château d’Eau', zone: 'Bonoua', latitude: 5.2780, longitude: -3.5980 },
    { name: 'Mairie de Bonoua', zone: 'Bonoua', latitude: 5.2710, longitude: -3.5945 },
    { name: 'Lycée Moderne de Bonoua', zone: 'Bonoua', latitude: 5.2820, longitude: -3.5940 },
    { name: 'Quartier Bégnéri', zone: 'Bonoua', latitude: 5.2650, longitude: -3.5900 },
    { name: 'Quartier Koumassi', zone: 'Bonoua', latitude: 5.2770, longitude: -3.6050 },
    { name: 'Pharmacie du Centre', zone: 'Bonoua', latitude: 5.2725, longitude: -3.5955 },
    { name: 'Carrefour Foyer des Jeunes', zone: 'Bonoua', latitude: 5.2740, longitude: -3.5970 },
    { name: 'Stade Municipal de Bonoua', zone: 'Bonoua', latitude: 5.2700, longitude: -3.5990 }
  ],
  aboisso: [
    { name: 'Grand Marché d’Aboisso', zone: 'Aboisso', latitude: 5.4680, longitude: -3.2070 },
    { name: 'Pont sur la Bia', zone: 'Aboisso', latitude: 5.4640, longitude: -3.2120 },
    { name: 'Hôpital Général (CHR) Aboisso', zone: 'Aboisso', latitude: 5.4720, longitude: -3.2040 },
    { name: 'Gare Centrale d’Aboisso', zone: 'Aboisso', latitude: 5.4660, longitude: -3.2090 },
    { name: 'Carrefour TP Aboisso', zone: 'Aboisso', latitude: 5.4690, longitude: -3.2020 },
    { name: 'Mairie & Préfecture', zone: 'Aboisso', latitude: 5.4700, longitude: -3.2050 },
    { name: 'Quartier Sokoura', zone: 'Aboisso', latitude: 5.4620, longitude: -3.2080 },
    { name: 'Lycée Moderne d’Aboisso', zone: 'Aboisso', latitude: 5.4740, longitude: -3.2010 }
  ],
  adiake: [
    { name: 'Débarcadère / Bord de Lagune', zone: 'Adiaké', latitude: 5.2850, longitude: -3.3030 },
    { name: 'Marché Municipal d’Adiaké', zone: 'Adiaké', latitude: 5.2870, longitude: -3.3050 },
    { name: 'Hôpital Général d’Adiaké', zone: 'Adiaké', latitude: 5.2830, longitude: -3.3080 },
    { name: 'Gare Routière d’Adiaké', zone: 'Adiaké', latitude: 5.2890, longitude: -3.3060 },
    { name: 'Mairie d’Adiaké', zone: 'Adiaké', latitude: 5.2880, longitude: -3.3020 },
    { name: 'Carrefour Commissariat', zone: 'Adiaké', latitude: 5.2860, longitude: -3.3040 }
  ]
};

/**
 * Recherche intelligente de repères dans la zone active
 * @param {string} query
 * @param {string} zoneId ('bonoua' | 'aboisso' | 'adiake' | null)
 */
export const searchLandmarks = (query, zoneId = null) => {
  if (!query || query.trim().length < 2) return [];
  const cleanQuery = query.toLowerCase().trim();

  let list = [];
  if (zoneId && CITY_LANDMARKS[zoneId]) {
    list = CITY_LANDMARKS[zoneId];
  } else {
    list = [
      ...CITY_LANDMARKS.bonoua,
      ...CITY_LANDMARKS.aboisso,
      ...CITY_LANDMARKS.adiake
    ];
  }

  return list.filter((item) => item.name.toLowerCase().includes(cleanQuery));
};
