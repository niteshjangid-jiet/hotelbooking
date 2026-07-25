import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiCheckCircle, 
  HiCalendar, 
  HiLocationMarker, 
  HiUser, 
  HiPrinter, 
  HiTicket, 
  HiArrowRight,
  HiShieldCheck,
  HiOutlineSparkles,
  HiMail,
  HiPhone
} from 'react-icons/hi';
import { formatPrice } from '../utils/formatters';

const BookingSuccessPage = () => {
  const location = useLocation();
  const { bookingId: paramBookingId } = useParams();

  // Try retrieving booking details from location state or mock display
  const booking = location.state?.booking || {
    booking_id: paramBookingId || 'BK-89A4F2',
    user_name: 'Primary Guest',
    user_email: 'guest@example.com',
    user_phone: '+91 98765 43210',
    hotel_name: 'The Taj Lake Palace',
    hotel_city: 'Udaipur',
    hotel_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    room_name: 'Deluxe Heritage Room',
    check_in: '2026-08-01',
    check_out: '2026-08-04',
    guests: 2,
    nights: 3,
    total_price: 88500,
    booking_status: 'Confirmed',
    created_at: new Date().toISOString(),
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* TOP DECORATIVE GLOW */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* CELEBRATION HEADER */}
          <div className="text-center space-y-4 pb-8 border-b border-slate-800 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-emerald-500/20"
            >
              <HiCheckCircle />
            </motion.div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 font-extrabold text-xs rounded-full border border-emerald-500/20 mb-2">
                <HiOutlineSparkles /> Booking Confirmed & Guaranteed
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Reservation Successful!
              </h1>
              <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
                Thank you for choosing us! A confirmation receipt and check-in pass have been issued.
              </p>
            </div>

            {/* BOOKING REFERENCE BADGE */}
            <div className="inline-flex items-center justify-center gap-3 bg-slate-950/80 border border-slate-800 px-6 py-3 rounded-2xl">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Booking Ref:</span>
              <span className="text-xl font-black text-blue-400 tracking-wider font-mono">{booking.booking_id}</span>
            </div>
          </div>

          {/* HOTEL & ROOM SUMMARY CARD */}
          <div className="my-8 bg-slate-950/60 border border-slate-800/90 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
            {booking.hotel_image && (
              <div className="sm:w-2/5 h-48 sm:h-auto relative bg-slate-900">
                <img
                  src={booking.hotel_image}
                  alt={booking.hotel_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent sm:hidden" />
              </div>
            )}
            <div className="p-6 flex-1 space-y-3 justify-center flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold uppercase tracking-wider">
                <HiLocationMarker /> {booking.hotel_city}
              </div>
              <h3 className="text-xl font-extrabold text-white">{booking.hotel_name}</h3>
              <p className="text-xs text-slate-300 font-medium">Category: <span className="text-white font-bold">{booking.room_name}</span></p>

              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl w-fit">
                <HiShieldCheck /> Status: {booking.booking_status || 'Confirmed'}
              </div>
            </div>
          </div>

          {/* RESERVATION SPECIFICATIONS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Check-in</span>
              <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <HiCalendar className="text-blue-400" /> {booking.check_in}
              </span>
            </div>

            <div className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Check-out</span>
              <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <HiCalendar className="text-blue-400" /> {booking.check_out}
              </span>
            </div>

            <div className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Duration & Guests</span>
              <span className="text-sm font-extrabold text-white">
                {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'} • {booking.guests} Guests
              </span>
            </div>
          </div>

          {/* PRIMARY GUEST INFORMATION */}
          <div className="bg-slate-950/50 border border-slate-800/80 p-5 rounded-2xl mb-8 space-y-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Guest Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
              <div className="flex items-center gap-2 text-slate-300">
                <HiUser className="text-slate-500" /> <span>{booking.user_name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <HiMail className="text-slate-500" /> <span>{booking.user_email}</span>
              </div>
              {booking.user_phone && (
                <div className="flex items-center gap-2 text-slate-300">
                  <HiPhone className="text-slate-500" /> <span>{booking.user_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* TOTAL PAYMENT HIGHLIGHT */}
          <div className="flex items-center justify-between bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl mb-8">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Amount Paid</span>
              <span className="text-xs text-blue-400 font-semibold">Includes all taxes (18% GST)</span>
            </div>
            <div className="text-2xl font-black text-blue-400 tracking-tight">
              {formatPrice(booking.total_price)}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <HiPrinter className="text-base" /> Print Receipt
            </button>

            <Link
              to="/booking-history"
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-center"
            >
              <HiTicket className="text-base" /> View All Bookings
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
