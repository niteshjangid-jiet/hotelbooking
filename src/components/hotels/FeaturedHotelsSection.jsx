import React, { useState } from 'react';
import SectionTitle from '../common/SectionTitle';
import HotelCard from './HotelCard';
import { FEATURED_HOTELS } from '../../constants/featuredHotels';

const CATEGORIES = ['All Stays', 'Luxury Heritage', 'Beachfront Oasis', 'Royal Residence', 'City Skyline', 'Unmatched Views'];

const FeaturedHotelsSection = () => {
  const [activeCategory, setActiveCategory] = useState('All Stays');

  const filteredHotels = activeCategory === 'All Stays'
    ? FEATURED_HOTELS
    : FEATURED_HOTELS.filter((hotel) => hotel.tag === activeCategory);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="Featured Stays"
        title="Experience World-Class Luxury & Comfort"
        subtitle="Explore our top-rated hotels, handpicked for superior amenities, stunning views, and royal hospitality."
        center={true}
      />

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center justify-center flex-wrap gap-2.5 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* HOTEL CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHotels.map((hotel, index) => (
          <HotelCard key={hotel.id} hotel={hotel} index={index} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedHotelsSection;
