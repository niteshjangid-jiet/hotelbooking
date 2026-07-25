import React, { useState } from 'react';
import { 
  HiWifi, 
  HiSparkles, 
  HiSun, 
  HiCheckCircle, 
  HiOutlineShieldCheck,
  HiChevronDown,
  HiChevronUp,
  HiOfficeBuilding,
  HiCake,
  HiKey,
  HiAcademicCap
} from 'react-icons/hi';
import { 
  FaSwimmer, 
  FaSpa, 
  FaDumbbell, 
  FaParking, 
  FaUtensils, 
  FaCocktail, 
  FaConciergeBell, 
  FaTv, 
  FaCoffee, 
  FaSnowflake, 
  FaShuttleVan 
} from 'react-icons/fa';

// Map amenity strings to icons and color presets
const getAmenityIcon = (name) => {
  const n = (name || '').toLowerCase();

  if (n.includes('wifi') || n.includes('internet')) {
    return { icon: <HiWifi />, color: 'text-blue-500 bg-blue-50' };
  }
  if (n.includes('pool') || n.includes('swimming')) {
    return { icon: <FaSwimmer />, color: 'text-cyan-500 bg-cyan-50' };
  }
  if (n.includes('spa') || n.includes('wellness') || n.includes('massage')) {
    return { icon: <FaSpa />, color: 'text-purple-500 bg-purple-50' };
  }
  if (n.includes('gym') || n.includes('fitness')) {
    return { icon: <FaDumbbell />, color: 'text-emerald-500 bg-emerald-50' };
  }
  if (n.includes('park') || n.includes('valet')) {
    return { icon: <FaParking />, color: 'text-amber-500 bg-amber-50' };
  }
  if (n.includes('break') || n.includes('dining') || n.includes('restaur')) {
    return { icon: <FaUtensils />, color: 'text-rose-500 bg-rose-50' };
  }
  if (n.includes('bar') || n.includes('lounge') || n.includes('cocktail')) {
    return { icon: <FaCocktail />, color: 'text-indigo-500 bg-indigo-50' };
  }
  if (n.includes('ac') || n.includes('air cond')) {
    return { icon: <FaSnowflake />, color: 'text-sky-500 bg-sky-50' };
  }
  if (n.includes('shuttle') || n.includes('transfer') || n.includes('airport')) {
    return { icon: <FaShuttleVan />, color: 'text-orange-500 bg-orange-50' };
  }
  if (n.includes('coffee') || n.includes('tea')) {
    return { icon: <FaCoffee />, color: 'text-amber-700 bg-amber-50' };
  }
  if (n.includes('room service') || n.includes('butler')) {
    return { icon: <FaConciergeBell />, color: 'text-teal-500 bg-teal-50' };
  }
  return { icon: <HiSparkles />, color: 'text-blue-600 bg-slate-100' };
};

const AmenityList = ({ amenities = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Complete list of amenities if array is minimal
  const defaultAmenitiesList = [
    'Free WiFi (High Speed)',
    'Outdoor Infinity Swimming Pool',
    'Complimentary Buffet Breakfast',
    'Luxury Spa & Wellness Center',
    'Fitness Center / Gym',
    'Free Valet Parking',
    'Multi-cuisine Fine Dining Restaurant',
    'Bar & Rooftop Cocktail Lounge',
    '24/7 Room Service & Butler',
    'Air Conditioning in All Rooms',
    'Airport Shuttle Transfer',
    'Concierge & Tour Desk',
  ];

  const displayList = amenities && amenities.length >= 4 ? amenities : defaultAmenitiesList;
  const visibleItems = isExpanded ? displayList : displayList.slice(0, 8);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <HiSparkles className="text-blue-600" /> Hotel Amenities & Facilities
          </h3>
          <p className="text-xs text-slate-500 font-medium">World-class comforts designed for your relaxation</p>
        </div>
        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200/50">
          {displayList.length} Amenities
        </span>
      </div>

      {/* AMENITIES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleItems.map((amenity, idx) => {
          const { icon, color } = getAmenityIcon(amenity);
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color} group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <span className="text-xs font-bold text-slate-800 leading-snug">
                {amenity}
              </span>
            </div>
          );
        })}
      </div>

      {/* VIEW MORE TOGGLE */}
      {displayList.length > 8 && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            <span>{isExpanded ? 'Show Fewer Amenities' : `View All ${displayList.length} Amenities`}</span>
            {isExpanded ? <HiChevronUp className="text-base" /> : <HiChevronDown className="text-base" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default AmenityList;
