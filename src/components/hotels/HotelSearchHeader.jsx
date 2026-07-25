import React from 'react';
import { 
  HiSearch, 
  HiFilter, 
  HiSelector, 
  HiX,
  HiLocationMarker,
  HiOutlineAdjustments
} from 'react-icons/hi';
import Input from '../common/Input';

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating_desc' },
  { label: 'Name (A - Z)', value: 'name_asc' },
];

const HotelSearchHeader = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  city,
  setCity,
  propertyType,
  setPropertyType,
  minRating,
  setMinRating,
  maxPrice,
  setMaxPrice,
  selectedAmenities,
  setSelectedAmenities,
  onReset,
  totalResults = 0,
  onToggleMobileFilters,
  isFallback = false,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    (city !== 'All' && city !== 'All Cities') ||
    (propertyType !== 'All' && propertyType !== 'All Types') ||
    minRating > 0 ||
    maxPrice < 60000 ||
    selectedAmenities.length > 0;

  return (
    <div className="space-y-4 mb-8">
      {/* SEARCH AND CONTROL BAR */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl shadow-xl border border-white/60 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-xl">
        {/* MAIN SEARCH INPUT */}
        <div className="w-full md:w-1/2 lg:w-3/5">
          <Input
            icon={HiSearch}
            placeholder="Search hotel name, location, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-slate-200/80 focus:border-blue-600 font-semibold"
          />
        </div>

        {/* CONTROLS: SORT & MOBILE FILTER */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* MOBILE FILTER TOGGLE */}
          <button
            onClick={onToggleMobileFilters}
            className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-3 rounded-2xl text-xs font-bold text-slate-800 shadow-sm"
          >
            <HiFilter className="text-blue-600 text-base" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            )}
          </button>

          {/* SORT BY DROPDOWN */}
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2.5 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-900 focus:outline-none cursor-pointer pr-1"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RESULT COUNT & ACTIVE FILTER BADGES */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
          <span>Found <span className="text-blue-600 font-black">{totalResults}</span> Verified Luxury Stays</span>
          {isFallback && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
              ⚡ Local High-Perf Engine Active
            </span>
          )}
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Active:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg font-bold">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-blue-950">
                  <HiX className="text-xs" />
                </button>
              </span>
            )}

            {city !== 'All' && city !== 'All Cities' && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg font-bold">
                <HiLocationMarker className="text-xs text-blue-600" />
                {city}
                <button onClick={() => setCity('All')} className="hover:text-blue-950">
                  <HiX className="text-xs" />
                </button>
              </span>
            )}

            {propertyType !== 'All' && propertyType !== 'All Types' && (
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg font-bold">
                {propertyType}
                <button onClick={() => setPropertyType('All')} className="hover:text-purple-950">
                  <HiX className="text-xs" />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-bold">
                ⭐ {minRating}+
                <button onClick={() => setMinRating(0)} className="hover:text-amber-950">
                  <HiX className="text-xs" />
                </button>
              </span>
            )}

            {maxPrice < 60000 && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-bold">
                Max ₹{maxPrice.toLocaleString()}
                <button onClick={() => setMaxPrice(60000)} className="hover:text-emerald-950">
                  <HiX className="text-xs" />
                </button>
              </span>
            )}

            {selectedAmenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg font-bold"
              >
                {amenity}
                <button
                  onClick={() =>
                    setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity))
                  }
                  className="hover:text-slate-950"
                >
                  <HiX className="text-xs" />
                </button>
              </span>
            ))}

            <button
              onClick={onReset}
              className="text-[11px] font-extrabold text-rose-600 hover:underline ml-1 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelSearchHeader;
