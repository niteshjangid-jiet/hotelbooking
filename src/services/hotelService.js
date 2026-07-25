import { supabase, isSupabaseConfigured } from './supabase/supabaseClient';
import { MOCK_HOTELS } from '../data/mockHotels';

/**
 * Filter and fetch hotels from Supabase PostgreSQL DB or fallback to MOCK_HOTELS dataset.
 * 
 * @param {Object} params - Search and filter parameters
 * @returns {Promise<{ hotels: Array, total: number, isFallback: boolean }>}
 */
export const fetchHotels = async ({
  searchQuery = '',
  city = 'All',
  propertyType = 'All',
  minPrice = 0,
  maxPrice = 100000,
  minRating = 0,
  amenities = [],
  sortBy = 'popular',
  page = 1,
  limit = 20,
} = {}) => {
  // Simulate minor network delay for realistic loading UX
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('hotels').select('*', { count: 'exact' });

      // Apply Search Filter
      if (searchQuery.trim()) {
        query = query.or(
          `hotel_name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      // Apply City Filter
      if (city && city !== 'All' && city !== 'All Cities') {
        query = query.eq('city', city);
      }

      // Apply Property Type Filter
      if (propertyType && propertyType !== 'All' && propertyType !== 'All Types') {
        query = query.eq('property_type', propertyType);
      }

      // Apply Price Range
      query = query.gte('starting_price', minPrice).lte('starting_price', maxPrice);

      // Apply Minimum Rating
      if (minRating > 0) {
        query = query.gte('rating', minRating);
      }

      // Apply Sorting
      switch (sortBy) {
        case 'price_asc':
          query = query.order('starting_price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('starting_price', { ascending: false });
          break;
        case 'rating_desc':
          query = query.order('rating', { ascending: false });
          break;
        case 'popular':
        default:
          query = query.order('review_count', { ascending: false });
          break;
      }

      // Apply Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (!error && data && data.length > 0) {
        return {
          hotels: data,
          total: count || data.length,
          isFallback: false,
        };
      }
    } catch (err) {
      console.warn('Supabase fetch query failed, falling back to local dataset:', err);
    }
  }

  // --- LOCAL FALLBACK ENGINE ---
  let results = [...MOCK_HOTELS];

  // Search Filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    results = results.filter(
      (h) =>
        h.hotel_name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        (h.address && h.address.toLowerCase().includes(q))
    );
  }

  // City Filter
  if (city && city !== 'All' && city !== 'All Cities') {
    results = results.filter(
      (h) => h.city.toLowerCase() === city.toLowerCase()
    );
  }

  // Property Type Filter
  if (propertyType && propertyType !== 'All' && propertyType !== 'All Types') {
    results = results.filter(
      (h) => h.property_type.toLowerCase() === propertyType.toLowerCase()
    );
  }

  // Price Filter
  results = results.filter(
    (h) => h.starting_price >= minPrice && h.starting_price <= maxPrice
  );

  // Rating Filter
  if (minRating > 0) {
    results = results.filter((h) => h.rating >= minRating);
  }

  // Amenities Filter
  if (amenities && amenities.length > 0) {
    results = results.filter((h) => {
      const hotelAmenities = h.amenities || [];
      return amenities.every((reqAmenity) =>
        hotelAmenities.some((a) => a.toLowerCase().includes(reqAmenity.toLowerCase()))
      );
    });
  }

  // Sorting
  switch (sortBy) {
    case 'price_asc':
      results.sort((a, b) => a.starting_price - b.starting_price);
      break;
    case 'price_desc':
      results.sort((a, b) => b.starting_price - a.starting_price);
      break;
    case 'rating_desc':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'name_asc':
      results.sort((a, b) => a.hotel_name.localeCompare(b.hotel_name));
      break;
    case 'popular':
    default:
      results.sort((a, b) => b.review_count - a.review_count);
      break;
  }

  const total = results.length;
  const startIndex = (page - 1) * limit;
  const paginatedHotels = results.slice(startIndex, startIndex + limit);

  return {
    hotels: paginatedHotels,
    total,
    isFallback: true,
  };
};

/**
 * Fetch single hotel details by ID or Slug
 */
export const fetchHotelByIdOrSlug = async (identifier) => {
  if (!identifier) return null;

  if (isSupabaseConfigured()) {
    try {
      const isUUID = /^[0-9a-fA-F-]{36}$/.test(identifier);
      const column = isUUID ? 'id' : 'slug';
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq(column, identifier)
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase get hotel error:', e);
    }
  }

  // Fallback to MOCK_HOTELS
  return (
    MOCK_HOTELS.find(
      (h) => h.id === identifier || h.slug === identifier
    ) || null
  );
};
