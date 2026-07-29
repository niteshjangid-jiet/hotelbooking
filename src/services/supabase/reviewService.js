import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Fetch reviews for a hotel from Supabase 'reviews' table
 */
export const getSupabaseReviewsByHotel = async (hotelId) => {
  if (!isSupabaseConfigured() || !hotelId) return [];

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`Error fetching reviews for hotel ${hotelId}:`, err);
    return [];
  }
};

/**
 * Add a review to Supabase 'reviews' table
 */
export const createSupabaseReview = async (reviewPayload) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    user_id: reviewPayload.user_id,
    hotel_id: reviewPayload.hotel_id,
    rating: reviewPayload.rating,
    comment: reviewPayload.comment || reviewPayload.review,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('reviews')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Supabase review creation error:', error);
    throw error;
  }

  return data;
};

/**
 * Delete a review from Supabase
 */
export const deleteSupabaseReview = async (reviewId) => {
  if (!isSupabaseConfigured() || !reviewId) return false;

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting review from Supabase:', error);
    throw error;
  }

  return true;
};
