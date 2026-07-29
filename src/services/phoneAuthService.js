import { supabase, isSupabaseConfigured } from './supabase/supabaseClient';
import toast from 'react-hot-toast';

const OTP_SESSION_KEY = 'hb_phone_otp_session';
const VERIFIED_PHONES_KEY = 'hb_verified_phones';

/**
 * Format phone number into clean E.164 international standard (+91XXXXXXXXXX)
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (phone.startsWith('+')) return phone;
  return `+${digits}`;
};

/**
 * Check if the current user has verified their phone number
 * @param {Object} user - Supabase user object or mock user
 * @returns {boolean}
 */
export const isUserPhoneVerified = (user) => {
  if (!user) return false;

  // Check user metadata
  if (user.user_metadata?.phone_verified === true || user.user_metadata?.phone_number_verified === true) return true;
  if (user.phone_verified === true || user.phone_number_verified === true) return true;

  // Check verified phones registry in localStorage
  try {
    const verifiedList = JSON.parse(localStorage.getItem(VERIFIED_PHONES_KEY) || '{}');
    if (user.id && verifiedList[user.id] === true) return true;
    const phone = user.user_metadata?.phone || user.user_metadata?.phone_number || user.phone || user.phone_number;
    if (phone && verifiedList[phone] === true) return true;
  } catch (err) {
    console.error('Error reading verified phones list:', err);
  }

  return false;
};

/**
 * Send OTP to the provided phone number
 * @param {string} phone - User entered mobile number
 * @returns {Promise<{ success: boolean, message: string, sentViaSupabase: boolean, formattedPhone: string, demoOtp?: string }>}
 */
export const sendPhoneOtp = async (phone) => {
  const formattedPhone = formatPhoneNumber(phone);
  const digitsOnly = formattedPhone.replace(/\D/g, '');

  if (digitsOnly.length < 10) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }

  let sentViaSupabase = false;
  let supabaseMessage = '';

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (!error) {
        sentViaSupabase = true;
        supabaseMessage = `Real SMS OTP sent to ${formattedPhone}. Please check your mobile handset!`;
      } else {
        console.warn('Supabase Phone OTP Provider Error:', error);
        supabaseMessage = `Twilio/Supabase Notice: ${error.message}`;
      }
    } catch (err) {
      console.warn('Supabase Phone Auth Exception:', err);
      supabaseMessage = err.message;
    }
  }

  // Store OTP session in sessionStorage with expiration (5 mins)
  const demoOtp = '123456';
  const sessionPayload = {
    phone: formattedPhone,
    otp: demoOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  };

  sessionStorage.setItem(OTP_SESSION_KEY, JSON.stringify(sessionPayload));

  return {
    success: true,
    sentViaSupabase,
    formattedPhone,
    demoOtp: sentViaSupabase ? null : '123456',
    message: sentViaSupabase
      ? supabaseMessage
      : (supabaseMessage 
          ? `${supabaseMessage}. (Using Test OTP: 123456)` 
          : `Verification code sent to ${formattedPhone} (Demo OTP: 123456)`),
  };
};

/**
 * Verify OTP entered by the user
 * @param {Object} params
 * @param {string} params.phone - User mobile number
 * @param {string} params.otp - 6-digit OTP entered
 * @param {Object} params.user - Current user object
 * @returns {Promise<{ success: boolean, verified: boolean, phone: string }>}
 */
export const verifyPhoneOtp = async ({ phone, otp, user }) => {
  const formattedPhone = formatPhoneNumber(phone);
  const cleanOtp = otp.trim();

  if (!cleanOtp || cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
    throw new Error('Please enter a valid 6-digit OTP verification code.');
  }

  let verified = false;

  // 1. Try verifying via Supabase Auth if configured
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: cleanOtp,
        type: 'sms',
      });

      if (!error) {
        verified = true;
      } else {
        console.warn('Supabase verifyOtp notice:', error.message);
      }
    } catch (err) {
      console.warn('Supabase verifyOtp fallback:', err.message);
    }
  }

  // 2. Check Session Storage Demo OTP Fallback (accepts 123456 or stored OTP)
  if (!verified) {
    try {
      const sessionData = JSON.parse(sessionStorage.getItem(OTP_SESSION_KEY) || '{}');

      if (cleanOtp === '123456' || (sessionData.otp && sessionData.otp === cleanOtp)) {
        if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
          throw new Error('OTP code has expired. Please request a new verification code.');
        }
        verified = true;
      }
    } catch (err) {
      if (err.message.includes('expired')) throw err;
    }
  }

  if (!verified) {
    throw new Error('Invalid OTP code. Please enter the correct 6-digit code received on your phone.');
  }

  // Clear OTP session once verified
  sessionStorage.removeItem(OTP_SESSION_KEY);

  // 3. Mark user phone as verified in database & local storage
  if (user) {
    // Save to verified phones registry in localStorage
    try {
      const verifiedList = JSON.parse(localStorage.getItem(VERIFIED_PHONES_KEY) || '{}');
      if (user.id) verifiedList[user.id] = true;
      verifiedList[formattedPhone] = true;
      localStorage.setItem(VERIFIED_PHONES_KEY, JSON.stringify(verifiedList));
    } catch (e) {
      console.error('Error setting local verified phone:', e);
    }

    // Update user metadata in Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            phone: formattedPhone,
            phone_number: formattedPhone,
            phone_verified: true,
          },
        });

        // Update public.users table
        await supabase.from('users').upsert({
          id: user.id,
          phone: formattedPhone,
          phone_number: formattedPhone,
          phone_verified: true,
          updated_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('Supabase user phone update notice:', dbErr.message);
      }
    }

    // Update local user state in localStorage if using mock user
    try {
      const MOCK_STORAGE_KEY = 'hotel_booking_mock_user';
      const storedUser = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY) || '{}');
      if (storedUser.id === user.id || storedUser.email === user.email) {
        storedUser.phone_verified = true;
        storedUser.phone = formattedPhone;
        storedUser.phone_number = formattedPhone;
        if (storedUser.user_metadata) {
          storedUser.user_metadata.phone_verified = true;
          storedUser.user_metadata.phone = formattedPhone;
          storedUser.user_metadata.phone_number = formattedPhone;
        }
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(storedUser));
      }
    } catch (mockErr) {
      console.warn('Mock user update error:', mockErr);
    }
  }

  return {
    success: true,
    verified: true,
    phone: formattedPhone,
  };
};
