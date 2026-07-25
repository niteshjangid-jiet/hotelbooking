import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiLocationMarker, 
  HiCalendar, 
  HiUserGroup, 
  HiSearch,
  HiChevronDown
} from 'react-icons/hi';
import Button from '../common/Button';

const SearchCard = ({ onSearch }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('Udaipur, Rajasthan');
  const [checkIn, setCheckIn] = useState('2026-08-10');
  const [checkOut, setCheckOut] = useState('2026-08-15');
  const [guests, setGuests] = useState('2 Adults, 1 Room');
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const city = destination.split(',')[0].trim();
    if (onSearch) {
      onSearch({ destination, checkIn, checkOut, guests });
    }
    navigate(`/search?city=${encodeURIComponent(city)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-5xl mx-auto glass-panel rounded-3xl p-4 md:p-6 shadow-2xl shadow-slate-950/20 border border-white/60 relative z-20 backdrop-blur-2xl"
    >
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 items-center">
        {/* DESTINATION */}
        <div className="lg:col-span-4 flex flex-col p-3 rounded-2xl bg-white/70 border border-slate-200/80 hover:bg-white hover:border-blue-300 transition-all duration-200 group">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <HiLocationMarker className="text-blue-600 text-sm group-hover:scale-110 transition-transform" />
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-transparent text-slate-900 font-bold text-sm md:text-base focus:outline-none cursor-pointer"
          >
            <option value="Udaipur, Rajasthan">Udaipur, Rajasthan</option>
            <option value="Jaipur, Rajasthan">Jaipur, Rajasthan</option>
            <option value="Goa, Beachfront">Goa, Beachfront</option>
            <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
            <option value="Jodhpur, Rajasthan">Jodhpur, Rajasthan</option>
            <option value="Kerala, Backwaters">Kerala, Backwaters</option>
            <option value="Manali, Himachal">Manali, Himachal</option>
            <option value="Delhi NCR">Delhi NCR</option>
          </select>
        </div>

        {/* CHECK-IN */}
        <div className="lg:col-span-3 flex flex-col p-3 rounded-2xl bg-white/70 border border-slate-200/80 hover:bg-white hover:border-blue-300 transition-all duration-200 group">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <HiCalendar className="text-blue-600 text-sm group-hover:scale-110 transition-transform" />
            Check-In
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-slate-900 font-bold text-sm md:text-base focus:outline-none cursor-pointer"
          />
        </div>

        {/* CHECK-OUT */}
        <div className="lg:col-span-3 flex flex-col p-3 rounded-2xl bg-white/70 border border-slate-200/80 hover:bg-white hover:border-blue-300 transition-all duration-200 group">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
            <HiCalendar className="text-cyan-600 text-sm group-hover:scale-110 transition-transform" />
            Check-Out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-slate-900 font-bold text-sm md:text-base focus:outline-none cursor-pointer"
          />
        </div>

        {/* GUESTS & ROOMS */}
        <div className="lg:col-span-2 flex items-center h-full">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={HiSearch}
            className="py-4 shadow-xl shadow-blue-600/30 rounded-2xl text-base font-bold"
          >
            Search
          </Button>
        </div>
      </form>

      {/* QUICK POPULAR FILTERS */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Popular Searches:</span>
          <div className="flex flex-wrap gap-1.5">
            {['5-Star Palaces', 'Beach Villas', 'Private Pool', 'Free Cancellation'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setDestination(tag.includes('Palace') ? 'Udaipur, Rajasthan' : 'Goa, Beachfront')}
                className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-medium border border-slate-200/80"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1 font-semibold text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Over 1,200+ Verified Stays Available
        </div>
      </div>
    </motion.div>
  );
};

export default SearchCard;
