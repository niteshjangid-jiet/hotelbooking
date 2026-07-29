import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiStar, 
  HiHeart, 
  HiOutlineHeart, 
  HiLocationMarker, 
  HiCheckCircle,
  HiEye,
  HiSparkles
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';
import Button from '../common/Button';

import { useNavigate } from 'react-router-dom';

const HotelCard = ({ hotel, index = 0 }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(hotel.isWishlisted || false);

  // Normalize data keys between Database Schema & Legacy Mock data
  const name = hotel.hotel_name || hotel.name || 'Luxury Hotel';
  const price = hotel.starting_price || hotel.price || 15000;
  const originalPrice = hotel.originalPrice || Math.round(price * 1.25);
  const rating = hotel.rating || 4.8;
  const reviewCount = hotel.review_count || hotel.reviewsCount || 120;
  const city = hotel.city || 'India';
  const state = hotel.state || '';
  const imageUrl = hotel.image_url || hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
  const propertyType = hotel.property_type || hotel.type || 'Resort';
  const description = hotel.description || 'Experience world-class hospitality and luxury amenities.';
  const amenitiesList = Array.isArray(hotel.amenities) ? hotel.amenities : ['Free WiFi', 'Swimming Pool', 'Spa'];

  const toggleWishlist = (e) => {
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (nextState) {
      toast.success(`Saved "${name}" to your Wishlist!`, { icon: '❤️' });
    } else {
      toast.error(`Removed "${name}" from Wishlist.`, { icon: '🗑️' });
    }
  };

  const handleBookNow = () => {
    const targetId = hotel.id || hotel.slug;
    navigate(`/booking?hotelId=${targetId}`);
  };

  const handleViewDetails = () => {
    const targetId = hotel.id || hotel.slug;
    navigate(`/hotels/${targetId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* CARD TOP IMAGE & BADGES */}
      <div className="relative h-60 overflow-hidden bg-slate-900">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20"></div>

        {/* PROPERTY TYPE & FEATURED BADGE */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
          <span className="px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-lg tracking-wide border border-blue-400/30 flex items-center gap-1">
            <HiSparkles className="text-xs text-amber-300" />
            {propertyType}
          </span>
          {hotel.featured && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
              Featured Palace
            </span>
          )}
        </div>

        {/* WISHLIST BUTTON */}
        <button
          onClick={toggleWishlist}
          aria-label="Save to Wishlist"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-rose-500 shadow-md hover:bg-white hover:scale-110 transition-all cursor-pointer z-10"
        >
          {isWishlisted ? (
            <HiHeart className="text-xl text-rose-500 fill-current animate-bounce" />
          ) : (
            <HiOutlineHeart className="text-xl text-slate-700 hover:text-rose-500" />
          )}
        </button>

        {/* CITY BADGE & RATING */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-1 text-xs font-semibold bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10">
            <HiLocationMarker className="text-blue-400" />
            <span>{city}{state ? `, ${state}` : ''}</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-500 text-white font-bold text-xs px-2.5 py-1 rounded-xl shadow-sm">
            <HiStar className="text-white text-xs fill-current" />
            <span>{Number(rating).toFixed(1)}</span>
            <span className="text-[10px] text-amber-100 font-normal">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {name}
          </h3>

          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* AMENITIES BADGES */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {amenitiesList.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium flex items-center gap-1"
              >
                <HiCheckCircle className="text-blue-500 text-xs" />
                {amenity}
              </span>
            ))}
            {amenitiesList.length > 3 && (
              <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-semibold">
                +{amenitiesList.length - 3} More
              </span>
            )}
          </div>
        </div>

        {/* PRICING & ACTION BUTTONS */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Per Night Stays</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(price)}
                </span>
                {originalPrice > price && (
                  <span className="text-xs text-slate-400 line-through font-medium">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-extrabold">
              Inclusive Taxes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              icon={HiEye}
              onClick={handleViewDetails}
              className="py-2.5 text-xs font-bold"
            >
              Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBookNow}
              className="py-2.5 text-xs font-bold shadow-md shadow-blue-600/20"
            >
              Book Stay
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
