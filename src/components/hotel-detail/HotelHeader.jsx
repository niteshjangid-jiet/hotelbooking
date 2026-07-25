import React, { useState } from 'react';
import { 
  HiStar, 
  HiLocationMarker, 
  HiHeart, 
  HiOutlineHeart, 
  HiShare, 
  HiCheckCircle, 
  HiBadgeCheck,
  HiCurrencyRupee 
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';

const HotelHeader = ({ hotel }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!hotel) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hotel.hotel_name,
        text: `Check out ${hotel.hotel_name} on HotelBookingSite!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from your wishlist' : 'Saved to your wishlist! ♥');
  };

  const scrollToMap = () => {
    const el = document.getElementById('hotel-map-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* LEFT COLUMN: BADGES, TITLE, ADDRESS, RATING */}
        <div className="space-y-3 flex-1">
          {/* BADGES & TYPE */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-700 font-extrabold text-xs rounded-full border border-amber-500/20">
              <HiStar className="text-amber-500" />
              <span>5-Star {hotel.property_type || 'Luxury Resort'}</span>
            </span>

            {hotel.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/10 text-blue-700 font-extrabold text-xs rounded-full border border-blue-600/20">
                <HiBadgeCheck className="text-blue-600" />
                Featured Luxury Stay
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full">
              {hotel.city}, {hotel.state || 'India'}
            </span>
          </div>

          {/* HOTEL NAME */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {hotel.hotel_name}
          </h1>

          {/* ADDRESS & MAP LINK */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 font-medium">
            <HiLocationMarker className="text-red-500 text-lg flex-shrink-0" />
            <span>{hotel.address || `${hotel.city}, Rajasthan, India`}</span>
            <button
              onClick={scrollToMap}
              className="text-blue-600 font-bold hover:underline underline-offset-2 ml-1 text-xs"
            >
              (View on Map)
            </button>
          </div>

          {/* RATING & REVIEWS SUMMARY */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 bg-amber-500 text-white font-black text-sm px-3 py-1 rounded-xl shadow-sm">
              <HiStar className="text-base" />
              <span>{hotel.rating || 4.9}</span>
            </div>
            <div className="text-sm font-semibold text-slate-700">
              <span className="font-extrabold text-slate-900">Exceptional</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-slate-500">{hotel.review_count || 128} Verified Guest Reviews</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION BUTTONS & STARTING PRICE */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
              title="Share Hotel"
            >
              <HiShare className="text-base text-slate-500" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={toggleWishlist}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all hover:scale-105 active:scale-95 ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Save to Wishlist"
            >
              {isWishlisted ? (
                <HiHeart className="text-base text-rose-600" />
              ) : (
                <HiOutlineHeart className="text-base text-slate-500" />
              )}
              <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          {/* STARTING PRICE TAG */}
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Starts From</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">
                {formatPrice(hotel.starting_price)}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/ night</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1 mt-0.5">
              <HiCheckCircle /> Inclusive of all taxes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelHeader;
