/**
 * Map service using Leaflet and OpenStreetMap (free alternative to Google Maps)
 */

// Nominatim API for geocoding (free OpenStreetMap service)
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

/**
 * Load Leaflet CSS
 * This should be called once when the app initializes
 */
export const loadLeafletCSS = () => {
  if (document.getElementById('leaflet-css')) return;

  const link = document.createElement('link');
  link.id = 'leaflet-css';
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';

  document.head.appendChild(link);
};

/**
 * Geocode an address to get coordinates
 * @param {string} address - Address to geocode
 * @returns {Promise<{lat: number, lng: number, formattedAddress: string}>} Coordinates
 */
export const geocodeAddress = async (address) => {
  try {
    // Load Leaflet CSS if not already loaded
    loadLeafletCSS();

    const response = await fetch(
      `${NOMINATIM_API}/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('No results found for this address');
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      formattedAddress: data[0].display_name
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

/**
 * Reverse geocode coordinates to get address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Address
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `${NOMINATIM_API}/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.display_name) {
      throw new Error('No address found for these coordinates');
    }

    return data.display_name;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};

/**
 * Calculate route between two points using OSRM (Open Source Routing Machine)
 * @param {Object} origin - Origin coordinates {lat, lng} or address string
 * @param {Object} destination - Destination coordinates {lat, lng} or address string
 * @returns {Promise<{distance: string, duration: string, steps: Array, polyline: string}>} Route information
 */
export const calculateRoute = async (origin, destination) => {
  try {
    // Convert addresses to coordinates if needed
    let originCoords = origin;
    let destCoords = destination;

    if (typeof origin === 'string') {
      const geocoded = await geocodeAddress(origin);
      originCoords = { lat: geocoded.lat, lng: geocoded.lng };
    }

    if (typeof destination === 'string') {
      const geocoded = await geocodeAddress(destination);
      destCoords = { lat: geocoded.lat, lng: geocoded.lng };
    }

    // Use OSRM API for routing
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=polyline&steps=true`
    );

    if (!response.ok) {
      throw new Error(`Routing failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    const distanceKm = (route.distance / 1000).toFixed(1);
    const durationMin = Math.round(route.duration / 60);

    return {
      distance: `${distanceKm} km`,
      duration: `${durationMin} min`,
      steps: route.legs[0].steps.map(step => ({
        instruction: step.maneuver.instruction || '',
        distance: (step.distance / 1000).toFixed(1) + ' km',
        duration: Math.round(step.duration / 60) + ' min'
      })),
      polyline: route.geometry
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    throw error;
  }
};

/**
 * Get nearby restaurants using Overpass API (OpenStreetMap data)
 * @param {Object} location - Location coordinates {lat, lng}
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} Array of nearby restaurants
 */
export const getNearbyRestaurants = async (location, radius = 1500) => {
  try {
    // Overpass API query to find restaurants
    const query = `
      [out:json];
      node["amenity"="restaurant"](around:${radius},${location.lat},${location.lng});
      out body;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    if (!response.ok) {
      throw new Error(`Nearby search failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.elements) {
      return [];
    }

    // Transform the data to a format similar to what we'd get from Google Maps
    return data.elements.map(place => ({
      id: place.id.toString(),
      name: place.tags.name || 'Restaurant',
      address: place.tags['addr:street']
        ? `${place.tags['addr:housenumber'] || ''} ${place.tags['addr:street']}, ${place.tags['addr:city'] || ''}`
        : 'Address unavailable',
      rating: place.tags.stars ? parseFloat(place.tags.stars) : null,
      location: {
        lat: place.lat,
        lng: place.lon
      },
      isOpenNow: place.tags.opening_hours ? isOpenNow(place.tags.opening_hours) : null,
      cuisine: place.tags.cuisine || null,
      phone: place.tags.phone || null,
      website: place.tags.website || null
    }));
  } catch (error) {
    console.error('Error finding nearby restaurants:', error);
    // Return empty array instead of throwing to make it more resilient
    return [];
  }
};

/**
 * Helper function to check if a place is currently open based on OSM opening_hours
 * @param {string} openingHours - OpenStreetMap opening_hours string
 * @returns {boolean} Whether the place is currently open
 */
const isOpenNow = (openingHours) => {
  // This is a simplified implementation
  // A full implementation would need to parse the OSM opening_hours format
  // For now, we'll just check if it contains "24/7" for always open
  if (openingHours.includes('24/7')) {
    return true;
  }

  // For other cases, we'd need a more complex parser
  // For simplicity, we'll return null (unknown)
  return null;
};

// Export the service
const mapService = {
  loadLeafletCSS,
  geocodeAddress,
  reverseGeocode,
  calculateRoute,
  getNearbyRestaurants
};

export default mapService;
