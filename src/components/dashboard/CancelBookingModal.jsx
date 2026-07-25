import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamation, HiX, HiShieldExclamation, HiCalendar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const CancelBookingModal = ({ booking, onClose, onConfirmCancel, isSubmitting }) => {
  const [reason, setReason] = useState('');

  if (!booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmCancel(booking.booking_id, reason);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        
        {/* Backdrop Click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 text-white p-6 sm:p-8"
        >
          {/* ICON & TITLE */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl flex-shrink-0">
              <HiShieldExclamation />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Cancel Reservation</h3>
              <p className="text-xs text-rose-400 font-semibold font-mono">
                Booking #{booking.booking_id}
              </p>
            </div>
          </div>

          {/* WARNING DETAILS */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 mb-4">
            <p className="text-slate-300 font-semibold">
              Are you sure you want to cancel your stay at <span className="text-white font-extrabold">{booking.hotel_name}</span>?
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
              <HiCalendar className="text-blue-400" /> Scheduled Check-in: <span className="text-white font-bold">{booking.check_in}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Reason for cancellation (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Change of travel plans, emergency, found alternative hotel..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white text-xs rounded-xl p-3 outline-none resize-none transition-colors placeholder:text-slate-600"
              />
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] leading-tight">
              ⚠️ Cancellations made at least 24 hours prior to check-in qualify for a 100% full refund to the original payment source.
            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Keep Reservation
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CancelBookingModal;
