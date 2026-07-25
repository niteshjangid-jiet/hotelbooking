import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiCalendar, 
  HiLocationMarker, 
  HiUserGroup, 
  HiTicket, 
  HiShieldCheck, 
  HiXCircle, 
  HiClock,
  HiChevronRight,
  HiOfficeBuilding
} from 'react-icons/hi';
import { formatPrice } from '../../utils/formatters';

const BookingCard = ({ booking, onViewDetails, onCancelBooking, index = 0 }) => {
  const {
    booking_id,
    hotel_name,
    hotel_image,
    hotel_city,
    room_name,
    check_in,
    check_out,
    guests,
    nights,
    total_price,
    booking_status,
  } = booking;

  // Determine stay status (Upcoming vs Completed vs Cancelled)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);

  let computedStatus = booking_status || 'Confirmed';
  if (computedStatus !== 'Cancelled') {
    if (checkOutDate < today) {
      computedStatus = 'Completed';
    } else {
      computedStatus = 'Upcoming';
    }
  }

  const isCancellable = computedStatus === 'Upcoming' && checkInDate > today;

  // Status Badge Styling
  const getStatusBadge = () => {
    switch (computedStatus) {
      case 'Cancelled':
        return (
          <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-black rounded-full flex items-center gap-1 shadow-sm">
            <HiXCircle className="text-rose-400" /> Cancelled
          </span>
        );
      case 'Completed':
        return (
          <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold rounded-full flex items-center gap-1">
            <HiClock className="text-slate-400" /> Completed Stay
          </span>
        );
      case 'Upcoming':
      default:
        return (
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black rounded-full flex items-center gap-1 shadow-sm animate-pulse">
            <HiShieldCheck className="text-emerald-400" /> Confirmed / Upcoming
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-slate-900/70 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700/90 transition-all duration-300 flex flex-col md:flex-row group"
    >
      {/* HOTEL IMAGE & BADGE */}
      <div className="md:w-72 h-52 md:h-auto relative bg-slate-950 flex-shrink-0 overflow-hidden">
        <img
          src={hotel_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
          alt={hotel_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-[11px] font-black text-blue-400 font-mono shadow-lg flex items-center gap-1">
          <HiTicket className="text-blue-400" /> {booking_id}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <HiLocationMarker /> {hotel_city || 'India'}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors">
                {hotel_name}
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
                <HiOfficeBuilding className="text-slate-400" /> {room_name}
              </p>
            </div>

            <div>{getStatusBadge()}</div>
          </div>

          {/* DATES & SPECS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800/80 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Check-in</span>
              <span className="font-extrabold text-white flex items-center gap-1 mt-0.5">
                <HiCalendar className="text-blue-400 text-sm" /> {check_in}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Check-out</span>
              <span className="font-extrabold text-white flex items-center gap-1 mt-0.5">
                <HiCalendar className="text-blue-400 text-sm" /> {check_out}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Occupancy</span>
              <span className="font-extrabold text-white flex items-center gap-1 mt-0.5">
                <HiUserGroup className="text-indigo-400 text-sm" /> {guests} Guests ({nights || 1}N)
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 flex-wrap gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Price</span>
            <span className="text-lg sm:text-xl font-black text-blue-400 tracking-tight">
              {formatPrice(total_price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCancellable && (
              <button
                onClick={() => onCancelBooking(booking)}
                className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 transition-all flex items-center gap-1"
              >
                <HiXCircle className="text-sm" /> Cancel Stay
              </button>
            )}

            <button
              onClick={() => onViewDetails(booking)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-1 transition-all"
            >
              <span>View Ticket</span>
              <HiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
