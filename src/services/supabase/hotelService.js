import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Fetch hotels with filters from Supabase 'hotels' table
 */
export const getSupabaseHotels = async (filters = {}) => {
  if (!isSupabaseConfigured()) return { data: [], count: 0, error: 'Supabase not configured' };

  try {
    let query = supabase.from('hotels').select('*', { count: 'exact' });

    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.trim();
      query = query.or(`name.ilike.%${q}%,hotel_name.ilike.%${q}%,location.ilike.%${q}%,city.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (filters.city && filters.city !== 'All' && filters.city !== 'All Cities') {
      query = query.or(`city.eq.${filters.city},location.ilike.%${filters.city}%`);
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      query = query.gte('starting_price', filters.minPrice).lte('starting_price', filters.maxPrice);
    }

    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }

    if (filters.limit) {
      const page = filters.page || 1;
      const from = (page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return { data: data || [], count: count || 0, error: null };
  } catch (err) {
    console.error('Error fetching hotels from Supabase:', err);
    return { data: [], count: 0, error: err.message };
  }
};

/**
 * Fetch single hotel details by ID or Slug
 */
export const getSupabaseHotelById = async (idOrSlug) => {
  if (!isSupabaseConfigured() || !idOrSlug) return null;

  try {
    const isUUID = /^[0-9a-fA-F-]{36}$/.test(idOrSlug);
    const col = isUUID ? 'id' : 'slug';

    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq(col, idOrSlug)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`Error fetching hotel ${idOrSlug} from Supabase:`, err);
    return null;
  }
};

/**
 * Fetch rooms for a specific hotel ID
 */
export const getSupabaseRoomsByHotelId = async (hotelId) => {
  if (!isSupabaseConfigured() || !hotelId) return [];

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('hotel_id', hotelId);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`Error fetching rooms for hotel ${hotelId} from Supabase:`, err);
    return [];
  }
};
