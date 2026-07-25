import React from 'react';
import { 
  HiFilter, 
  HiRefresh, 
  HiCurrencyRupee, 
  HiStar, 
  HiCheck, 
  HiOfficeBuilding,
  HiWifi,
  HiX
} from 'react-icons/hi';
import { CITIES_LIST, PROPERTY_TYPES } from '../../data/mockHotels';
import Button from '../common/Button';

const AMENITY_OPTIONS = [
  'Free WiFi',
  'Swimming Pool',
  'Free Breakfast',
  'Air Conditioning',
  'Luxury Spa & Wellness',
  'Fitness Center / Gym',
  'Free Parking',
  'Bar & Cocktail Lounge'
];

const RATING_OPTIONS = [
  { label: 'All Ratings', value: 0 },
  { label: '4.5+ Exceptional', value: 4.5 },
  { label: '4.8+ Outstanding', value: 4.8 },
  { label: '4.9+ World Class', value: 4.9 },
];

const FilterSidebar = ({
  city,
  setCity,
  propertyType,
  setPropertyType,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  selectedAmenities,
  setSelectedAmenities,
  onReset,
  isOpenOnMobile,
  setIsOpenOnMobile,
  totalResults = 0,
}) => {

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const activeFiltersCount =
    (city !== 'All' && city !== 'All Cities' ? 1 : 0) +
    (propertyType !== 'All' && propertyType !== 'All Types' ? 1 : 0) +
    (maxPrice < 60000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    selectedAmenities.length;

  const content = (
    <div className="space-y-6">
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <HiFilter className="text-lg" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Filters</h3>
            <p className="text-xs text-slate-500 font-medium">Refine {totalResults} stays</p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <HiRefresh className="text-xs" />
            Reset ({activeFiltersCount})
          </button>
        )}

        {isOpenOnMobile && (
          <button
            onClick={() => setIsOpenOnMobile(false)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <HiX className="text-xl" />
          </button>
        )}
      </div>

      {/* CITY FILTER */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Destination City
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
        >
          {CITIES_LIST.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE RANGE FILTER */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Max Price / Night
          </label>
          <span className="text-sm font-extrabold text-blue-600">
            ₹{maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="10000"
          max="60000"
          step="2000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1">
          <span>₹10,000</span>
          <span>₹35,000</span>
          <span>₹60,000+</span>
        </div>
      </div>

      {/* PROPERTY TYPE */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Property Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((type) => {
            const isSelected = propertyType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setPropertyType(type)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* MINIMUM RATING */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Guest Rating
        </label>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMinRating(opt.value)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                minRating === opt.value
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-extrabold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HiStar className={`text-sm ${minRating === opt.value ? 'text-amber-500' : 'text-slate-400'}`} />
                {opt.label}
              </span>
              {minRating === opt.value && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* AMENITIES CHECKBOXES */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
          Popular Amenities
        </label>
        <div className="space-y-2">
          {AMENITY_OPTIONS.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none group"
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    isChecked
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-300 group-hover:border-blue-400'
                  }`}
                >
                  {isChecked && <HiCheck className="text-xs font-bold" />}
                </div>
                <span className={`font-medium ${isChecked ? 'text-slate-900 font-bold' : ''}`}>
                  {amenity}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* APPLY FILTERS BUTTON ON MOBILE */}
      {isOpenOnMobile && (
        <div className="pt-4 border-t border-slate-200 lg:hidden">
          <Button
            variant="primary"
            fullWidth
            onClick={() => setIsOpenOnMobile(false)}
            className="py-3 font-bold"
          >
            Show {totalResults} Hotels
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg sticky top-28">
        {content}
      </div>

      {/* MOBILE DRAWER */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsOpenOnMobile(false)}
          ></div>
          <div className="relative ml-auto w-full max-w-xs bg-white h-full overflow-y-auto p-6 shadow-2xl z-10 flex flex-col justify-between">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
