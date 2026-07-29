import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiUserGroup, 
  HiCheck, 
  HiSparkles, 
  HiOutlineShieldCheck,
  HiWifi,
  HiCalendar
} from 'react-icons/hi';
import { FaBed, FaRulerCombined, FaCoffee } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatters';

const RoomCard = ({ room, hotelId, hotelName }) => {
  const navigate = useNavigate();

  if (!room) return null;

  const handleReserve = () => {
    // Navigate to booking page (Module 5 target) passing hotelId and roomId parameters
    navigate(`/booking?hotelId=${hotelId || ''}&roomId=${room.id || ''}`);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group">
      {/* ROOM IMAGE */}
      <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden bg-slate-900">
        <img
          src={room.image || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent md:hidden" />
        
        {room.originalPrice && room.originalPrice > room.price && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-emerald-500 text-white font-extrabold text-xs rounded-full shadow-lg">
            {Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>

      {/* ROOM CONTENT & SPECS */}
      <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
        <div>
          {/* ROOM TITLE & DESCRIPTION */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                {room.name}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                {room.description || 'Spacious and beautifully decorated room featuring modern amenities and elegant bath.'}
              </p>
            </div>
          </div>

          {/* ROOM SPECIFICATIONS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <HiUserGroup className="text-blue-600 text-base flex-shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Capacity</span>
                <span>{room.capacity || '2 Guests'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <FaBed className="text-amber-500 text-base flex-shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Bed Type</span>
                <span className="truncate">{room.bedType || '1 King Bed'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <FaRulerCombined className="text-emerald-500 text-base flex-shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Room Size</span>
                <span>{room.size || '450 sq.ft'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <HiSparkles className="text-purple-600 text-base flex-shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Available Rooms</span>
                <span className="text-emerald-700 font-extrabold">{room.available_rooms || room.availableRooms || room.total_rooms || 4} Rooms Left</span>
              </div>
            </div>
          </div>

          {/* INCLUSIONS / BADGES */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {room.breakfastIncluded && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200/60">
                <FaCoffee className="text-amber-600" />
                Breakfast Included
              </span>
            )}

            {room.freeWifi && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-xl border border-blue-200/60">
                <HiWifi className="text-blue-600" />
                Free Wi-Fi
              </span>
            )}

            {room.freeCancellation && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200/60">
                <HiCheck className="text-emerald-600 font-bold" />
                Free Cancellation
              </span>
            )}
          </div>
        </div>

        {/* PRICE AND CTA ROW */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div>
            {room.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-semibold block">
                {formatPrice(room.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {formatPrice(room.price)}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/ night</span>
            </div>
          </div>

          <button
            onClick={handleReserve}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>Reserve Room</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
