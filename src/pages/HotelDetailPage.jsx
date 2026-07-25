import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHotelDetail } from '../hooks/useHotelDetail';
import HotelHeader from '../components/hotel-detail/HotelHeader';
import HotelGallery from '../components/hotel-detail/HotelGallery';
import AmenityList from '../components/hotel-detail/AmenityList';
import HotelPolicies from '../components/hotel-detail/HotelPolicies';
import NearbyAttractions from '../components/hotel-detail/NearbyAttractions';
import ReviewSection from '../components/hotel-detail/ReviewSection';
import RoomCard from '../components/hotel-detail/RoomCard';
import BookingSidebar from '../components/hotel-detail/BookingSidebar';

const HotelDetailPage = () => {
  const { id } = useParams();
  const { hotel, similarHotels, loading, error } = useHotelDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-28 pb-20">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-semibold animate-pulse">Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4 pt-28 pb-20">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-2">Hotel Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">{error || 'We could not locate the requested hotel.'}</p>
          <Link
            to="/hotels"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30"
          >
            Explore Available Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* HEADER SECTION */}
        <HotelHeader hotel={hotel} />

        {/* IMAGE GALLERY */}
        <HotelGallery images={hotel.gallery_images} hotelName={hotel.hotel_name || hotel.name} />

        {/* MAIN LAYOUT WITH CONTENT AND SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT CONTENT COLUMN (2 COLUMNS ON DESKTOP) */}
          <div className="lg:col-span-2 space-y-12">
            {/* DESCRIPTION */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <h3 className="text-xl font-extrabold text-white mb-4">About the Property</h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {hotel.description || 'Experience world-class luxury and hospitality in the heart of the city. Featuring exquisite dining options, tranquil spa amenities, and meticulously appointed rooms designed for maximum comfort.'}
              </p>
            </div>

            {/* AMENITIES */}
            <AmenityList amenities={hotel.amenities} />

            {/* AVAILABLE ROOM TYPES */}
            <div id="rooms-section" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white">Available Room Options</h3>
                  <p className="text-xs text-slate-400 mt-1">Select your preferred room layout for your stay</p>
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                  {hotel.rooms?.length || 3} Room Types
                </span>
              </div>

              <div className="space-y-6">
                {(hotel.rooms || []).map((room, idx) => (
                  <RoomCard
                    key={room.id || idx}
                    room={room}
                    hotelId={hotel.id}
                    hotelName={hotel.hotel_name || hotel.name}
                  />
                ))}
              </div>
            </div>

            {/* HOTEL POLICIES */}
            <HotelPolicies policies={hotel.policies} />

            {/* NEARBY ATTRACTIONS & GEOAPIFY INTERACTIVE MAP */}
            <NearbyAttractions hotel={hotel} attractions={hotel.nearby_attractions} city={hotel.city} />

            {/* REVIEWS & RATINGS */}
            <ReviewSection reviews={hotel.reviews} ratingBreakdown={hotel.rating_breakdown} rating={hotel.rating} />
          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <div className="lg:col-span-1">
            <BookingSidebar hotel={hotel} />
          </div>
        </div>

        {/* SIMILAR HOTELS */}
        {similarHotels && similarHotels.length > 0 && (
          <div className="border-t border-slate-800/80 pt-10">
            <h3 className="text-2xl font-extrabold text-white mb-6">Similar Luxury Stays</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarHotels.map((simHotel) => (
                <Link
                  key={simHotel.id}
                  to={`/hotels/${simHotel.id}`}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-blue-500/50 transition-all hover:scale-[1.02]"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={simHotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                      alt={simHotel.hotel_name || simHotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-xs font-bold text-amber-400">
                      ★ {simHotel.rating || 4.8}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-extrabold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {simHotel.hotel_name || simHotel.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{simHotel.city}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetailPage;
