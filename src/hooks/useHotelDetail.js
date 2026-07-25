import { useState, useEffect } from 'react';
import { fetchHotelByIdOrSlug, fetchHotels } from '../services/hotelService';
import { supabase, isSupabaseConfigured } from '../services/supabase/supabaseClient';

/**
 * Custom hook to fetch complete hotel details and related recommendations
 * 
 * @param {string} idOrSlug - Hotel ID or URL slug
 * @returns {Object} { hotel, similarHotels, loading, error, refetch }
 */
export const useHotelDetail = (idOrSlug) => {
  const [hotel, setHotel] = useState(null);
  const [similarHotels, setSimilarHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    if (!idOrSlug) {
      setLoading(false);
      setError('Hotel ID or slug is missing.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch base hotel info from Supabase or Local Fallback
      let baseHotel = await fetchHotelByIdOrSlug(idOrSlug);

      if (!baseHotel) {
        setError('Hotel not found. It may have been removed or the URL is invalid.');
        setLoading(false);
        return;
      }

      // 2. Fetch additional tables if Supabase is connected
      let dbRooms = [];
      let dbReviews = [];

      if (isSupabaseConfigured() && baseHotel.id) {
        try {
          const [roomsRes, reviewsRes] = await Promise.all([
            supabase.from('rooms').select('*').eq('hotel_id', baseHotel.id),
            supabase.from('reviews').select('*').eq('hotel_id', baseHotel.id),
          ]);
          if (!roomsRes.error && roomsRes.data?.length) dbRooms = roomsRes.data;
          if (!reviewsRes.error && reviewsRes.data?.length) dbReviews = reviewsRes.data;
        } catch (e) {
          console.warn('Error fetching relational sub-tables from Supabase:', e);
        }
      }

      // 3. Enrich hotel data with fallback defaults if sub-fields are missing
      const enrichedHotel = enrichHotelData(baseHotel, dbRooms, dbReviews);
      setHotel(enrichedHotel);

      // 4. Fetch Similar Hotels (same city or same property type)
      const similarRes = await fetchHotels({
        city: enrichedHotel.city,
        limit: 6,
      });

      const filteredSimilar = (similarRes?.hotels || [])
        .filter((h) => h.id !== enrichedHotel.id && h.slug !== enrichedHotel.slug)
        .slice(0, 4);

      setSimilarHotels(filteredSimilar);
    } catch (err) {
      console.error('Failed to load hotel detail:', err);
      setError(err.message || 'An error occurred while fetching hotel details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [idOrSlug]);

  return {
    hotel,
    similarHotels,
    loading,
    error,
    refetch: loadData,
  };
};

/**
 * Enriches hotel record with full gallery, rooms, reviews, policies, attractions & map coords
 */
function enrichHotelData(hotel, dbRooms = [], dbReviews = []) {
  const baseImg = hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

  // Gallery Images Array
  const galleryImages = hotel.gallery_images && hotel.gallery_images.length >= 3
    ? hotel.gallery_images
    : [
        baseImg,
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      ];

  // Room Types Array
  const defaultRooms = [
    {
      id: 'room-1',
      name: 'Deluxe Heritage Room',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      capacity: '2 Guests (Max 3)',
      bedType: '1 King Bed or 2 Twin Beds',
      size: '420 sq.ft (39 m²)',
      price: hotel.starting_price,
      originalPrice: Math.round(hotel.starting_price * 1.2),
      breakfastIncluded: true,
      freeWifi: true,
      freeCancellation: true,
      description: 'Elegant room featuring traditional decor, plush bedding, and marble bathroom with luxury toiletries.',
    },
    {
      id: 'room-2',
      name: 'Executive Lake / City View Suite',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      capacity: '3 Guests (Max 4)',
      bedType: '1 Super King Bed',
      size: '650 sq.ft (60 m²)',
      price: Math.round(hotel.starting_price * 1.45),
      originalPrice: Math.round(hotel.starting_price * 1.7),
      breakfastIncluded: true,
      freeWifi: true,
      freeCancellation: true,
      description: 'Spacious suite with private lounge area, panoramic lake views, and complimentary butler service.',
    },
    {
      id: 'room-3',
      name: 'Royal Presidential Villa',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      capacity: '4 Guests',
      bedType: '2 King Beds',
      size: '1,200 sq.ft (111 m²)',
      price: Math.round(hotel.starting_price * 2.2),
      originalPrice: Math.round(hotel.starting_price * 2.6),
      breakfastIncluded: true,
      freeWifi: true,
      freeCancellation: true,
      description: 'Ultra-luxurious multi-room villa featuring a private dip pool, sun deck, and dedicated 24/7 personal chef.',
    },
  ];

  const rooms = dbRooms.length > 0 ? dbRooms : (hotel.rooms || defaultRooms);

  // Reviews Array
  const defaultReviews = [
    {
      id: 'rev-1',
      user_name: 'Aarav Sharma',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      date: '12 Feb 2026',
      stay_type: 'Verified Couple Stay',
      comment: 'An extraordinary experience! The hospitality was flawless, the room views were breathtaking, and the breakfast buffet was a culinary masterpiece.',
      ratings_breakdown: { cleanliness: 5, location: 5, service: 5, value: 4.8 },
    },
    {
      id: 'rev-2',
      user_name: 'Sophia Patel',
      user_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      date: '28 Jan 2026',
      stay_type: 'Solo Traveler',
      comment: 'Pure luxury from the moment you step foot into the lobby. Highly recommend booking the lake view suite!',
      ratings_breakdown: { cleanliness: 4.9, location: 5, service: 5, value: 4.6 },
    },
    {
      id: 'rev-3',
      user_name: 'Vikram & Priya Mehta',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 4.8,
      date: '15 Jan 2026',
      stay_type: 'Family Vacation',
      comment: 'The spa treatment was out of this world and the staff went above and beyond to make our anniversary special.',
      ratings_breakdown: { cleanliness: 4.8, location: 4.9, service: 4.9, value: 4.7 },
    },
  ];

  const reviews = dbReviews.length > 0 ? dbReviews : (hotel.reviews || defaultReviews);

  // Hotel Policies
  const policies = hotel.policies || {
    checkIn: '14:00 PM (Early check-in subject to availability)',
    checkOut: '12:00 PM Noon',
    cancellation: 'Free cancellation up to 48 hours prior to arrival. Late cancellations forfeit 1st night charge.',
    childPolicy: 'Children under 6 years stay free when using existing bedding. Extra bed available for ₹2,500/night.',
    pets: 'Pets are not allowed on property except registered service animals.',
    payment: 'Accepts Credit Cards (Visa, MasterCard, Amex), UPI, Net Banking & Cash.',
  };

  // Nearby Attractions
  const nearbyAttractions = hotel.nearby_attractions || [
    { name: `${hotel.city} Main Heritage Palace`, distance: '0.8 km', duration: '10 mins walk' },
    { name: 'Central City Promenade & Lake', distance: '1.2 km', duration: '5 mins drive' },
    { name: 'International Airport', distance: '18.5 km', duration: '35 mins drive' },
    { name: 'Central Railway Station', distance: '4.2 km', duration: '12 mins drive' },
    { name: 'Famous Craft & Bazaar Market', distance: '1.5 km', duration: '15 mins walk' },
  ];

  // Rating categories breakdown
  const ratingBreakdown = hotel.rating_breakdown || {
    cleanliness: 4.9,
    location: 4.9,
    service: 4.8,
    value: 4.7,
  };

  return {
    ...hotel,
    gallery_images: galleryImages,
    rooms,
    reviews,
    policies,
    nearby_attractions: nearbyAttractions,
    rating_breakdown: ratingBreakdown,
  };
}
