import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiLocationMarker, 
  HiCalendar, 
  HiUserGroup, 
  HiStar, 
  HiBadgeCheck, 
  HiCheckCircle,
  HiShieldCheck 
} from 'react-icons/hi';
import { FaBed } from 'react-icons/fa';
import PriceBreakdown from './PriceBreakdown';
import { formatDate } from '../../utils/formatters';

const BookingSummary = ({
  hotel,
  room,
  checkIn,
  checkOut,
  nights = 1,
  guests = 1,
  subtotal = 0,
  taxes = 0,
  totalPrice = 0,
  onConfirmBooking,
  isSubmitting = false,
}) => {
  if (!hotel) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl sticky top-28 space-y-6"
    >
      {/* HEADER TITLE */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <HiBadgeCheck className="text-blue-600 dark:text-blue-400 text-xl" />
          Booking Summary
        </h3>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs rounded-full border border-blue-200 dark:border-blue-800">
          Instant Confirmation
        </span>
      </div>

      {/* HOTEL THUMBNAIL & METADATA */}
      <div className="flex gap-4">
        <img
          src={
            hotel.image_url ||
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
          }
          alt={hotel.hotel_name || hotel.name}
          className="w-24 h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0 shadow-sm"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
            <HiStar className="fill-amber-400" />
            <span>{hotel.rating || 4.9}</span>
            <span className="text-slate-400 font-normal">({hotel.review_count || 120} reviews)</span>
          </div>

          <h4 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 leading-snug">
            {hotel.hotel_name || hotel.name}
          </h4>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <HiLocationMarker className="text-rose-500 flex-shrink-0" />
            <span className="truncate">{hotel.city || hotel.address}</span>
          </p>
        </div>
      </div>

      {/* ROOM SELECTION BADGE */}
      {room && (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Selected Room Category
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FaBed className="text-blue-500" />
              {room.name || room.room_type || 'Standard Deluxe Room'}
            </span>
          </div>
        </div>
      )}

      {/* RESERVATION DETAILS (DATES & GUESTS) */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/50">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
            Check-in / Check-out
          </span>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 dark:text-white">
            <HiCalendar className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>
              {formatDate(checkIn)} - {formatDate(checkOut)}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block mt-0.5">
            {nights} {nights === 1 ? 'Night' : 'Nights'} stay
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
            Guests
          </span>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 dark:text-white">
            <HiUserGroup className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span>
              {guests} {guests === 1 ? 'Guest' : 'Guests'}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
            Standard Occupancy
          </span>
        </div>
      </div>

      {/* PRICE BREAKDOWN INCLUDED */}
      <PriceBreakdown
        pricePerNight={room ? room.price : hotel.starting_price}
        nights={nights}
        subtotal={subtotal}
        taxes={taxes}
        totalPrice={totalPrice}
      />

      {/* PROCEED TO PAYMENT CTA BUTTON */}
      {onConfirmBooking && (
        <button
          type="button"
          onClick={onConfirmBooking}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <HiShieldCheck className="text-xl text-emerald-400" />
              <span>Proceed to Pay & Confirm</span>
            </>
          )}
        </button>
      )}

      {/* ACCEPTED PAYMENT METHODS & REASSURANCE */}
      <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Secured by Razorpay Checkout
        </p>
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px]">💳 Cards</span>
          <span className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px]">📱 UPI / GPay</span>
          <span className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px]">🏦 NetBanking</span>
        </div>
      </div>

      {/* TRUST REASSURANCE */}
      <div className="space-y-2 pt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <HiCheckCircle className="text-emerald-500 text-base flex-shrink-0" />
          <span>Instant reservation lock upon payment</span>
        </div>
        <div className="flex items-center gap-2">
          <HiShieldCheck className="text-blue-500 text-base flex-shrink-0" />
          <span>24/7 Dedicated Concierge & Support</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingSummary;
