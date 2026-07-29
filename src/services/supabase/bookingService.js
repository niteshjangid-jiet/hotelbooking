import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Save new room booking to Supabase 'bookings' table
 */
export const createSupabaseBooking = async (bookingData) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    booking_id: bookingData.booking_id || `BK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    user_id: bookingData.user_id,
    hotel_id: bookingData.hotel_id,
    room_id: bookingData.room_id,
    check_in: bookingData.check_in,
    check_out: bookingData.check_out,
    guests: bookingData.guests || 1,
    total_amount: bookingData.total_amount || bookingData.total_price || 0,
    booking_status: bookingData.booking_status || 'Confirmed',
    payment_status: bookingData.payment_status || 'Paid',
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Supabase booking creation error:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch all bookings for a user from Supabase
 */
export const getSupabaseUserBookings = async (userId) => {
  if (!isSupabaseConfigured() || !userId) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user bookings from Supabase:', error);
    throw error;
  }

  return data || [];
};

/**
 * Cancel a booking by ID
 */
export const cancelSupabaseBooking = async (bookingId) => {
  if (!isSupabaseConfigured()) return false;

  const isUUID = /^[0-9a-fA-F-]{36}$/.test(bookingId);
  const column = isUUID ? 'id' : 'booking_id';

  const { data, error } = await supabase
    .from('bookings')
    .update({ booking_status: 'Cancelled' })
    .eq(column, bookingId)
    .select();

  if (error) {
    console.error('Error cancelling booking in Supabase:', error);
    throw error;
  }

  return data && data.length > 0;
};
