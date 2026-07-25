import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiCalendar, 
  HiUserGroup, 
  HiShieldCheck, 
  HiLightningBolt, 
  HiCheckCircle, 
  HiCurrencyRupee,
  HiInformationCircle 
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';

const BookingSidebar = ({ hotel }) => {
  const navigate = useNavigate();

  // Tomorrow date default check-in
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckIn = tomorrow.toISOString().split('T')[0];

  // 3 days later default check-out
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 4);
  const defaultCheckOut = threeDaysLater.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(2);

  if (!hotel) return null;

  // Calculate night count
  const dateIn = new Date(checkIn);
  const dateOut = new Date(checkOut);
  const diffTime = Math.abs(dateOut - dateIn);
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1);

  const pricePerNight = hotel.starting_price || 25000;
  const subtotal = pricePerNight * nights;
  const taxesAndFees = Math.round(subtotal * 0.18); // 18% GST & Service fee
  const totalPrice = subtotal + taxesAndFees;

  const handleBookNow = () => {
    if (dateOut <= dateIn) {
      toast.error('Check-out date must be after Check-in date!');
      return;
    }
    // Navigate to Module 5 Booking Page with query parameters
    navigate(
      `/booking?hotelId=${hotel.id || hotel.slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    );
  };

  return (
    <>
      {/* DESKTOP / TABLET STICKY SIDEBAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl sticky top-28 space-y-6">
        {/* PRICE DISPLAY HEADER */}
        <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Price Starts At
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-blue-600 tracking-tight">
                {formatPrice(pricePerNight)}
              </span>
              <span className="text-xs text-slate-500 font-bold">/ night</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200">
            ★ {hotel.rating || 4.9} Superb
          </span>
        </div>

        {/* DATE & GUEST PICKER INPUTS */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
          {/* CHECK IN & CHECK OUT */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Check-in
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Check-out
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* GUESTS SELECTOR */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value={1}>1 Adult (Single Occupancy)</option>
              <option value={2}>2 Adults (Standard Double)</option>
              <option value={3}>3 Guests (2 Adults + 1 Child)</option>
              <option value={4}>4 Guests (Family Suite)</option>
            </select>
          </div>
        </div>

        {/* DYNAMIC PRICE BREAKDOWN TABLE */}
        <div className="space-y-2 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-4">
          <div className="flex justify-between">
            <span>{formatPrice(pricePerNight)} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
            <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-500">
            <span className="flex items-center gap-1">
              Taxes & Service Fees (18%)
              <HiInformationCircle className="text-slate-400" title="Includes GST and luxury stay cess" />
            </span>
            <span>{formatPrice(taxesAndFees)}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-black text-slate-900 border-t border-slate-200 pt-2.5 mt-2">
            <span>Total Payable</span>
            <span className="text-xl font-black text-blue-600">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* BOOK NOW CTA BUTTON */}
        <button
          onClick={handleBookNow}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <HiLightningBolt className="text-amber-300 text-lg" />
          <span>Book Now</span>
        </button>

        {/* TRUST BADGES */}
        <div className="space-y-2 pt-2 text-[11px] font-bold text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2 rounded-xl">
            <HiShieldCheck className="text-base text-emerald-600 flex-shrink-0" />
            <span>Best Price Guarantee & Instant Confirmation</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 px-2">
            <HiCheckCircle className="text-blue-600 flex-shrink-0" />
            <span>No hidden booking fees or charges</span>
          </div>
        </div>
      </div>

      {/* MOBILE FIXED BOTTOM BOOKING BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 sm:hidden shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total ({nights} nights)</span>
          <div className="text-lg font-black text-blue-600 leading-tight">
            {formatPrice(totalPrice)}
          </div>
        </div>

        <button
          onClick={handleBookNow}
          className="px-6 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30"
        >
          Book Now
        </button>
      </div>
    </>
  );
};

export default BookingSidebar;
