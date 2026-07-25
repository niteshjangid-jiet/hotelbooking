import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  HiMap,
  HiLocationMarker,
  HiFilter,
  HiOutlineRefresh,
  HiExternalLink,
  HiExclamationCircle,
  HiSearch,
  HiInformationCircle,
} from 'react-icons/hi';
import {
  FaUtensils,
  FaHospital,
  FaCreditCard,
  FaLandmark,
  FaDirections,
  FaHotel,
} from 'react-icons/fa';
import {
  geocodeHotelLocation,
  fetchNearbyPlaces,
  getGeoapifyApiKey,
  isGeoapifyKeyConfigured,
  getDirectionsUrl,
} from '../../services/geoapifyService';

// Category Definitions & Styles
const CATEGORY_MAP = {
  all: { label: 'All Places', icon: HiFilter, colorClass: 'bg-blue-600 text-white' },
  restaurants: { label: 'Restaurants & Cafes', icon: FaUtensils, colorClass: 'bg-emerald-500 text-white', hex: '#10b981' },
  attractions: { label: 'Attractions', icon: FaLandmark, colorClass: 'bg-amber-500 text-white', hex: '#f59e0b' },
  atms: { label: 'ATMs & Banks', icon: FaCreditCard, colorClass: 'bg-purple-500 text-white', hex: '#a855f7' },
  hospitals: { label: 'Hospitals', icon: FaHospital, colorClass: 'bg-rose-500 text-white', hex: '#f43f5e' },
};

const GeoapifyInteractiveMap = ({ hotel }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [coords, setCoords] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const hotelName = hotel?.hotel_name || hotel?.name || 'Luxury Hotel';
  const address = hotel?.address || '';
  const city = hotel?.city || 'Udaipur';
  const apiKey = getGeoapifyApiKey();

  // Load coordinates and nearby places
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Geocode Hotel Location
        const locResult = await geocodeHotelLocation({
          address,
          hotelName,
          city,
          state: hotel?.state || '',
        });

        if (!isMounted) return;

        setCoords({ lat: locResult.lat, lon: locResult.lon });
        setIsFallback(locResult.isFallback);

        // 2. Fetch Nearby Places (2km radius)
        const placesResult = await fetchNearbyPlaces(locResult.lat, locResult.lon, 2000);

        if (!isMounted) return;

        setPlaces(placesResult.places || []);
        if (placesResult.isFallback) {
          setIsFallback(true);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Geoapify Interactive Map Error:', err);
        setError('Unable to load map data. Displaying standard fallback view.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [hotel?.id, hotelName, address, city]);

  // Initialize and update Leaflet Map instance
  useEffect(() => {
    if (!coords || !mapContainerRef.current || loading) return;

    // Destroy previous map instance if re-initializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const { lat, lon } = coords;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [lat, lon],
      zoom: 14,
      zoomControl: false,
    });

    // Add Zoom Control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Tile Layer: Geoapify Tile API or OpenStreetMap fallback
    const tileUrl = isGeoapifyKeyConfigured()
      ? `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileAttribution = isGeoapifyKeyConfigured()
      ? 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: tileAttribution,
    }).addTo(map);

    // Add 2km radius circle around hotel
    L.circle([lat, lon], {
      radius: 2000,
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '4, 6',
    }).addTo(map);

    // Create Hotel DivIcon
    const hotelIconHtml = `
      <div class="relative flex items-center justify-center">
        <span class="absolute w-10 h-10 bg-blue-500/40 rounded-full animate-ping"></span>
        <div class="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white ring-4 ring-blue-500/30">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M496 448h-16V56c0-13.3-10.7-24-24-24H56C42.7 32 32 42.7 32 56v392H16c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16zm-336-64h-32v-32h32v32zm0-80h-32v-32h32v32zm0-80h-32v-32h32v32zm0-80h-32v-32h32v32zm112 240h-32v-32h32v32zm0-80h-32v-32h32v32zm0-80h-32v-32h32v32zm0-80h-32v-32h32v32zm112 240h-32v-32h32v32zm0-80h-32v-32h32v32zm0-80h-32v-32h32v32zm0-80h-32v-32h32v32z"></path></svg>
        </div>
      </div>
    `;

    const hotelIcon = L.divIcon({
      html: hotelIconHtml,
      className: 'custom-hotel-pin',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -22],
    });

    const hotelMarker = L.marker([lat, lon], { icon: hotelIcon }).addTo(map);

    const directionsUrl = getDirectionsUrl(lat, lon, hotelName);

    const popupHtml = `
      <div class="p-3 max-w-xs text-slate-900 font-sans">
        <span class="inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 rounded-full mb-1">SELECTED HOTEL</span>
        <h4 class="font-black text-sm text-slate-900 leading-tight mb-1">${hotelName}</h4>
        <p class="text-xs text-slate-600 mb-2">${address || city}</p>
        <div class="flex items-center justify-between pt-2 border-t border-slate-200">
          <span class="text-xs font-bold text-emerald-700">₹${hotel?.starting_price?.toLocaleString('en-IN') || '10,000'} / night</span>
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
            Directions &rarr;
          </a>
        </div>
      </div>
    `;

    hotelMarker.bindPopup(popupHtml).openPopup();

    // Create LayerGroup for nearby markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coords, loading]);

  // Update nearby markers when filtered places change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const filteredPlaces = places.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.categoryKey === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    filteredPlaces.forEach((place) => {
      const catHex = CATEGORY_MAP[place.categoryKey]?.hex || '#3b82f6';

      const placeIconHtml = `
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-md border border-white hover:scale-125 transition-transform" style="background-color: ${catHex}; ring: 2px solid ${catHex}40;">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      `;

      const placeIcon = L.divIcon({
        html: placeIconHtml,
        className: 'custom-place-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([place.lat, place.lon], { icon: placeIcon });

      const placePopupHtml = `
        <div class="p-2 text-slate-900 font-sans max-w-xs">
          <span class="inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full text-white mb-1" style="background-color: ${catHex}">
            ${place.categoryLabel}
          </span>
          <h5 class="font-bold text-xs text-slate-900 mb-0.5">${place.name}</h5>
          <p class="text-[11px] text-slate-500 mb-1">${place.formattedDistance} from hotel</p>
          <a href="${getDirectionsUrl(place.lat, place.lon, place.name)}" target="_blank" rel="noopener noreferrer" class="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
            Navigate &rarr;
          </a>
        </div>
      `;

      marker.bindPopup(placePopupHtml);
      marker.on('click', () => {
        setSelectedPlace(place);
      });

      markersLayer.addLayer(marker);
    });
  }, [places, selectedCategory, searchQuery]);

  // Center map on specific place click
  const handleFocusPlace = (place) => {
    setSelectedPlace(place);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.lat, place.lon], 16, {
        duration: 1.2,
      });
    }
  };

  // Center back on hotel
  const handleFocusHotel = () => {
    if (mapInstanceRef.current && coords) {
      mapInstanceRef.current.flyTo([coords.lat, coords.lon], 15, {
        duration: 1.2,
      });
    }
  };

  const filteredPlacesList = places.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.categoryKey === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div id="geoapify-map-section" className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6 shadow-2xl">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <HiMap className="text-blue-500 text-2xl" />
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Interactive Map & Nearby Places</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Powered by Geoapify & OpenStreetMap — Showing attractions & amenities within 2 km radius
          </p>
        </div>

        {/* GET DIRECTIONS BUTTON & RE-CENTER */}
        <div className="flex items-center gap-2">
          {coords && (
            <a
              href={getDirectionsUrl(coords.lat, coords.lon, hotelName)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95"
            >
              <FaDirections className="text-sm" /> Get Directions
            </a>
          )}

          <button
            onClick={handleFocusHotel}
            title="Recenter map on hotel"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700"
          >
            <FaHotel className="text-sm" />
          </button>
        </div>
      </div>

      {/* FALLBACK / API KEY ALERT BANNER */}
      {!isGeoapifyKeyConfigured() && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 text-amber-300 text-xs leading-relaxed">
          <HiInformationCircle className="text-amber-400 text-lg shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-amber-200 block mb-0.5">Geoapify Demo Mode Active</span>
            To enable live Geoapify tiles & dynamic POIs, set <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">VITE_GEOAPIFY_API_KEY</code> in your <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono">.env</code> file. Showing OpenStreetMap tiles & estimated nearby landmarks.
          </div>
        </div>
      )}

      {/* MAIN CONTENT: MAP + SIDEBAR */}
      {loading ? (
        <div className="h-[420px] bg-slate-950/60 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-400 animate-pulse">Loading Geoapify map & nearby places...</p>
        </div>
      ) : error ? (
        <div className="h-[300px] bg-slate-950/60 rounded-2xl border border-rose-900/50 p-6 flex flex-col items-center justify-center text-center">
          <HiExclamationCircle className="text-rose-500 text-4xl mb-2" />
          <p className="text-sm font-bold text-white mb-1">Map Error</p>
          <p className="text-xs text-slate-400 mb-4">{error}</p>
          <button
            onClick={handleFocusHotel}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Retry Loading Map
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAP CANVAS CONTAINER */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl min-h-[360px] sm:min-h-[440px] bg-slate-950">
            <div ref={mapContainerRef} className="w-full h-full min-h-[360px] sm:min-h-[440px] z-10" />

            {/* FLOATING HOTEL BADGE */}
            <div className="absolute top-4 left-4 z-[500] bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-2 rounded-xl shadow-xl flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
              <div>
                <p className="text-[11px] font-extrabold text-white line-clamp-1">{hotelName}</p>
                <p className="text-[9px] text-slate-400 font-semibold">{city} (2 km Search Radius)</p>
              </div>
            </div>
          </div>

          {/* NEARBY PLACES SIDEBAR */}
          <div className="lg:col-span-1 flex flex-col h-[440px] bg-slate-950/60 border border-slate-800 rounded-2xl p-4 overflow-hidden">
            {/* SEARCH INPUT */}
            <div className="relative mb-3">
              <HiSearch className="absolute left-3 top-2.5 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search nearby places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* CATEGORY FILTER TABS */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar shrink-0">
              {Object.entries(CATEGORY_MAP).map(([key, cat]) => {
                const Icon = cat.icon;
                const active = selectedCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Icon className="text-xs" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* PLACES SCROLLABLE LIST */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredPlacesList.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No nearby places found for this filter.
                </div>
              ) : (
                filteredPlacesList.map((place) => {
                  const isSelected = selectedPlace?.id === place.id;
                  const catHex = CATEGORY_MAP[place.categoryKey]?.hex || '#3b82f6';

                  return (
                    <div
                      key={place.id}
                      onClick={() => handleFocusPlace(place)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                          : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: catHex }}
                            />
                            <h5 className="text-xs font-bold text-white line-clamp-1">{place.name}</h5>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{place.address || place.suburb}</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full shrink-0">
                          {place.formattedDistance}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-semibold">{place.categoryLabel}</span>
                        <a
                          href={getDirectionsUrl(place.lat, place.lon, place.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                        >
                          Directions <HiExternalLink className="text-[10px]" />
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoapifyInteractiveMap;
