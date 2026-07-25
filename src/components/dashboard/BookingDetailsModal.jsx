import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiPrinter, 
  HiTicket, 
  HiCalendar, 
  HiUserGroup, 
  HiLocationMarker, 
  HiShieldCheck, 
  HiPhone, 
  HiMail, 
  HiUser, 
  HiOfficeBuilding,
  HiCheckCircle
} from 'react-icons/hi';
import { formatPrice } from '../../utils/formatters';

const BookingDetailsModal = ({ booking, onClose, onPrint }) => {
  if (!booking) return null;

  const handlePrintAction = () => {
    if (onPrint) {
      onPrint(booking);
    } else {
      window.print();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        
        {/* Backdrop Click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 text-white my-8 max-h-[90vh] flex flex-col"
        >
          {/* MODAL HEADER */}
          <div className="p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl">
                <HiTicket />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                  Reservation Voucher
                </span>
                <h2 className="text-lg font-bold text-white font-mono">
                  {booking.booking_id}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <HiX className="text-lg" />
            </button>
          </div>

          {/* MODAL BODY SCROLLABLE */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            
            {/* HOTEL & STATUS BANNER */}
            <div className="flex flex-col sm:flex-row gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
              {booking.hotel_image && (
                <img
                  src={booking.hotel_image}
                  alt={booking.hotel_name}
                  className="w-full sm:w-28 h-28 object-cover rounded-xl border border-slate-800"
                />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                    <HiLocationMarker /> {booking.hotel_city || 'India'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                    {booking.booking_status || 'Confirmed'}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white">{booking.hotel_name}</h3>
                <p className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  <HiOfficeBuilding className="text-slate-500" /> {booking.room_name}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Issued on: {new Date(booking.created_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* STAY DATES & OCCUPANCY */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Stay Itinerary
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Check-in</span>
                  <span className="font-extrabold text-white text-sm flex items-center gap-1.5 mt-0.5">
                    <HiCalendar className="text-blue-400" /> {booking.check_in}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Check-out</span>
                  <span className="font-extrabold text-white text-sm flex items-center gap-1.5 mt-0.5">
                    <HiCalendar className="text-blue-400" /> {booking.check_out}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Guests & Duration</span>
                  <span className="font-extrabold text-white text-sm flex items-center gap-1.5 mt-0.5">
                    <HiUserGroup className="text-indigo-400" /> {booking.guests} Guests ({booking.nights || 1} Nights)
                  </span>
                </div>
              </div>
            </div>

            {/* GUEST CONTACT DETAILS */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Primary Guest Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <HiUser className="text-slate-500 text-sm" />
                  <span className="font-bold text-white">{booking.user_name || 'Guest User'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <HiMail className="text-slate-500 text-sm" />
                  <span className="font-semibold text-slate-300">{booking.user_email || 'Not specified'}</span>
                </div>
                {booking.user_phone && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <HiPhone className="text-slate-500 text-sm" />
                    <span className="font-semibold text-slate-300">{booking.user_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* PRICE BREAKDOWN */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Payment Summary
              </h4>
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Room Charge ({booking.nights || 1} Nights)</span>
                  <span className="font-semibold text-white">{formatPrice(booking.subtotal || booking.total_price * 0.82)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Taxes & Luxury Service Charges (18% GST)</span>
                  <span className="font-semibold text-white">{formatPrice(booking.taxes || booking.total_price * 0.18)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-extrabold">
                  <span className="text-white">Total Amount Paid</span>
                  <span className="text-blue-400 text-base">{formatPrice(booking.total_price)}</span>
                </div>
              </div>
            </div>

            {/* SPECIAL REQUESTS IF ANY */}
            {booking.special_requests && (
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Special Requests
                </h4>
                <p className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-300 italic">
                  "{booking.special_requests}"
                </p>
              </div>
            )}

            {/* POLICIES */}
            <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-300 text-[11px] space-y-1">
              <p className="font-bold flex items-center gap-1">
                <HiCheckCircle className="text-blue-400" /> Complimentary Perks Included
              </p>
              <p className="text-slate-300">
                Free High-Speed Wi-Fi • Daily Buffet Breakfast • 24/7 Butler Service • Free Parking
              </p>
            </div>

          </div>

          {/* MODAL FOOTER */}
          <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Close
            </button>

            <button
              onClick={handlePrintAction}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all"
            >
              <HiPrinter className="text-sm" /> Print Voucher Receipt
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingDetailsModal;
