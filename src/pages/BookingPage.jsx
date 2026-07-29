import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOfficeBuilding, HiUser, HiMail, HiPhone, HiClipboardList, HiShieldCheck, HiArrowLeft } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { fetchHotelByIdOrSlug } from '../services/hotelService';
import { checkRoomAvailability, createBooking, logUserActivity } from '../services/bookingService';
import { initiateRazorpayCheckout, recordPaymentRecord } from '../services/paymentService';
import DateSelector from '../components/booking/DateSelector';
import BookingSummary from '../components/booking/BookingSummary';
import BookingLoader from '../components/booking/BookingLoader';
import { isUserPhoneVerified } from '../services/phoneAuthService';
import OtpVerificationModal from '../components/auth/OtpVerificationModal';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const hotelIdParam = searchParams.get('hotelId') || 'hotel-1';
  const roomIdParam = searchParams.get('roomId');
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const guestsParam = searchParams.get('guests');

  // Dates initialization
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 4);
  const defaultCheckOutStr = threeDaysLater.toISOString().split('T')[0];

  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  // Form State
  const [checkIn, setCheckIn] = useState(checkInParam || tomorrowStr);
  const [checkOut, setCheckOut] = useState(checkOutParam || defaultCheckOutStr);
  const [guests, setGuests] = useState(Number(guestsParam) || 2);
  const [guestName, setGuestName] = useState(user?.user_metadata?.full_name || user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.user_metadata?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  // Update guest details if user loads after mount
  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.user_metadata?.full_name || user.name || '');
      if (!guestEmail) setGuestEmail(user.email || '');
      if (!guestPhone) setGuestPhone(user.user_metadata?.phone || user.phone || '');
    }
  }, [user]);

  // Load hotel and selected room
  useEffect(() => {
    const loadHotel = async () => {
      try {
        setLoading(true);
        const data = await fetchHotelByIdOrSlug(hotelIdParam);
        if (data) {
          setHotel(data);
          const roomsList = data.rooms || [
            {
              id: 'room-1',
              name: 'Deluxe Heritage Room',
              price: data.starting_price || 25000,
              capacity: '2 Guests',
              image: data.image_url,
            },
          ];
          const matchedRoom = roomsList.find((r) => String(r.id) === String(roomIdParam)) || roomsList[0];
          setSelectedRoom(matchedRoom);
        }
      } catch (err) {
        console.error('Failed to fetch hotel for booking:', err);
        toast.error('Unable to load hotel details for booking.');
      } finally {
        setLoading(false);
      }
    };

    loadHotel();
  }, [hotelIdParam, roomIdParam]);

  // Initiate Payment Checkout
  const handleProceedToPayment = async (phoneToUse) => {
    try {
      setIsSubmitting(true);

      // Check availability
      const availCheck = await checkRoomAvailability({
        hotelId: hotel.id || hotel.slug,
        roomId: selectedRoom.id,
        checkIn,
        checkOut,
      });

      if (!availCheck.available) {
        setIsSubmitting(false);
        toast.error(availCheck.message || 'Room is unavailable for selected dates.');
        return;
      }

      // Calculate nights and financial summary
      const dIn = new Date(checkIn);
      const dOut = new Date(checkOut);
      const diffTime = Math.abs(dOut - dIn);
      const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const pricePerNight = selectedRoom.price || hotel.starting_price || 25000;
      const subtotal = pricePerNight * nights;
      const taxes = Math.round(subtotal * 0.18);
      const totalPrice = subtotal + taxes;

      const tempRef = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Open Razorpay Checkout Modal
      await initiateRazorpayCheckout({
        hotel,
        room: selectedRoom,
        totalAmount: totalPrice,
        userDetails: {
          name: guestName,
          email: guestEmail,
          phone: phoneToUse || guestPhone,
        },
        bookingRef: tempRef,
        onSuccess: async (paymentInfo) => {
          try {
            // Build Final Booking Payload with Payment Details
            const payload = {
              userId: user.id,
              userName: guestName,
              userEmail: guestEmail,
              userPhone: phoneToUse || guestPhone,
              hotelId: hotel.id || hotel.slug,
              hotelName: hotel.hotel_name || hotel.name,
              hotelImage: hotel.image_url,
              hotelCity: hotel.city,
              roomId: selectedRoom.id,
              roomName: selectedRoom.name,
              roomImage: selectedRoom.image,
              checkIn,
              checkOut,
              guests,
              nights,
              pricePerNight,
              subtotal,
              taxes,
              totalPrice,
              specialRequests,
              bookingStatus: 'Confirmed',
              paymentStatus: 'paid',
              razorpayPaymentId: paymentInfo.razorpay_payment_id,
              razorpayOrderId: paymentInfo.razorpay_order_id,
            };

            const result = await createBooking(payload);

            if (result.success) {
              // Store payment record in payments table
              await recordPaymentRecord({
                booking_id: result.booking.booking_id,
                razorpay_order_id: paymentInfo.razorpay_order_id,
                razorpay_payment_id: paymentInfo.razorpay_payment_id,
                amount: totalPrice,
                status: 'paid',
              });

              // Log user activity
              logUserActivity(
                user.id,
                'booking',
                `Booked ${selectedRoom.name} at ${hotel.hotel_name || hotel.name} (Payment ID: ${paymentInfo.razorpay_payment_id})`
              );

              toast.success('Payment Successful! Reservation Confirmed.');
              setIsSubmitting(false);
              navigate(`/booking-success/${result.booking.booking_id}`, {
                state: { booking: result.booking, payment: paymentInfo },
              });
            } else {
              throw new Error('Failed to save reservation after payment.');
            }
          } catch (err) {
            console.error('Payment post-processing error:', err);
            toast.error('Payment completed, but logging reservation failed. Please contact support.');
            setIsSubmitting(false);
          }
        },
        onCancel: () => {
          setIsSubmitting(false);
          toast.error('Payment cancelled. You can complete your reservation whenever ready.');
        },
        onError: (err) => {
          setIsSubmitting(false);
          toast.error(err?.message || 'Payment failed. Please try again.');
        },
      });
    } catch (err) {
      console.error('Booking initiation error:', err);
      toast.error(err.message || 'Booking process failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Form Submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to complete your reservation.');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    // Validation 1: Check-in / Check-out
    if (!checkIn || !checkOut) {
      toast.error('Please select valid check-in and check-out dates.');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error('Check-out date must be strictly after Check-in date!');
      return;
    }

    if (new Date(checkIn) < new Date(todayStr)) {
      toast.error('Booking dates cannot be in the past.');
      return;
    }

    // Validation 2: Guest info
    if (!guestName.trim()) {
      toast.error('Please enter your full primary guest name.');
      return;
    }

    if (!guestPhone.trim() || guestPhone.length < 7) {
      toast.error('Please enter a valid contact phone number.');
      return;
    }

    // Validation 3: Room Capacity check if available
    const capacityNum = selectedRoom?.capacity ? parseInt(selectedRoom.capacity) : 4;
    if (!isNaN(capacityNum) && guests > capacityNum + 1) {
      toast.error(`The selected room comfortably accommodates up to ${capacityNum} guests. Please select a larger suite or reduce guest count.`);
      return;
    }

    // Check if phone number is verified via OTP
    if (!isUserPhoneVerified(user)) {
      toast.custom((t) => (
        <div className="bg-slate-900 border border-blue-500/30 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
          <span className="text-xl">📱</span>
          <div>
            <p className="font-bold text-xs">Mobile Verification Required</p>
            <p className="text-[11px] text-slate-400">Please verify your phone number to complete booking.</p>
          </div>
        </div>
      ), { duration: 3000 });
      setIsOtpModalOpen(true);
      return;
    }

    await handleProceedToPayment(guestPhone);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-24 pb-20">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-bold">Preparing reservation details...</p>
      </div>
    );
  }

  if (!hotel || !selectedRoom) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4 pt-24 pb-20">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full">
          <h3 className="text-xl font-bold text-white mb-2">Invalid Booking Request</h3>
          <p className="text-xs text-slate-400 mb-6">Could not locate property information for this reservation.</p>
          <Link
            to="/hotels"
            className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg"
          >
            Browse Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen pt-28 pb-20">
      {/* PROCESSING LOADER OVERLAY */}
      {isSubmitting && <BookingLoader />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* TOP BAR / NAVIGATION BACK */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <Link
              to={`/hotels/${hotel.id || hotel.slug}`}
              className="text-xs font-bold text-slate-400 hover:text-blue-400 flex items-center gap-1.5 mb-2 transition-colors"
            >
              <HiArrowLeft /> Back to {hotel.hotel_name || hotel.name}
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight">Complete Your Reservation</h1>
            <p className="text-xs text-slate-400 mt-1">Review dates, guest info & confirm your luxury stay</p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-2xl text-xs font-extrabold self-start sm:self-auto">
            <HiShieldCheck className="text-base" /> Instant Confirmation & Best Price Guaranteed
          </div>
        </div>

        {/* MAIN TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT COLUMN: BOOKING FORM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            <form onSubmit={handleSubmitBooking} className="space-y-8">
              {/* SECTION 1: READ-ONLY PROPERTY & ROOM DETAILS */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-lg">
                    <HiOfficeBuilding />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Selected Stay Details</h3>
                    <p className="text-xs text-slate-400">Verified hotel property and room reservation selection</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hotel Name (Read-Only) */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Hotel Property
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={hotel.hotel_name || hotel.name}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-200 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  {/* Room Type (Read-Only) */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Room Category
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedRoom.name}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-200 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DATES & GUEST COUNT */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
                <DateSelector
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  onCheckInChange={setCheckIn}
                  onCheckOutChange={setCheckOut}
                  onGuestsChange={setGuests}
                />
              </div>

              {/* SECTION 3: GUEST INFORMATION */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg">
                    <HiUser />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Primary Guest Details</h3>
                    <p className="text-xs text-slate-400">Reservation confirmation and e-ticket will be sent to this email</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <HiUser className="absolute left-4 top-3.5 text-slate-500 text-base" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-white placeholder-slate-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-4 top-3.5 text-slate-500 text-base" />
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-white placeholder-slate-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Contact Mobile Number *
                    </label>
                    <div className="relative">
                      <HiPhone className="absolute left-4 top-3.5 text-slate-500 text-base" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-white placeholder-slate-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Special Requests (Optional)
                  </label>
                  <div className="relative">
                    <HiClipboardList className="absolute left-4 top-3.5 text-slate-500 text-base" />
                    <textarea
                      rows={3}
                      placeholder="e.g. High floor room, late check-in, honeymoon setup, or airport transfer assistance..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Special requests cannot be guaranteed but the property will do its best to accommodate.
                  </p>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Opening Payment Window...
                    </span>
                  ) : (
                    <>
                      <HiShieldCheck className="text-xl text-emerald-400" />
                      <span>Proceed to Pay & Confirm Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* RIGHT COLUMN: STICKY BOOKING SUMMARY */}
          <div className="lg:col-span-1">
            <BookingSummary
              hotel={hotel}
              room={selectedRoom}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onConfirmBooking={handleSubmitBooking}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* MOBILE OTP VERIFICATION MODAL */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        initialPhone={guestPhone}
        onSuccess={(verifiedPhone) => {
          setIsOtpModalOpen(false);
          setGuestPhone(verifiedPhone);
          handleProceedToPayment(verifiedPhone);
        }}
      />
    </div>
  );
};

export default BookingPage;
