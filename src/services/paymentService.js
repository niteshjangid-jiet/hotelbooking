import { supabase, isSupabaseConfigured } from './supabase/supabaseClient';

const MOCK_PAYMENTS_KEY = 'hotel_booking_user_payments';

/**
 * Dynamically load Razorpay SDK script if not already present
 * @returns {Promise<boolean>}
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK script.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Save payment transaction record to Supabase and LocalStorage
 * 
 * @param {Object} paymentData - { booking_id, razorpay_order_id, razorpay_payment_id, amount, status }
 * @returns {Promise<{ success: boolean, payment: Object }>}
 */
export const recordPaymentRecord = async (paymentData) => {
  const payload = {
    booking_id: paymentData.booking_id,
    razorpay_order_id: paymentData.razorpay_order_id || `order_${Date.now()}`,
    razorpay_payment_id: paymentData.razorpay_payment_id,
    amount: Number(paymentData.amount) || 0,
    status: paymentData.status || 'paid',
    created_at: new Date().toISOString(),
  };

  let savedToSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        savedToSupabase = true;
      } else {
        console.warn('Supabase payments table insert notice:', error?.message || error);
      }
    } catch (err) {
      console.warn('Supabase payment recording fallback:', err);
    }
  }

  // Always store in localStorage fallback
  try {
    const existing = JSON.parse(localStorage.getItem(MOCK_PAYMENTS_KEY) || '[]');
    localStorage.setItem(MOCK_PAYMENTS_KEY, JSON.stringify([payload, ...existing]));
  } catch (err) {
    console.error('LocalStorage payment save error:', err);
  }

  return {
    success: true,
    payment: payload,
    savedToSupabase,
  };
};

/**
 * Trigger Razorpay Test Mode Payment Modal
 * 
 * @param {Object} params
 * @param {Object} params.hotel - Hotel details object
 * @param {Object} params.room - Room details object
 * @param {number} params.totalAmount - Total payment amount in INR (Rupees)
 * @param {Object} params.userDetails - { name, email, phone }
 * @param {string} params.bookingRef - Pre-generated booking reference ID
 * @param {Function} params.onSuccess - Callback on payment success (receives razorpay_payment_id, order_id)
 * @param {Function} params.onCancel - Callback if user closes Razorpay modal without paying
 * @param {Function} params.onError - Callback on payment error
 */
export const initiateRazorpayCheckout = async ({
  hotel,
  room,
  totalAmount,
  userDetails,
  bookingRef,
  onSuccess,
  onCancel,
  onError,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    if (onError) onError(new Error('Razorpay SDK failed to load. Please check your internet connection.'));
    return;
  }

  // Retrieve Razorpay Key ID from Vite env (Default to official Razorpay Test Key if env not set)
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';

  // Amount in Paise (INR smallest sub-unit)
  const amountInPaise = Math.round(Number(totalAmount) * 100);

  // Generate synthetic order ID for Razorpay modal display in test mode
  const generatedOrderId = `order_${bookingRef}_${Date.now().toString().slice(-6)}`;

  const options = {
    key: razorpayKey,
    amount: amountInPaise,
    currency: 'INR',
    name: hotel?.hotel_name || hotel?.name || 'Hotel Booking Reservation',
    description: `Payment for ${room?.name || 'Hotel Stay'} (${bookingRef})`,
    image: hotel?.image_url || hotel?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
    order_id: '', // Empty order_id allows direct test checkout modal in Razorpay without backend signature requirement
    handler: async function (response) {
      try {
        const paymentInfo = {
          razorpay_payment_id: response.razorpay_payment_id || `pay_test_${Math.random().toString(36).substring(2, 10)}`,
          razorpay_order_id: response.razorpay_order_id || generatedOrderId,
          razorpay_signature: response.razorpay_signature || 'test_signature_valid',
        };

        if (onSuccess) {
          await onSuccess(paymentInfo);
        }
      } catch (err) {
        if (onError) onError(err);
      }
    },
    prefill: {
      name: userDetails?.name || '',
      email: userDetails?.email || '',
      contact: userDetails?.phone || '',
    },
    notes: {
      booking_ref: bookingRef,
      hotel_name: hotel?.hotel_name || hotel?.name,
      room_name: room?.name,
    },
    theme: {
      color: '#2563EB', // Blue 600 theme
    },
    modal: {
      ondismiss: function () {
        if (onCancel) onCancel();
      },
    },
  };

  try {
    const razorpayInstance = new window.Razorpay(options);

    razorpayInstance.on('payment.failed', function (response) {
      console.error('Razorpay payment failure event:', response.error);
      if (onError) {
        onError(
          new Error(response.error?.description || response.error?.reason || 'Payment processing failed. Please try again.')
        );
      }
    });

    razorpayInstance.open();
  } catch (err) {
    console.error('Razorpay Modal Initialization Error:', err);
    if (onError) onError(err);
  }
};
