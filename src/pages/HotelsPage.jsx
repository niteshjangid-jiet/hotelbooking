import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionTitle from '../components/common/SectionTitle';
import HotelCard from '../components/hotels/HotelCard';
import FilterSidebar from '../components/hotels/FilterSidebar';
import HotelSearchHeader from '../components/hotels/HotelSearchHeader';
import HotelSkeleton from '../components/hotels/HotelSkeleton';
import Button from '../components/common/Button';
import { fetchHotels } from '../services/hotelService';
import { HiEmojiSad, HiRefresh, HiSparkles } from 'react-icons/hi';

const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state initialized from URL params if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'All');
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 60000);
  const [minRating, setMinRating] = useState(Number(searchParams.get('rating')) || 0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');

  // Async Data state
  const [hotels, setHotels] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state to URL params for shareable search links
  useEffect(() => {
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (city !== 'All' && city !== 'All Cities') params.city = city;
    if (propertyType !== 'All' && propertyType !== 'All Types') params.type = propertyType;
    if (maxPrice < 60000) params.maxPrice = maxPrice;
    if (minRating > 0) params.rating = minRating;
    if (sortBy !== 'popular') params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [searchQuery, city, propertyType, maxPrice, minRating, sortBy]);

  // Fetch hotels whenever filter conditions change
  useEffect(() => {
    let isSubscribed = true;
    setIsLoading(true);

    fetchHotels({
      searchQuery,
      city,
      propertyType,
      maxPrice,
      minRating,
      amenities: selectedAmenities,
      sortBy,
      page: 1,
      limit: 40,
    })
      .then((res) => {
        if (isSubscribed) {
          setHotels(res.hotels);
          setTotal(res.total);
          setIsFallback(res.isFallback);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch hotels:', err);
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [searchQuery, city, propertyType, maxPrice, minRating, selectedAmenities, sortBy]);

  // Handle Filter Reset
  const handleResetFilters = () => {
    setSearchQuery('');
    setCity('All');
    setPropertyType('All');
    setMaxPrice(60000);
    setMinRating(0);
    setSelectedAmenities([]);
    setSortBy('popular');
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* PAGE HEADER */}
      <SectionTitle
        badge="Database-Driven Hotel Engine"
        title="Find & Book Verified Luxury Stays"
        subtitle="Explore 5-star palace hotels, beachfront villas, and heritage boutique resorts powered by Supabase."
        center={true}
      />

      {/* TOP SEARCH & SORT CONTROLS HEADER */}
      <HotelSearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        city={city}
        setCity={setCity}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        minRating={minRating}
        setMinRating={setMinRating}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        onReset={handleResetFilters}
        totalResults={total}
        onToggleMobileFilters={() => setIsMobileFiltersOpen(true)}
        isFallback={isFallback}
      />

      {/* 2-COLUMN MAIN LAYOUT: SIDEBAR FILTERS + RESULTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mt-6">
        {/* LEFT SIDEBAR FILTERS */}
        <div className="lg:col-span-1">
          <FilterSidebar
            city={city}
            setCity={setCity}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minRating={minRating}
            setMinRating={setMinRating}
            selectedAmenities={selectedAmenities}
            setSelectedAmenities={setSelectedAmenities}
            onReset={handleResetFilters}
            isOpenOnMobile={isMobileFiltersOpen}
            setIsOpenOnMobile={setIsMobileFiltersOpen}
            totalResults={total}
          />
        </div>

        {/* RIGHT HOTEL RESULTS GRID */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <HotelSkeleton count={6} />
          ) : hotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, index) => (
                <HotelCard key={hotel.id || index} hotel={hotel} index={index} />
              ))}
            </div>
          ) : (
            /* EMPTY RESULTS STATE */
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 text-3xl">
                <HiEmojiSad />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Stays Match Your Criteria</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md">
                We couldn't find any luxury stays matching your exact combination of city, price range, and amenities.
              </p>
              <Button
                variant="primary"
                icon={HiRefresh}
                onClick={handleResetFilters}
                className="mt-6 font-bold py-3 px-6 shadow-lg shadow-blue-600/20"
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
