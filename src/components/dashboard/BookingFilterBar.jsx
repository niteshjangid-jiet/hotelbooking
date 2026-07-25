import React from 'react';
import { HiSearch, HiX, HiFilter, HiSortAscending } from 'react-icons/hi';

const BookingFilterBar = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  counts = { all: 0, upcoming: 0, completed: 0, cancelled: 0 },
}) => {
  const tabs = [
    { id: 'all', label: 'All Bookings', count: counts.all },
    { id: 'upcoming', label: 'Upcoming', count: counts.upcoming, color: 'bg-blue-500/20 text-blue-400' },
    { id: 'completed', label: 'Completed', count: counts.completed, color: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'cancelled', label: 'Cancelled', count: counts.cancelled, color: 'bg-rose-500/20 text-rose-400' },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-4 sm:p-5 backdrop-blur-xl mb-6 shadow-xl space-y-4">
      {/* TABS & CONTROLS ROW */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : tab.color || 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH & SORT */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by hotel, city, or ID..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 text-white text-xs rounded-xl pl-9 pr-8 py-2.5 transition-all outline-none placeholder:text-slate-500 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <HiX className="text-xs" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 focus:border-blue-500 text-slate-300 text-xs font-bold rounded-xl px-3.5 py-2.5 transition-all outline-none cursor-pointer appearance-none pr-8"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_high">Highest Price</option>
              <option value="price_low">Lowest Price</option>
            </select>
            <HiSortAscending className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookingFilterBar;
