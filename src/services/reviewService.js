import { supabase, isSupabaseConfigured } from './supabase/supabaseClient';

const LOCAL_STORAGE_REVIEWS_KEY = 'hotel_booking_custom_reviews';

/**
 * Helper to get custom reviews stored locally (for offline demo mode)
 */
const getLocalReviews = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading local reviews from localStorage:', e);
    return [];
  }
};

/**
 * Helper to save custom reviews locally
 */
const saveLocalReviews = (reviews) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Error saving local reviews to localStorage:', e);
  }
};

/**
 * Fetch all reviews for a specific hotel (combines Supabase & Local Demo reviews)
 * @param {string} hotelId 
 * @returns {Promise<Array>}
 */
export const fetchHotelReviews = async (hotelId) => {
  let dbReviews = [];

  if (isSupabaseConfigured() && hotelId) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        dbReviews = data.map((item) => {
          // Parse metadata if stored in review text as JSON or structured object
          let parsedReviewText = item.review;
          let extraData = {};

          try {
            if (item.review && item.review.startsWith('{') && item.review.endsWith('}')) {
              extraData = JSON.parse(item.review);
              parsedReviewText = extraData.comment || item.review;
            }
          } catch (e) {
            // plain text review
          }

          return {
            id: item.id,
            hotel_id: item.hotel_id,
            user_id: item.user_id,
            rating: Number(item.rating),
            comment: parsedReviewText,
            title: extraData.title || '',
            user_name: extraData.user_name || 'Guest User',
            user_avatar: extraData.user_avatar || null,
            stay_type: extraData.stay_type || 'Verified Stay',
            date: extraData.date || new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            created_at: item.created_at,
            ratings_breakdown: extraData.ratings_breakdown || {
              cleanliness: Number(item.rating),
              location: Number(item.rating),
              service: Number(item.rating),
              value: Number(item.rating),
            },
            helpful_count: extraData.helpful_count || 0,
          };
        });
      }
    } catch (err) {
      console.warn('Supabase review fetch failed, falling back to local:', err);
    }
  }

  // Get local demo reviews matching this hotelId
  const localReviews = getLocalReviews().filter((r) => r.hotel_id === hotelId);

  // Combine DB & Local reviews, avoiding duplicates by id
  const dbIds = new Set(dbReviews.map((r) => r.id));
  const combined = [...dbReviews, ...localReviews.filter((r) => !dbIds.has(r.id))];

  return combined;
};

/**
 * Add a new review to Supabase & LocalStorage
 * @param {Object} reviewData 
 * @returns {Promise<Object>}
 */
export const createReview = async (reviewData) => {
  const {
    hotel_id,
    user_id,
    user_name,
    user_avatar,
    rating,
    title,
    comment,
    stay_type,
    ratings_breakdown,
  } = reviewData;

  const createdAt = new Date().toISOString();
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const payload = {
    title,
    comment,
    user_name: user_name || 'Anonymous Guest',
    user_avatar: user_avatar || null,
    stay_type: stay_type || 'Verified Stay',
    date: formattedDate,
    ratings_breakdown: ratings_breakdown || {
      cleanliness: rating,
      location: rating,
      service: rating,
      value: rating,
    },
    helpful_count: 0,
  };

  const reviewJson = JSON.stringify(payload);
  let createdRecord = null;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            hotel_id,
            user_id: user_id || null,
            rating: Number(rating),
            review: reviewJson,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        createdRecord = {
          id: data.id,
          hotel_id: data.hotel_id,
          user_id: data.user_id,
          rating: Number(data.rating),
          comment,
          title,
          user_name: payload.user_name,
          user_avatar: payload.user_avatar,
          stay_type: payload.stay_type,
          date: payload.date,
          created_at: data.created_at,
          ratings_breakdown: payload.ratings_breakdown,
          helpful_count: 0,
        };
      }
    } catch (err) {
      console.warn('Failed inserting review into Supabase, using local fallback:', err);
    }
  }

  if (!createdRecord) {
    createdRecord = {
      id: `local-rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      hotel_id,
      user_id: user_id || 'demo-user-id',
      rating: Number(rating),
      comment,
      title,
      user_name: payload.user_name,
      user_avatar: payload.user_avatar,
      stay_type: payload.stay_type,
      date: payload.date,
      created_at: createdAt,
      ratings_breakdown: payload.ratings_breakdown,
      helpful_count: 0,
    };
  }

  // Also update local storage for persistence across reloads in demo mode
  const currentLocals = getLocalReviews();
  saveLocalReviews([createdRecord, ...currentLocals]);

  return createdRecord;
};

/**
 * Update an existing review
 * @param {string} reviewId 
 * @param {Object} updatedData 
 * @returns {Promise<Object>}
 */
export const updateReview = async (reviewId, updatedData) => {
  const {
    rating,
    title,
    comment,
    stay_type,
    ratings_breakdown,
    user_name,
    user_avatar,
  } = updatedData;

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const payload = {
    title,
    comment,
    user_name: user_name || 'Guest User',
    user_avatar: user_avatar || null,
    stay_type: stay_type || 'Verified Stay',
    date: formattedDate,
    ratings_breakdown: ratings_breakdown || {
      cleanliness: rating,
      location: rating,
      service: rating,
      value: rating,
    },
  };

  if (isSupabaseConfigured() && !String(reviewId).startsWith('local-') && !String(reviewId).startsWith('rev-')) {
    try {
      await supabase
        .from('reviews')
        .update({
          rating: Number(rating),
          review: JSON.stringify(payload),
        })
        .eq('id', reviewId);
    } catch (err) {
      console.warn('Failed updating review in Supabase:', err);
    }
  }

  // Update in local storage
  const currentLocals = getLocalReviews();
  const updatedLocals = currentLocals.map((r) => {
    if (r.id === reviewId) {
      return {
        ...r,
        rating: Number(rating),
        title,
        comment,
        stay_type: payload.stay_type,
        ratings_breakdown: payload.ratings_breakdown,
        date: formattedDate,
      };
    }
    return r;
  });
  saveLocalReviews(updatedLocals);

  return {
    id: reviewId,
    rating: Number(rating),
    title,
    comment,
    stay_type: payload.stay_type,
    ratings_breakdown: payload.ratings_breakdown,
    date: formattedDate,
  };
};

/**
 * Delete a review
 * @param {string} reviewId 
 * @returns {Promise<boolean>}
 */
export const deleteReview = async (reviewId) => {
  if (isSupabaseConfigured() && !String(reviewId).startsWith('local-') && !String(reviewId).startsWith('rev-')) {
    try {
      await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
    } catch (err) {
      console.warn('Failed deleting review from Supabase:', err);
    }
  }

  // Delete from local storage
  const currentLocals = getLocalReviews();
  const filteredLocals = currentLocals.filter((r) => r.id !== reviewId);
  saveLocalReviews(filteredLocals);

  return true;
};
