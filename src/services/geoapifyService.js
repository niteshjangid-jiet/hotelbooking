import axios from 'axios';

// Geoapify API Key from Environment Variables
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || '';

// Known city center coordinates fallback dictionary
const CITY_FALLBACK_COORDS = {
  udaipur: { lat: 24.5764, lon: 73.6806 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  goa: { lat: 15.4989, lon: 73.8278 },
  kerala: { lat: 9.9312, lon: 76.2673 },
  kochi: { lat: 9.9312, lon: 76.2673 },
  mumbai: { lat: 18.9220, lon: 72.8347 },
  delhi: { lat: 28.6139, lon: 77.2090 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  hyderabad: { lat: 17.3850, lon: 78.4867 },
  shimla: { lat: 31.1048, lon: 77.1734 },
};

/**
 * Get Geoapify API key safely
 * @returns {string}
 */
export const getGeoapifyApiKey = () => {
  return GEOAPIFY_API_KEY;
};

/**
 * Check if a valid Geoapify API Key is configured
 * @returns {boolean}
 */
export const isGeoapifyKeyConfigured = () => {
  return Boolean(GEOAPIFY_API_KEY && GEOAPIFY_API_KEY !== 'your_geoapify_api_key' && GEOAPIFY_API_KEY.trim() !== '');
};

/**
 * Geocode a hotel by address/name/city using Geoapify Geocoding API
 * 
 * @param {Object} locationInfo - { address, hotelName, city, state }
 * @returns {Promise<{ lat: number, lon: number, formattedAddress: string, isFallback: boolean }>}
 */
export const geocodeHotelLocation = async ({ address = '', hotelName = '', city = '', state = '' }) => {
  const cityKey = (city || '').toLowerCase().trim();
  const fallback = CITY_FALLBACK_COORDS[cityKey] || CITY_FALLBACK_COORDS.udaipur;

  if (!isGeoapifyKeyConfigured()) {
    return {
      lat: fallback.lat,
      lon: fallback.lon,
      formattedAddress: address || `${hotelName}, ${city}`,
      isFallback: true,
      reason: 'Geoapify API key not configured',
    };
  }

  try {
    const searchQuery = [hotelName, address, city, state, 'India']
      .filter(Boolean)
      .join(', ');

    const response = await axios.get('https://api.geoapify.com/v1/geocode/search', {
      params: {
        text: searchQuery,
        limit: 1,
        apiKey: GEOAPIFY_API_KEY,
      },
      timeout: 8000,
    });

    const features = response.data?.features;
    if (features && features.length > 0) {
      const firstResult = features[0];
      const [lon, lat] = firstResult.geometry.coordinates;
      return {
        lat,
        lon,
        formattedAddress: firstResult.properties.formatted || `${hotelName}, ${city}`,
        isFallback: false,
      };
    }
  } catch (error) {
    console.warn('Geoapify Geocoding API request failed, utilizing city fallback:', error?.message || error);
  }

  return {
    lat: fallback.lat,
    lon: fallback.lon,
    formattedAddress: address || `${hotelName}, ${city}`,
    isFallback: true,
  };
};

/**
 * Map category string from Geoapify to our unified UI categories
 */

export const parsePlaceCategory = (categories = []) => {
  const catStr = categories.join(',').toLowerCase();
  if (catStr.includes('catering.restaurant') || catStr.includes('catering.cafe') || catStr.includes('catering')) {
    return { key: 'restaurants', label: 'Restaurants & Cafes', color: 'emerald' };
  }
  if (catStr.includes('healthcare') || catStr.includes('hospital') || catStr.includes('pharmacy')) {
    return { key: 'hospitals', label: 'Hospitals & Medical', color: 'rose' };
  }
  if (catStr.includes('financial') || catStr.includes('bank') || catStr.includes('atm')) {
    return { key: 'atms', label: 'ATMs & Banks', color: 'purple' };
  }
  if (catStr.includes('tourism') || catStr.includes('entertainment') || catStr.includes('leisure') || catStr.includes('landmark')) {
    return { key: 'attractions', label: 'Tourist Attractions', color: 'amber' };
  }
  return { key: 'other', label: 'Point of Interest', color: 'sky' };
};

/**
 * Format distance in meters to human readable string (e.g. 450 m or 1.4 km)
 */
export const formatDistance = (meters) => {
  if (!meters && meters !== 0) return 'Nearby';
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

/**
 * Fetch nearby places within a specified radius (default 2km / 2000m) using Geoapify Places API
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radiusMeters - Search radius in meters (default 2000)
 * @returns {Promise<{ places: Array, isFallback: boolean, error: string|null }>}
 */
export const fetchNearbyPlaces = async (lat, lon, radiusMeters = 2000) => {
  if (!isGeoapifyKeyConfigured()) {
    return {
      places: generateMockNearbyPlaces(lat, lon, radiusMeters),
      isFallback: true,
      error: 'Geoapify API key missing in environment (.env)',
    };
  }

  try {
    const categories = [
      'catering.restaurant',
      'catering.cafe',
      'tourism.sights',
      'entertainment',
      'service.financial',
      'commercial.bank',
      'healthcare.hospital',
      'healthcare.pharmacy',
    ].join(',');

    const response = await axios.get('https://api.geoapify.com/v2/places', {
      params: {
        categories,
        filter: `circle:${lon},${lat},${radiusMeters}`,
        bias: `proximity:${lon},${lat}`,
        limit: 30,
        apiKey: GEOAPIFY_API_KEY,
      },
      timeout: 8000,
    });

    const features = response.data?.features || [];

    const places = features.map((feature, idx) => {
      const prop = feature.properties;
      const [placeLon, placeLat] = feature.geometry.coordinates;
      const catInfo = parsePlaceCategory(prop.categories || []);

      return {
        id: prop.place_id || `place-${idx}`,
        name: prop.name || prop.street || prop.address_line1 || 'Nearby Point of Interest',
        lat: placeLat,
        lon: placeLon,
        distanceMeters: prop.distance || 0,
        formattedDistance: formatDistance(prop.distance),
        categoryKey: catInfo.key,
        categoryLabel: catInfo.label,
        categoryColor: catInfo.color,
        address: prop.formatted || prop.address_line2 || '',
        suburb: prop.suburb || prop.city || '',
      };
    });

    return {
      places,
      isFallback: false,
      error: null,
    };
  } catch (err) {
    console.warn('Geoapify Places API error, using dynamic fallback places:', err?.message || err);
    return {
      places: generateMockNearbyPlaces(lat, lon, radiusMeters),
      isFallback: true,
      error: err?.message || 'Failed to fetch places from Geoapify',
    };
  }
};

/**
 * Generate realistic nearby fallback places around a given lat/lon when API key is missing or offline
 */
export const generateMockNearbyPlaces = (centerLat, centerLon, radiusMeters = 2000) => {
  const templates = [
    { name: 'Royal Heritage Restaurant & Rooftop', cat: 'restaurants', dLat: 0.003, dLon: 0.002, dist: 350 },
    { name: 'Lakeview Artisan Cafe & Bakery', cat: 'restaurants', dLat: -0.002, dLon: 0.004, dist: 480 },
    { name: 'State Bank of India ATM & Branch', cat: 'atms', dLat: 0.004, dLon: -0.003, dist: 620 },
    { name: 'HDFC Bank ATM 24x7', cat: 'atms', dLat: -0.005, dLon: -0.002, dist: 790 },
    { name: 'City Palace Museum & Cultural Center', cat: 'attractions', dLat: 0.006, dLon: 0.005, dist: 910 },
    { name: 'Central Sunset Pier & Boat Jetty', cat: 'attractions', dLat: -0.007, dLon: 0.006, dist: 1200 },
    { name: 'Apollo Pharmacy & Wellness Clinic', cat: 'hospitals', dLat: 0.008, dLon: -0.006, dist: 1450 },
    { name: 'City Multi-Specialty Hospital', cat: 'hospitals', dLat: -0.009, dLon: 0.008, dist: 1750 },
  ];

  return templates.map((t, idx) => {
    const catInfo = parsePlaceCategory([t.cat]);
    return {
      id: `mock-place-${idx}`,
      name: t.name,
      lat: centerLat + t.dLat,
      lon: centerLon + t.dLon,
      distanceMeters: t.dist,
      formattedDistance: formatDistance(t.dist),
      categoryKey: catInfo.key,
      categoryLabel: catInfo.label,
      categoryColor: catInfo.color,
      address: `Within ${formatDistance(t.dist)} radius`,
      suburb: 'City Center',
    };
  });
};

/**
 * Get external directions URL for Google Maps or OpenStreetMap
 * 
 * @param {number} lat - Destination Latitude
 * @param {number} lon - Destination Longitude
 * @param {string} destinationName - Optional hotel or spot name
 * @param {string} provider - 'google' | 'osm'
 * @returns {string}
 */
export const getDirectionsUrl = (lat, lon, destinationName = '', provider = 'google') => {
  if (provider === 'osm') {
    return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=;${lat},${lon}`;
  }
  // Default: Google Maps
  const query = destinationName ? encodeURIComponent(destinationName) : `${lat},${lon}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${query}`;
};
