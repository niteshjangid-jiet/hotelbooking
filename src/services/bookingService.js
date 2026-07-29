import { supabase, isSupabaseConfigured } from './supabase/supabaseClient';
import { fetchHotelByIdOrSlug } from './hotelService';

const MOCK_BOOKINGS_KEY = 'hotel_booking_user_bookings';

/**
 * Generate a unique 8-character uppercase booking reference ID (e.g., BK-9X42A1)
 */
export const generateBookingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'BK-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Check if a room is available for the given dates
 * 
 * @param {Object} params - { hotelId, roomId, checkIn, checkOut }
 * @returns {Promise<{ available: boolean, message?: string }>}
 */
export const checkRoomAvailability = async ({ hotelId, roomId, checkIn, checkOut }) => {
  // Minor artificial delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!checkIn || !checkOut) {
    return { available: false, message: 'Check-in and check-out dates are required.' };
  }

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  if (endDate <= startDate) {
    return { available: false, message: 'Check-out date must be after check-in date.' };
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('hotel_id', hotelId)
        .eq('room_id', roomId)
        .neq('booking_status', 'Cancelled')
        .lt('check_in', checkOut)
        .gt('check_out', checkIn);

      if (!error && data && data.length > 0) {
        return {
          available: false,
          message: 'This room is already reserved for the selected dates. Please choose different dates or room type.',
        };
      }
    } catch (e) {
      console.warn('Supabase availability check fallback:', e);
    }
  }

  // Fallback / Local Storage Check
  try {
    const localBookings = JSON.parse(localStorage.getItem(MOCK_BOOKINGS_KEY) || '[]');
    const conflict = localBookings.find(
      (b) =>
        b.hotel_id === hotelId &&
        b.room_id === roomId &&
        b.booking_status !== 'Cancelled' &&
        new Date(b.check_in) < endDate &&
        new Date(b.check_out) > startDate
    );

    if (conflict) {
      return {
        available: false,
        message: 'Selected dates conflict with an existing reservation in our system.',
      };
    }
  } catch (err) {
    console.error('Local availability check error:', err);
  }

  return { available: true };
};

/**
 * Save new room booking to Supabase & LocalStorage fallback
 * 
 * @param {Object} bookingPayload
 * @returns {Promise<{ success: boolean, booking: Object }>}
 */
export const createBooking = async (bookingPayload) => {
  const bookingId = generateBookingId();
  const createdAt = new Date().toISOString();

  const newBooking = {
    booking_id: bookingId,
    user_id: bookingPayload.userId || 'guest_user',
    user_name: bookingPayload.userName || 'Guest User',
    user_email: bookingPayload.userEmail || '',
    user_phone: bookingPayload.userPhone || '',
    hotel_id: bookingPayload.hotelId,
    hotel_name: bookingPayload.hotelName,
    hotel_image: bookingPayload.hotelImage,
    hotel_city: bookingPayload.hotelCity || '',
    room_id: bookingPayload.roomId,
    room_name: bookingPayload.roomName,
    room_image: bookingPayload.roomImage || '',
    check_in: bookingPayload.checkIn,
    check_out: bookingPayload.checkOut,
    guests: Number(bookingPayload.guests) || 1,
    nights: Number(bookingPayload.nights) || 1,
    price_per_night: Number(bookingPayload.pricePerNight) || 0,
    subtotal: Number(bookingPayload.subtotal) || 0,
    taxes: Number(bookingPayload.taxes) || 0,
    total_price: Number(bookingPayload.totalPrice) || 0,
    special_requests: bookingPayload.specialRequests || '',
    booking_status: bookingPayload.bookingStatus || 'Confirmed',
    payment_status: bookingPayload.paymentStatus || 'paid',
    razorpay_payment_id: bookingPayload.razorpayPaymentId || null,
    razorpay_order_id: bookingPayload.razorpayOrderId || null,
    created_at: createdAt,
  };

  let savedToSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('bookings').insert([
        {
          booking_id: newBooking.booking_id,
          user_id: newBooking.user_id,
          hotel_id: newBooking.hotel_id,
          room_id: newBooking.room_id,
          check_in: newBooking.check_in,
          check_out: newBooking.check_out,
          guests: newBooking.guests,
          nights: newBooking.nights,
          subtotal: newBooking.subtotal,
          taxes: newBooking.taxes,
          total_price: newBooking.total_price,
          booking_status: newBooking.booking_status,
          payment_status: newBooking.payment_status,
          user_phone: newBooking.user_phone,
          razorpay_payment_id: newBooking.razorpay_payment_id,
          razorpay_order_id: newBooking.razorpay_order_id,
          created_at: newBooking.created_at,
        },
      ]).select();

      if (!error) {
        savedToSupabase = true;
      } else {
        console.warn('Supabase booking insert notice:', error.message);
      }
    } catch (e) {
      console.warn('Failed to insert booking into Supabase:', e);
    }
  }

  // Always store in localStorage so the user can immediately see it in BookingHistoryPage
  try {
    const existing = JSON.parse(localStorage.getItem(MOCK_BOOKINGS_KEY) || '[]');
    const updated = [newBooking, ...existing];
    localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('LocalStorage booking save error:', err);
  }

  return {
    success: true,
    booking: newBooking,
    savedToSupabase,
  };
};

/**
 * Update payment status & Razorpay transaction details for a booking
 */
export const updateBookingPaymentStatus = async (bookingId, { payment_status, booking_status, razorpay_payment_id, razorpay_order_id }) => {
  let updatedInSupabase = false;

  if (isSupabaseConfigured() && bookingId) {
    try {
      const updatePayload = {
        payment_status: payment_status || 'paid',
        booking_status: booking_status || 'Confirmed',
      };
      if (razorpay_payment_id) updatePayload.razorpay_payment_id = razorpay_payment_id;
      if (razorpay_order_id) updatePayload.razorpay_order_id = razorpay_order_id;

      const { error } = await supabase
        .from('bookings')
        .update(updatePayload)
        .eq('booking_id', bookingId);

      if (!error) {
        updatedInSupabase = true;
      } else {
        console.warn('Supabase updateBookingPaymentStatus notice:', error?.message);
      }
    } catch (e) {
      console.warn('Supabase updateBookingPaymentStatus error:', e);
    }
  }

  // Update local storage
  try {
    const localBookings = JSON.parse(localStorage.getItem(MOCK_BOOKINGS_KEY) || '[]');
    const updated = localBookings.map((b) => {
      if (b.booking_id === bookingId) {
        return {
          ...b,
          payment_status: payment_status || b.payment_status || 'paid',
          booking_status: booking_status || b.booking_status || 'Confirmed',
          razorpay_payment_id: razorpay_payment_id || b.razorpay_payment_id,
          razorpay_order_id: razorpay_order_id || b.razorpay_order_id,
        };
      }
      return b;
    });
    localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('LocalStorage update payment status error:', err);
  }

  return { success: true, updatedInSupabase };
};

/**
 * Get user booking history
 */
export const getUserBookings = async (userId) => {
  let dbBookings = [];

  if (isSupabaseConfigured() && userId) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, hotels(hotel_name, image_url, city), rooms(name, image)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        dbBookings = data.map((b) => ({
          ...b,
          hotel_name: b.hotels?.hotel_name || b.hotel_name || 'Luxury Hotel',
          hotel_image: b.hotels?.image_url || b.hotel_image,
          hotel_city: b.hotels?.city || b.hotel_city,
          room_name: b.rooms?.name || b.room_name || 'Standard Room',
        }));
      }
    } catch (e) {
      console.warn('Supabase get user bookings error:', e);
    }
  }

  // Local Storage Fallback & Merge
  try {
    const localBookings = JSON.parse(localStorage.getItem(MOCK_BOOKINGS_KEY) || '[]');
    const userLocal = userId ? localBookings.filter((b) => b.user_id === userId) : localBookings;
    
    // Combine without duplicates
    const combined = [...dbBookings];
    userLocal.forEach((lb) => {
      if (!combined.some((db) => db.booking_id === lb.booking_id)) {
        combined.push(lb);
      }
    });

    return combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (err) {
    return dbBookings;
  }
};

/**
 * Get single booking by booking_id
 */
export const getBookingById = async (bookingId) => {
  if (isSupabaseConfigured() && bookingId) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, hotels(hotel_name, image_url, city), rooms(name, image)')
        .eq('booking_id', bookingId)
        .single();

      if (!error && data) {
        return {
          ...data,
          hotel_name: data.hotels?.hotel_name || data.hotel_name || 'Luxury Hotel',
          hotel_image: data.hotels?.image_url || data.hotel_image,
          hotel_city: data.hotels?.city || data.hotel_city,
          room_name: data.rooms?.name || data.room_name || 'Standard Room',
        };
      }
    } catch (e) {
      console.warn('Supabase getBookingById error:', e);
    }
  }

  // Local storage fallback
  try {
    const localBookings = JSON.parse(localStorage.getItem(MOCK_BOOKINGS_KEY) || '[]');
    const found = localBookings.find((b) => b.booking_id === bookingId);
    if (found) return found;
  } catch (err) {
    console.error('LocalStorage getBookingById error:', err);
  }

  return null;
};

/**
 * Cancel a booking if check-in date is in the future
 * 
 * @param {string} bookingId 
 * @param {string} reason 
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const cancelBooking = async (bookingId, reason = '') => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const booking = await getBookingById(bookingId);
  if (!booking) {
    return { success: false, message: 'Booking record not found.' };
  }

  // Verify check-in date is in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkInDate = new Date(booking.check_in);

  if (checkInDate <= today) {
    return {
      success: false,
      message: 'Bookings cannot be cancelled on or after the check-in date.',
    };
  }

  if (booking.booking_status === 'Cancelled') {
    return { success: false, message: 'This booking is already cancelled.' };
  }

  let updatedInSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          booking_status: 'Cancelled',
          cancellation_reason: reason || 'Cancelled by user',
          cancelled_at: new Date().toISOString()
        })
        .eq('booking_id', bookingId);

      if (!error) {
        updatedInSupabase = true;
      } else {
        console.warn('Supabase cancel booking error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase cancel error fallback:', e);
    }
  }

  // Always update LocalStorage
  try {
    const localBookings = JSON.parse(localStorage.getItem(MOCK_BOOKINGS_KEY) || '[]');
    const updated = localBookings.map((b) => {
      if (b.booking_id === bookingId) {
        return {
          ...b,
          booking_status: 'Cancelled',
          cancellation_reason: reason || 'Cancelled by user',
          cancelled_at: new Date().toISOString(),
        };
      }
      return b;
    });
    localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('LocalStorage cancel update error:', err);
  }

  // Log activity
  logUserActivity(booking.user_id || 'guest', 'cancellation', `Cancelled booking ${bookingId} for ${booking.hotel_name}`);

  return {
    success: true,
    message: `Reservation ${bookingId} successfully cancelled. Any eligible refund will be processed within 3-5 business days.`,
  };
};

/**
 * Log user activity to localStorage / state
 */
export const logUserActivity = (userId, type, description) => {
  try {
    const key = `user_activities_${userId || 'guest'}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const newActivity = {
      id: `act_${Date.now()}`,
      type,
      description,
      timestamp: new Date().toISOString(),
    };
    const updated = [newActivity, ...existing].slice(0, 20); // Keep latest 20
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to log user activity:', e);
  }
};

/**
 * Get user recent activity feed
 */
export const getUserActivities = (userId) => {
  try {
    const key = `user_activities_${userId || 'guest'}`;
    const activities = JSON.parse(localStorage.getItem(key) || '[]');
    
    // If empty, provide nice default initial activities for demo
    if (activities.length === 0) {
      return [
        {
          id: 'act_def_1',
          type: 'security',
          description: 'Logged into Luxury Member Dashboard',
          timestamp: new Date().toISOString(),
        },
      ];
    }
    return activities;
  } catch (e) {
    return [];
  }
};

